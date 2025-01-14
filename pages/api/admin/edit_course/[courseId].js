import pool from "../../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { courseId } = req.query;
    const {
      course_name,
      detail,
      price,
      totalTime,
      summary,
      image_file,
      video_file,
      document_file,
    } = req.body;

    const total_time = totalTime;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    if (
      !course_name &&
      !detail &&
      !price &&
      !total_time &&
      !summary &&
      !image_file &&
      !video_file &&
      !document_file
    ) {
      return res.status(400).json({
        error: "At least one field must be provided to update the course.",
      });
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (course_name) {
      updates.push(`course_name = $${index}`);
      values.push(course_name);
      index++;
    }
    if (detail) {
      updates.push(`detail = $${index}`);
      values.push(detail);
      index++;
    }
    if (price) {
      updates.push(`price = $${index}`);
      values.push(price);
      index++;
    }
    if (total_time) {
      updates.push(`total_time = $${index}`);
      values.push(total_time);
      index++;
    }
    if (summary) {
      updates.push(`summary = $${index}`);
      values.push(summary);
      index++;
    }
    if (image_file) {
      updates.push(`image_file = $${index}`);
      values.push(image_file);
      index++;
    }
    if (video_file) {
      updates.push(`video_file = $${index}`);
      values.push(video_file);
      index++;
    }
    if (document_file) {
      updates.push(`document_file = $${index}`);
      values.push(document_file);
      index++;
    }

    updates.push(`updated_at = $${index}`);
    values.push(new Date().toISOString());
    values.push(courseId);

    try {
      const query = `
        UPDATE courses
        SET ${updates.join(", ")}
        WHERE course_id = $${index + 1}
        RETURNING *;
      `;

      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Course not found or not updated." });
      }

      return res.status(200).json({
        message: "Course updated successfully",
        data: rows[0],
      });
    } catch (error) {
      console.error("Error updating course:", error);
      return res.status(500).json({
        error: "Something went wrong while updating the course.",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
