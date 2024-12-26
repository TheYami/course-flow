import { useState } from "react";
import Dropdown from "./Dropdown";
import axios from "axios";
import Image from "next/image";
import loadingIcon from "../../assets/icons/admin_icon/loading_icon.gif";
import { useRouter } from "next/router";

const AddAssignment = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedSubLesson, setSelectedSubLesson] = useState("");
  const [assignment, setAssignment] = useState("");

  const courses = [
    { value: "course1", label: "Course 1" },
    { value: "course2", label: "Course 2" },
    { value: "course3", label: "Course 3" },
    { value: "course4", label: "Course 4" },
  ];

  const lessons = [
    { value: "lesson1", label: "lesson 1" },
    { value: "lesson2", label: "lesson 2" },
    { value: "lesson3", label: "lesson 3" },
    { value: "lesson4", label: "lesson 4" },
  ];

  const subLessons = [
    { value: "sub-lesson1", label: "sub-lesson 1" },
    { value: "sub-lesson2", label: "sub-lesson 2" },
    { value: "sub-lesson3", label: "sub-lesson 3" },
    { value: "sub-lesson4", label: "sub-lesson 4" },
  ];

  const handleCourseSelect = (courseValue) => {
    setSelectedCourse(courseValue);
  };

  const handleLessonSelect = (lessonValue) => {
    setSelectedLesson(lessonValue);
  };

  const handleSubLessonSelect = (subLessonValue) => {
    setSelectedSubLesson(subLessonValue);
  };

  const handleAssignmentChange = (e) => {
    setAssignment(e.target.value);
  };

  return (
    <form
      className="add-course-page bg-[#F6F7FC] w-full"
      // onSubmit={}
    >
      <header className="top-bar flex justify-between items-center h-[92px] px-10 py-4 bg-white border-b-[1px] border-[#D6D9E4]">
        <h1 className="text-[24px] font-[500]">Add Assignment</h1>
        <div className="button flex gap-4">
          <button
            // onClick={}
            type="button"
            className="cancel-button w-[120px] h-[60px] px-8 py-[18px] text-[#F47E20] font-[700] border border-[#F47E20] rounded-[12px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-button w-[120px] h-[60px] px-8 py-[18px] text-[#FFFFFF] bg-[#2F5FAC] font-[700] rounded-[12px] flex justify-center items-center"
            // disabled={isLoading}
          >
            Create
          </button>
        </div>
      </header>

      <div className="main-card bg-white px-[100px] pt-[40px] pb-[60px] m-10 border-[1px] border-[#E6E7EB] rounded-[16px]">
        <div className="course-selected-part flex flex-col gap-10 border-b-[1px] border-[#D6D9E4] pb-10">
          <div className="flex flex-rol gap-10 justify-between items-center">
            <div className="w-full">
              <Dropdown
                label="Course"
                options={courses}
                placeholder="Please select a course"
                value={selectedCourse}
                onSelect={handleCourseSelect}
              />
            </div>
            <div className="w-full"></div>
          </div>
          <div className="flex flex-rol gap-10 justify-between items-center">
            <div className="w-full">
              <Dropdown
                label="Lesson"
                options={lessons}
                placeholder="Please select a lesson"
                value={selectedLesson}
                onSelect={handleLessonSelect}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label="Sub-lesson"
                options={subLessons}
                placeholder="Please select a sub-lesson"
                value={selectedSubLesson}
                onSelect={handleSubLessonSelect}
              />
            </div>
          </div>
        </div>

        <div className="assignment-part flex flex-col gap-10">
          <div className="text-[#646D89] text-[20px] font-[600] mt-10">
            Assignment detail
          </div>

          <div className="flex flex-col gap-1 justify-center">
            <label htmlFor="assignmentInput">
              Assignment *
            </label>
            <input
              id="assignmentInput"
              value={assignment}
              onChange={handleAssignmentChange}
              placeholder=""
              className="border-[1px] border-[#D6D9E4] rounded-[8px] py-3 pr-4 pl-3"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddAssignment;
