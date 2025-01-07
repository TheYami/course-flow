import Navbar from "@/components/navbar";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/useUserAuth";
import { useState, useEffect } from "react";

export default function MyAssignment() {
  const { isLoggedIn, user, userData, subscriptions } = useAuth();
  const [submission, setSubmission] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [answers, setAnswers] = useState({});

  const router = useRouter();

  const getSubmission = async () => {
    try {
      const response = await axios.get(
        `/api/getAllSubmission?user_id=${userData.id}`
      );

      setSubmission(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const filteredSubmissions = submission.filter((sub) => {
    if (selectedStatus === "All") {
      return true;
    }
    return sub.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  const handleSubmitAnswer = async (submissionId, answer) => {
    try {
      const response = await axios.put("/api/submitSubmission", {
        submission_id: submissionId,
        answer: answer,
      });

      console.log("Submission updated:", response.data);
      getSubmission();
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };


  useEffect(() => {
    if (userData) {
      getSubmission();
    }
  }, [userData]);

  return (
    <div className="w-full">
      <Navbar />
      <div className="flex flex-col items-center">
        <div className="relative w-full">
          {/* gliter */}
          <svg
            width="100%"
            height="157"
            viewBox="0 0 375 157"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-10 md:hidden"
          >
            <circle cx="369" cy="139" r="18" fill="#C6DCFF" />
            <path
              d="M300.372 20.5449L318.99 17.7062L312.139 35.249L300.372 20.5449Z"
              stroke="#FBAA1C"
              strokeWidth="3"
            />
            <circle
              cx="40.2011"
              cy="4.28073"
              r="2.78073"
              stroke="#2F5FAC"
              strokeWidth="3"
            />
            <circle cx="0.253627" cy="56.1735" r="10.2536" fill="#C6DCFF" />
            <path
              d="M80.2176 137.001L76.3218 151.54"
              stroke="#2FAC61"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M71 142.322L85.5393 146.217"
              stroke="#2FAC61"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <svg
            width="100%"
            height="190"
            viewBox="0 0 1397 190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-10 hidden md:block"
          >
            <circle cx="64.5" cy="5.5" r="4" stroke="#2F5FAC" strokeWidth="3" />
            <circle cx="1381" cy="153" r="37" fill="#C6DCFF" />
            <circle cx="13.1741" cy="72.1741" r="13.1741" fill="#C6DCFF" />
            <path
              d="M1231.36 45.9099L1257.15 41.9774L1247.66 66.28L1231.36 45.9099Z"
              stroke="#FBAA1C"
              strokeWidth="3"
            />
            <path
              d="M248.843 132L243.838 150.68"
              stroke="#2FAC61"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M237 138.838L255.68 143.843"
              stroke="#2FAC61"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="my-assignment-header flex flex-col items-center gap-[60px] mt-24">
          <h3 className="font-medium text-4xl gap-14 m-0">My Assignments</h3>
          <div className="flex text-base font-normal gap-4 text-[#9AA1B9]">
            <button
              className={`m-0 p-2 ${
                selectedStatus === "All"
                  ? "border-b-2 border-black text-black"
                  : ""
              }`}
              onClick={() => setSelectedStatus("All")}
            >
              All
            </button>
            <button
              className={`m-0 p-2 focus:text-black ${
                selectedStatus === "in-progress"
                  ? "border-b-2 border-black text-black"
                  : ""
              }`}
              onClick={() => setSelectedStatus("in-progress")}
            >
              In Progress
            </button>
            <button
              className={`m-0 p-2 focus:text-black ${
                selectedStatus === "submitted"
                  ? "border-b-2 border-black text-black"
                  : ""
              }`}
              onClick={() => setSelectedStatus("submitted")}
            >
              Submitted
            </button>
          </div>
        </div>
        {/* assignment card section */}
        <div className="assignment-card-section flex flex-col gap-6 w-full max-w-[1120px] mt-10">
          {filteredSubmissions.map((submission) => (
            <div
              className="assignment-card w-full h-[354px] bg-[#E5ECF8] rounded-lg px-24 py-10"
              key={submission.submission_id}
            >
              <div className="card-header flex justify-between">
                <div className="card-header-left flex flex-col gap-3">
                  <h3 className="m-0">Course: {submission.course_name}</h3>
                  <p>Introduction: {submission.sub_lesson_name}</p>
                </div>
                {submission && submission.status === "in-progress" ? (
                  <div className="card-right w-fit h-fit px-2 py-1 bg-[#FFFBDB] rounded text-base font-medium text-[#996500]">
                    In-Progress
                  </div>
                ) : (
                  <div className="card-right w-fit h-fit px-2 py-1 bg-[#DDF9EF] rounded text-base font-medium text-[#0A7B60]">
                    Submitted
                  </div>
                )}
              </div>

              {/* Submission Area */}
              <div className="card-submission box-border flex items-end w-full h-[175px] rounded-lg bg-white border-[1px] border-[#D6D9E4] p-6 gap-6">
                <div className="card-submission-left flex flex-col w-5/6 h-full gap-1">
                  <p className="m-0">{submission.description}</p>
                  <div className="relative w-full h-full">
                    {submission.answer == null ? (
                      <input
                        className="border-[1px] w-full h-full rounded-lg pl-4 pt-2 text-left text-gray-800"
                        placeholder="Answer..."
                        onChange={(e) =>
                          setAnswers({
                            ...answers,
                            [submission.submission_id]: e.target.value,
                          })
                        }
                        value={answers[submission.submission_id] || ""}
                      />
                    ) : (
                      <input
                        className="border-none w-full h-full rounded-lg pl-4 pt-2 text-left text-[#9AA1B9]"
                        placeholder="Answer..."
                        value={submission.answer || ""}
                        disabled={!!submission.answer}
                      />
                    )}
                  </div>
                </div>
                <div className="card-submission-right box-border gap-4 flex flex-col justify-center h-full">
                  {submission.status === "submitted" ? (
                    <button
                      className="m-0 font-bold text-[#2F5FAC] min-w-32 text-center h-14"
                      onClick={() => {
                        router.push(`course/${submission.course_id}`);
                      }}
                    >
                      Open in Course
                    </button>
                  ) : (
                    <>
                      <button
                        className="box-border x-8 py-3 rounded-xl shadow-sm bg-[#2F5FAC] text-base font-bold text-white"
                        onClick={() =>
                          handleSubmitAnswer(
                            submission.submission_id,
                            answers[submission.submission_id]
                          )
                        }
                      >
                        Submit
                      </button>
                      <button
                        className="m-0 font-bold text-[#2F5FAC] min-w-32 text-center"
                        onClick={() => {
                          router.push(`course/${submission.course_id}`);
                        }}
                      >
                        Open in Course
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
