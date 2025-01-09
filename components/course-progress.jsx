import React, { useState, useRef, useEffect } from "react";
import supabase from "../lib/supabase";
import CollapsiblePanel from "./collapsible-panel";
import AssignmentForm from "./mycourse/assignment-form";
import axios from "axios";
import { useRouter } from "next/router";

export default function CourseProgress({ slug }) {
  const [subLessonId, setSubLessonId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [subscribeCoursesData, setSubscribeCoursesData] = useState([]); //ข้อมูลที่ user subscribe แต่ละคอร์ส
  const [selectedSubLesson, setSelectedSubLesson] = useState(null); //ข้อมูลของ sub-lesson ที่ถูกเลือก
  const [selectedSubLessonIndex, setSelectedSubLessonIndex] = useState(null); //เก็บตำแหน่งของ index ของ sub_lesson ที่ถูกเลือก
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const learningSectionRef = useRef(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [assignmentDescription, setAssignmentDescription] = useState(null);
  const videoSectionRef = useRef(null);

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
        setLoading(false);

        setSubscribeCoursesData(subscribeData.data);
        setSubLessonId(
          subscribeData.data[0].lessons[0].sub_lessons[0].sub_lesson_id
        );
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
    fetchSubscribeCourses();
  }, [userData]);

  useEffect(() => {
    console.log("Subscription Course Data", subscribeCoursesData[0]);
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
    setSelectedSubLesson(lesson); // เลือก sub-lesson ที่คลิก
    setSelectedSubLessonIndex(index); // เก็บ index ของ sub-lesson ที่เลือก
    setIsVideoEnded(false);
    console.log(lesson);
    console.log("Selected Sub LessonId : ", selectedSubLesson?.sub_lesson_id);
    // ตรวจสอบว่า lesson มี assignments และเลือก assignment ที่ต้องการ
    if (lesson.assignments && lesson.assignments.length > 0) {
      setAssignmentDescription(lesson.assignments[0].assignment_description);
    } else {
      setAssignmentDescription("No assignment available for this lesson.");
    }

    if (learningSectionRef.current) {
      learningSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsVideoEnded(false);
  };

  const handleNextLesson = () => {
    if (selectedSubLessonIndex !== null && selectedSubLesson !== null) {
      const currentCourse = subscribeCoursesData.find((course) =>
        course.lessons.some((lesson) =>
          lesson.sub_lessons.includes(selectedSubLesson)
        )
      );

      if (currentCourse) {
        const currentLesson = currentCourse.lessons.find((lesson) =>
          lesson.sub_lessons.includes(selectedSubLesson)
        );

        const nextIndex = selectedSubLessonIndex + 1;

        if (currentLesson && nextIndex < currentLesson.sub_lessons.length) {
          const nextSubLesson = currentLesson.sub_lessons[nextIndex]; // กำหนดค่าของ nextSubLesson
          setSelectedSubLesson(nextSubLesson);
          setSelectedSubLessonIndex(nextIndex);
          setSubLessonId(nextSubLesson.sub_lesson_id); // ใช้ nextSubLesson อย่างถูกต้อง
        } else {
          const currentLessonIndex =
            currentCourse.lessons.indexOf(currentLesson);
          if (currentLessonIndex + 1 < currentCourse.lessons.length) {
            const nextLesson = currentCourse.lessons[currentLessonIndex + 1];
            const nextSubLesson = nextLesson.sub_lessons[0]; // กำหนดค่าของ nextSubLesson
            setSelectedSubLesson(nextSubLesson);
            setSelectedSubLessonIndex(0);
            setSubLessonId(nextSubLesson.sub_lesson_id); // ใช้ nextSubLesson อย่างถูกต้อง
          }
        }
      }
    }
    // เลื่อนอัตโนมัติไปยังวิดีโอ
    if (videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsVideoEnded(false);
  };

  const handlePreviousLesson = () => {
    if (selectedSubLessonIndex !== null && selectedSubLesson !== null) {
      const currentCourse = subscribeCoursesData.find((course) =>
        course.lessons.some((lesson) =>
          lesson.sub_lessons.includes(selectedSubLesson)
        )
      );

      if (currentCourse) {
        const currentLesson = currentCourse.lessons.find((lesson) =>
          lesson.sub_lessons.includes(selectedSubLesson)
        );

        const previousIndex = selectedSubLessonIndex - 1;

        if (currentLesson && previousIndex >= 0) {
          const prevSubLesson = currentLesson.sub_lessons[previousIndex]; // กำหนดค่าของ prevSubLesson
          setSelectedSubLesson(prevSubLesson);
          setSelectedSubLessonIndex(previousIndex);
          setSubLessonId(prevSubLesson.sub_lesson_id); // อัปเดต subLessonId
        } else {
          const currentLessonIndex =
            currentCourse.lessons.indexOf(currentLesson);
          if (currentLessonIndex - 1 >= 0) {
            const previousLesson =
              currentCourse.lessons[currentLessonIndex - 1];
            const prevSubLesson =
              previousLesson.sub_lessons[previousLesson.sub_lessons.length - 1]; // กำหนดค่าของ prevSubLesson
            setSelectedSubLesson(prevSubLesson);
            setSelectedSubLessonIndex(previousLesson.sub_lessons.length - 1);
            setSubLessonId(prevSubLesson.sub_lesson_id); // อัปเดต subLessonId
          }
        }
      }
    }
    // เลื่อนอัตโนมัติไปยังวิดีโอ
    if (videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsVideoEnded(false);
  };

  // console.log(selectedSubLesson); //ข้อมูลของ sub-lesson ที่ถูกเลือก
  // console.log(selectedSubLessonIndex); //เก็บตำแหน่งของ index ของ sub_lesson ที่ถูกเลือก

  //update progress
  const handleCompleteAssignment = () => {
    setProgress((prev) => Math.min(prev + 10, 100));
  };

  //auto scroll to learning section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return subscribeCoursesData && subscribeCoursesData.length > 0 ? (
    <>
      <div className="flex flex-col items-center md:flex-row md:justify-center md:items-start gap-3">
        {/* Left Section */}
        <section className="w-[343px] lg:w-[387px] flex-col mt-4 pt-4 p-4 box-border rounded-md ml-0 shadow-md xl:ml-8">
          <h1 className="text-xs font-normal mb-4 text-[#F47E20]">Course</h1>

          {/* Course Header */}
          <div className="h-10 mb-4 rounded">
            <h1 className="text-base font-medium">
              {subscribeCoursesData[0]?.course_name || "No Course Name"}
            </h1>
            <h2 className="text-xs font-normal">
              {subscribeCoursesData[0]?.summary || "No Summary Available"}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="text-xs font-normal mb-1 text-[#646D89]">
              {subscribeCoursesData[0].progress || 0}% Complete
            </div>
            <div className="w-full bg-gray-300 h-4 rounded-full">
              <div
                className="bg-gradient-to-r from-[#95BEFF] to-[#0040E5] h-4 rounded-full"
                style={{ width: `${subscribeCoursesData[0].progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Course Sections */}
          <div className="flex flex-col items-center">
            {subscribeCoursesData[0]?.lessons?.length > 0 ? (
              subscribeCoursesData[0].lessons.map((lesson, lessonIndex) => (
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
                            className={`mb-4 cursor-pointer flex items-center rounded w-[309px] pl-1 ${
                              selectedSubLesson?.sub_lesson_id ===
                              subLesson.sub_lesson_id
                                ? "bg-[#F6F7FC]" // สีของรายการที่ถูกเลือก
                                : ""
                            }`}
                            onClick={() =>
                              handleLessonClick(subLesson, subLessonIndex)
                            }
                          >
                            <div className="flex items-center bg-[#F6F7FC] rounded w-[309px] pl-1">
                              {subLesson.progress_status === "not-started" ? (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mb-[5px]"
                                >
                                  <circle
                                    cx="8"
                                    cy="8"
                                    r="7.25"
                                    stroke="#2FAC8E"
                                    stroke-width="1.5"
                                  />
                                </svg>
                              ) : subLesson.progress_status ===
                                "in-progress" ? (
                                <svg
                                  width="8"
                                  height="16"
                                  viewBox="0 0 8 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mb-[5px]"
                                >
                                  <mask
                                    id="path-1-inside-1_140_7904"
                                    fill="white"
                                  >
                                    <path d="M8 -3.49691e-07C5.87827 -2.56947e-07 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 -2.82249e-07 5.87827 -3.49691e-07 8C-4.17134e-07 10.1217 0.842854 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16L8 8L8 -3.49691e-07Z" />
                                  </mask>
                                  <path
                                    d="M8 -3.49691e-07C5.87827 -2.56947e-07 3.84344 0.842854 2.34315 2.34315C0.842854 3.84344 -2.82249e-07 5.87827 -3.49691e-07 8C-4.17134e-07 10.1217 0.842854 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16L8 8L8 -3.49691e-07Z"
                                    fill="#2FAC8E"
                                    stroke="#2FAC8E"
                                    stroke-width="3"
                                    mask="url(#path-1-inside-1_140_7904)"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mb-[5px]"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.875 10C1.875 5.5125 5.5125 1.875 10 1.875C14.4875 1.875 18.125 5.5125 18.125 10C18.125 14.4875 14.4875 18.125 10 18.125C5.5125 18.125 1.875 14.4875 1.875 10ZM13.0083 8.48833C13.0583 8.42171 13.0945 8.34576 13.1147 8.26496C13.135 8.18415 13.1388 8.10012 13.1261 8.0178C13.1134 7.93547 13.0844 7.85652 13.0407 7.78558C12.9971 7.71464 12.9396 7.65315 12.8719 7.60471C12.8041 7.55627 12.7273 7.52187 12.6461 7.50352C12.5648 7.48518 12.4807 7.48326 12.3987 7.49789C12.3167 7.51251 12.2385 7.54338 12.1686 7.58868C12.0987 7.63398 12.0385 7.69279 11.9917 7.76167L9.295 11.5367L7.94167 10.1833C7.82319 10.0729 7.66648 10.0128 7.50456 10.0157C7.34265 10.0185 7.18816 10.0841 7.07365 10.1986C6.95914 10.3132 6.89354 10.4676 6.89069 10.6296C6.88783 10.7915 6.94793 10.9482 7.05833 11.0667L8.93333 12.9417C8.99749 13.0058 9.07483 13.0552 9.15999 13.0864C9.24515 13.1176 9.33608 13.1299 9.42647 13.1224C9.51686 13.115 9.60455 13.088 9.68344 13.0432C9.76233 12.9985 9.83054 12.9371 9.88333 12.8633L13.0083 8.48833Z"
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
            <div
              className="w-[343px] lg:w-[480px] xl:w-[739px] flex flex-col items-start justify-center lg:ml-4 mt-6 lg:mt-4"
              onLoad={() => {
                // Scroll to the learning section when a sub-lesson is selected
                learningSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <h1 className="w-[343px] lg:w-[439px] text-2xl p-2">
                {selectedSubLesson.sub_lesson_name || "No Subtitle"}
              </h1>
              {selectedSubLesson?.video ? (
                <div ref={videoSectionRef}>
                  <video
                    className="w-[343px] lg:w-[480px] xl:w-[739px] rounded-xl"
                    controls
                    muted
                    onEnded={handleVideoEnd} // เรียกฟังก์ชันเมื่อวิดีโอเล่นจบ
                    key={selectedSubLesson.video}
                  >
                    <source
                      src={selectedSubLesson.video || ""}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
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
              subLessonId={selectedSubLesson.sub_lesson_id}
              onComplete={handleCompleteAssignment}
            />
          )}
        </section>
      </div>

      {/* Previous, Next */}
      <div className="flex justify-between mt-10 px-3 shadow-[0_-1px_15px_-6px_rgba(0,0,0,0.3)] h-[92px] sticky bottom-0 bg-white z-50">
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
          disabled={!selectedSubLesson}
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
