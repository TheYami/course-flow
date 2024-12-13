import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  const { courseId } = req.query;

  if (req.method === "POST") {
    const { lessonName, subLessonData } = req.body;

    if (!lessonName || !subLessonData || subLessonData.length === 0) {
      return res
        .status(400)
        .json({ error: "Lesson Name and Sub-Lessons are required." });
    }

    try {
      const courseCheck = await pool.query(
        "SELECT course_id FROM courses WHERE course_id = $1",
        [courseId]
      );
      if (courseCheck.rowCount === 0) {
        return res.status(404).json({ error: "Course not found." });
      }

      const lessonResult = await pool.query(
        "INSERT INTO lessons (course_id, lesson_name) VALUES ($1, $2) RETURNING lesson_id",
        [courseId, lessonName]
      );
      const lessonId = lessonResult.rows[0].lesson_id;

      const subLessonPromises = subLessonData.map(async (subLesson) => {
        const { subLessonName, videoUrl } = subLesson;
        if (!subLessonName || !videoUrl) {
          throw new Error("Sub-lesson name and video URL are required.");
        }

        await pool.query(
          "INSERT INTO sub_lessons (lesson_id, sub_lesson_name, video) VALUES ($1, $2, $3)",
          [lessonId, subLessonName, videoUrl]
        );
      });

      await Promise.all(subLessonPromises);

      res
        .status(201)
        .json({ message: "Lesson created successfully", lessonId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
