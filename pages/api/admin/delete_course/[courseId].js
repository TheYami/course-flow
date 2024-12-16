import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const values = [courseId];

    try {
      const deleteQuery = `DELETE FROM courses WHERE course_id = $1 RETURNING *`;
      const result = await pool.query(deleteQuery, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Course not found or already deleted" });
      }

      await pool.query(`
        DO $$
        BEGIN
          PERFORM reset_sequence('courses', 'course_id');
          PERFORM reset_sequence('lessons', 'lesson_id');
          PERFORM reset_sequence('sub_lessons', 'sub_lesson_id');
        END;
        $$;
      `);
      

      return res.status(200).json({
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      return res.status(500).json({
        error: "Something went wrong while deleting the course.",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
