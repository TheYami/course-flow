import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { LessonProvider} from "@/contexts/LessonContext";
import { CourseProvider } from "@/contexts/CourseContext";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <CourseProvider>
      <LessonProvider>
        <Component {...pageProps} />
      </LessonProvider>
    </CourseProvider>
  );
}
