import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeLib from "qrcode";
import { useRouter } from "next/router";
import useUserAuth from "@/hooks/useUserAuth";
import { saveAs } from "file-saver";
import { useRef } from "react";
import React from "react";

const QrScanWindow = React.memo(function QrScanWindow() {
  const { userData, loadingUserData } = useUserAuth();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const hasFetchedRef = useRef(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const { courseId, amount } = router.query;

  const fetchCheckoutUrl = async () => {
    if (!userData) {
      setError("User data not available yet");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/payment/checkSubscription", {
        courseId,
        userId: userData.id,
      });
      if (response.data.subscription) {
        router.push(`/payment/success-payment?courseId=${courseId}`);
      } else {
        const newCheckoutResponse = await axios.post(
          "/api/payment/createPromptpayUrl",
          {
            courseId,
            amount,
            userId: userData.id,
          }
        );

        if (newCheckoutResponse.data.url) {
          setCheckoutUrl(newCheckoutResponse.data.url);
          setReferenceNumber(newCheckoutResponse.data.referenceNumber);
        } else {
          setError("Error creating checkout session");
        }
      }
    } catch (err) {
      setError("Error: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
      hasFetchedRef.current = true;
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    fetchCheckoutUrl();
  }, [userData]);

  useEffect(() => {
    const eventSource = new EventSource("/api/payment/sse");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received SSE data:", data);
      setStatus(data.status);
      setReferenceNumber(data.referenceNumber);

      if (data.status === "complete") {
        router.push(`/payment/success-payment?courseId=${courseId}`);
      } else if (data.status === "failed") {
        router.push(`/payment/failed-payment?courseId=${courseId}`);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Error with SSE connection:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [router]);

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
