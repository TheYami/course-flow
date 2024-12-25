import pool from "../../../utils/db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { name = "", courseId = null, page = 1, limit = 10 } = req.query;

      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);
      if (parsedPage < 1 || parsedLimit < 1) {
        return res.status(400).json({ error: "Invalid page or limit value." });
      }

      const offset = (parsedPage - 1) * parsedLimit;

      let query;
      let values;

      if (courseId) {
        query = `
          SELECT 
            c.course_id, 
            c.course_name, 
            c.detail, 
            c.image_file,
            c.total_time, 
            c.summary, 
            c.price, 
            c.video_file, 
            c.image_file, 
            c.document_file, 
            c.created_at, 
            c.updated_at, 
            (
              SELECT COUNT(*) 
              FROM lessons AS l 
              WHERE l.course_id = c.course_id
            ) AS lesson_count
          FROM courses AS c
          WHERE c.course_id = $1
          ORDER BY c.created_at ASC
        `;
        values = [courseId];
      } else {
        query = `
          SELECT 
            c.course_id, 
            c.course_name, 
            c.detail, 
            c.image_file,
            c.total_time, 
            c.summary, 
            c.price, 
            c.video_file, 
            c.image_file, 
            c.document_file, 
            c.created_at, 
            c.updated_at, 
            (
              SELECT COUNT(*) 
              FROM lessons AS l 
              WHERE l.course_id = c.course_id
            ) AS lesson_count,
            COUNT(*) OVER() AS total
          FROM courses AS c
          ${name ? `WHERE c.course_name ILIKE $1` : ""}
          ORDER BY c.course_id
          LIMIT $${name ? 2 : 1} OFFSET $${name ? 3 : 2};
        `;
        values = name
          ? [`%${name}%`, parsedLimit, offset]
          : [parsedLimit, offset];
      }

      const { rows } = await pool.query(query, values);

      if (courseId && rows.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      const total = rows.length > 0 && !courseId ? parseInt(rows[0].total, 10) : 0;

      res.status(200).json({
        data: rows,
        total: courseId ? 1 : total,
        currentPage: parsedPage,
        totalPages: courseId ? 1 : Math.ceil(total / parsedLimit),
      });
    } catch (error) {
      console.error("Database query error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
