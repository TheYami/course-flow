import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { promoCodeId } = req.query;

    if (!promoCodeId) {
      return res.status(400).json({ error: "Promo code ID is required" });
    }

    const values = [promoCodeId];

    try {
      const deleteQuery = `DELETE FROM promo_codes WHERE promo_code_id = $1 RETURNING *`;
      const result = await pool.query(deleteQuery, values);

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "Course not found or already deleted" });
      }

      await pool.query(`
        DO $$
        BEGIN
          PERFORM reset_sequence('promo_codes', 'promo_code_id');
          PERFORM reset_sequence('course_promocode', 'id');
        END;
        $$;
      `);

      return res.status(200).json({
        message: "Promo code deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting Promo code:", error);
      return res.status(500).json({
        error: "Something went wrong while deleting the Promo code.",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
