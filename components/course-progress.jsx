import React from "react";
import CollapsiblePanel from "./collapsible-panel";

export default function CourseProgress() {
  const sections = [
    {
      id: 1,
      title: "Introduction",
      lessons: ["4 Levels of Service Design in an Organization"],
    },
    {
      id: 2,
      title: "Service Design Theories and Principles",
      lessons: [],
    },
    {
      id: 3,
      title: "Understanding Users and Finding Opportunities",
      lessons: [],
    },
    {
      id: 4,
      title: "Identifying and Validating Opportunities for Design",
      lessons: [],
    },
    { id: 5, title: "Prototyping", lessons: [] },
    { id: 6, title: "Course Summary", lessons: [] },
  ];

  return (
    <section className="w-[343px] flex-col m-0 pt-4 px-4 box-border">
      <h1 className="text-xs font-normal mb-4 text-[#F47E20]">Course</h1>

      {/* Course Header */}
      <div className="h-10 mb-4 rounded">
        <h1 className="text-base font-medium">Service Design Essentials</h1>
        <h2 className="text-xs font-normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="text-xs font-normal mb-1 text-[#646D89]">
          15% Complete
        </div>
        <div className="w-full bg-gray-300 h-4 rounded-full">
          <div
            className="bg-gradient-to-r from-[#95BEFF] to-[#0040E5] h-4 rounded-full"
            style={{ width: "15%" }}
          ></div>
        </div>
      </div>

      {/* Course Sections */}
      <div>
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            <CollapsiblePanel
              title={
                <span className="text-base font-medium">
                  {`${section.id.toString().padStart(2, "0")} ${section.title}`}
                </span>
              }
            >
              {section.lessons.length > 0 ? (
                <div className="ml-4">
                  {section.lessons.map((lesson, index) => (
                    <p
                      key={index}
                      className="text-sm text-[#646D89] bg-blue-50 rounded p-2 mb-2"
                    >
                      {lesson}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No lessons available</p>
              )}
            </CollapsiblePanel>
          </div>
        ))}
      </div>
    </section>
  );
}
