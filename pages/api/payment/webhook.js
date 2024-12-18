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
  console.log("signature", sig);
  console.log("body", req.body);
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const paymentData = event.data.object;
      const sessionId = paymentData.id;
      console.log(paymentData);

      try {
        const result = await connectionPool.query(
          "UPDATE orders SET status = $1 WHERE session_id = $2",
          [paymentData.status, sessionId]
        );
        console.log("=== update result", result);
      } catch (err) {
        console.error("Database Error:", err);
      } finally {
        connectionPool.end();
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("Webhook received successfully.");
}
