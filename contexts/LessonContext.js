import { createContext, useContext, useState } from "react";

const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
  const [lessonData, setLessonData] = useState([]);
  const [lessonId, setLessonId] = useState([]);

  const addLesson = (newLesson) => {
    setLessonData((prev) => [...prev, newLesson]);
  };

  const editLesson = (lessonId, updatedLesson) => {
    setLessonData((prev) =>
      prev.map((lesson) =>
        lesson.lesson_id === lessonId ? updatedLesson : lesson
      )
    );
  };

  const deleteLesson = (lessonId) => {
    setLessonData((prev) =>
      prev.filter((lesson) => lesson.lesson_id !== lessonId)
    );
  };

  const resetLessonData = () => {
    setLessonData([]);
  };

  const addLessonIdToEdit = (lessonId) => {
    setLessonId(lessonId);
  };

  const resetLessonIdToEdit = () => {
    setLessonId([]);
  };
  return (
    <LessonContext.Provider
      value={{
        lessonData,
        lessonId,
        addLesson,
        editLesson,
        deleteLesson,
        resetLessonData,
        addLessonIdToEdit,
        resetLessonIdToEdit,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => useContext(LessonContext);
