import pool from "../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      promoCode,
      minimumPurchase,
      discountType,
      discountValue,
      selectedCourses,
    } = req.body;

    if (!promoCode || !minimumPurchase || !discountType || !discountValue) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const checkQuery = `SELECT 1 FROM promo_codes WHERE code = $1`;
      const { rows } = await pool.query(checkQuery, [promoCode]);

      if (rows.length > 0) {
        return res.status(400).json({ message: "Promo code already exists" });
      }

      const query = `
        INSERT INTO promo_codes (code, min_price, discount_type, discount)
        VALUES ($1, $2, $3, $4)
        RETURNING promo_code_id, code, min_price, discount_type, discount;
      `;

      const { rows: insertedRows } = await pool.query(query, [
        promoCode,
        minimumPurchase,
        discountType,
        discountValue,
      ]);

      const promoCodeId = insertedRows[0].promo_code_id;

      const insertCoursePromoQuery = `
        INSERT INTO course_promocode (course_id, promo_code_id)
        VALUES ($1, $2)
      `;

      await Promise.all(
        selectedCourses.map((courseId) =>
          pool.query(insertCoursePromoQuery, [courseId, promoCodeId])
        )
      );
      return res.status(201).json({ promocode: insertedRows[0] });
    } catch (error) {
      console.error("Error inserting promocode:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
