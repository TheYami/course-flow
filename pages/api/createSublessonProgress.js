import connectionPool from "@/utils/db";
// เอาไว้สร้างเก็บ Progress สำหรับ Sublesson ใน User แต่ละคน

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { courseId, user_id } = req.query;


  try {
    // Query lessons จากฐานข้อมูล
    const result = await connectionPool.query(
      `SELECT l.course_id,l.lesson_id,sl.sub_lesson_id
FROM lessons AS l
JOIN sub_lessons AS sl
ON l.lesson_id =sl.lesson_id
      WHERE l.course_id = $1`,
      [courseId]
    );

    // ตัวอย่างหน้าตาผลลัพธ์
    //"result": [
    //       {
    //           "course_id": 1,
    //           "lesson_id": 2,
    //           "sub_lesson_id": 3
    //       },
    //       {
    //           "course_id": 1,
    //           "lesson_id": 2,
    //           "sub_lesson_id": 4
    //       },
    //       {
    //           "course_id": 1,
    //           "lesson_id": 26,
    //           "sub_lesson_id": 48
    //       },

    if (!result.rows || result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No lessons found for this course" });
    }

    const lessons = result.rows;

    // สร้าง array ของ sub_lesson_id
    const subLessonIds = lessons.flatMap(
      (subLesson) => subLesson.sub_lesson_id
    );

    const values = subLessonIds
      .map((id) => `(${id}, 'not-started', ${user_id},${courseId})`)
      .join(", ");

    const query = `INSERT INTO sub_lesson_progress (sub_lesson_id, progress_status, user_id,course_id) VALUES ${values};`;

    await connectionPool.query(query);

    res.status(200).json({
      message: "Lessons and sub-lessons added successfully",
      result: subLessonIds,
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
