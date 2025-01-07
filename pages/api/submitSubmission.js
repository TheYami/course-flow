import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { submission_id, answer } = req.body;

  if (!submission_id || !answer) {
    return res.status(400).json({ error: "Missing submission_id or answer" });
  }

  const updateQuery = `
    UPDATE submissions
    SET status = $1, answer = $2,submission_date = NOW()
    WHERE submission_id = $3
    RETURNING *`;

  try {
    console.log("Executing update with values:", {
      status: "Submitted",
      submission_id,
      answer,
    });

    const result = await connectionPool.query(updateQuery, [
      "Submitted",
      answer,
      submission_id,
    ]);

    console.log("Query result:", result);

    if (!result.rows || result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No record found to update for this submission_id" });
    }

    return res.status(200).json({
      message: "Status and answer updated successfully",
      updatedRecord: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating status and answer:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
