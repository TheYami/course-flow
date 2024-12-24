import connectionPool from "@/utils/db";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { user_id, course_id, purchase_date, payment_type, } = req.body;

            const result = await connectionPool.query(`
                INSERT INTO subscriptions (user_id, course_id, purchase_date, payment_type)
                VALUES ($1, $2, $3, $4) RETURNING *
            `, [user_id, course_id, purchase_date, payment_type,]);

            // ตรวจสอบว่าผลลัพธ์ของการ query ถูกเก็บใน result หรือไม่
            if (result && result.rows && result.rows.length > 0) {
                return res.status(200).json({ message: 'Subscription saved successfully', data: result.rows[0] });
            } else {
                return res.status(400).json({ error: 'Failed to save subscription' });
            }

        } catch (error) {
            console.error('Unexpected error:', error);
            return res.status(500).json({ error: 'An error occurred while saving subscription' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
