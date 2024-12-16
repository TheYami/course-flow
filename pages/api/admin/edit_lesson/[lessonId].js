import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  const { method } = req;
  const { lessonId } = req.query;
  const { lessonName, subLessonData } = req.body;

  if (method === "PUT") {
    try {
      const updatedLesson = await pool.query(
        "UPDATE lessons SET lesson_name = $1 WHERE lesson_id = $2 RETURNING *",
        [lessonName, lessonId]
      );

      if (!updatedLesson.rows.length) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      for (const subLesson of subLessonData) {
        if (subLesson.subLessonId) {
          await pool.query(
            "UPDATE sub_lessons SET sub_lesson_name = $1, video = $2 WHERE sub_lesson_id = $3",
            [subLesson.subLessonName, subLesson.videoUrl, subLesson.subLessonId]
          );
        } else {
          await pool.query(
            "INSERT INTO sub_lessons (lesson_id, sub_lesson_name, video) VALUES ($1, $2, $3)",
            [lessonId, subLesson.subLessonName, subLesson.videoUrl]
          );
        }
      }
      return res
        .status(200)
        .json({ message: "Lesson and sub lessons updated successfully" });
    } catch (error) {
      console.error("Error updating lesson:", error);
      return res.status(500).json({ message: "Failed to update lesson" });
    }
  } else {

    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
