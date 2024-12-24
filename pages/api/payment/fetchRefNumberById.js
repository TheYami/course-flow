import connectionPool from "@/utils/db";

export default async function handler(req, res) {
    const { reference_number } = req.query;
  
    if (!reference_number) {
      return res.status(400).json({ error: 'reference_number is required' });
    }
  
    try {
      const result = await connectionPool.query(
        'SELECT * FROM orders WHERE reference_number = $1',
        [reference_number]
      );
  
      if (result.rows.length > 0) {
        return res.status(200).json(result.rows[0]); 
      } else {
        return res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }