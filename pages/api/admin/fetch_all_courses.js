import pool from "../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const query = `
        SELECT 
          c.course_id, 
          c.course_name
        FROM courses AS c
        ORDER BY c.course_id ASC
      `;

      const totalQuery = `
        SELECT COUNT(*) AS total_courses FROM courses
      `;

      const { rows } = await pool.query(query);
      const totalResult = await pool.query(totalQuery);

      if (rows.length === 0) {
        return res.status(404).json({ error: "No courses found" });
      }

      res.status(200).json({
        data: rows,
        total: totalResult.rows[0].total_courses,
      });
    } catch (error) {
      console.error("Database query error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
