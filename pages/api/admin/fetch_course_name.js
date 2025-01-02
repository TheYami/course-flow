import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await connectionPool.query(
        "SELECT course_id, course_name FROM courses"
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch course names" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
