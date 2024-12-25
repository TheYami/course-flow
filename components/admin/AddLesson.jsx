import { useState, useEffect } from "react";
import {
  ArrowBack,
  DragIcon,
  AlertIcon,
} from "@/assets/icons/admin_icon/adminIcon";
import { useRouter } from "next/router";
import axios from "axios";

export const AddLesson = ({ courseId }) => {
  const [courseName, setCourseName] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [subLessonData, setSubLessonData] = useState([
    { subLessonName: "", videoUrl: "", videoPreview: "" },
  ]);
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState(false);
  const [isFillForm, setIsFillForm] = useState({
    lessonName: null,
    subLessons: subLessonData.map(() => ({
      subLessonName: null,
      videoUrl: null,
    })),
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `/api/admin/courses?courseId=${courseId}`
        );

        setCourseName(response.data.data[0].course_name);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleLessonInput = (e) => {
    const { value } = e.target;
    setLessonName(value);
    setIsFillForm((prev) => ({
      ...prev,
      lessonName: true,
    }));
  };

  const handleSubLessonInput = (index, e) => {
    const { name, value } = e.target;
    setSubLessonData((prev) =>
      prev.map((subLesson, i) =>
        i === index ? { ...subLesson, [name]: value } : subLesson
      )
    );
    setIsFillForm((prev) => ({
      ...prev,
      subLessons: prev.subLessons.map((subLesson, i) =>
        i === index ? { ...subLesson, [name]: true } : subLesson
      ),
    }));
  };

  const addSubLesson = () => {
    setSubLessonData((prev) => [
      ...prev,
      { subLessonName: "", videoUrl: "", videoPreview: "" },
    ]);

    setIsFillForm((prev) => ({
      ...prev,
      subLessons: [...prev.subLessons, { subLessonName: null, videoUrl: null }],
    }));
  };

  const deleteSubLesson = (index) => {
    if (subLessonData.length > 1) {
      setSubLessonData((prev) => prev.filter((_, i) => i !== index));
      setIsFillForm((prev) => ({
        ...prev,
        subLessons: prev.subLessons.filter((_, idx) => idx !== index),
      }));
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
        setIsFillForm((prev) => ({
          ...prev,
          subLessons: prev.subLessons.map((subLesson, i) =>
            i === index ? { ...subLesson, videoUrl: true } : subLesson
          ),
        }));
      } else {
        setVideoUploadError(true);
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

    setIsFillForm((prev) => ({
      ...prev,
      subLessons: prev.subLessons.map((subLesson, i) =>
        i === index ? { ...subLesson, videoUrl: null } : subLesson
      ),
    }));
  };

  const validateForm = () => {
    const isLessonNameValid = Boolean(lessonName);
  
    const updatedSubLessons = subLessonData.map((subLesson) => ({
      subLessonName: Boolean(subLesson.subLessonName),
      videoUrl: Boolean(subLesson.videoPreview),
    }));
  
    setIsFillForm({
      lessonName: isLessonNameValid,
      subLessons: updatedSubLessons,
    });
  
    const isSubLessonsValid = updatedSubLessons.every(
      (subLesson) => subLesson.subLessonName && subLesson.videoUrl
    );
  
    return isLessonNameValid && isSubLessonsValid;
  };

  const uploadToCloudinary = async (file, preset = "unSigned") => {
    const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dxjamlkhi/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    try {
      const response = await axios.post(cloudinaryUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload to Cloudinary");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingData(true);

    if (!validateForm()) {
      setLoadingData(false);
      return;
    }

    try {
      const storedToken = localStorage.getItem(
        "sb-iyzmaaubmvzitbqdicbe-auth-token"
      );
      const parsedToken = JSON.parse(storedToken);
      const accessToken = parsedToken?.access_token;

      if (!accessToken) {
        alert("Not authenticated");
        return;
      }

      const updatedSubLessonData = await Promise.all(
        subLessonData.map(async (subLesson) => {
          if (subLesson.videoUrl) {
            const videoCloudinaryUrl = await uploadToCloudinary(
              subLesson.videoUrl
            );
            return { ...subLesson, videoUrl: videoCloudinaryUrl };
          }
          return subLesson;
        })
      );

      const updatedLessonData = {
        lessonName,
        subLessonData: updatedSubLessonData,
      };

      const response = await axios.post(
        `/api/admin/create_lesson/${courseId}`,
        { lessons: [updatedLessonData] },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      router.push(`/admin/edit_course/${courseId}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCancle = () => {
    router.push(`/admin/edit_course/${courseId}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-lesson-page bg-[#F6F7FC] w-full"
    >
      <header className="top-bar flex justify-between items-center h-[92px] px-10 py-4 bg-white">
        <div className="flex gap-4 items-center">
          <div>
            <div onClick={handleCancle} className="cursor-pointer">
              <ArrowBack />
            </div>
          </div>
          <div className="text-[14px]">
            <span className=" text-[#9AA1B9] mr-1">Course</span> '{courseName}'
            <h1 className="text-[24px] font-[500]">Add Lesson</h1>
          </div>
        </div>
        <div className="button flex gap-4">
          <button
            type="button"
            onClick={handleCancle}
            className="cancel-button px-8 py-[18px] text-[#F47E20] font-[700] border border-[#F47E20] rounded-[12px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-button px-8 py-[18px] font-[700] rounded-[12px] bg-[#2F5FAC] text-[#FFFFFF]"
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
            <div className="relative">
              <input
                type="text"
                id="lessonName"
                name="courseName"
                value={lessonName}
                onChange={handleLessonInput}
                placeholder="Enter the lesson name"
                className={`w-full mt-1 px-4 py-3 border-1 rounded-[8px] ${
                  isFillForm.lessonName === false
                    ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                    : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                } `}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B2FAC]">
                {isFillForm.lessonName === false && <AlertIcon />}
              </div>
            </div>
            {isFillForm.lessonName === false && (
              <p className="absolute text-[#9B2FAC] text-sm mt-1">
                Please fill out this field
              </p>
            )}
          </section>

          <section className="sub-lesson border-t border-[#D6D9E4]">
            <h2 className="text-[#646D89] text-[20px] font-[600] mt-8">
              Sub-Lesson
            </h2>

            <div className="sub-lesson-data-fill mt-4">
              {subLessonData.map((subLesson, index) => (
                <div
                  key={index}
                  className="sub-lesson-box pt-6 pb-16 px-20 mb-4 bg-[#F6F7FC] border border-[#E4E6ED] rounded-[12px] shadow-sm relative"
                >
                  <div className=" absolute left-5 top-14">
                    <DragIcon />
                  </div>
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
                    <div className="relative">
                      <input
                        type="text"
                        name="subLessonName"
                        value={subLesson.subLessonName}
                        onChange={(e) => handleSubLessonInput(index, e)}
                        placeholder="Enter sub-lesson name"
                        className={`w-9/12 px-4 py-3 border-1 rounded-[8px] ${
                          isFillForm.subLessons[index]?.subLessonName === false
                            ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                            : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                        } `}
                      />
                      <div className="absolute right-80 top-1/2 transform -translate-y-1/2 text-[#9B2FAC]">
                        {isFillForm.subLessons[index]?.subLessonName === false && <AlertIcon />}
                      </div>
                      {isFillForm.subLessons[index]?.subLessonName === false && (
                        <p className="absolute text-[#9B2FAC] text-sm mt-1">
                          Please fill out this field
                        </p>
                      )}
                    </div>
                    <label className=" mt-4">Video *</label>
                    <div>
                      {!subLesson.videoPreview ? (
                        <>
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
                            />
                          </button>
                          {videoUploadError && (
                            <p className="absolute text-[#9B2FAC] text-sm mt-1">
                              Upload failed. Ensure the file is .mp4, .mov, .avi
                              and less than 20 MB.
                            </p>
                          )}
                          {isFillForm.subLessons[index]?.videoUrl === false &&
                          videoUploadError === false ? (
                            <p className="absolute text-[#9B2FAC] text-sm mt-1">
                              Upload the video trailer is required.
                            </p>
                          ) : null}
                        </>
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
