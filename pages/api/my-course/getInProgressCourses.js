import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  const { user_id } = req.query;
  
  try {
    const result = await connectionPool.query(
      `SELECT 
          c.course_id, 
          c.course_name, 
          c.summary, 
          (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.course_id) AS lessons_count,
          c.total_time,
          c.image_file
       FROM courses c
       JOIN subscriptions s ON s.course_id = c.course_id
       JOIN progress p ON p.course_id = c.course_id
       WHERE s.user_id = $1
       AND p.completed_lessons_count < (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.course_id)`, 
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch in-progress courses' });
  }
}
