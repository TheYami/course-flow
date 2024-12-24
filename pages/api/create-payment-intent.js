import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ใช้ Stripe Secret Key ที่ได้จาก Stripe

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { paymentMethodId, amount } = req.body;

            // สร้าง PaymentIntent ด้วยจำนวนเงินที่ให้มา
            const paymentIntent = await stripe.paymentIntents.create({
              amount: amount, // จำนวนเงิน
              currency: 'thb', // สกุลเงิน
              payment_method: paymentMethodId, // ID ของวิธีการชำระเงิน
              confirmation_method: 'manual', // การยืนยันด้วยมือ
              confirm: true, // ยืนยันการชำระเงิน
              return_url: 'http://localhost:3000/payment/success-payment', // URL ที่จะใช้กลับมาหลังจากการชำระเงิน
          });

            // ส่งข้อมูลของ payment intent กลับไปที่ client
            res.status(200).json({
                success: true,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
            });
        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
}
