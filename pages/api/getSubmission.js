import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, subLessonId } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  if (!subLessonId) {
    return res.status(400).json({ error: "Missing sub lesson id" });
  }

  const query = `
    SELECT * 
    FROM submissions AS s
    JOIN assignments AS a
    ON s.assignment_id = a.assignment_id
    WHERE  a.sub_lesson_id = $1 AND user_id = $2`;

  try {
    const result = await connectionPool.query(query, [subLessonId, user_id]);

    if (!result.rows || result.rows.length === 0) {
      return res
        .status(200)
        .json({ message: "No sub lessons found for this course" });
    } else {
      return res
        .status(200)
        .json({ message: "Fetching data successfully", data: result.rows });
    }
  } catch (error) {
    console.error("Error fetching progress:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
