import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeLib from "qrcode";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import useUserAuth from "@/hooks/useUserAuth";
import { saveAs } from "file-saver";
import { useRef } from "react";
import React from "react";

const QrScanWindow = React.memo(function QrScanWindow() {
  //   const { userData, loading } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const hasFetchedRef = useRef(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const courseId = 13;
  const userId = 3;
  const amount = 3000;

  useEffect(() => {
    if (hasFetchedRef.current) return;
    setLoading(true);
    setError(null);

    const fetchCheckoutUrl = async () => {
      console.log("Component mounted or re-rendered");
      try {
        const response = await axios.post("/api/payment/createPromptpayUrl", {
          courseId,
          amount,
          userId,
        });
        if (response.data.url) {
          setCheckoutUrl(response.data.url);
          setReferenceNumber(response.data.referenceNumber);
        } else {
          setError("Error creating checkout session");
        }
      } catch (err) {
        console.error(err);
        setError("Error: " + err.message);
      } finally {
        setLoading(false);
        hasFetchedRef.current = true;
      }
    };

    fetchCheckoutUrl();
  }, []);

  const handleDownload = async () => {
    QRCodeLib.toDataURL(
      checkoutUrl,
      {
        errorCorrectionLevel: "H",
      },
      (err, url) => {
        if (err) {
          console.error("Error generating QR code:", err);
        } else {
          saveAs(url, `${courseId}.png`);
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

  return (
    <div className="qr-code flex flex-col items-center rounded-[8px] gap-2 p-10 shadow">
      <div className="flex flex-col items-center gap-1">
        <h1 className="title text-[24px]">Scan QR code</h1>
        <h2 className="reference-number text-[#646D89] text-[16px]">
          Reference no. {referenceNumber}
        </h2>
      </div>
      <div className="amount text-[#F47E20] text-[24px] font-[500]">
        THB {amount}
      </div>
      {checkoutUrl && (
        <a
          href={checkoutUrl}
          rel="noopener noreferrer"
          className="qr-code p-4 w-[200px] h-[200px]"
        >
          <QRCode value={checkoutUrl} className="w-full h-full" />
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
});

export default QrScanWindow;
