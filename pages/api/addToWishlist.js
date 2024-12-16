import connectionPool from "@/utils/db.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, course_id } = req.body; // ดึงข้อมูลจาก body ของ request

    if (!email || !course_id) {
      return res
        .status(400)
        .json({ message: "user_id and course_id are required" });
    }

    const sqlStatement = `
  INSERT INTO wishlists (user_id, course_id, added_at)
  VALUES (
      (SELECT u.id 
       FROM users AS u
       JOIN auth.users AS au ON u.email = au.email
       WHERE au.email = $1),
      $2,
      $3
  )
  RETURNING *;
`;

    try {
      // ใช้ new Date() สำหรับวันที่ปัจจุบัน
      const result = await connectionPool.query(sqlStatement, [
        email,
        course_id,
        new Date(),
      ]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No data found." });
      }
      res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error("Error inserting into wishlists:", error);
      res.status(500).json({
        message: `Server could not handle the request due to a database connection error.`,
      });
    }
  }
}
