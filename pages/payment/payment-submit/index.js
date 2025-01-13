import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PaymentSubmitPage() {
  const router = useRouter();
  const { ref, price } = router.query; // Capture the 'ref' and 'price' query parameters

  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePayment = () => {
    setPaymentStatus("Payment successful!");
  };

  useEffect(() => {
    if (ref) {
      console.log("Reference Number:", ref);
    }
    if (price) {
      console.log("Price:", price);
    }
  }, [ref, price]);

  return (
    <div className="payment-submit-container flex flex-col items-center justify-center p-10">
      <h1 className="text-xl font-bold">Payment Submit</h1>
      <h2 className="text-lg text-gray-500 mt-2">
        Reference No: <strong>{ref}</strong>
      </h2>
      
      <div className="amount mt-4 text-xl text-[#F47E20]">
        {/* Dynamically render the price passed from the QR code */}
        THB {price}
      </div>

      <button
        onClick={handlePayment}
        className="pay-now-btn mt-6 px-8 py-3 bg-blue-500 text-white rounded-lg"
      >
        Confirm Payment
      </button>

      {paymentStatus && (
        <div className="payment-status mt-6 text-green-500 text-lg">
          {paymentStatus}
        </div>
      )}
    </div>
  );
}
