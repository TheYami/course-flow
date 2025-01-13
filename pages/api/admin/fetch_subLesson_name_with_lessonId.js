import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  const { lessonId } = req.query;

  if (!lessonId) {
    return res.status(400).json({ error: "lesson Id is required" });
  }

  if (req.method === "GET") {
    try {
      const result = await connectionPool.query(
        "SELECT sub_lesson_id, sub_lesson_name FROM sub_lessons WHERE lesson_id=$1",
        [lessonId]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch sub-lesson names" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}