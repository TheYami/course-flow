import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, courseId, subLessonId, status } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  if (!courseId) {
    return res.status(400).json({ error: "Missing course id" });
  }

  if (!subLessonId) {
    return res.status(400).json({ error: "Missing subLessonId" });
  }

  if (!status) {
    return res.status(400).json({ error: "Missing status" });
  }

  const updateQuery = `
    UPDATE sub_lesson_progress 
    SET progress_status = $1 
    WHERE course_id = $2 AND user_id = $3 AND sub_lesson_id = $4
    RETURNING *`;

  try {
    const result = await connectionPool.query(updateQuery, [
      status,
      courseId,
      user_id,
      subLessonId,
    ]);


    if (!result.rows || result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No record found to update for this subLessonId" });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      updatedRecord: result.rows,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
