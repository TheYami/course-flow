import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { subLessonId } = req.query;

    if (!subLessonId || isNaN(Number(subLessonId))) {
      return res.status(400).json({ error: "Valid Lesson ID is required" });
    }

    const values = [Number(subLessonId)];

    try {
      const query = `DELETE FROM sub_lessons WHERE sub_lesson_id = $1`;
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "Lesson not found or already deleted" });
      }

      await pool.query(`
        DO $$
        BEGIN
          PERFORM reset_sequence('sub_lessons', 'sub_lesson_id');
        END;
        $$;
      `);

      return res.status(200).json({
        message: "Sublesson deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting Sublesson :", error);
      return res.status(500).json({
        error: "Something went wrong while deleting the Sublesson.",
      });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
