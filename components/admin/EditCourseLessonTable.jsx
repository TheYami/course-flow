import { useState, useEffect } from "react";
import axios from "axios";
import {
  TrashIcon,
  EditIcon,
  DragIcon,
  ModalXIcon,
  DisabledTrashIcon,
} from "@/assets/icons/admin_icon/adminIcon";
import { useRouter } from "next/router";

export function EditCourseLessonTable({
  loadingData,
  setLoadingData,
  courseId,
}) {
  const [lessonData, setLessonData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchLessonData(courseId);
    }
  }, [courseId]);

  const fetchLessonData = async (courseId) => {
    setLoadingData(true);
    try {
      const { data } = await axios.get(`/api/admin/fetch_lesson/${courseId}`);
      if (data && data.data && data.data.length > 0) {
        setLessonData(data.data);
      } else {
        setError("No lessons available for this course.");
      }
    } catch (err) {
      console.error("Error fetching lesson data:", err);
      setError("Failed to load lesson data.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!lessonId) {
      console.error("Lesson ID is missing.");
      setError("Invalid lesson ID.");
      return;
    }

    setLoadingData(true);

    try {
      const { data } = await axios.delete(
        `/api/admin/delete_lesson/${lessonId}`
      );
      setLessonData((prevLessons) =>
        prevLessons.filter((lesson) => lesson.lesson_id !== lessonId)
      );
    } catch (err) {
      console.error("Error deleting lesson data:", err);
      setError("Failed to delete lesson data.");
    } finally {
      setIsModalOpen(false);
      setLoadingData(false);
    }
  };

  const renderTableHeaders = () => {
    const headers = ["", "", "Lesson name", "Sub-lesson", "Action"];
    return headers.map((header, index) => (
      <th key={index} className="p-2 text-[#424C6B] font-normal">
        {header}
      </th>
    ));
  };

  const handleShakeIcon = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const renderTableBody = () => {
    return lessonData.map((lesson, index) => (
      <tr key={lesson.lesson_id} className="hover:bg-[#F6F7FC]">
        <td className="pl-4 border-t border-[#F1F2F6]">
          <DragIcon />
        </td>
        <td className="p-2 py-4 border-t border-[#F1F2F6]">{index + 1}</td>
        <td className="p-2 border-t border-[#F1F2F6]">{lesson.lesson_name}</td>
        <td className="p-2 px-5 border-t border-[#F1F2F6]">
          {lesson.sub_lesson_count}
        </td>
        <td className="p-2 border-t border-[#F1F2F6]">
          {lessonData.length <= 1 ? (
            <button
              onClick={handleShakeIcon}
              className={`mr-2 hover:scale-110 ${
                isShaking ? "animate-shake" : ""
              }`}
            >
              <DisabledTrashIcon />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsModalOpen(true);
                setLessonToDelete(lesson.lesson_id);
              }}
              className="mr-2 hover:scale-110"
            >
              <TrashIcon />
            </button>
          )}
          <button
            onClick={() =>
              router.push(`/admin/edit_lesson/${lesson.lesson_id}`)
            }
            className="hover:scale-110"
          >
            <EditIcon />
          </button>
        </td>
      </tr>
    ));
  };

  return loadingData ? null : (
    <>
      <div className="flex-1">
        <div className="flex justify-between items-center mt-10 mx-10">
          <h1 className="text-2xl">Lesson</h1>
          <button
            disabled={loadingData}
            onClick={() => router.push(`/admin/add_lesson/${courseId}`)}
            className="w-[150px] bg-[#2F5FAC] hover:bg-[#FFFFFF] hover:text-[#2F5FAC] hover:border-[#2F5FAC] text-[#FFFFFF] px-6 py-3 rounded-lg font-semibold border-1 border-transparent"
          >
            + Add Lesson
          </button>
        </div>
        <table className="w-[80vw] text-left m-8 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-[#E4E6ED]">
            <tr>{renderTableHeaders()}</tr>
          </thead>
          <tbody className="bg-[#FFFFFF]">
            {lessonData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-[#6B7280]">
                  lesson Not Found !
                </td>
              </tr>
            ) : (
              renderTableBody()
            )}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-3xl shadow-lg w-[30rem]">
              <div className="px-6 pt-6 pb-2 border-b flex justify-between">
                <h3 className="text-xl">Confirmation</h3>
                <div
                  className=" cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  <ModalXIcon />
                </div>
              </div>
              <div className="p-6">
                <p>Are you sure you want to delete this lesson?</p>
                <div className="flex justify-center gap-6 mt-6">
                  <button
                    className="font-semibold px-4 py-3 bg-[#FFFFFF] border-1 border-[#F47E20] text-[#F47E20] rounded-xl hover:bg-[#F47E20] hover:text-[#FFFFFF]"
                    onClick={() => handleDeleteLesson(lessonToDelete)}
                  >
                    Yes, I want to delete this Lesson
                  </button>
                  <button
                    className="px-4 py-3 bg-[#2F5FAC] text-[#FFFFFF] rounded-xl hover:bg-[#FFFFFF] hover:text-[#2F5FAC] border-1 border-[#2F5FAC]"
                    onClick={() => setIsModalOpen(false)}
                  >
                    No, keep it
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
