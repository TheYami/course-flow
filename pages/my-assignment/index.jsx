import Navbar from "@/components/navbar";

export default function MyAssignment() {
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
            <button className="m-0 p-2 focus:text-black focus:border-b-2">
              All
            </button>
            <button className="m-0 p-2 focus:text-black focus:border-b-2">
              In progress
            </button>
            <button className="m-0 p-2 focus:text-black focus:border-b-2">
              Submitted
            </button>
          </div>
        </div>
        {/* assignment card section */}
        <div className="assignment-card-section flex flex-col gap-6 w-full max-w-[1120px] mt-10">
          <div className="assignment-card w-full h-[354px] bg-[#E5ECF8] rounded-lg px-24 py-10">
            <div className="card-header flex justify-between">
              <div className="card-header-left flex flex-col gap-3">
                <h3 className="m-0">Course: Course_Name</h3>
                <p>Introduction: Assignment_Name</p>
              </div>
              <div className="card-right w-fit h-fit px-2 py-1 bg-[#FFFBDB] rounded text-base font-medium text-[#996500]">
                Status
              </div>
            </div>

            {/* Submission Area */}
            <div className="card-submission box-border flex items-end w-full h-[175px] rounded-lg bg-white border-[1px] border-[#D6D9E4] p-6 gap-6">
              <div className="card-submission-left flex flex-col w-5/6 h-full gap-1">
                <p className="m-0">assignment_description ?</p>
                <div className="relative w-full h-full">
                  <input
                    className="border-[1px] w-full h-full rounded-lg pl-4 pt-2 text-left text-gray-800"
                    placeholder="Answer..."
                  />
                </div>
              </div>
              <div className="card-submission-right box-border gap-4 flex flex-col justify-center">
                <button className="box-border x-8 py-3 rounded-xl shadow-sm bg-[#2F5FAC] text-base font-bold text-white">
                  Submit
                </button>
                <button
                  className="m-0 font-bold text-[#2F5FAC] min-w-32 text-center"
                  onClick={() => {
                    router.push(`course/${course.course_id}`);
                  }}
                >
                  Open in Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
