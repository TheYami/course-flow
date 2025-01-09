import { useState, useEffect } from "react";
export default function AssignmentForm({
  userData,
  slug,
  subLessonId,
  onComplete,
  courseData,
}) {
  const [answer, setAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // สถานะควบคุมการส่ง
  const [isLoading, setIsLoading] = useState(true); // สถานะโหลดข้อมูล
  const [assignmentDescription, setAssignmentDescription] = useState(""); // ข้อมูล Assignment
  const [error, setError] = useState(null); // สำหรับเก็บ Error

  useEffect(() => {
    if (courseData && courseData.lessons && courseData.lessons.length > 0) {
      const firstLesson = courseData.lessons[0]; // เลือก lesson แรก
      if (firstLesson.sub_lessons && firstLesson.sub_lessons.length > 0) {
        const firstSubLesson = firstLesson.sub_lessons[0]; // เลือก subLesson แรก
        // ตั้งค่า subLessonId ให้เป็น id ของ subLesson แรก
        subLessonId = firstSubLesson.sub_lesson_id;
      }
    }
  }, [courseData]);

  const fetchAssignment = async () => {
    if (!subLessonId) {
      return; // ถ้าไม่มี subLessonId ไม่ต้องทำการดึงข้อมูล
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/getSubmission?subLessonId=${subLessonId}&user_id=${userData.id}`
      );
      const data = await response.json();

      if (response.ok) {
        // ตั้งค่า description จากผลลัพธ์ API
        const description =
          data.length > 0 ? data[0]?.description : "No assignment found";
        setAssignmentDescription(description);
      } else {
        setError(data.error || "Failed to fetch assignment data.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("subLessonId:", subLessonId); // เพิ่ม log เพื่อตรวจสอบค่า subLessonId
    if (subLessonId) {
      fetchAssignment();
    }
  }, [subLessonId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Your answer: ${answer}`);
    setIsSubmitted(true); // ตั้งค่าให้ไม่สามารถแก้ไขคำตอบได้
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-[#E5ECF8] border rounded-lg p-4 mt-6 w-[343px] lg:w-[480px] xl:w-[739px] lg:ml-4 lg:mt-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Assignment{subLessonId}</h2>
        {/* assignment status */}
        <span
          className={`px-2 py-1 text-sm font-medium rounded ${
            isSubmitted
              ? "text-green-700 bg-green-100" // สีสำหรับ Submitted
              : "text-yellow-700 bg-yellow-100" // สีสำหรับ In-Progress
          }`}
        >
          {isSubmitted ? "Submitted" : "In-Progress"}
        </span>
      </div>
      {/* assignment name */}
      <p className="text-gray-600 mb-4">
        {isLoading
          ? "Loading assignment..."
          : error
          ? `Error: ${error}`
          : assignmentDescription}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer..."
          className={`w-full p-2 rounded-md focus:outline-none ${
            isSubmitted ? "bg-[#E5ECF8] border-none" : "bg-white border"
          }`}
          rows="4"
          readOnly={isSubmitted} // ป้องกันการแก้ไขเมื่อส่งแล้ว
        ></textarea>
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white rounded-md ${
            isSubmitted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isSubmitted} // ปิดการใช้งานปุ่มเมื่อส่งแล้ว
        >
          {isSubmitted ? "Submitted" : "Send Assignment"}
        </button>
      </form>
    </div>
  );
}
