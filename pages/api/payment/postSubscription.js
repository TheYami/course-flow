import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, courseId, amount, paymentType } = req.body;
    try {
      const query = `
        INSERT INTO subscriptions (user_id, course_id, purchase_date, amount, payment_type, payment_status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `;
      const values = [
        userId,
        courseId,
        new Date(),
        amount,
        paymentType,
        "paid",
      ];
      const { rows } = await connectionPool.query(query, values);
      return res
        .status(201)
        .json({ message: "Subscription created successfully!" });
    } catch(err) {
      return res.status(500).json({
        error: "Something went wrong while creating the subscription.",
        err:err.message
      });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
