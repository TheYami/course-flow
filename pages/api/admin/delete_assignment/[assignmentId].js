import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  const { assignmentId } = req.query;

  if (req.method === "DELETE") {
    if (!assignmentId) {
      return res.status(400).json({ message: "Assignment ID is required." });
    }
    try {
      const result = await connectionPool.query(
        "DELETE FROM assignments WHERE assignment_id = $1 RETURNING *",
        [assignmentId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Assignment not found." });
      }
      return res
        .status(200)
        .json({ message: "Assignment deleted successfully." });
    } catch {
      console.error("Error deleting assignment:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
