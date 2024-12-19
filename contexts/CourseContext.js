import React, { createContext, useContext, useState } from "react";

const CourseContext = createContext();

export const useCourse = () => {
  return useContext(CourseContext);
};

export const CourseProvider = ({ children }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    price: "",
    totalTime: "",
    summary: "",
    detail: "",
    image: null,
    videoTrailer: null,
    file: null,
    created_by: 2,
  });

  const [previewData, setPreviewData] = useState({
    image: null,
    videoTrailer: null,
    file: null,
    imageName: "",
    videoTrailerName: "",
    fileName: "",
  });

  const handleCourseDataChange = (name, value) => {
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreviewDataChange = (name, value) => {
    setPreviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetAll = () => {
    setCourseData({
      courseName: "",
      price: "",
      totalTime: "",
      summary: "",
      detail: "",
      image: null,
      videoTrailer: null,
      file: null,
      created_by: 2,
    });
    setPreviewData({
      image: null,
      videoTrailer: null,
      file: null,
      imageName: "",
      videoTrailerName: "",
      fileName: "",
    });
  };

  const contextValue = {
    courseData,
    previewData,
    setCourseData: handleCourseDataChange,
    setPreviewData: handlePreviewDataChange,
    handleResetAll,
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};
