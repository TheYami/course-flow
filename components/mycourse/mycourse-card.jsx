import Image from "next/image";
import Link from "next/link";
import bookIcon from "@/assets/icons/mycourse-icon/book.svg";
import clockIcon from "@/assets/icons/mycourse-icon/clock.svg";

export default function MyCourseCard({course}) {
  return (
    <Link href={`/mycourse/${course.course_id}`} passHref className="no-underline">
    <div className="mycourse-card shadow-md rounded-[8px] overflow-hidden w-[357px] md:w-[365px] md:h-[475px] flex flex-col justify-between">
      <img
        src={course.image_file}
        alt={course.course_name}
        className="h-[240px] w-full"
      ></img>
      <div className="px-4 py-2 flex flex-col gap-1 mb-4">
        <div className="text-[#F47E20] text-[12px]">Course</div>
        <div className="course-name text-[20px] font-[400]">
          {course.course_name}
        </div>
        <div className="course_summary text-[#646D89] text-[14px] leading-tight">
          {course.summary}
        </div>
      </div>
      <div className="bottom-card-part p-4 flex items-center gap-6 border-t-[1px] text-[#646D89]">
        <div className="lesson-count flex gap-2">
          <Image src={bookIcon} alt="book-icon" />
          {course.lessons_count} Lesson
        </div>
        <div className="total-time flex gap-2">
          <Image src={clockIcon} alt="clock-icon" />
          {course.total_time} Hours
        </div>
      </div>
    </div>
    </Link>
  );
}
