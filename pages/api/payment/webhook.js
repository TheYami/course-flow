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
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );
        const orderStatus =
          paymentIntent.status === "succeeded" ? "complete" : "failed";
        const referenceNumber = session.metadata.reference_number;

        await connectionPool.query(
          "UPDATE orders SET status = $1 WHERE reference_number = $2",
          [orderStatus, referenceNumber]
        );
        console.log(`Order updated with status: ${orderStatus}`);

        sendSSEUpdate({ status: orderStatus, referenceNumber });
      } catch (err) {
        console.error("Error fetching payment intent or updating order:", err);
        res.status(500).send("Error processing the payment.");
        return;
      }
      break;
    case "payment_intent.requires_action":
      // Handle requires_action event
      console.log("Payment Intent requires action.");
      // Send SSE update for 'requires_action'
      sendSSEUpdate({
        status: "requires_action",
        referenceNumber: event.data.object.metadata.reference_number,
      });
      break;

    case "payment_intent.created":
      console.log("Payment Intent created.");
      // Optionally send SSE update here if needed
      break;

    case "payment_intent.succeeded":
      console.log("Payment Intent succeeded.");
      // Optionally send SSE update here if needed
      break;

    case "charge.succeeded":
      console.log("Charge succeeded.");
      // Optionally send SSE update here if needed
      break;

    case "charge.updated":
      console.log("Charge updated.");
      // Optionally send SSE update here if needed
      break;

    case "payment_intent.payment_failed":
      sendSSEUpdate({
        status: "failed",
      });

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send("Webhook received successfully.");
}

function sendSSEUpdate(data) {
  if (!global.sseClients) return;
  console.log("Sending SSE update:", data);
  global.sseClients.forEach((client) => {
    try {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
      client.flush();
    } catch (err) {
      console.error("Error sending SSE message", err);
    }
  });
}
