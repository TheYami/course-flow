import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SideBar from "@/components/admin/AdminSidebar";
import { ArrowBack } from "@/assets/icons/admin_icon/adminIcon";

const EditCoursePage = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const [courseName, setCourseName] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    course_name: "",
    summary: "",
    detail: "",
    price: 0,
    totalTime: 0,
    image: "",
    video: "",
    document: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [documentPreview, setDocumentPreview] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (courseId) {
      fetchCourseData(courseId);
    }
  }, [courseId]);

  const fetchCourseData = async (id) => {
    setLoadingData(true);
    try {
      const { data } = await axios.get(`/api/admin/courses`, {
        params: { courseId: id },
      });
      const course = data.data[0];
      if (course) {
        setCourseName(course.course_name);
        setFormValues({
          course_name: course.course_name || "",
          summary: course.summary || "",
          detail: course.detail || "",
          price: course.price || 0,
          totalTime: course.total_time || 0,
          image: "",
          video: "",
          document: "",
        });
        setImagePreview(course.image_file || "");
        setVideoPreview(course.video_file || "");
        setDocumentPreview(course.document_file || "");
      } else {
        setError("Course not found.");
      }
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError("Failed to load course data.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
        setFormValues((prev) => ({
          ...prev,
          image: file,
        }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert("File size exceeds 5 MB");
      }
    }
  };

  const handleRemoveImage = () => {
    setFormValues((prev) => ({
      ...prev,
      image: "",
      imagePreview: "",
    }));
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 20 * 1024 * 1024) {
        setFormValues((prev) => ({
          ...prev,
          video: file,
        }));
        setVideoPreview(URL.createObjectURL(file));
      } else {
        alert("File size exceeds 20 MB");
      }
    }
  };

  const handleRemoveVideo = () => {
    setFormValues((prev) => ({
      ...prev,
      video: "",
    }));
    setVideoPreview("");
  };

  const handleOptionalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        setFormValues((pre) => ({
          ...pre,
          document: file,
        }));
        setDocumentPreview((prev) => ({
          ...prev,
          document: URL.createObjectURL(file),
        }));
        setFileName(file.name);
      } else {
        alert("File size exceeds 10 MB");
      }
    }
  };

  const handleRemoveFile = () => {
    setFormValues((pre) => ({
      ...pre,
      document: null,
    }));
    setDocumentPreview((prev) => ({
      ...prev,
      document: "",
    }));
    setFileName("");
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

      let imageUrl = formValues.image
        ? await uploadToCloudinary(formValues.image)
        : null;
      let videoUrl = formValues.video
        ? await uploadToCloudinary(formValues.video)
        : null;
      let documentUrl = formValues.document
        ? await uploadToCloudinary(formValues.document)
        : null;

      // อัปเดตข้อมูลของคอร์ส
      const updatedCourseData = {
        ...formValues,
        image_file: imageUrl,
        video_file: videoUrl,
        document_file: documentUrl,
      };

      const response = await axios.put(
        `/api/admin/edit_course/${courseId}`,
        updatedCourseData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      router.push("/admin/course_list");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/course_list");
  };

  // รวบสถานะ loading เพื่อให้ render คงที่

  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 bg-[#F6F7FC]">
        <div className="flex bg-[#FFFFFF] justify-between items-center p-6 mb-6 border-b shadow-sm">
          <div className="flex">
            <div onClick={handleCancel} className=" absolute top-11">
              <ArrowBack />
            </div>
            <h1 className="text-2xl font-sans text-[#9AA1B9] ml-10 mr-3">
              Course
            </h1>
            <h1 className="text-2xl font-sans mr-3">'{courseName}'</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleCancel}
              className="border border-[#F47E20] hover:bg-[#F47E20] text-[#F47E20] hover:text-[#FFFFFF] font-semibold px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loadingData}
              className="bg-[#2F5FAC] hover:bg-white hover:text-[#2F5FAC] hover:border hover:border-[#2F5FAC] text-[#FFFFFF] px-6 py-3 rounded-lg font-semibold"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="p-6 bg-[#F6F7FC]">
          {loadingData ? (
            <div className="absolute inset-0 bg-[#FFFFFF] bg-opacity-20 flex items-center justify-center z-10">
              <div className="loader border-t-4 border-[#2F5FAC] w-12 h-12 rounded-full animate-spin"></div>
            </div>
          ) : (
            <form
              className="add-course-page bg-[#F6F7FC] w-full"
              onSubmit={handleSubmit}
            >
              <main className="course-data-form bg-[#F6F7FC]">
                <div className="bg-white mx-10 rounded-[16px] px-[100px] pt-[40px] pb-[60px] flex flex-col gap-[40px]">
                  {/* Course Name */}
                  <section className="course-name">
                    <label htmlFor="courseName">Course Name *</label>
                    <input
                      type="text"
                      id="courseName"
                      name="course_name"
                      value={formValues.course_name}
                      onChange={handleInputChange}
                      placeholder="Enter the course name"
                      required
                      className="w-full mt-1 px-4 py-3 border border-[#D6D9E4] rounded-[8px]"
                    />
                  </section>

                  {/* Price and Total Time */}
                  <div className="flex gap-[40px]">
                    <section className="price w-[50%]">
                      <label htmlFor="price">Price *</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formValues.price}
                        onChange={handleInputChange}
                        placeholder="Enter the price in THB"
                        required
                        className="w-full mt-1 px-4 py-3 border border-[#D6D9E4] rounded-[8px]"
                      />
                    </section>
                    <section className="total-time w-[50%]">
                      <label htmlFor="totalTime">Total Learning Time *</label>
                      <input
                        type="number"
                        id="totalTime"
                        name="totalTime"
                        value={formValues.totalTime}
                        onChange={handleInputChange}
                        placeholder="Enter the total learning time in hours"
                        required
                        className="w-full mt-1 px-4 py-3 border border-[#D6D9E4] rounded-[8px]"
                      />
                    </section>
                  </div>

                  {/* Course Summary */}
                  <section className="course-summary">
                    <label htmlFor="summary">Course Summary *</label>
                    <textarea
                      id="summary"
                      name="summary"
                      value={formValues.summary}
                      onChange={handleInputChange}
                      placeholder="Write a summary of the course"
                      required
                      rows="2"
                      className="w-full mt-1 px-4 py-3 border border-[#D6D9E4] rounded-[8px]"
                    />
                  </section>

                  {/* Course Details */}
                  <section className="course-detail">
                    <label htmlFor="detail">Course Detail:</label>
                    <textarea
                      id="detail"
                      name="detail"
                      value={formValues.detail}
                      onChange={handleInputChange}
                      placeholder="Enter detailed information about the course"
                      required
                      rows="6"
                      className="w-full h-[40rem] mt-1 px-4 py-3 border border-[#D6D9E4] rounded-[8px]"
                    />
                  </section>

                  {/* Cover Image Section */}
                  <section className="cover-image bg-white">
                    <h3>Cover Image *</h3>
                    <p className="text-[#9AA1B9] mt-2 text-[14px]">
                      Supported file types: .jpg, .png, .jpeg. Max file size: 5
                      MB
                    </p>

                    <div className="mt-4">
                      {!formValues.image ? (
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
                            required
                          />
                        </button>
                      ) : (
                        <div className="relative w-[240px] h-[240px]">
                          <img
                            src={imagePreview}
                            alt="Uploaded Preview"
                            className="w-[240px] h-[240px] object-cover rounded-lg"
                          />
                          <button
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
                      Supported file types: .mp4, .mov, .avi Max file size: 20
                      MB
                    </p>

                    <div className="mt-4">
                      {!formValues.video ? (
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
                            required
                          />
                        </button>
                      ) : (
                        <div className="relative w-[240px] h-[240px]">
                          {/* Video Preview */}
                          <video
                            src={videoPreview}
                            controls
                            className="w-[240px] h-[240px] object-cover rounded-lg"
                            alt="Uploaded Video Preview"
                          />
                          <button
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
                      Supported file types: .pdf, .docx, .xlsx, .txt. Max file
                      size: 10 MB
                    </p>

                    <div className="mt-4">
                      {!formValues.document ? (
                        <button
                          type="button"
                          className="border-dashed w-[160px] h-[160px] bg-[#F6F7FC] rounded-[8px] p-6 text-center cursor-pointer"
                          onClick={handleClickUploadFile}
                        >
                          <div className="text-[#5483D0] font-[500] text-[24px]">
                            +
                          </div>
                          <div className="text-[#5483D0] font-[500]">
                            Attach File
                          </div>
                          <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept=".pdf, .docx, .xlsx, .txt"
                            onChange={handleOptionalFileChange}
                          />
                        </button>
                      ) : (
                        <div className="relative w-[160px] h-[160px]">
                          {/* File Preview */}
                          <div className="w-full h-full flex flex-col justify-center items-center">
                            <div className="mt-2 text-sm text-[#9AA1B9]">
                              <a
                                href={documentPreview}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#5483D0]"
                              >
                                {fileName}
                              </a>
                            </div>
                          </div>
                          <button
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;