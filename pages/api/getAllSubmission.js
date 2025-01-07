import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user id" });
  }


  const query = `
     SELECT * 
    FROM submissions AS s
    JOIN assignments AS a
    ON s.assignment_id = a.assignment_id
    JOIN sub_lessons AS sl
    ON a.sub_lesson_id = sl.sub_lesson_id
    JOIN lessons AS l
    ON sl.lesson_id = l.lesson_id
    JOIN courses AS c
    ON l.course_id = c.course_id
    WHERE user_id = $1`;

  try {
    const result = await connectionPool.query(query, [user_id]);

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
