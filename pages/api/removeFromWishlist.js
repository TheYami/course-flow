import connectionPool from "@/utils/db.js";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { email, course_id } = req.query; // ดึงข้อมูลจาก body ของ request
    if (!email || !course_id) {
      return res
        .status(400)
        .json({ message: "Email and course_id are required" });
    }

    const sqlStatement = `
      DELETE FROM wishlists
      WHERE user_id = (
          SELECT u.id
          FROM users AS u
          JOIN auth.users AS au ON u.email = au.email
          WHERE au.email = $1
      )
      AND course_id = $2
      RETURNING *;
    `;

    try {
      // ลบข้อมูลจากฐานข้อมูล
      const result = await connectionPool.query(sqlStatement, [
        email,
        course_id,
      ]);

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "No wishlist entry found to delete" });
      }

      // ส่งผลลัพธ์กลับไปยัง client
      res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error("Error removing from wishlists:", error);
      res.status(500).json({
        message: `Server could not handle the request due to a database connection error.`,
      });
    }
  } else {
    // Method อื่นที่ไม่ใช่ DELETE
    res.status(405).json({ message: `Method Not Allowed` });
  }
}
