import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  const { courseId } = req.query;

  if (req.method === "PUT") {
    const { course_name, detail, price } = req.body;

    if (!courseId || !course_name || !detail || price == null) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    try {
      const query = `
        UPDATE courses
        SET course_name = $1, detail = $2, price = $3, updated_at = NOW()
        WHERE course_id = $4
        RETURNING *;
      `;
      const values = [course_name, detail, price, courseId];
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Course not found." });
      }

      res.status(200).json({ message: "Course updated successfully.", data: rows[0] });
    } catch (error) {
      console.error("Database error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
