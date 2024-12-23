import React, { useState, useRef, useEffect } from "react";
import supabase from "../lib/supabase";
import Image from "next/image";
import CollapsiblePanel from "./collapsible-panel";
import AssignmentForm from "./mycourse/assignment-form";
import axios from "axios";
import { useRouter } from "next/router";

export default function CourseProgress({ slug }) {
  const [progress, setProgress] = useState(0);
  //fetch from suapbase
  const [subcribeCoursesData, setSubscribeCoursesData] = useState([]);
  const [lessonsData, setLessonsData] = useState([]);
  const [subLessonData, setSubLessonData] = useState([]);
  const [selectedSubLesson, setSelectedSubLesson] = useState(null);
  const [selectedSubLessonIndex, setSelectedSubLessonIndex] = useState(null); // เก็บตำแหน่งของ selectedLesson
  const learningSectionRef = useRef(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const handleVideoEnd = () => {
    setIsVideoEnded(true);
  };

  // ฟังก์ชันตรวจสอบเซสชันจาก Supabase
  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setUser(null);
      setLoading(false);
      router.push("/login"); // ไปที่หน้าล็อกอินหากไม่พบเซสชัน
      return;
    }

    setUser(session.user);
    setLoading(false);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
    } else {
      setUserData(data); // เก็บข้อมูลผู้ใช้
      console.log(data);
    }
  };
  useEffect(() => {
    checkSession(); // ตรวจสอบเซสชันจาก Supabase
  }, []);
  //fetch subscription data from supabase
  useEffect(() => {
    const fetchSubscribeCourses = async () => {
      setLoading(true);
      if (!userData) return;
      setLoading(false);
      try {
        const subscribeData = await axios.get(
          `/api/course-learning/subscribeCourses?user_id=${userData.id}&course_id=${slug}`
        ); // ดึงข้อมูลการสมัครคอร์สของผู้ใช้
        console.log(subscribeData.data);
        setLoading(false);

        setSubscribeCoursesData(subscribeData.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
    fetchSubscribeCourses();
  }, [userData]);

  useEffect(() => {
    console.log(subscribeCoursesData);
  }, [subscribeCoursesData]);

  useEffect(() => {
    // ตรวจสอบว่ามีข้อมูลคอร์สที่ subscribe หรือไม่
    if (
      subscribeCoursesData.length > 0 &&
      subscribeCoursesData[0].lessons?.length > 0 &&
      subscribeCoursesData[0].lessons[0].sub_lessons?.length > 0
    ) {
      const firstSubLesson = subscribeCoursesData[0].lessons[0].sub_lessons[0];
      setSelectedSubLesson(firstSubLesson); // ตั้งค่า sub_lesson แรก
      setSelectedSubLessonIndex(0); // index ของ sub_lesson แรก
      setSelectedLessonIndex(0); // index ของ lesson แรก
    }
  }, [subscribeCoursesData]);

  if (loading) {
    return <div>Loading...</div>; // แสดงเมื่อยังโหลดข้อมูล
  }

  const handleLessonClick = (lesson, index) => {
    setSelectedSubLesson(lesson);
    setSelectedSubLessonIndex(index);

    if (learningSectionRef.current) {
      learningSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePreviousLesson = () => {
    if (selectedSubLessonIndex > 0) {
      const previousLesson = selectedSubLesson
        .flatMap((section) => section.lessons)
        .find((_, index) => index === selectedSubLessonIndex - 1);
      setSelectedSubLesson(previousLesson);
      setSelectedSubLessonIndex(selectedSubLessonIndex - 1);
    }
  };
  console.log(selectedSubLesson);
  console.log(subcribeCoursesData);
  console.log(subcribeCoursesData[0]);

  const handleNextLesson = () => {
    const totalSubLessons = subcribeCoursesData[0]?.lessons.sub_lessons.flatMap(
      (lesson) => lesson.sub_lessons
    ).length;

    if (selectedSubLessonIndex < totalSubLessons - 1) {
      // คำนวณ sub-lesson ถัดไป
      const nextSubLesson = subcribeCoursesData[0]?.lessons.flatMap(
        (lesson) => lesson.sub_lessons
      )[selectedSubLessonIndex + 1]; // หาค่าบทเรียนถัดไปจาก index
      setSelectedSubLesson(nextSubLesson);
      setSelectedSubLessonIndex(selectedSubLessonIndex + 1); // อัปเดต index
    }
  };
  //auto scroll to learning section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  //auto scroll to learning section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  //auto scroll to learning section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  //auto scroll to learning section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  console.log(slug);

  return subcribeCoursesData && subcribeCoursesData.length > 0 ? (
    <>
      <div className="flex flex-col items-center md:flex-row md:justify-center md:items-start gap-3">
        {/* Left Section */}
        <section className="w-[343px] lg:w-[387px] flex-col mt-4 pt-4 p-4 box-border rounded-md ml-4 shadow-md xl:ml-8">
          <h1 className="text-xs font-normal mb-4 text-[#F47E20]">Course</h1>

          {/* Course Header */}
          <div className="h-10 mb-4 rounded">
            <h1 className="text-base font-medium">
              {subscribeCoursesData[0]?.course_name || "No Course Name"}
            </h1>
            <h2 className="text-xs font-normal">
              {subcribeCoursesData[0]?.summary || "No Summary Available"}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="text-xs font-normal mb-1 text-[#646D89]">
              {progress || 0}% Complete
            </div>
            <div className="w-full bg-gray-300 h-4 rounded-full">
              <div
                className="bg-gradient-to-r from-[#95BEFF] to-[#0040E5] h-4 rounded-full"
                style={{ width: `${progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Course Sections */}
          <div className="flex flex-col items-center">
            {subcribeCoursesData[0]?.lessons?.length > 0 ? (
              subcribeCoursesData[0].lessons.map((lesson, lessonIndex) => (
                <div
                  key={lesson.lesson_id || lessonIndex}
                  className="mb-4 w-full"
                >
                  <CollapsiblePanel
                    title={
                      <span className="text-base font-medium flex gap-3">
                        <span className="text-gray-500">
                          {(lessonIndex + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="text-black">
                          {lesson.lesson_name || "Unnamed Lesson"}
                        </span>
                      </span>
                    }
                  >
                    {lesson.sub_lessons?.length > 0 ? (
                      <div className="mt-3">
                        {lesson.sub_lessons.map((subLesson, subLessonIndex) => (
                          <div
                            key={subLessonIndex}
                            className="mb-4 cursor-pointer"
                            onClick={() =>
                              handleLessonClick(subLesson, subLessonIndex)
                            }
                          >
                            <div className="flex items-center bg-[#F6F7FC] rounded w-[309px] pl-1">
                              {subLesson.complete_status === "not started" ? (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-6 h-6"
                                >
                                  <circle
                                    cx="8"
                                    cy="8"
                                    r="7.25"
                                    stroke="#2FAC8E"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                              ) : subLesson.complete_status ===
                                "in-progress" ? (
                                <svg
                                  width="8"
                                  height="16"
                                  viewBox="0 0 8 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-6 h-6"
                                >
                                  <mask
                                    id="path-1-inside-1_140_7811"
                                    fill="white"
                                  >
                                    <path d="M8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8C0 10.1217 0.842854 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16L8 8L8 0Z" />
                                  </mask>
                                  <path
                                    d="M8 0C5.87827 0 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 0 5.87827 0 8C0 10.1217 0.842854 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16L8 8L8 0Z"
                                    fill="#2FAC8E"
                                    stroke="#2FAC8E"
                                    strokeWidth="3"
                                    mask="url(#path-1-inside-1_140_7811)"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.875 10.5C1.875 6.0125 5.5125 2.375 10 2.375C14.4875 2.375 18.125 6.0125 18.125 10.5C18.125 14.9875 14.4875 18.625 10 18.625C5.5125 18.625 1.875 14.9875 1.875 10.5ZM13.0083 8.98833C13.0583 8.92171 13.0945 8.84576 13.1147 8.76496C13.135 8.68415 13.1388 8.60012 13.1261 8.5178C13.1134 8.43547 13.0844 8.35652 13.0407 8.28558C12.9971 8.21464 12.9396 8.15315 12.8719 8.10471C12.8041 8.05627 12.7273 8.02187 12.6461 8.00352C12.5648 7.98518 12.4807 7.98326 12.3987 7.99789C12.3167 8.01251 12.2385 8.04338 12.1686 8.08868C12.0987 8.13398 12.0385 8.19279 11.9917 8.26167L9.295 12.0367L7.94167 10.6833C7.82319 10.5729 7.66648 10.5128 7.50456 10.5157C7.34265 10.5185 7.18816 10.5841 7.07365 10.6986C6.95914 10.8132 6.89354 10.9676 6.89069 11.1296C6.88783 11.2915 6.94793 11.4482 7.05833 11.5667L8.93333 13.4417C8.99749 13.5058 9.07483 13.5552 9.15999 13.5864C9.24515 13.6176 9.33608 13.6299 9.42647 13.6224C9.51686 13.615 9.60455 13.588 9.68344 13.5432C9.76233 13.4985 9.83054 13.4371 9.88333 13.3633L13.0083 8.98833Z"
                                    fill="#2FAC8E"
                                  />
                                </svg>
                              )}
                              <p className="text-sm text-[#646D89] rounded p-2 mb-2">
                                {subLesson.sub_lesson_name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No lessons available
                      </p>
                    )}
                  </CollapsiblePanel>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No course sections available
              </p>
            )}
          </div>
        </section>

        {/* Right Section */}
        <section className="flex-col xl:ml-12" ref={learningSectionRef}>
          {selectedSubLesson && (
            <div className="w-[343px] lg:w-[739px] flex flex-col items-start justify-center lg:ml-4 mt-6 lg:mt-4">
              <h1 className="w-[343px] lg:w-[439px] text-2xl p-2">
                {selectedSubLesson.sub_lesson_name || "No Subtitle"}
              </h1>
              {selectedSubLesson?.video ? (
                <video
                  className="w-[343px] lg:w-[739px]"
                  controls
                  autoPlay
                  loop
                  muted
                >
                  <source src={selectedSubLesson.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src="/assets/image/mockupvideo.png"
                  alt="mockup video"
                  className="w-[343px] lg:w-[739px]"
                />
              )}
            </div>
          )}
          {/* Previous, Next */}
          {isVideoEnded && (
            <AssignmentForm
              slug={slug}
              userData={userData}
              subLessonId={subLessonId}
              onComplete={handleCompleteAssignment}
            />
          )}
        </section>
      </div>

      {/* Previous, Next */}
      <div className="flex justify-between mt-10 px-3 shadow-[0_-1px_15px_-6px_rgba(0,0,0,0.3)] h-[92px]">
        <button
          className="text-[#2F5FAC] font-semibold xl:ml-10 2xl:ml-64"
          onClick={handlePreviousLesson}
          disabled={selectedSubLessonIndex === 0}
        >
          Previous Lesson
        </button>
        <button
          className="bg-[#2F5FAC] w-[161px] h-[60px] rounded-xl text-white font-semibold mt-3 2xl:mr-52"
          onClick={handleNextLesson}
          disabled={
            selectedSubLessonIndex ===
            subcribeCoursesData.flatMap((section) => section.lessons).length - 1
          }
        >
          Next Lesson
        </button>
      </div>
    </>
  ) : (
    <div className="flex items-center justify-center h-full">
      <p className="text-sm text-gray-500">Loading course information...</p>
    </div>
  );
}
