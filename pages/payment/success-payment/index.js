import PaymentSuccessfullCard from "@/components/payment/payment-successfull";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PaymentDecoration from "@/components/payment/payment-decoration";

export default function successPayPage() {
  return (
    <div>
      <nav className="border-b-[1px]">
        <Navbar />
      </nav>
      <PaymentDecoration/>
      <div className="pt-4 px-4 pb-10 flex flex-col gap-8">
        <div className="flex justify-center xl:mb-[150px] xl:mt-[80px]">
          <PaymentSuccessfullCard />
        </div>
      </div>
      <Footer />
    </div>
  );
}
