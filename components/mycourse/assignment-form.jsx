import { useState } from "react";
export default function AssignmentForm({ onComplete }) {
  const [answer, setAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // สถานะควบคุมการส่ง

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Your answer: ${answer}`);
    // setAnswer("");
    setIsSubmitted(true); // ตั้งค่าให้ไม่สามารถแก้ไขคำตอบได้
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-[#E5ECF8] border rounded-lg p-4 mt-6 w-[343px] lg:w-[739px] lg:ml-4 lg:mt-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Assignment</h2>
        {/* assignment status */}
        <span className={`px-2 py-1 text-sm font-medium rounded ${
            isSubmitted
              ? "text-green-700 bg-green-100" // สีสำหรับ Submitted
              : "text-yellow-700 bg-yellow-100" // สีสำหรับ In-Progress
          }`}>
        {isSubmitted ? "Submitted" : "In-Progress"}
        </span>
      </div>
      {/* assignment name */}
      <p className="text-gray-600 mb-4">
        What are the 4 elements of service design?
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
            isSubmitted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isSubmitted} // ปิดการใช้งานปุ่มเมื่อส่งแล้ว
        >
          {isSubmitted ? "Submitted" : "Send Assignment"}
        </button>
      </form>
    </div>
  );
}
