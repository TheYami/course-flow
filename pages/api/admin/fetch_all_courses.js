import pool from "../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { rows } = await pool.query(`
        SELECT 
          c.course_id, 
          c.course_name
        FROM courses AS c
        ORDER BY c.course_id ASC
      `);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.status(200).json({ data: rows });
    } catch (error) {
      console.error("Database query error:", error.stack);
      console.error("Database query error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
