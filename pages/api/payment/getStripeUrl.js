import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log(session)
      if (session.url) {
        return res.status(200).json({ url: session.url });
      } else {
        return res.status(404).json({ error: "Session URL not found" });
      }
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
      return res
        .status(500)
        .json({ error: "Error fetching Stripe session URL" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
