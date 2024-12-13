import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import QRCodeLib from "qrcode";
import { useRouter } from "next/router";
import useUserAuth from "@/hooks/useUserAuth";
import { saveAs } from "file-saver";

export default function QrScanWindow() {
  //   const { userData, loading } = useUserAuth();
  const router = useRouter();
  const [refNumber, setRefNumber] = useState();
  const courseId = 8;
  const userId = 3;
  const amount = 3359;

  const generateAlphaPrefix = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomIndex1 = Math.floor(Math.random() * letters.length);
    const randomIndex2 = Math.floor(Math.random() * letters.length);
    return letters[randomIndex1] + letters[randomIndex2];
  };

  const generateReferenceNumber = (userId, courseId) => {
    let combined = (userId + courseId).toString().slice(0, 11);
    if (combined.length < 11) {
      combined = combined.padStart(11, "0");
    }
    return generateAlphaPrefix() + combined;
  };

  const handleQrClick = () => {
    router.push(`/payment/payment-submit?ref=${refNumber}&price=${amount}`);
  };

  const handleDownload = async () => {
    QRCodeLib.toDataURL(
      `http://localhost:3000/payment/payment-submit?ref=${refNumber}&price=${amount}`,
      {
        errorCorrectionLevel: "H",
      },
      (err, url) => {
        if (err) {
          console.error("Error generating QR code:", err);
        } else {
          saveAs(url, `${refNumber}.png`);
        }
      }
    );
  };

  //   useEffect(() => {
  //     if (userData && !refNumber) {
  //       const newRefNumber = generateReferenceNumber(userData.id, courseId);
  //       setRefNumber(newRefNumber);
  //     }
  //   }, [userData, courseId]);

  useEffect(() => {
    const newRefNumber = generateReferenceNumber(userId, courseId);
    setRefNumber(newRefNumber);
  }, [userId, courseId]);

  return (
    <div className="qr-code flex flex-col items-center rounded-[8px] gap-2 p-10 shadow">
      
      <div className="flex flex-col items-center gap-1">
        <h1 className="title text-[24px]">Scan QR code</h1>
        <h2 className="reference-number text-[#646D89] text-[16px]">
          Reference no. {refNumber}
        </h2>
      </div>
      <div className="amount text-[#F47E20] text-[24px] font-[500]">
        THB {amount}
      </div>
      {refNumber && (
        <a
        href={`http://localhost:3000/payment/payment-submit?ref=${refNumber}&price=${amount}`}
        target="_blank"
        rel="noopener noreferrer"
        className="qr-code p-4 w-[200px] h-[200px]"
      >
        <QRCode
          value={`http://localhost:3000/payment/payment-submit?ref=${refNumber}&price=${amount}`}
          className="w-full h-full"
        />
      </a>
      )}
      <div
        type="button"
        className="save-qr mt-8 py-[18px] w-[263px] px-8 bg-[#2F5FAC] rounded-[12px] text-center text-white font-[700]"
        onClick={handleDownload}
      >
        Save QR image
      </div>
    </div>
  );
}
