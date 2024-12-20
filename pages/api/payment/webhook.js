import connectionPool from "@/utils/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];

  const buf = await new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    req.on("error", (err) => reject(err));
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      const paymentIntentId = session.payment_intent;

      if (!paymentIntentId) {
        console.error("No payment intent found in session.");
        res.status(400).send("Missing payment_intent in session.");
        return;
      }

      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === "succeeded") {
          const orderStatus = "complete";

          const referenceNumber = session.metadata.reference_number;

          const result = await connectionPool.query(
            "UPDATE orders SET status = $1 WHERE reference_number = $2",
            [orderStatus, referenceNumber]
          );
          console.log(`Order updated with status: ${orderStatus}`);
        } else {
          const orderStatus = "failed";

          const referenceNumber = session.metadata.reference_number;

          const result = await connectionPool.query(
            "UPDATE orders SET status = $1 WHERE reference_number = $2",
            [orderStatus, referenceNumber]
          );
          console.log(`Order updated with status: ${orderStatus}`);
        }
      } catch (err) {
        console.error("Error fetching payment intent or updating order:", err);
        res.status(500).send("Error processing the payment.");
        return;
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send("Webhook received successfully.");
}
