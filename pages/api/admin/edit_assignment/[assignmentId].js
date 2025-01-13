import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { assignmentId } = req.query;
      const { subLessonId, description } = req.body;
      const query = `
          UPDATE assignments
          SET sub_lesson_id = $1, description = $2, updated_at = $3
          WHERE assignment_id = $4
          RETURNING *;`;
      const values = [subLessonId, description, new Date(), assignmentId];
      const result = await connectionPool.query(query, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      return res.status(200).json(result.rows[0]);
    } catch {
      return res
        .status(500)
        .json({ message: "Failed to update assignment", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
