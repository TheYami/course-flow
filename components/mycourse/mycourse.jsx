import { useState, useEffect } from "react";
import axios from "axios";
import useUserAuth from "@/hooks/useUserAuth";
import Footer from "../footer";
import Decoration from "./decoration";
import MyCourseCard from "./mycourse-card";
import StickyMobile from "./sticky-mobile";
import StickyDesktop from "./sticky-desktop";

export default function MyCourse() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { userData, loading: userLoading } = useUserAuth();
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

  // useEffect(() => {
  //   if (userData) {
  //     const fetchCourses = async () => {
  //       try {
  //         // Check if courses are stored in localStorage
  //         const storedAllCourses = localStorage.getItem("allCourses");
  //         const storedInProgressCourses =
  //           localStorage.getItem("inProgressCourses");
  //         const storedCompletedCourses =
  //           localStorage.getItem("completedCourses");

  //         if (
  //           storedAllCourses &&
  //           storedInProgressCourses &&
  //           storedCompletedCourses
  //         ) {
  //           setAllCourses(JSON.parse(storedAllCourses));
  //           setInProgressCourses(JSON.parse(storedInProgressCourses));
  //           setCompletedCourses(JSON.parse(storedCompletedCourses));
  //         } else {
  //           const allCoursesResponse = await axios.get(
  //             `/api/my-course/getAllCourses?user_id=${userData.id}`
  //           );
  //           setAllCourses(allCoursesResponse.data);
  //           localStorage.setItem(
  //             "allCourses",
  //             JSON.stringify(allCoursesResponse.data)
  //           );

  //           const inProgressCoursesResponse = await axios.get(
  //             `/api/my-course/getInProgressCourses?user_id=${userData.id}`
  //           );
  //           setInProgressCourses(inProgressCoursesResponse.data);
  //           localStorage.setItem(
  //             "inProgressCourses",
  //             JSON.stringify(inProgressCoursesResponse.data)
  //           );

  //           const completedCoursesResponse = await axios.get(
  //             `/api/my-course/getCompletedCourses?user_id=${userData.id}`
  //           );
  //           setCompletedCourses(completedCoursesResponse.data);
  //           localStorage.setItem(
  //             "completedCourses",
  //             JSON.stringify(completedCoursesResponse.data)
  //           );
  //         }
  //       } catch (error) {
  //         console.log("Error fetching courses:", error);
  //       }
  //     };

  //     fetchCourses();
  //   }
  // }, [userData]);

  useEffect(() => {
    if (selectedTab === "all" ) {
      setCourses(allCourses);
    } else if (selectedTab === "inProgress" ) {
      setCourses(inProgressCourses);
    } else if (selectedTab === "completed" ) {
      setCourses(completedCourses);
    }
  }, [selectedTab, allCourses, inProgressCourses, completedCourses]);

  return (
    <div className="my-course-list">
      <Decoration />

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
            <StickyDesktop
              userData={userData}
              inProgressCourses={inProgressCourses}
              completedCourses={completedCourses}
            />
          )}

          {/* Cards Layout - Flexbox to adapt to screen size */}
          <div className="w-full xl:w-2/3 flex flex-wrap justify-center xl:justify-start xl:grid xl:grid-cols-2 xl:place-items-end gap-y-8 gap-x-6 xl:gap-y-10">
            {courses.map((course) => (
              <MyCourseCard course={course} />
            ))}
          </div>
        </div>

        {/* Mobile Layout - Sticky Profile at the Bottom */}
        {userData && (
          <StickyMobile
            userData={userData}
            inProgressCourses={inProgressCourses}
            completedCourses={completedCourses}
          />
        )}
      </div>
      <Footer />
      <div className="blank xl:hidden h-[135px]"></div>
    </div>
  );
}
