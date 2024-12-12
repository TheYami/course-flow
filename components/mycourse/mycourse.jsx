import { useState, useEffect } from "react";
import axios from "axios";
import useUserAuth from "@/hooks/useUserAuth";
import Image from "next/image";
import bookIcon from "@/assets/icons/mycourse-icon/book.svg";
import clockIcon from "@/assets/icons/mycourse-icon/clock.svg";
import Footer from "../footer";

function MyCourseCard({ course }) {
  return (
    <div className="mycourse-card shadow-md rounded-[8px] overflow-hidden w-[357px] xl:w-[365px]">
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

  // useEffect(() => {
  //   if (userData) {
  //     const fetchCourses = async () => {
  //       try {
  //         const allCoursesResponse = await axios.get(
  //           `/api/my-course/getAllCourses?user_id=${userData.id}`
  //         );
  //         setAllCourses(allCoursesResponse.data);

  //         const inProgressCoursesResponse = await axios.get(
  //           `/api/my-course/getInProgressCourses?user_id=${userData.id}`
  //         );
  //         setInProgressCourses(inProgressCoursesResponse.data);

  //         const completedCoursesResponse = await axios.get(
  //           `/api/my-course/getCompletedCourses?user_id=${userData.id}`
  //         );
  //         setCompletedCourses(completedCoursesResponse.data);
  //       } catch (error) {
  //         console.log("Error fetching courses:", error);
  //       }
  //     };

  //     fetchCourses();
  //   }
  // }, [userData]);

  useEffect(() => {
    if (userData) {
      const fetchCourses = async () => {
        try {
          // Check if courses are stored in localStorage
          const storedAllCourses = localStorage.getItem("allCourses");
          const storedInProgressCourses =
            localStorage.getItem("inProgressCourses");
          const storedCompletedCourses =
            localStorage.getItem("completedCourses");

          if (
            storedAllCourses &&
            storedInProgressCourses &&
            storedCompletedCourses
          ) {
            setAllCourses(JSON.parse(storedAllCourses));
            setInProgressCourses(JSON.parse(storedInProgressCourses));
            setCompletedCourses(JSON.parse(storedCompletedCourses));
          } else {
            const allCoursesResponse = await axios.get(
              `/api/my-course/getAllCourses?user_id=${userData.id}`
            );
            setAllCourses(allCoursesResponse.data);
            localStorage.setItem(
              "allCourses",
              JSON.stringify(allCoursesResponse.data)
            );

            const inProgressCoursesResponse = await axios.get(
              `/api/my-course/getInProgressCourses?user_id=${userData.id}`
            );
            setInProgressCourses(inProgressCoursesResponse.data);
            localStorage.setItem(
              "inProgressCourses",
              JSON.stringify(inProgressCoursesResponse.data)
            );

            const completedCoursesResponse = await axios.get(
              `/api/my-course/getCompletedCourses?user_id=${userData.id}`
            );
            setCompletedCourses(completedCoursesResponse.data);
            localStorage.setItem(
              "completedCourses",
              JSON.stringify(completedCoursesResponse.data)
            );
          }
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
    <div className="my-course-list shadow-inner">
      <div className="decoaration relative w-full z-[-10]">
        {/* Decoration */}
        <svg
          width="100%"
          height="350"
          viewBox="0 0 375 157"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-5 left-0 xl:hidden"
        >
          <circle cx="350" cy="170" r="37" fill="#C6DCFF" />
          <path
            d="M320.372 35.5449L338.99 32.7062L332.139 50.249L320.372 35.5449Z"
            stroke="#FBAA1C"
            strokeWidth="3"
          />
          <circle cx="58" cy="-89" r="5.5" stroke="#2F5FAC" strokeWidth="3" />
          <circle cx="0.253627" cy="-20" r="13" fill="#C6DCFF" />
        </svg>

        <svg
          width="100%"
          height="500"
          viewBox="0 0 1980 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-5 left-0 hidden xl:block"
        >
          <circle cx="1965" cy="90" r="37" fill="#C6DCFF" />
          <g className="triangle" transform="scale(1.4) translate(950,-40)">
            <path
              d="M320.372 35.5449L338.99 32.7062L332.139 50.249L320.372 35.5449Z"
              stroke="#FBAA1C"
              strokeWidth="3"
            />
          </g>
          <circle cx="130" cy="-50" r="5.5" stroke="#2F5FAC" strokeWidth="3" />
          <circle cx="70" cy="20" r="13" fill="#C6DCFF" />

          <g className="green-x" transform="scale(1.4) translate(30,-80)">
            <path
              d="M248.843 132L243.838 150.68"
              stroke="#2FAC61"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M237 138.838L255.68 143.843"
              stroke="#2FAC61"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      <div className="py-10 px-4">
        <h1 className="text-[24px] font-[500] text-center xl:text-[36px]">
          My Courses
        </h1>

        {/* Tab Menu */}
        <div className="menu flex justify-between mt-6 mx-2 xl:justify-center xl:gap-4">
          <button
            onClick={() => setSelectedTab("all")}
            className={`text-[#9AA1B9] p-2 ${
              selectedTab === "all" ? "text-black border-b-2 border-black" : ""
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setSelectedTab("inProgress")}
            className={`text-[#9AA1B9] p-2 ${
              selectedTab === "inProgress"
                ? "text-black border-b-2 border-black"
                : ""
            }`}
          >
            Inprogress
          </button>
          <button
            onClick={() => setSelectedTab("completed")}
            className={`text-[#9AA1B9] p-2 ${
              selectedTab === "completed"
                ? "text-black border-b-2 border-black"
                : ""
            }`}
          >
            Completed
          </button>
        </div>

        {/* Main Layout (Responsive Flexbox) */}
        <div className="xl:flex xl:justify-center gap-4 mt-8 xl:mx-[120px]">
          {/* Profile Column (Sticky on Large Screens) */}
          {userData && (
            <div className="desktop-sticky py-8 hidden xl:block xl:sticky xl:top-24 xl:h-full w-full xl:w-[357px] bg-white rounded-xl shadow-md ">
              
              <div className="profile  flex flex-col justify-center items-center gap-6">
                <img
                  src={userData.profile_picture}
                  alt={userData.name}
                  className="xl:h-[120px] xl:w-[120px] rounded-full"
                />
                <div className="text-[#424C6B] text-[24px]">
                  {userData.name}
                </div>
              </div>

              <div className="status h-[134px] flex items-center gap-4 justify-evenly mt-4 mx-4 bg-white">
                <div className="in-progress w-[142.5px] text-[#646D89] text-[16px] bg-[#F1F2F6] rounded-[8px] flex flex-col gap-2 p-4">
                  Course Inprogress
                  <div className="text-black text-[20px]">
                    {inProgressCourses.length}
                  </div>
                </div>
                <div className="complete w-[142.5px] text-[#646D89] text-[16px] bg-[#F1F2F6] rounded-[8px] flex flex-col gap-2 p-4">
                  Course Complete
                  <div className="text-black text-[20px]">
                    {completedCourses.length}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cards Layout - Flexbox to adapt to screen size */}
          <div className="w-full xl:w-2/3 flex flex-wrap justify-center xl:justify-start xl:grid xl:grid-cols-2 xl:place-items-end gap-y-8 gap-x-6 xl:gap-y-10">
            {courses.map((course) => (
              <MyCourseCard key={course.course_id} course={course} />
            ))}
          </div>
        </div>

        {/* Mobile Layout - Sticky Profile at the Bottom */}
        {userData && (
          <div className="mobile-sticky xl:hidden fixed bottom-0 left-0 right-0 z-20 p-4 bg-white flex flex-col gap-2 shadow-xl">
            <div className="header flex items-center gap-3">
              <img
                src={userData.profile_picture}
                alt={userData.name}
                className="h-10 w-10 rounded-full"
              />
              <div className="text-[#424C6B]">{userData.name}</div>
            </div>
            <div className="status flex items-center justify-between bg-white">
              <div className="in-progress text-[#646D89] text-[12px] bg-[#F1F2F6] px-4 py-1 rounded-[8px] flex items-center gap-2">
                Course Inprogress
                <div className="text-black text-[20px]">
                  {inProgressCourses.length}
                </div>
              </div>
              <div className="complete text-[#646D89] text-[12px] bg-[#F1F2F6] px-4 py-1 rounded-[8px] flex items-center gap-2">
                Course Complete
                <div className="text-black text-[20px]">
                  {completedCourses.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <div className="blank xl:hidden h-[135px]"></div>
    </div>
  );
}
