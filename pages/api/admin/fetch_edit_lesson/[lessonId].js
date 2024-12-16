import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { lessonId } = req.query;

    if (!lessonId) {
      return res.status(400).json({ error: "Lesson ID is required" });
    }

    try {
      const query = `
        SELECT 
          c.course_name,
          c.course_id,
          l.lesson_id,
          l.course_id,
          l.lesson_name,
          sl.sub_lesson_id,
          sl.sub_lesson_name,
          sl.video,
          (
            SELECT COUNT(*) 
            FROM sub_lessons AS sl 
            WHERE sl.lesson_id = l.lesson_id
          ) AS sub_lesson_count
        FROM lessons AS l
        LEFT JOIN courses AS c ON l.course_id = c.course_id
        LEFT JOIN sub_lessons AS sl ON l.lesson_id = sl.lesson_id
        WHERE l.lesson_id = $1
      `;
      const values = [lessonId];

      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "No lessons available or wrong lesson id",
          data: [],
        });
      }

      return res.status(200).json({
        message: "Lessons fetched successfully",
        data: rows,
      });
    } catch (error) {
      console.error("Error fetching Lessons:", error);
      return res.status(500).json({
        error: "Something went wrong while fetching the lessons.",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
