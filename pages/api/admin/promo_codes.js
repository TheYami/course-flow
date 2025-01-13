import pool from "../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { code = "", page = 1, limit = 10 } = req.query;

      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);
      if (parsedPage < 1 || parsedLimit < 1) {
        return res.status(400).json({ error: "Invalid page or limit value." });
      }

      const offset = (parsedPage - 1) * parsedLimit;

      const query = `
        SELECT 
          pmc.promo_code_id,
          pmc.code,
          pmc.discount,
          pmc.created_at,
          pmc.updated_at,
          pmc.min_price,
          pmc.discount_type,
          COALESCE(
            JSON_AGG(
              JSONB_BUILD_OBJECT(
                'course_id', c.course_id,
                'course_name', c.course_name
              )
            ) FILTER (WHERE c.course_id IS NOT NULL),
            '[]'
          ) AS courses,
          COUNT(*) OVER() AS total
        FROM promo_codes AS pmc
        LEFT JOIN course_promocode AS cp ON pmc.promo_code_id = cp.promo_code_id
        LEFT JOIN courses AS c ON cp.course_id = c.course_id
        ${code ? "WHERE pmc.code ILIKE $1" : ""}
        GROUP BY pmc.promo_code_id
        ORDER BY pmc.created_at ASC
        LIMIT $${code ? 2 : 1} OFFSET $${code ? 3 : 2};
      `;

      const values = code
        ? [`%${code}%`, parsedLimit, offset]
        : [parsedLimit, offset];

      const { rows } = await pool.query(query, values);

      const total = rows.length > 0 ? parseInt(rows[0].total, 10) : 0;

      res.status(200).json({
        data: rows.map((row) => ({
          promo_code_id: row.promo_code_id,
          code: row.code,
          discount: row.discount,
          created_at: row.created_at,
          updated_at: row.updated_at,
          min_price: row.min_price,
          discount_type: row.discount_type,
          courses: row.courses,
        })),
        total,
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
      });
    } catch (error) {
      console.error("Database query error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
