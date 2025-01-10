// /pages/api/promotion-codes.js

import connectionPool from '@/utils/db'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { promocodeId } = req.query; // ใช้ req.query สำหรับ GET request

    if (!promocodeId) {
      return res.status(400).json({ error: 'Promo code ID is required' });
    }

    try {
      const results = await connectionPool.query(
        `
          SELECT * 
          FROM promo_codes pc
          INNER JOIN course_promocode cp ON pc.promo_code_id = cp.promo_code_id
          WHERE pc.promo_code_id = $1
        `,
        [promocodeId]
      );

      if (results.rows.length > 0) {
        res.status(200).json({ data: results.rows });
      } else {
        res.status(404).json({ message: 'Promo code not found or no associated courses' });
      }

    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
