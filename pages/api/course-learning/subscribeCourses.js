import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, slug } = req.query;

  // ตรวจสอบว่ามีการส่ง `user_id` และ `slug` มาหรือไม่
  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
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
      sub_lessons.sub_lesson_name,
      sub_lessons.video
    FROM subscriptions
    JOIN courses ON subscriptions.course_id = courses.course_id
    JOIN lessons ON courses.course_id = lessons.course_id
    JOIN sub_lessons ON lessons.lesson_id = sub_lessons.lesson_id
    WHERE subscriptions.user_id = $1 AND courses.slug = $2
  `;

  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const { rows } = await connectionPool.query(SqlStatement, [user_id, slug]);

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    // ส่งข้อมูลกลับไปยัง client
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
