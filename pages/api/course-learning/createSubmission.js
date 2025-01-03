import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { lessons, user } = req.body;

  if (!Array.isArray(lessons) || lessons.length === 0) {
    return res.status(400).json({ error: "Invalid lessons data" });
  }

  try {
    // Map subLesson to get sub_lesson_id
    const subLessonIds = lessons.flatMap((lesson) =>
      lesson.sub_lessons.map((subLesson) => subLesson.sub_lesson_id)
    );

    const assignmentQuery = `
  SELECT sub_lesson_id, assignment_id
  FROM assignments
  WHERE sub_lesson_id IN (${subLessonIds.join(", ")});
`;

    const subLessonsWithAssignments = await connectionPool.query(
      assignmentQuery
    );

    const values = subLessonsWithAssignments.rows
      .map(
        ({ assignment_id }) =>
          `(${assignment_id}, ${user.id}, null, null, 'in-progress')`
      )
      .join(", ");

    // สร้าง query สำหรับ INSERT
    const query = `
      INSERT INTO submissions (assignment_id, user_id, answer, submission_date, status)
      VALUES ${values};
    `;

    // Execute the query
    await connectionPool.query(query);

    res.status(200).json({
      message: "Submissions are successfully created",
      values: values,
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
