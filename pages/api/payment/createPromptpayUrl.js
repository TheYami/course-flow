import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { courseId, amount, userId, refNumber, currency } = req.body;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["promptpay"],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: `Course ${courseId}`,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3000/payment/success-payment`,
        cancel_url: `http://localhost:3000/payment/failed-payment`,
        metadata: {
          reference_number: refNumber,
          user_id: userId,
          course_id: courseId,
          course_name: `Course ${courseId}`,
          amount,
          currency,
        },
      });
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
