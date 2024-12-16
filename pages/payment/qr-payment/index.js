import QrScanWindow from "@/components/payment/qr-scan-window";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BackBotton from "@/components/payment/back-button";

export default function Payment() {
  return (
    <div>
      <nav className="border-b-[1px]">
        <Navbar />
      </nav>
      <div className="pt-4 px-4 pb-10 flex flex-col gap-8">
        <BackBotton url="/payment" />
        <QrScanWindow />
      </div>
      <Footer />
    </div>
  );
}
