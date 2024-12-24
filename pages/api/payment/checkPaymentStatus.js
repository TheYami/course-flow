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

    let statusMessage = paymentStatus;


    if (paymentStatus === "unpaid") {

      if (session.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        if (paymentIntent.status === "failed") {
          statusMessage = "Payment failed";
        } else if (paymentIntent.status === "requires_payment_method") {
          statusMessage = "Payment pending, awaiting method";
        } else if (paymentIntent.status === "requires_confirmation") {
          statusMessage = "Payment pending, awaiting confirmation";
        } else {
          statusMessage = "Payment status is unclear";
        }
      }
    }

    
    // console.log(session);

    res.status(200).json({ status: statusMessage });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Error checking payment status" });
  }
}
