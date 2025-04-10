import { useRouter } from "next/router";

export default function CourseCards({ courses }) {
  const router = useRouter();

  return (
  <div>
    {courses.length > 0 ? (
      <div className="course-card flex flex-col items-center md:grid md:grid-cols-2 lg:grid-cols-3 w-full md:w-fit gap-8 px-4">
        {courses.map((course, course_id) => (
          <div
            key={course_id}
            className="card h-[475px] w-[343px] rounded-lg flex flex-col gap-2 bg-white drop-shadow-xl overflow-hidden hover:shadow-lg hover:cursor-pointer"
            onClick={() => router.push(`course/${course.course_id}`)}
          >
            <img
              src={course.image_file}
              alt={course.course_name}
              className="w-full h-[240px] object-cover"
            />
            <div className="course-content h-[122px] px-3 pt-2 flex flex-col gap-1">
              <p className="m-0 text-orange-500 font-normal text-xs">Course</p>
              <p className="m-0 course-name font-normal text-xl">
                {course.course_name}
              </p>
              <p className="course-detail font-normal text-sm text-gray-700">
                {course.summary.length > 50
                  ? `${course.summary.substring(0, 50)}...`
                  : course.summary}
              </p>
            </div>
            <div className="course-footer border-t-[1px] flex flex-row gap-6 p-3">
              <div className="lesson flex items-center">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 5.53501C8.62634 4.30281 6.84533 3.62246 5 3.62501C4.12333 3.62501 3.28167 3.77501 2.5 4.05167V15.9267C3.30302 15.6434 4.14847 15.4991 5 15.5C6.92083 15.5 8.67333 16.2225 10 17.41M10 5.53501C11.3736 4.30274 13.1547 3.62238 15 3.62501C15.8767 3.62501 16.7183 3.77501 17.5 4.05167V15.9267C16.697 15.6434 15.8515 15.4991 15 15.5C13.1547 15.4975 11.3737 16.1778 10 17.41M10 5.53501V17.41"
                    stroke="#5483D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                &#160; {course.lesson_count} Lessons
              </div>
              <div className="hour flex items-center">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 5.5V10.5H13.75M17.5 10.5C17.5 11.4849 17.306 12.4602 16.9291 13.3701C16.5522 14.2801 15.9997 15.1069 15.3033 15.8033C14.6069 16.4997 13.7801 17.0522 12.8701 17.4291C11.9602 17.806 10.9849 18 10 18C9.01509 18 8.03982 17.806 7.12987 17.4291C6.21993 17.0522 5.39314 16.4997 4.6967 15.8033C4.00026 15.1069 3.44781 14.2801 3.0709 13.3701C2.69399 12.4602 2.5 11.4849 2.5 10.5C2.5 8.51088 3.29018 6.60322 4.6967 5.1967C6.10322 3.79018 8.01088 3 10 3C11.9891 3 13.8968 3.79018 15.3033 5.1967C16.7098 6.60322 17.5 8.51088 17.5 10.5Z"
                    stroke="#5483D0"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                &#160; {course.total_time} Hours
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-lg font-medium text-gray-600">
        No course found
      </p>
    )}
  </div>
);
}