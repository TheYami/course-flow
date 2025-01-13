import connectionPool from "@/utils/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { courseId, userId } = req.body;
    console.log(req.body);

    if (!courseId || !userId) {
      return res
        .status(400)
        .json({ error: "Course ID and User ID are required" });
    }

    try {
      const result = await connectionPool.query(
        "SELECT * FROM orders WHERE course_id = $1 AND user_id = $2",
        [courseId, userId]
      );

      if (result.rows.length > 0) {
        const order = result.rows[0];
        return res.status(200).json({
          exists: true,
          status: order.status,
          sessionId: order.session_id,
          referenceNumber: order.reference_number,
        });
      } else {
        return res.status(404).json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking order status:", error);
      return res.status(500).json({ error: "Database error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
