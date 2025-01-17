import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import axios from "axios";
import { useRouter } from "next/router";

const AddAssignment = () => {
  const router = useRouter();

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedSubLesson, setSelectedSubLesson] = useState("");
  const [assignment, setAssignment] = useState("");

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [subLessons, setSubLessons] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingSubLessons, setLoadingSubLessons] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [courseError, setCourseError] = useState("");
  const [lessonError, setLessonError] = useState("");
  const [subLessonError, setSubLessonError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");

  const handleCourseSelect = (courseValue) => {
    setSelectedCourse(courseValue);
    setSelectedLesson("");
    setSelectedSubLesson("");
    setCourseError("");
  };

  const handleLessonSelect = (lessonValue) => {
    setSelectedLesson(lessonValue);
    setSelectedSubLesson("");
    setLessonError("");
  };

  const handleSubLessonSelect = (subLessonValue) => {
    setSelectedSubLesson(subLessonValue);
    setSubLessonError("");
  };

  const handleLessonClick = () => {
    if (!selectedCourse) {
      setCourseError("!! Please select a course");
      setLessonError("");
      return;
    }
  };

  const handleSubLessonClick = () => {
    if (!selectedCourse) {
      setCourseError("!! Please select a course");
      setLessonError("");
      setSubLessonError("");
      return;
    }
    if (!selectedLesson) {
      setLessonError("!! Please select a lesson");
      setSubLessonError("");
      setCourseError("");
      return;
    }
  };

  const handleAssignmentChange = (e) => {
    setAssignment(e.target.value);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/admin/fetch_course_name");
        setCourses(response.data);
        setLoadingCourses(false);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    const fetchLessons = async () => {
      setLoadingLessons(true);
      try {
        const response = await axios.get(
          `/api/admin/fetch_lesson_name_with_courseId?courseId=${selectedCourse.course_id}`
        );
        setLessons(response.data);
        setLoadingLessons(false);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        setLoadingLessons(false);
      }
    };
    fetchLessons();
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedLesson) return;

    const fetchSubLessons = async () => {
      setLoadingSubLessons(true);
      try {
        const response = await axios.get(
          `/api/admin/fetch_subLesson_name_with_lessonId?lessonId=${selectedLesson.lesson_id}`
        );
        setSubLessons(response.data);
        setLoadingSubLessons(false);
      } catch (error) {
        console.error("Failed to fetch sub-lessons:", error);
        setLoadingSubLessons(false);
      }
    };

    fetchSubLessons();
  }, [selectedLesson]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    if (!selectedCourse) {
      setCourseError("Please select a course");
      setLessonError("Please select a lesson");
      setSubLessonError("Please select a sub-lesson");
    }
    if (selectedCourse && !selectedLesson) {
      setLessonError("Please select a lesson");
      setSubLessonError("Please select a sub-lesson");
    }
    if (selectedCourse && selectedLesson && !selectedSubLesson) {
      setSubLessonError("Please select a sub-lesson");
    }
    if (!assignment) {
      setAssignmentError("Please fill an assignment");
    }

    if (
      selectedCourse &&
      selectedLesson &&
      selectedSubLesson &&
      assignment !== ""
    ) {
      const data = {
        subLessonId: selectedSubLesson.sub_lesson_id,
        assignment: assignment,
      };

      try {
        const response = await axios.post("/api/admin/post_assignment", data);
        if (response.status === 200) {
          setCreateLoading(false);
          router.push("/admin/assignment_list");
        }
      } catch (error) {
        console.error("Error creating assignment:", error);
        setCreateLoading(false);
      }
    } else {
      setCreateLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/assignment_list");
  };

  return (
    <form
      className="add-course-page bg-[#F6F7FC] w-full"
      onSubmit={handleSubmit}
    >
      <header className="top-bar flex justify-between items-center h-[92px] px-10 py-4 bg-white border-b-[1px] border-[#D6D9E4]">
        <h1 className="text-[24px] font-[500]">Add Assignment</h1>
        <div className="button flex gap-4">
          <button
            onClick={handleCancel}
            type="button"
            className="cancel-button w-[120px] h-[60px] px-8 py-[18px] text-[#F47E20] font-[700] border border-[#F47E20] rounded-[12px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-button w-[120px] h-[60px] px-8 py-[18px] text-[#FFFFFF] bg-[#2F5FAC] font-[700] rounded-[12px] flex justify-center items-center"
          >
            Create
          </button>
        </div>
      </header>
      {createLoading ? (
        <div className="absolute inset-0 bg-[#FFFFFF] bg-opacity-80 flex items-center justify-center z-10">
          <div className="loader border-t-4 border-[#2F5FAC] w-12 h-12 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="main-card bg-white px-[100px] pt-[40px] pb-[60px] m-10 border-[1px] border-[#E6E7EB] rounded-[16px]">
          <div className="course-selected-part flex flex-col gap-10 border-b-[1px] border-[#D6D9E4] pb-10">
            <div className="flex flex-rol gap-10 justify-between items-center">
              <div className="w-full">
                <Dropdown
                  label="Course"
                  datas={courses}
                  placeholder="Please select a course"
                  value={selectedCourse}
                  onSelect={handleCourseSelect}
                  idKey="course_id"
                  nameKey="course_name"
                  borderColor={courseError ? "#9B2FAC" : ""}
                  errorMessage={courseError}
                />
              </div>
              <div className="w-full"></div>
            </div>
            <div className="flex flex-rol gap-10 justify-between" onClick={handleLessonClick}>
              <div className="w-full">
                <Dropdown
                  label="Lesson"
                  datas={lessons}
                  placeholder="Please select a lesson"
                  value={selectedLesson}
                  onSelect={handleLessonSelect}
                  idKey="lesson_id"
                  nameKey="lesson_name"
                  borderColor={lessonError ? "#9B2FAC" : ""}
                  errorMessage={lessonError}
                  disabled={!selectedCourse}
                />
              </div>

              <div className="w-full" onClick={handleSubLessonClick}>
                <Dropdown
                  label="Sub-lesson"
                  datas={subLessons}
                  placeholder="Please select a sub-lesson"
                  value={selectedSubLesson}
                  onSelect={handleSubLessonSelect}
                  idKey="sub_lesson_id"
                  nameKey="sub_lesson_name"
                  borderColor={subLessonError ? "#9B2FAC" : ""}
                  errorMessage={subLessonError}
                  disabled={!selectedLesson}
                />
              </div>
            </div>
          </div>

          <div className="assignment-part flex flex-col gap-10">
            <div className="text-[#646D89] text-[20px] font-[600] mt-10">
              Assignment detail
            </div>

            <div className="flex flex-col gap-1 justify-center">
              <label htmlFor="assignmentInput">Assignment *</label>
              <input
                id="assignmentInput"
                value={assignment}
                onChange={handleAssignmentChange}
                placeholder=""
                className={`border-[1px]  rounded-[8px] py-3 pr-4 pl-3
                  ${assignmentError ? "border-[#9B2FAC]" : "border-[#D6D9E4]"}`}
              />
              {assignmentError && (
                <div className="text-[#9B2FAC] text-sm">{assignmentError}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddAssignment;
