import connectionPool from "@/utils/db";

function validateAssignmentData({ subLessonId, assignment }) {
  const errors = [];
  if (!subLessonId) {
    errors.push("Sub-lesson ID is required.");
  }
  if (!assignment || assignment.trim() === "") {
    errors.push("Assignment detail is required.");
  }
  return errors;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { subLessonId, assignment } = req.body;
    const validationErrors = validateAssignmentData({
      subLessonId,
      assignment
    });
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: validationErrors });
    }
    try {
      const result = await connectionPool.query(
        "INSERT INTO assignments (sub_lesson_id, description, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *",
        [subLessonId, assignment, new Date(), new Date()]
      );
      return res.status(200).json({
        message: "Assignment created successfully!",
        assignment: result.rows[0],
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error",error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
