import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { lessonId } = req.query;

    if (!lessonId || isNaN(Number(lessonId))) {
      return res.status(400).json({ error: "Valid Lesson ID is required" });
    }

    const values = [Number(lessonId)];

    try {
      const query = `DELETE FROM lessons WHERE lesson_id = $1`;
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "Lesson not found or already deleted" });
      }

      await pool.query(`
        DO $$
        BEGIN
          PERFORM reset_sequence('lessons', 'lesson_id');
          PERFORM reset_sequence('sub_lessons', 'sub_lesson_id');
        END;
        $$;
      `);

      return res.status(200).json({
        message: "Lesson deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      return res.status(500).json({
        error: "Something went wrong while deleting the lesson.",
      });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
