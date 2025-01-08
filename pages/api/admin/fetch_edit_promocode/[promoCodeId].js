import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { promoCodeId } = req.query;

    if (!promoCodeId) {
      return res.status(400).json({ error: "PromoCode ID is required" });
    }

    try {
      const query = `
          SELECT
            c.course_name,
            c.course_id, 
            pmc.promo_code_id,
            cp.course_id,
            pmc.code,
            pmc.min_price,
            pmc.discount_type,
            pmc.discount
          FROM promo_codes AS pmc
          LEFT JOIN course_promocode AS cp ON cp.promo_code_id = pmc.promo_code_id
          LEFT JOIN courses as c ON c.course_id = cp.course_id
          WHERE pmc.promo_code_id = $1
        `;
      const values = [promoCodeId];

      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "No lessons available or wrong PromoCode id",
          data: null,
        });
      }

      const promoCodeDetails = {
        promo_code_id: rows[0].promo_code_id,
        code: rows[0].code,
        min_price: rows[0].min_price,
        discount_type: rows[0].discount_type,
        discount: rows[0].discount,
      };

      const courses = rows.map((row) => ({
        course_id: row.course_id,
        course_name: row.course_name,
      }));

      return res.status(200).json({
        message: "PromoCode fetched successfully",
        data: {
          ...promoCodeDetails,
          courses: courses,
        },
      });
    } catch (error) {
      console.error("Error fetching PromoCode:", error);
      return res.status(500).json({
        error: "Something went wrong while fetching the PromoCode.",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
