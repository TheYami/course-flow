import connectionPool from "@/utils/db.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_id, course_id } = req.body; // ดึงข้อมูลจาก body ของ request

    const sqlStatement = `
      INSERT INTO wishlists (user_id, course_id, added_at)
      VALUES ($1, $2, $3)
      RETURNING *;`; // RETURNING ใช้คืนค่าข้อมูลหลังจาก INSERT

    try {
      // ใช้ new Date() สำหรับวันที่ปัจจุบัน
      const result = await connectionPool.query(sqlStatement, [
        user_id,
        course_id,
        new Date(),
      ]);

      // ส่งผลลัพธ์กลับไปยัง client
      res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error("Error inserting into wishlists:", error);
      res.status(500).json({
        message: `Server could not handle the request due to a database connection error.`,
      });
    }
  } else {
    // Method อื่นที่ไม่ใช่ POST
    res.status(404).json({ message: `Not Found` });
  }
}
