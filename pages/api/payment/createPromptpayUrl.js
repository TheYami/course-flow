import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import connectionPool from "@/utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { courseId, amount, userId } = req.body;
      const referenceNumber = uuidv4();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["promptpay"],
        line_items: [
          {
            price_data: {
              currency: "thb",
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
          reference_number: referenceNumber,
          user_id: userId,
          course_id: courseId,
          course_name: `Course ${courseId}`,
          amount,
        },
      });

      const query = `
      INSERT INTO orders (user_id, course_id, session_id, status, reference_number, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING reference_number;
    `;

      const values = [
        userId,
        courseId,
        session.id,
        session.status,
        referenceNumber,
        new Date(),
      ];

      const result = await connectionPool.query(query, values);
      const insertedOrderId = result.rows[0].reference_number;

      res.status(200).json({
        url: session.url,
        reference_number: insertedOrderId,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error", error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
