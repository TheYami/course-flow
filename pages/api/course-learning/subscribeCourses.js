import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, course_id } = req.query;

  // ตรวจสอบว่ามีการส่ง `user_id` และ `slug` มาหรือไม่
  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  if (!course_id) {
    return res.status(400).json({ error: "Missing course_id" });
  }

  const SqlStatement = `
    SELECT
      subscriptions.subscription_id,
      subscriptions.user_id,
      subscriptions.course_id,
      courses.course_name,
      courses.detail,
      courses.summary,
      lessons.lesson_id,
      lessons.lesson_name,
      sub_lessons.sub_lesson_id,
      sub_lessons.sub_lesson_name,
      sub_lessons.complete_status,
      sub_lessons.video,
      sub_lesson_progress.progress_status
    FROM subscriptions
    JOIN courses ON subscriptions.course_id = courses.course_id
    JOIN lessons ON courses.course_id = lessons.course_id
    JOIN sub_lessons ON lessons.lesson_id = sub_lessons.lesson_id
    JOIN sub_lesson_progress 
      ON sub_lesson_progress.user_id = subscriptions.user_id
     AND sub_lesson_progress.sub_lesson_id = sub_lessons.sub_lesson_id
    WHERE subscriptions.user_id = $1 AND courses.course_id = $2
  `;

  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const { rows } = await connectionPool.query(SqlStatement, [
      user_id,
      course_id,
    ]);

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    // จัดรูปแบบข้อมูล
    const formattedData = rows.reduce((acc, row) => {
      let course = acc.find((item) => item.course_id === row.course_id);

      if (!course) {
        course = {
          course_id: row.course_id,
          course_name: row.course_name,
          detail: row.detail,
          summary: row.summary,
          lessons: [],
          progress: 0,
        };
        acc.push(course);
      }

      let lesson = course.lessons.find(
        (item) => item.lesson_id === row.lesson_id
      );

      if (!lesson) {
        lesson = {
          lesson_id: row.lesson_id,
          lesson_name: row.lesson_name,
          sub_lessons: [],
        };
        course.lessons.push(lesson);
      }

      let subLesson = lesson.sub_lessons.find(
        (item) => item.sub_lesson_name === row.sub_lesson_name
      );

      if (!subLesson) {
        subLesson = {
          sub_lesson_id: row.sub_lesson_id,
          sub_lesson_name: row.sub_lesson_name,
          video: row.video,
          progress_status: row.progress_status,
        };
        lesson.sub_lessons.push(subLesson);
      }
      return acc;
    }, []);

    
    formattedData.forEach((course) => {
      const allSubLessons = course.lessons.flatMap(
        (lesson) => lesson.sub_lessons
      );
      const totalSubLessons = allSubLessons.length; // จำนวน sub_lessons ทั้งหมด
      const completedSubLessons = allSubLessons.filter(
        (subLesson) => subLesson.progress_status === "completed"
      ).length; // จำนวนที่ progress_status เป็น 'completed'

      course.progress =
        totalSubLessons > 0
          ? Math.round((completedSubLessons / totalSubLessons) * 100)
          : 0;
    });
    // ส่งข้อมูลกลับไปยัง client
    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
