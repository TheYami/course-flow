import { useState, useEffect } from "react";
import { ArrowBack, ModalXIcon,DragIcon } from "@/assets/icons/admin_icon/adminIcon";
import { useRouter } from "next/router";
import axios from "axios";

export const EditLesson = ({ lessonId }) => {
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [subLessonData, setSubLessonData] = useState([
    { subLessonId: "", subLessonName: "", videoUrl: "", videoPreview: "" },
  ]);
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedSubLessons, setDeletedSubLessons] = useState([]);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await axios.get(
          `/api/admin/fetch_edit_lesson/${lessonId}`
        );

        setCourseId(response.data.data[0].course_id);
        setCourseName(response.data.data[0].course_name);
        setLessonName(response.data.data[0].lesson_name);

        const subLessons = response.data.data.map((item) => ({
          subLessonId: item.sub_lesson_id,
          subLessonName: item.sub_lesson_name,
          videoPreview: item.video,
        }));

        setSubLessonData(subLessons);
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      }
    };

    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId]);

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
    setSubLessonData((prev) => [
      ...prev,
      { subLessonName: "", videoUrl: "", videoPreview: "" },
    ]);
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

  const handleDeleteLesson = async (lessonId) => {
    if (!lessonId) {
      console.error("Lesson ID is missing.");
      setError("Invalid lesson ID.");
      return;
    }

    setLoadingData(true);

    try {
      const { data } = await axios.delete(
        `/api/admin/delete_lesson/${lessonId}`
      );
    } catch (err) {
      console.error("Error deleting lesson data:", err);
      setError("Failed to delete lesson data.");
    } finally {
      setIsModalOpen(false);
      setLoadingData(false);
      router.push(`/admin/edit_course/${courseId}`);
    }
  };

  const handleDeleteSubLesson = (index) => {
    const subLesson = subLessonData[index];

    if (subLesson.subLessonId) {
      setDeletedSubLessons((prev) => [...prev, subLesson.subLessonId]);
    }

    setSubLessonData((prev) => prev.filter((_, idx) => idx !== index));
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

      await Promise.all(
        deletedSubLessons.map(async (subLessonId) => {
          await axios.delete(`/api/admin/delete_sub_lesson/${subLessonId}`);
        })
      );

      const updatedSubLessonData = await Promise.all(
        subLessonData.map(async (subLesson) => {
          if (subLesson.videoUrl && subLesson.videoUrl instanceof File) {
            const videoUrl = await uploadToCloudinary(subLesson.videoUrl);
            return { ...subLesson, videoUrl };
          }
          return {
            ...subLesson,
            videoUrl: subLesson.videoUrl || subLesson.videoPreview,
          };
        })
      );

      const updatedLessonData = {
        lessonName,
        subLessonData: updatedSubLessonData,
      };

      await axios.put(`/api/admin/edit_lesson/${lessonId}`, updatedLessonData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      router.push(`/admin/edit_course/${courseId}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-lesson-page bg-[#F6F7FC] w-full"
    >
      <header className="top-bar flex justify-between items-center h-[92px] px-10 py-4 bg-white">
        <div className="flex gap-4 items-center">
          <div>
            <div
              onClick={() => router.push(`/admin/edit_course/${courseId}`)}
              className="cursor-pointer"
            >
              <ArrowBack />
            </div>
          </div>
          <div className="text-[14px]">
            <span className=" text-[#9AA1B9] mr-1">Course</span> '{courseName}'
            <div className=" flex gap-2">
              <h1 className="text-[24px] text-[#9AA1B9] font-[500]">Lesson</h1>
              <h1 className="text-[24px] font-[500]">'{lessonName}'</h1>
            </div>
          </div>
        </div>
        <div className="button flex gap-4">
          <button
            type="button"
            onClick={() => router.push(`/admin/edit_course/${courseId}`)}
            className="cancel-button px-8 py-[18px] text-[#F47E20] font-[700] border border-[#F47E20] rounded-[12px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-button px-8 py-[18px] font-[700] rounded-[12px] bg-[#2F5FAC] text-[#FFFFFF]"
          >
            Edit
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
              name="lessonName"
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
                  className="sub-lesson-box pt-6 pb-20 px-20 mb-4 bg-[#F6F7FC] border border-[#E4E6ED] rounded-[12px] relative"
                >
                  <div className=" absolute left-5 top-14"><DragIcon/></div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubLesson(index)}
                    disabled={subLessonData.length === 1}
                    className={` absolute top-6 right-6 font-semibold text-[#2F5FAC] hover:scale-105 ${
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
                            name={`userVideo-${index}`}
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
                            className="w-[240px] h-[240px] object-cover rounded-[8px]"
                          />
                          <button
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
              className="font-semibold px-4 py-3 bg-[#FFFFFF] border-1 border-[#F47E20] text-[#F47E20] rounded-xl hover:bg-[#F47E20] hover:text-[#FFFFFF] "
              onClick={addSubLesson}
            >
              + Add Sub Lesson
            </button>
          </section>
        </div>
        <div
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="flex font-semibold text-[#2F5FAC] justify-end mr-12 pb-20 mt-0 cursor-pointer"
        >
          <p className="hover:scale-105">Delete Lesson</p>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-3xl shadow-lg w-[30rem]">
              <div className="px-6 pt-6 pb-2 border-b flex justify-between">
                <h3 className="text-xl">Confirmation</h3>
                <div
                  className=" cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  <ModalXIcon />
                </div>
              </div>
              <div className="p-6">
                <p>Are you sure you want to delete this lesson?</p>
                <div className="flex justify-center gap-6 mt-6">
                  <button
                    type="button"
                    className="font-semibold px-4 py-3 bg-[#FFFFFF] border-1 border-[#F47E20] text-[#F47E20] rounded-xl hover:bg-[#F47E20] hover:text-[#FFFFFF]"
                    onClick={() => handleDeleteLesson(lessonId)}
                  >
                    Yes, I want to delete this Lesson
                  </button>
                  <button
                    type="button"
                    className="px-4 py-3 bg-[#2F5FAC] text-[#FFFFFF] rounded-xl hover:bg-[#FFFFFF] hover:text-[#2F5FAC] border-1 border-[#2F5FAC]"
                    onClick={() => setIsModalOpen(false)}
                  >
                    No, keep it
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </form>
  );
};

export default EditLesson;
