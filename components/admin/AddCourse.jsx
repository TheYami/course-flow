import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import loadingIcon from "../../assets/icons/admin_icon/loading_icon.gif";
import { useRouter } from "next/router";
import { useCourse } from "@/contexts/CourseContext";
import { useLesson } from "@/contexts/LessonContext";
import {
  DragIcon,
  TrashIcon,
  EditIcon,
  DisabledTrashIcon,
  ModalXIcon,
  AlertIcon,
} from "@/assets/icons/admin_icon/adminIcon";

export const AddCourse = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    courseData,
    previewData,
    setCourseData,
    setPreviewData,
    handleResetAll,
  } = useCourse();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState([]);
  const { lessonData, deleteLesson, addLessonIdToEdit, resetLessonData } =
    useLesson();
  const [uploadError, setUploadError] = useState({
    image: false,
    videoTrailer: false,
    file: false,
  });
  const [isFillForm, setIsFillForm] = useState({
    courseName: null,
    price: null,
    totalTime: null,
    summary: null,
    detail: null,
    image: null,
    videoTrailer: null,
    lessonData: null,
  });

  const handleAddLesson = () => {
    router.push("/admin/add_course_add_lesson");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(name, value);
    setIsFillForm((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleClickUploadImage = () => {
    document.getElementById("imageInput").click();
  };

  const handleClickUploadVideo = () => {
    document.getElementById("videoInput").click();
  };

  const handleClickUploadFile = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) {
        setUploadError((prevState) => ({
          ...prevState,
          image: false,
        }));
        setIsFillForm((prevState) => ({
          ...prevState,
          image: true,
        }));
        setCourseData("image", file);
        setPreviewData("image", URL.createObjectURL(file));
        setPreviewData("imageName", file.name);
      } else {
        setUploadError((prevState) => ({
          ...prevState,
          image: true,
        }));
      }
    }
  };

  const handleRemoveImage = () => {
    setCourseData("image", null);
    setPreviewData("image", null);
    setPreviewData("imageName", "");
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 20 * 1024 * 1024) {
        setUploadError((prevState) => ({
          ...prevState,
          videoTrailer: false,
        }));
        setIsFillForm((prevState) => ({
          ...prevState,
          videoTrailer: true,
        }));
        setCourseData("videoTrailer", file);
        setPreviewData("videoTrailer", URL.createObjectURL(file));
        setPreviewData("videoTrailerName", file.name);
      } else {
        setUploadError((prevState) => ({
          ...prevState,
          videoTrailer: true,
        }));
      }
    }
  };

  const handleRemoveVideo = () => {
    setCourseData("videoTrailer", null);
    setPreviewData("videoTrailer", null);
    setPreviewData("videoTrailerName", "");
  };

  const handleOptionalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        setUploadError((prevState) => ({
          ...prevState,
          file: false,
        }));
        setCourseData("file", file);
        setPreviewData("file", URL.createObjectURL(file));
        setPreviewData("fileName", file.name);
      } else {
        setUploadError((prevState) => ({
          ...prevState,
          file: true,
        }));
      }
    }
  };

  const handleRemoveFile = () => {
    setCourseData("file", null);
    setPreviewData("file", null);
    setPreviewData("fileName", "");
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

  const validateForm = () => {
    const updatedState = {};
    Object.keys(courseData).forEach((key) => {
      if (key !== "file") {
        updatedState[key] = Boolean(courseData[key]);
      }
    });
    updatedState.lessonData = lessonData && lessonData.length >= 1;

    setIsFillForm(updatedState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    validateForm();
    const isValid = Object.values(isFillForm).every((value) => value === true);

    if (!isValid) {
      setIsLoading(false);
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

      let imageUrl = courseData.image
        ? await uploadToCloudinary(courseData.image)
        : null;
      let videoUrl = courseData.videoTrailer
        ? await uploadToCloudinary(courseData.videoTrailer)
        : null;
      let fileUrl = courseData.file
        ? await uploadToCloudinary(courseData.file)
        : null;
      const updatedCourseData = {
        ...courseData,
        image: imageUrl,
        videoTrailer: videoUrl,
        file: fileUrl,
      };

      const courseResponse = await axios.post(
        "/api/admin/create_course",
        updatedCourseData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      const { courseId } = courseResponse.data;

      const updatedLessonsData = await Promise.all(
        lessonData.map(async (lesson) => {
          const updatedSubLessonData = await Promise.all(
            lesson.sub_lesson_data.map(async (subLesson) => {
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
            lessonName: lesson.lesson_name,
            subLessonData: updatedSubLessonData,
          };

          return updatedLessonData;
        })
      );

      const subLessonResponse = await axios.post(
        `/api/admin/create_lesson/${courseId}`,
        { lessons: updatedLessonsData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      handleResetAll();
      alert("Course created successfully!");
      router.push("/admin/course_list");
    } catch (error) {
      alert("Can not upload course to database");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    handleResetAll();
    resetLessonData();
    router.push("/admin/course_list");
  };

  const handleEditLesson = (LessonId) => {
    addLessonIdToEdit(LessonId);
    router.push("/admin/add_course_edit_lesson");
  };

  const renderTableHeaders = () => {
    const headers = ["", "", "Lesson name", "Sub-lesson", "Action"];
    return headers.map((header, index) => (
      <th key={index} className="p-2 text-[#424C6B] font-normal">
        {header}
      </th>
    ));
  };

  const handleShakeIcon = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const renderTableBody = () => {
    return lessonData.map((lesson, index) => (
      <tr key={lesson.lesson_id} className="hover:bg-[#F6F7FC]">
        <td className="pl-4 border-t border-[#F1F2F6]">
          <DragIcon />
        </td>
        <td className="p-2 py-4 border-t border-[#F1F2F6]">{index + 1}</td>
        <td className="p-2 border-t border-[#F1F2F6]">{lesson.lesson_name}</td>
        <td className="p-2 px-5 border-t border-[#F1F2F6]">
          {lesson.sub_lesson_data.length}
        </td>
        <td className="p-2 border-t border-[#F1F2F6]">
          {lessonData.length <= 1 ? (
            <button
              type="button"
              onClick={handleShakeIcon}
              className={`mr-2 hover:scale-110 ${
                isShaking ? "animate-shake" : ""
              }`}
            >
              <DisabledTrashIcon />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setLessonToDelete(lesson.lesson_id);
              }}
              className="mr-2 hover:scale-110"
            >
              <TrashIcon />
            </button>
          )}
          <button
            onClick={() => handleEditLesson(lesson.lesson_id)}
            type="button"
            className="hover:scale-110"
          >
            <EditIcon />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <form
      className="add-course-page bg-[#F6F7FC] w-full"
      onSubmit={handleSubmit}
    >
      <header className="top-bar flex justify-between items-center h-[92px] px-10 py-4 bg-white">
        <h1 className="text-[24px] font-[500]">Add Course</h1>
        <div className="button flex gap-4">
          <button
            onClick={handleCancel}
            type="button"
            className="cancel-button w-[120px] h-[60px] px-8 py-[18px] text-[#F47E20] font-[700] border border-[#F47E20] rounded-[12px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#2F5FAC] hover:bg-white hover:text-[#2F5FAC] hover:border hover:border-[#2F5FAC] text-[#FFFFFF] create-button w-[120px] h-[60px] px-8 py-[18px] font-[700] rounded-[12px] flex justify-center items-center"
          >
            {isLoading ? (
              <Image src={loadingIcon} alt="loading icon" className="w-8 h-8" />
            ) : (
              "Create"
            )}
          </button>
        </div>
      </header>

      <main className="course-data-form bg-[#F6F7FC]">
        <div className="bg-[#FFFFFF] mx-10 my-10 rounded-[16px] px-[100px] pt-[40px] pb-[60px] flex flex-col gap-[40px]">
          {/* Course Name */}
          <section className="course-name">
            <label htmlFor="courseName">Course Name *</label>
            <div className="relative">
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={courseData.courseName}
                onChange={handleInputChange}
                placeholder="Enter the course name"
                className={`w-full mt-1 px-4 py-3 border-1 rounded-[8px] ${
                  isFillForm.courseName === false
                    ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                    : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                } `}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B2FAC]">
                {isFillForm.courseName === false && <AlertIcon />}
              </div>
            </div>
            {isFillForm.courseName === false && (
              <p className="absolute text-[#9B2FAC] text-sm mt-1">
                Please fill out this field
              </p>
            )}
          </section>

          {/* Price and Total Time */}
          <div className="flex gap-[40px]">
            <section className="price w-[50%]">
              <label htmlFor="price">Price *</label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  placeholder="Enter the price in THB"
                  className={`w-full mt-1 px-4 py-3 border-1 rounded-[8px] ${
                    isFillForm.price === false
                      ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                      : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B2FAC]">
                  {isFillForm.price === false && <AlertIcon />}
                </div>
              </div>
              {isFillForm.price === false && (
                <p className="absolute text-[#9B2FAC] text-sm mt-1">
                  Please fill out this field
                </p>
              )}
            </section>
            <section className="total-time w-[50%]">
              <label htmlFor="totalTime">Total Learning Time *</label>
              <div className="relative">
                <input
                  type="number"
                  id="totalTime"
                  name="totalTime"
                  value={courseData.totalTime}
                  onChange={handleInputChange}
                  placeholder="Enter the total learning time in hours"
                  className={`w-full mt-1 px-4 py-3 border-1 rounded-[8px] ${
                    isFillForm.totalTime === false
                      ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                      : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9B2FAC]">
                  {isFillForm.totalTime === false && <AlertIcon />}
                </div>
              </div>
              {isFillForm.totalTime === false && (
                <p className="absolute text-[#9B2FAC] text-sm mt-1">
                  Please fill out this field
                </p>
              )}
            </section>
          </div>

          {/* Course Summary */}
          <section className="course-summary">
            <label htmlFor="summary">Course Summary *</label>
            <div className="relative">
              <textarea
                id="summary"
                name="summary"
                value={courseData.summary}
                onChange={handleInputChange}
                placeholder="Write a summary of the course"
                rows="2"
                className={`w-full mt-1 px-4 py-3 border-1 rounded-[8px] ${
                  isFillForm.summary === false
                    ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                    : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                }`}
              />
              <div className="absolute right-3 top-5 text-[#9B2FAC]">
                {isFillForm.summary === false && <AlertIcon />}
              </div>
            </div>
            {isFillForm.summary === false && (
              <p className="absolute text-[#9B2FAC] text-sm mt-1">
                Please fill out this field
              </p>
            )}
          </section>

          {/* Course Details */}
          <section className="course-detail">
            <label htmlFor="detail">Course Detail:</label>
            <div className="relative">
              <textarea
                id="detail"
                name="detail"
                value={courseData.detail}
                onChange={handleInputChange}
                placeholder="Enter detailed information about the course"
                rows="6"
                className={`w-full mt-1 px-4 py-3 border-1 rounded-[8px] ${
                  isFillForm.detail === false
                    ? "border-[#9B2FAC] focus:border-[#9B2FAC] focus:outline-none"
                    : "border-[#D6D9E4] focus:border-[#F47E20] focus:outline-none"
                }`}
              />
              <div className="absolute right-3 top-5 text-[#9B2FAC]">
                {isFillForm.detail === false && <AlertIcon />}
              </div>
            </div>
            {isFillForm.detail === false && (
              <p className="absolute text-[#9B2FAC] text-sm mt-1">
                Please fill out this field
              </p>
            )}
          </section>

          {/* Cover Image Section */}
          <section className="cover-image bg-white">
            <h3>Cover Image *</h3>
            <p className="text-[#9AA1B9] mt-2 text-[14px]">
              Supported file types: .jpg, .png, .jpeg. Max file size: 5 MB
            </p>

            <div className="mt-4">
              {!courseData.image ? (
                <>
                  <button
                    type="button"
                    className="border-dashed w-[240px] h-[240px] bg-[#F6F7FC] rounded-[8px] p-6 text-center cursor-pointer"
                    onClick={handleClickUploadImage}
                  >
                    <div className="text-[#5483D0] font-[500] text-[24px]">
                      +
                    </div>
                    <div className="text-[#5483D0] font-[500]">
                      Upload Image
                    </div>
                    <input
                      type="file"
                      id="imageInput"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageFileChange}
                    />
                  </button>
                  {uploadError.image && (
                    <p className="absolute text-[#9B2FAC] text-sm mt-1">
                      Upload failed. Ensure the file is .jpg, .png, or .jpeg and
                      less than 5 MB.
                    </p>
                  )}
                  {isFillForm.image === false && uploadError.image === false ? (
                    <p className="absolute text-[#9B2FAC] text-sm mt-1">
                      Upload the cover image is required.
                    </p>
                  ) : null}
                </>
              ) : (
                <div className="relative w-[240px] h-[240px]">
                  <img
                    src={previewData.image}
                    alt="Uploaded Preview"
                    className="w-[240px] h-[240px] object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-[#9B2FAC] text-white rounded-full flex items-center justify-center w-8 h-8"
                  >
                    x
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Video Section */}
          <section className="cover-video bg-white">
            <h3>Video Trailer *</h3>
            <p className="text-[#9AA1B9] mt-2 text-[14px]">
              Supported file types: .mp4, .mov, .avi Max file size: 20 MB
            </p>

            <div className="mt-4">
              {!courseData.videoTrailer ? (
                <>
                  <button
                    type="button"
                    className="border-dashed w-[240px] h-[240px] bg-[#F6F7FC] rounded-[8px] p-6 text-center cursor-pointer"
                    onClick={handleClickUploadVideo}
                  >
                    <div className="text-[#5483D0] font-[500] text-[24px]">
                      +
                    </div>
                    <div className="text-[#5483D0] font-[500]">
                      Upload Video
                    </div>
                    <input
                      type="file"
                      id="videoInput"
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                    />
                  </button>
                  {uploadError.videoTrailer && (
                    <p className="absolute text-[#9B2FAC] text-sm mt-1">
                      Upload failed. Ensure the file is .mp4, .mov, .avi and
                      less than 20 MB.
                    </p>
                  )}
                  {isFillForm.videoTrailer === false &&
                  uploadError.videoTrailer === false ? (
                    <p className="absolute text-[#9B2FAC] text-sm mt-1">
                      Upload the video trailer is required.
                    </p>
                  ) : null}
                </>
              ) : (
                <div className="relative w-[240px] h-[240px]">
                  {/* Video Preview */}
                  <video
                    src={previewData.videoTrailer}
                    controls
                    className="w-[240px] h-[240px] object-cover rounded-lg"
                    alt="Uploaded Video Preview"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-0 right-0 bg-[#9B2FAC] text-white rounded-full flex items-center justify-center w-8 h-8"
                  >
                    x
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="cover-file bg-white">
            <h3>Attach File (Optional)</h3>
            <p className="text-[#9AA1B9] mt-2 text-[14px]">
              Supported file types: .pdf, .docx, .xlsx, .txt. Max file size: 10
              MB
            </p>

            <div className="mt-4">
              {!courseData.file ? (
                <>
                  <button
                    type="button"
                    className="border-dashed w-[160px] h-[160px] bg-[#F6F7FC] rounded-[8px] p-6 text-center cursor-pointer"
                    onClick={handleClickUploadFile}
                  >
                    <div className="text-[#5483D0] font-[500] text-[24px]">
                      +
                    </div>
                    <div className="text-[#5483D0] font-[500]">Attach File</div>
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      accept=".pdf, .docx, .xlsx, .txt"
                      onChange={handleOptionalFileChange}
                    />
                  </button>
                  {uploadError.file && (
                    <p className=" absolute text-[#9B2FAC] text-sm mt-1">
                      Upload failed. Ensure the file is .pdf, .docx, .xlsx,
                      .txt. and less than 10 MB.
                    </p>
                  )}
                </>
              ) : (
                <div className="relative w-[160px] h-[160px]">
                  {/* File Preview */}
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className="mt-2 text-sm text-[#9AA1B9]">
                      <a
                        href={previewData.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#5483D0]"
                      >
                        {previewData.fileName}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-0 right-0 bg-[#9B2FAC] text-white rounded-full flex items-center justify-center w-8 h-8"
                  >
                    x
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <section className="mx-10">
        <div className="flex justify-between items-center mt-10">
          <h1 className="text-2xl">Lesson</h1>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleAddLesson}
            className="w-[150px] bg-[#2F5FAC] hover:bg-[#FFFFFF] hover:text-[#2F5FAC] hover:border-[#2F5FAC] text-[#FFFFFF] px-6 py-3 rounded-lg font-semibold border-1 border-transparent"
          >
            + Add Lesson
          </button>
        </div>
        <table className="w-full text-left my-10 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-[#E4E6ED]">
            <tr>{renderTableHeaders()}</tr>
          </thead>
          <tbody className="bg-[#FFFFFF]">
            {isFillForm.lessonData === false ? (
              <tr className="border-1 border-[#9B2FAC]">
                <td colSpan="8" className="text-center text-[#9B2FAC]">
                  You must have at least one lesson. !
                </td>
              </tr>
            ) : (
              renderTableBody()
            )}
          </tbody>
        </table>
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
                    onClick={() => {
                      deleteLesson(lessonToDelete);
                      setLessonToDelete([]);
                      setIsModalOpen(false);
                    }}
                    className="font-semibold px-4 py-3 bg-[#FFFFFF] border-1 border-[#F47E20] text-[#F47E20] rounded-xl hover:bg-[#F47E20] hover:text-[#FFFFFF]"
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
      </section>
    </form>
  );
};
