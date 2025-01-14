//pages\course\[slug]\index.jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useUserAuth"; // นำเข้า useAuth จาก AuthContext
import axios from "axios";
import Navbar from "@/components/navbar";
import VideoPlayer from "@/components/video-presentation";
import SubscritonFloat from "@/components/subscription-float";
import Footer from "@/components/footer";
import CourseList from "@/components/course-card";
import Checkout from "@/components/checkout-course";
import FileSizeDisplay from "@/utils/fileSize";

export default function CourseDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openLesson, setOpenLesson] = useState(null);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [number,setNumber] = useState(0)

  // ใช้ useAuth เพื่อเข้าถึงค่า isLoggedIn และ user
  const {
    isLoggedIn,
    loading: authLoading,
    user,
    userData,
    subscriptions,
  } = useAuth();

  useEffect(() => {
    if (!course || !subscriptions) return;

    if (subscriptions.find((item) => item.course_id === course.course_id)) {
      setIsSubscribe(true);
    }
  }, [subscriptions, course]);

  const getCourseById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/courseById?slug=${slug}`);
      setCourse(response.data.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching course:", err);
      setError(err.response?.data?.message || "Error fetching course");
      setLoading(false);
    }
  };

  const toggleAccordion = (id) => {
    setOpenLesson((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (slug) getCourseById();
  }, [slug]);

  return (
    <div>
      <nav className="border-b-[1px]">
        <Navbar />
      </nav>
      <div className="all-content box-border flex flex-col relative items-center px-3">
        {error ? (
          <div className="error-message text-red-500">
            <p>{error}</p>
            <button
              onClick={() => router.replace(`/course`)}
              className="box-border lg:h-[60px] flex flex-row justify-center items-center px-2 py-2 gap-2 bg-[#2F5FAC] text-white shadow-[4px_4px_24px_rgba(0,0,0,0.08)] rounded-[12px] flex-none order-1 flex-grow"
            >
              Back to Course
            </button>
          </div>
        ) : loading ? (
          // แสดง loading spinner หรือ pulse เมื่อกำลังโหลด
          <div className="loading-pulse border border-blue-300 shadow rounded-md p-4 w-3/4 mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-700 rounded"></div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : course ? (
          <>
            <article className="flex flex-col relative lg:flex-row lg:items-start items-center">
              <div className="article-content lg:w-[740px] ">
                {/* back to all course */}
                <button
                  className="back-to-course flex items-center gap-2 mt-4 mb-3 w-fit"
                  onClick={() => router.replace(`/course`)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5273 7.33641H5.08066L8.334 4.08307C8.594 3.82307 8.594 3.39641 8.334 3.13641C8.074 2.87641 7.654 2.87641 7.394 3.13641L3.00066 7.52974C2.74066 7.78974 2.74066 8.20974 3.00066 8.46974L7.394 12.8631C7.654 13.1231 8.074 13.1231 8.334 12.8631C8.594 12.6031 8.594 12.1831 8.334 11.9231L5.08066 8.66974H12.5273C12.894 8.66974 13.194 8.36974 13.194 8.00307C13.194 7.63641 12.894 7.33641 12.5273 7.33641Z"
                      fill="#2F5FAC"
                    />
                  </svg>
                  <p className="font-bold text-base text-[#2F5FAC]  mb-0">
                    Back
                  </p>
                </button>

                {/* video display */}
                <div className="flex flex-col gap-8 lg:gap-[100px] ">
                  <VideoPlayer
                    videoSrc={course?.video_file || "default-video.mp4"}
                  />
                  <div className="course-header gap-[16px] lg:gap-[100px] w-full flex flex-col">
                    <div className="course-detail flex flex-col gap-4 lg:gap-6">
                      <h3 className="font-medium text-2xl lg:text-4xl m-0">
                        Course Detail
                      </h3>
                      <p className="detail m-0 font-normal text-sm lg:text-base text-[#646D89]">
                        {course.detail}
                      </p>
                    </div>
                    {isSubscribe ? (
                      <div className="attach-file flex flex-col gap-6 w-5/6 md:w-2/3 mt-2">
                        <h2 className="text-2xl lg:text-4xl m-0">
                          Attach File
                        </h2>
                        {course.fileUrl ? (
                          <div className="file flex gap-3 bg-[#E5ECF8] rounded-lg py-4 px-4">
                            <div className="file-left">
                              <a href={course.document_file} target="_blank">
                                <svg
                                  width="50"
                                  height="50"
                                  viewBox="0 0 50 50"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    width="50"
                                    height="50"
                                    rx="4"
                                    fill="white"
                                  />
                                  <path
                                    d="M32.5 27.25V24.625C32.5 23.7299 32.1444 22.8715 31.5115 22.2385C30.8786 21.6056 30.0201 21.25 29.125 21.25H27.625C27.3266 21.25 27.0405 21.1315 26.8295 20.9205C26.6185 20.7095 26.5 20.4234 26.5 20.125V18.625C26.5 17.7299 26.1444 16.8714 25.5115 16.2385C24.8785 15.6056 24.0201 15.25 23.125 15.25H21.25M23.5 15.25H18.625C18.004 15.25 17.5 15.754 17.5 16.375V33.625C17.5 34.246 18.004 34.75 18.625 34.75H31.375C31.996 34.75 32.5 34.246 32.5 33.625V24.25C32.5 21.8631 31.5518 19.5739 29.864 17.886C28.1761 16.1982 25.8869 15.25 23.5 15.25V15.25Z"
                                    stroke="#5483D0"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </a>
                            </div>
                            <div className="file-right flex flex-col gap-1 w-fit">
                              <p>{course.course_name}</p>
                              <FileSizeDisplay fileUrl={course.document_file} />
                            </div>
                          </div>
                        ) : (
                          <div className="file flex gap-3 bg-[#E5ECF8] rounded-lg py-4 px-4">
                            No file for this course
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* accordion */}
                    <div className="accordion w-full h-fit mt-8 mb-9 lg:mb-[280px] pb-4 ">
                      <h2 className="font-medium text-2xl lg:text-4xl lg:mb-6">
                        Lesson Samples
                      </h2>
                      {Array.isArray(course.lessons) &&
                        course.lessons.map((lesson, index) => (
                          <div
                            className="accordion-item !border-0 "
                            key={lesson.lesson_id}
                          >
                            <div className="accordion-header ">
                              <button
                                className="accordion-button bg-white !text-xl lg:!text-2xl !font-normal focus:!ring-0"
                                type="button"
                                onClick={() =>
                                  toggleAccordion(lesson.lesson_id)
                                }
                              >
                                <span className="text-[#646D89]">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                &nbsp; &nbsp; &nbsp;
                                {lesson.lesson_name}
                              </button>
                            </div>
                            <div
                              className={`accordion-collapse ${
                                openLesson === lesson.lesson_id
                                  ? "show"
                                  : "collapse"
                              }`}
                            >
                              <div className="accordion-body !px-10 ">
                                {Array.isArray(lesson.sub_lessons) &&
                                  lesson.sub_lessons.map((subLesson, index) => (
                                    <div
                                      key={index}
                                      className="text-base text-[#646D89]"
                                    >
                                      <p className="my-1">
                                        • {subLesson.sub_lesson_name}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {/* end of accordion */}
                  </div>
                </div>
              </div>
              <div className="hidden lg:grid lg:sticky lg:top-0 mt-10">
                <SubscritonFloat
                  course={course}
                  subscriptionStatus={isSubscribe}
                />
              </div>
            </article>
          </>
        ) : null}
      </div>
      <div className="other-course flex flex-col gap-8 lg:gap-14 items-center bg-[#F6F7FC] py-10 lg:pt-36 lg:pb-24 md:hidden">
        <p className="other-course-header font-medium text-2xl lg:text-4xl m-0 ">
          Other Interesting Course
        </p>
        <CourseList currentCourse={course} />
      </div>
      <div className="sub-float-mobile sticky bottom-0 lg:hidden">
        <SubscritonFloat course={course} subscriptionStatus={isSubscribe} />
      </div>
      <div className="md:hidden">
        <Checkout />
      </div>

      <Footer />
    </div>
  );
}
