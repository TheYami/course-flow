import { useState, useEffect } from "react";
import axios from "axios";
import useUserAuth from "@/hooks/useUserAuth";
import Image from "next/image";
import bookIcon from "@/assets/icons/mycourse-icon/book.svg";
import clockIcon from "@/assets/icons/mycourse-icon/clock.svg";

function MyCourseCard({ course }) {
  return (
    <div className="mycourse-card shadow rounded-[8px] overflow-hidden">
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
  );
}

export default function MyCourse() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { userData, loading } = useUserAuth();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);

  useEffect(() => {
    if (userData) {
      const fetchCourses = async () => {
        try {
          const allCoursesResponse = await axios.get(
            `/api/my-course/getAllCourses?user_id=${userData.id}`
          );
          setAllCourses(allCoursesResponse.data);

          const inProgressCoursesResponse = await axios.get(
            `/api/my-course/getInProgressCourses?user_id=${userData.id}`
          );
          setInProgressCourses(inProgressCoursesResponse.data);

          const completedCoursesResponse = await axios.get(
            `/api/my-course/getCompletedCourses?user_id=${userData.id}`
          );
          setCompletedCourses(completedCoursesResponse.data);
        } catch (error) {
          console.log("Error fetching courses:", error);
        }
      };

      fetchCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (selectedTab === "all") {
      setCourses(allCourses);
    } else if (selectedTab === "inProgress") {
      setCourses(inProgressCourses);
    } else if (selectedTab === "completed") {
      setCourses(completedCourses);
    }
  }, [selectedTab, allCourses, inProgressCourses, completedCourses]);

  return (
    <div className="my-course-list py-10 px-4 shadow-inner">
      <div className="mb-[110px]">
        <h1 className="text-[24px] font-[500] text-center ">My Courses</h1>
        <div className="menu flex justify-between mt-6 mx-2">
          <button
            onClick={() => setSelectedTab("all")}
            className={`text-[#9AA1B9] p-2 ${
              selectedTab === "all" ? " text-black border-b-2 border-black" : ""
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setSelectedTab("inProgress")}
            className={`text-[#9AA1B9] p-2 ${
              selectedTab === "inProgress"
                ? " text-black border-b-2 border-black"
                : ""
            }`}
          >
            Inprogress
          </button>
          <button
            onClick={() => setSelectedTab("completed")}
            className={`text-[#9AA1B9] p-2 ${
              selectedTab === "completed"
                ? " text-black border-b-2 border-black"
                : ""
            }`}
          >
            Completed
          </button>
        </div>
        <div className="cards my-4 flex flex-col gap-8">
          {courses.map((course) => (
            <MyCourseCard key={course.course_id} course={course} />
          ))}
        </div>
      </div>
     
      {userData && (
        <div className="sticky-profile fixed bottom-0 left-0 right-0 rounded-t-[8px] p-4 bg-white flex flex-col gap-2 shadow-lg">
          <div className="header flex items-center gap-3">
            <img
              src={userData.profile_picture}
              alt={userData.name}
              className="h-10 w-10 rounded-full"
            ></img>
            <div className="text-[#424C6B]">{userData.name}</div>
          </div>
          <div className="status flex items-center justify-between bg-white">
            <div className="in-progress text-[#646D89] text-[12px] bg-[#F1F2F6] px-4 py-1 rounded-[8px] flex items-center gap-2">
              Course Inprogress{" "}
              <div className="text-black text-[20px]">
                {inProgressCourses.length}
              </div>
            </div>
            <div className="complete text-[#646D89] text-[12px] bg-[#F1F2F6] px-4 py-1 rounded-[8px] flex items-center gap-2">
              Course Complete <div className="text-black text-[20px]">{completedCourses.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
