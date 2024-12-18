import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paymentStatus = session.payment_status || "unknown";
    console.log(session)
    res.status(200).json({ status: paymentStatus });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Error checking payment status" });
  }
}
