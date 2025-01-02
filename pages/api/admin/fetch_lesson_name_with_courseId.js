import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ error: "courseId is required" });
  }

  if (req.method === "GET") {
    try {
      const result = await connectionPool.query(
        "SELECT lesson_id, lesson_name FROM lessons WHERE course_id=$1",
        [courseId]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch lesson names" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
