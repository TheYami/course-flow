import { useState, useEffect } from "react";
import { ArrowBack } from "@/assets/icons/admin_icon/adminIcon";
import { useRouter } from "next/router";
import { useLesson } from "@/contexts/LessonContext";
import { useCourse } from "@/contexts/CourseContext";

export const AddCoursePageAddLesson = () => {
  const { courseData } = useCourse();
  const { addLesson } = useLesson();
  const [lessonName, setLessonName] = useState("");
  const [subLessonData, setSubLessonData] = useState([
    { subLessonName: "", videoUrl: "", videoPreview: "" },
  ]);
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(false);

  const handleLessonInput = (e) => {
    setLessonName(e.target.value);
  };

  const handleSubLessonInput = (index, e) => {
    const { name, value } = e.target;
    setSubLessonData((prev) =>
      prev.map((subLesson, i) =>
        i === index ? { ...subLesson, [name]: value } : subLesson
      )
    );
  };

  const addSubLesson = () => {
    setSubLessonData((prev) => [...prev, { subLessonName: "", videoUrl: "" }]);
  };

  const deleteSubLesson = (index) => {
    if (subLessonData.length > 1) {
      setSubLessonData((prev) => prev.filter((_, i) => i !== index));
    } else {
      alert("You must have at least one sub-lesson.");
    }
  };

  const handleClickUploadVideo = (index) => {
    document.getElementById(`videoInput-${index}`).click();
  };

  const handleVideoFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 20 * 1024 * 1024) {
        setSubLessonData((prev) =>
          prev.map((subLesson, i) =>
            i === index
              ? {
                  ...subLesson,
                  videoUrl: file,
                  videoPreview: URL.createObjectURL(file),
                }
              : subLesson
          )
        );
      } else {
        alert("File size exceeds 20 MB");
      }
    }
  };

  const handleRemoveVideo = (index) => {
    setSubLessonData((prev) =>
      prev.map((subLesson, i) =>
        i === index
          ? { ...subLesson, videoUrl: "", videoPreview: "" }
          : subLesson
      )
    );
  };

  const isFormValid = subLessonData.every(
    (subLesson) => subLesson.subLessonName && subLesson.videoUrl
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newLesson = {
      lesson_id: Date.now(),
      lesson_name: lessonName,
      sub_lesson_data: subLessonData,
    };
    addLesson(newLesson);
    router.push("/admin/add_course");
  };

  const handleCancel = () => {
    router.push("/admin/add_course");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-lesson-page bg-[#F6F7FC] w-full"
    >
      <header className="top-bar flex justify-between items-center h-[92px] px-10 py-4 bg-white">
        <div className="flex gap-4 items-center">
          <div>
            <button
              type="button"
              onClick={handleCancel}
              className="cursor-pointer"
            >
              <ArrowBack />
            </button>
          </div>
          <div className="text-[14px]">
            <span className=" text-[#9AA1B9] mr-1">Course</span>{`${courseData.courseName}`}
            <h1 className="text-[24px] font-[500]">Add Lesson</h1>
          </div>
        </div>
        <div className="button flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button px-8 py-[18px] text-[#F47E20] font-[700] border border-[#F47E20] rounded-[12px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`create-button px-8 py-[18px] font-[700] rounded-[12px] ${
              isFormValid
                ? "bg-[#2F5FAC] text-[#FFFFFF]"
                : "bg-[#D3D8E5] text-[#9AA1B9]"
            }`}
          >
            Create
          </button>
        </div>
      </header>

      <main className="lesson-data-form bg-[#F6F7FC]">
        {loadingData && (
          <div className="absolute inset-0 bg-[#FFFFFF] bg-opacity-20 flex items-center justify-center z-10">
            <div className="loader border-t-4 border-[#2F5FAC] w-12 h-12 rounded-full animate-spin"></div>
          </div>
        )}
        <div className="bg-[#FFFFFF] mx-10 my-10 rounded-[16px] px-[100px] pt-[40px] pb-[60px] flex flex-col gap-[40px]">
          <section className="lesson-name">
            <label htmlFor="lessonName">Lesson Name *</label>
            <input
              type="text"
              id="lessonName"
              name="courseName"
              value={lessonName}
              onChange={handleLessonInput}
              placeholder="Enter the lesson name"
              required
              className="w-full mt-1 px-4 py-3 border border-[#D6D9E4] rounded-[8px]"
            />
          </section>

          <section className="sub-lesson border-t border-[#D6D9E4]">
            <h2 className="text-[#646D89] text-[20px] font-[600] mt-8">
              Sub-Lesson
            </h2>

            <div className="sub-lesson-data-fill mt-4">
              {subLessonData.map((subLesson, index) => (
                <div
                  key={index}
                  className="sub-lesson-box py-6 px-20 mb-4 bg-[#F6F7FC] border border-[#E4E6ED] rounded-[12px] shadow-sm relative"
                >
                  <button
                    type="button"
                    onClick={() => deleteSubLesson(index)}
                    disabled={subLessonData.length === 1}
                    className={` absolute top-6 right-6 text-[#2F5FAC] ${
                      subLessonData.length === 1
                        ? "cursor-not-allowed text-[#C8CCDB]"
                        : ""
                    }`}
                  >
                    Delete
                  </button>
                  <div className="flex flex-col gap-2">
                    <label>Sub-lesson name *</label>
                    <input
                      type="text"
                      name="subLessonName"
                      value={subLesson.subLessonName}
                      onChange={(e) => handleSubLessonInput(index, e)}
                      placeholder="Enter sub-lesson name"
                      className="w-2/3 px-4 py-3 border border-[#D6D9E4] rounded-[8px]"
                      required
                    />
                    <label>Video *</label>
                    <div>
                      {!subLesson.videoPreview ? (
                        <button
                          type="button"
                          className="border-dashed w-[240px] h-[240px] bg-[#F1F2F6] rounded-[8px] p-6 text-center cursor-pointer"
                          onClick={() => handleClickUploadVideo(index)}
                        >
                          <div className="text-[#5483D0] font-[500] text-[24px]">
                            +
                          </div>
                          <div className="text-[#5483D0] font-[500]">
                            Upload Video
                          </div>
                          <input
                            type="file"
                            id={`videoInput-${index}`}
                            className="hidden"
                            accept="video/*"
                            onChange={(e) => handleVideoFileChange(index, e)}
                            required
                          />
                        </button>
                      ) : (
                        <div className="relative w-[240px] h-[240px]">
                          <video
                            src={subLesson.videoPreview}
                            controls
                            className="w-[240px] h-[240px] object-cover rounded-lg"
                            alt="Uploaded Video Preview"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(index)}
                            className="absolute top-0 right-0 bg-[#9B2FAC] text-white rounded-full flex items-center justify-center w-8 h-8"
                          >
                            x
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="font-semibold px-4 py-3 bg-[#FFFFFF] border-1 border-[#F47E20] text-[#F47E20] rounded-xl hover:bg-[#F47E20] hover:text-[#FFFFFF] my-8"
              onClick={addSubLesson}
            >
              + Add Sub Lesson
            </button>
          </section>
        </div>
      </main>
    </form>
  );
};

export default AddCoursePageAddLesson;
