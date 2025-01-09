import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user } = req.body;
  const { courseId } = req.query;

  try {
    //ดึง sub_lesson_id จาก course_id ที่ทำการ subscription สำเร็จแล้ว
    const result = await connectionPool.query(
      `SELECT l.course_id,l.lesson_id,sl.sub_lesson_id
FROM lessons AS l
JOIN sub_lessons AS sl
ON l.lesson_id =sl.lesson_id
      WHERE l.course_id = $1`,
      [courseId]
    );

    const lessons = result.rows;
    const subLessonIds = lessons.flatMap(
      (subLesson) => subLesson.sub_lesson_id
    );

    if (subLessonIds.length === 0) {
      return res
        .status(404)
        .json({ error: "No sub_lessons found for the provided course" });
    }

    const assignmentQuery = `
  SELECT sub_lesson_id, assignment_id
  FROM assignments
  WHERE sub_lesson_id IN (${subLessonIds.join(", ")});
`;
    //ดึง assignment_id จาก sub_lesson_id
    const subLessonsWithAssignments = await connectionPool.query(
      assignmentQuery
    );

    const values = subLessonsWithAssignments.rows
      .map(
        ({ assignment_id }) =>
          `(${assignment_id}, ${user.id}, null, null, 'in-progress')`
      )
      .join(", ");

    const query = `
      INSERT INTO submissions (assignment_id, user_id, answer, submission_date, status)
      VALUES ${values};
    `;
    //สร้าง submissions จาก assignment_id สำหร้บ user แต่ละคน
    await connectionPool.query(query);

    res.status(200).json({
      message: "Submissions are successfully created",
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
