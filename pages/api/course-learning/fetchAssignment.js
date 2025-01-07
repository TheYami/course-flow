import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subLessonId } = req.query;

  //ส่ง sublesson_id มาอย่างเดียว
  // ตรวจสอบว่า subLessonId ถูกส่งมาหรือไม่
  if (!subLessonId) {
    return res.status(400).json({ error: "Missing subLessonId" });
  }

  const SqlStatement = `
      SELECT
        assignments.assignment_id,
        assignments.description
      FROM assignments
      WHERE assignments.sub_lesson_id = $1
    `;

  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const { rows } = await connectionPool.query(SqlStatement, [subLessonId]);

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No assignments found for this sub_lesson_id" });
    }

    // ส่งข้อมูลกลับไปยัง client
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
