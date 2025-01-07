import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, courseId } = req.query;
  const { subLessonId } = req.body;

  console.log("Request received with:", {
    method: req.method,
    query: req.query,
    body: req.body,
  });

  if (!user_id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  if (!courseId) {
    return res.status(400).json({ error: "Missing course id" });
  }

  if (!subLessonId) {
    return res.status(400).json({ error: "Missing subLessonId" });
  }

  const updateQuery = `
    UPDATE sub_lesson_progress 
    SET progress_status = $1 
    WHERE course_id = $2 AND user_id = $3 AND sub_lesson_id = $4
    RETURNING *`;

  try {
    console.log("Executing update with values:", {
      status: "complete",
      courseId,
      user_id,
      subLessonId,
    });

    const result = await connectionPool.query(updateQuery, [
      "complete",
      courseId,
      user_id,
      subLessonId,
    ]);

    console.log("Query result:", result);

    if (!result.rows || result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No record found to update for this subLessonId" });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      updatedRecord: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
