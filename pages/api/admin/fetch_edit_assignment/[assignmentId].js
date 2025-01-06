import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  const { assignmentId } = req.query;
  if (req.method === "GET") {
    if (!assignmentId) {
      return res.status(400).json({ error: "assignmentId is required" });
    }

    if (isNaN(assignmentId)) {
      return res
        .status(400)
        .json({ error: "Invalid assignmentId format. It should be a number." });
    }

    try {
      const query = `
      SELECT
        c.course_name,
        l.lesson_name,
        sl.sub_lesson_name,
        a.description,
        c.course_id,
        l.lesson_id,
        sl.sub_lesson_id,
        a.assignment_id
      FROM
        courses c
      JOIN
        lessons l ON l.course_id = c.course_id
      JOIN
        sub_lessons sl ON sl.lesson_id = l.lesson_id
      JOIN
        assignments a ON a.sub_lesson_id = sl.sub_lesson_id
      WHERE a.assignment_id = $1
    `;

      const result = await connectionPool.query(query, [
        parseInt(assignmentId),
      ]);

      const rows = result.rows;

      if (rows.length === 0) {
        return res.status(404).json({ error: "Assignment not found" });
      }

      res.status(200).json({ assignments: rows });
    } catch (error) {
      console.error("Error fetching assignment:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  }
}
