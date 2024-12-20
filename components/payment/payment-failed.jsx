import Image from "next/image";
import failedIcon from "@/assets/icons/payment-icons/payment-failed-icon.svg";

export default function PaymentFailedCard() {
  return (
    <div className="payment-successfull-card flex flex-col items-center rounded-[8px] gap-8 p-10 shadow-[4px_4px_24px_0px_rgba(0,0,0,0.08)] xl:w-[739px]">
      <div className="alert-part flex flex-col gap-6 items-center justify-center">
        <Image src={failedIcon} />
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="text-center text-[24px] font-[500]">
            Payment failed.
          </h1>
          <p className="text-center text-[#646D89]">
            Please check your payment details and try again
          </p>
        </div>
      </div>
      <nav className="navigation-part w-full flex flex-col items-center justify-center gap-4">
        <div
          className="w-full text-center text-white bg-[#2F5FAC] font-[500] px-8 py-[18px] rounded-[12px]"
          type="button"
        >
          Back to Payment
        </div>
      </nav>
    </div>
  );
}
