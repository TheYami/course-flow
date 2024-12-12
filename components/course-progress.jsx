import React, { useState, useRef, useEffect } from "react";
import supabase from "../lib/supabase";
import React, { useState, useRef, useEffect } from "react";
import supabase from "../lib/supabase";
import Image from "next/image";
import CollapsiblePanel from "./collapsible-panel";
import AssignmentForm from "./mycourse/assignment-form";
import axios from "axios";
import { useRouter } from "next/router";
import AssignmentForm from "./mycourse/assignment-form";
import axios from "axios";
import { useRouter } from "next/router";

export default function CourseProgress({slug}) {
  const [progress, setProgress] = useState(0);
  //fetch from suapbase
  const [subcribeCoursesData, setSubscribeCoursesData] = useState([]);
  const [lessonsData, setLessonsData] = useState([]);
  const [subLessonData, setSubLessonData] = useState([]);
  //mockup data
  // const [sections, setSections] = useState([
  //   {
  //     id: 1,
  //     title: "Introduction",
  //     lessons: [
  //       {
  //         subtitle: "4 Levels of Service Design in an Organization",
  //         imgurl: "/assets/icon/none.png",
  //         videourl: "/assets/image/mockupvideo.png",
  //         status: "Pending", // เพิ่มสถานะเริ่มต้น
  //         answer: "", // เก็บคำตอบของแต่ละ lesson
  //       },
  //       {
  //         subtitle: "5 Levels of Service Design in an Organization",
  //         imgurl: "/assets/icon/complete.png",
  //         videourl: "/assets/image/mockupvideo.png",
  //         status: "Pending",
  //         answer: "",
  //       },
  //       {
  //         subtitle: "6 Levels of Service Design in an Organization",
  //         imgurl: "/assets/icon/ongoing.png",
  //         videourl: "/assets/image/mockupvideo.png",
  //         status: "Pending",
  //         answer: "",
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     title: "Service Design Theories and Principles",
  //     lessons: [
  //       {
  //         subtitle: "7 Levels of Service Design in an Organization",
  //         imgurl: "/assets/icon/ongoing.png",
  //         videourl: "/assets/image/mockupvideo.png",
  //         status: "Pending",
  //         answer: "",
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     title: "Understanding Users and Finding Opportunities",
  //     lessons: [
  //       {
  //         subtitle: "8 Levels of Service Design in an Organization",
  //         imgurl: "/assets/icon/none.png",
  //         videourl: "/assets/image/mockupvideo.png",
  //         status: "Pending",
  //         answer: "",
  //       },
  //       {
  //         subtitle: "9 Levels of Service Design in an Organization",
  //         imgurl: "/assets/icon/complete.png",
  //         videourl: "/assets/image/mockupvideo.png",
  //         status: "Pending",
  //         answer: "",
  //       },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     title: "Identifying and Validating Opportunities for Design",
  //     lessons: [
  //       {
  //         subtitle: "10 Levels of Service Design in an Organization",
  //         imgurl: "/assets/icon/ongoing.png",
  //         videourl: "/assets/image/mockupvideo.png",
  //         status: "Pending",
  //         answer: "",
  //       },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     title: "Prototyping",
  //     lessons: [
  //       {
  //         subtitle: "11 Levels of Service Design in an Organization",
  //         imgurl: "/assets/icon/ongoing.png",
  //         videourl: "/assets/image/mockupvideo.png",
  //         status: "Pending",
  //         answer: "",
  //       },
  //     ],
  //   },
  //   {
  //     id: 6,
  //     title: "Course Summary",
  //     lessons: [
  //       {
  //         subtitle: "12 Levels of Service Design in an Organization",
  //         imgurl: "/assets/icon/ongoing.png",
  //         videourl: "/assets/image/mockupvideo.png",
  //         status: "Pending",
  //         answer: "",
  //       },
  //     ],
  //   },
  // ]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(null); // เก็บตำแหน่งของ selectedLesson
  const learningSectionRef = useRef(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
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
    }
  };
  useEffect(() => {
    checkSession(); // ตรวจสอบเซสชันจาก Supabase
  }, []);
  //fetch subscription data from supabase
  useEffect(() => {
    const fetchSubscribeCourses = async () => {
      if (!userData) return;
      setLoading(false);
      try {
        const subscribeData = await axios.get(
          `/api/course-learning/subscribeCourses?user_id=${userData.id}&slug=${slug}`
        ); // ดึงข้อมูลการสมัครคอร์สของผู้ใช้
        setSubscribeCoursesData(subscribeData.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }

    };
    fetchSubscribeCourses();
  }, [userData]);

  useEffect(() => {
    console.log(subcribeCoursesData);
  }, [subcribeCoursesData]);

  if (loading) {
    return <div>Loading...</div>; // แสดงเมื่อยังโหลดข้อมูล
  }

  // const handleLessonClick = (lesson, index) => {
  //   setSelectedLesson(lesson);
  //   setSelectedLessonIndex(index);

  //   if (learningSectionRef.current) {
  //     learningSectionRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  // const handleLessonUpdate = (updatedLesson) => {
  //   setSections((prevSections) =>
  //     prevSections.map((section) => ({
  //       ...section,
  //       lessons: section.lessons.map((lesson) =>
  //         lesson.subtitle === updatedLesson.subtitle ? updatedLesson : lesson
  //       ),
  //     }))
  //   );
  // };

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
  console.log(slug);

  //update progress
  const handleCompleteAssignment = () => {
    setProgress((prev) => Math.min(prev + 10, 100));
  };
  return <>
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
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            <CollapsiblePanel
              title={
                <span className="text-base font-medium flex gap-3">
                  <span className="text-gray-500">
                    {section.id.toString().padStart(2, "0")}
                  </span>
                  <span className="text-black">{section.title}</span>
                </span>
              }
            >
              {section.lessons.length > 0 ? (
                <div className="mt-3">
                  {section.lessons.map((lesson, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex items-center bg-[#F6F7FC] rounded w-[309px] pl-1">
                        <img
                          src={lesson.imgurl}
                          alt="lesson progress"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <p className="text-sm text-[#646D89] bg-blue-50 rounded p-2 mb-2">
                          {lesson.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No lessons available</p>
              )}
            </CollapsiblePanel>
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
          disabled={!selectedSubLesson}
        >
          Previous Lesson
        </button>
        <button
          className="bg-[#2F5FAC] w-[161px] h-[60px] rounded-xl text-white font-semibold mt-3 2xl:mr-52"
          onClick={handleNextLesson}
          disabled={
            selectedLessonIndex ===
            subcribeCoursesData.flatMap((section) => section.lessons).length - 1
          }
        >
          Next Lesson
        </button>
      </div>
  </>;
}
