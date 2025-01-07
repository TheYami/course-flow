import connectionPool from "@/utils/db";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { userId, courseId } = req.body;
  
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'userId and courseId are required' });
    }
  
    try {
      
      const query = `
        SELECT * FROM subscriptions
        WHERE user_id = $1 AND course_id = $2;
      `;
      
      const result = await connectionPool.query(query, [userId, courseId]);
      
      if (result.rows.length > 0) {
        return res.status(200).json({ subscription: result.rows[0] });
      } else {
        return res.status(200).json({ subscription: null });
      }
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }