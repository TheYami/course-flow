import { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LessonProvider } from "@/contexts/LessonContext";
import { CourseProvider } from "@/contexts/CourseContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // ถ้าคุณต้องการโหลด JavaScript ของ Bootstrap
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <CourseProvider>
      <LessonProvider>
        <Elements stripe={stripePromise}>
          <Component {...pageProps} />
        </Elements>
      </LessonProvider>
    </CourseProvider>
  );
}
