import MyCourse from "@/components/mycourse/mycourse";
import Navbar from "@/components/navbar";

export default function MyCoursePage() {
  return (
    <div className="my-course-page">
      <nav className="border-b-[1px]">
        <Navbar />
      </nav>
      <MyCourse />
    </div>
  );
}
