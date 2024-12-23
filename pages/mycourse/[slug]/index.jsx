import CourseProgress from "@/components/course-progress";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/router";
const CourseProgressPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <>
      <Navbar />
      <CourseProgress slug={slug}/>
      <Footer />
    </>
  );
};

export default CourseProgressPage;
