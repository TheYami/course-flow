import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  const { courseId } = req.query;

  if (req.method === "POST") {
    const { lessons } = req.body;

    if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
      return res
        .status(400)
        .json({ error: "Lessons array is required and cannot be empty." });
    }

    try {
      const courseCheck = await pool.query(
        "SELECT course_id FROM courses WHERE course_id = $1",
        [courseId]
      );
      if (courseCheck.rowCount === 0) {
        return res.status(404).json({ error: "Course not found." });
      }

      await pool.query("BEGIN");

      for (const lesson of lessons) {
        const { lessonName, subLessonData } = lesson;

        if (!lessonName || !subLessonData || subLessonData.length === 0) {
          throw new Error("Lesson Name and Sub-Lessons are required for each lesson.");
        }

        const lessonResult = await pool.query(
          "INSERT INTO lessons (course_id, lesson_name) VALUES ($1, $2) RETURNING lesson_id",
          [courseId, lessonName]
        );
        const lessonId = lessonResult.rows[0].lesson_id;

        const subLessonValues = subLessonData.map(subLesson => {
          const { subLessonName, videoUrl } = subLesson;
          if (!subLessonName || !videoUrl) {
            throw new Error("Sub-lesson name and video URL are required.");
          }
          return `(${lessonId}, '${subLessonName}', '${videoUrl}')`;
        });

        const subLessonQuery = `
          INSERT INTO sub_lessons (lesson_id, sub_lesson_name, video)
          VALUES ${subLessonValues.join(", ")}
        `;

        await pool.query(subLessonQuery);
      }

      await pool.query("COMMIT");

      res.status(201).json({ message: "All lessons and sub-lessons created successfully." });
    } catch (error) {
      console.error(error);
      await pool.query("ROLLBACK");
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
