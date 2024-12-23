import { useState } from "react";
export default function AssignmentForm({ onComplete }) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Your answer: ${answer}`);
    setAnswer("");
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-[#E5ECF8] border rounded-lg p-4 mt-6 w-[343px] lg:w-[739px] lg:ml-4 lg:mt-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Assignment</h2>
        <span className="px-2 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded">
          Pending
        </span>
      </div>
      <p className="text-gray-600 mb-4">
        What are the 4 elements of service design?
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="4"
        ></textarea>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Send Assignment
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">Assign within 2 days</p>
    </div>
  );
}