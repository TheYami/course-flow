import connectionPool from "@/utils/db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { user_id } = req.query; // ใช้ query parameters แทน body

    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Missing required user_id parameter" });
    }

    const sqlStatement = `
            SELECT c.course_id, c.course_name, c.detail, c.total_time, c.summary, c.price, c.video_file, c.image_file, c.document_file, COUNT(l.lesson_id) AS lesson_count
      FROM courses AS c
      LEFT JOIN lessons AS l
      ON c.course_id = l.course_id
      LEFT JOIN wishlists AS w
      ON c.course_id = w.course_id
      WHERE user_id = $1
      GROUP BY c.course_id
      ORDER BY c.course_id

    `;

    try {
      const result = await connectionPool.query(sqlStatement, [user_id]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "No wishlist found for the given user_id" });
      }

      res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      res.status(500).json({
        message:
          "Server could not handle the request due to a database connection error.",
      });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
