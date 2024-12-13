import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/admin/AdminSidebar";
import {
  TrashIcon,
  EditIcon,
  ModalXIcon,
} from "@/assets/icons/admin_icon/adminIcon";
import AdminHeaderbar from "@/components/admin/AdminHeaderbar";
import axios from "axios";
import formatDate from "@/utils/formatDate";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useRouter } from "next/router";

const AdminPanel = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { loading } = useAdminAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      fetchCourses(currentPage);
    }
  }, [currentPage, loading]);

  const fetchCourses = async (page) => {
    setLoadingData(true);
    try {
      const { data } = await axios.get("/api/admin/courses", {
        params: { page, limit: 6 },
      });
      setAllCourses(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError("Failed to load courses data.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSearch = async (searchQuery) => {
    setLoadingData(true);
    try {
      const { data } = await axios.get("/api/admin/courses", {
        params: { name: searchQuery, page: 1, limit: 6 },
      });
      setAllCourses(data.data);
      setTotalPages(data.totalPages);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError("Failed to load courses data.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleEdit = (course) => {
    router.push(`/admin/edit_course/${course.course_id}`);
  };

  const handleDelete = async (courseId) => {
    setLoadingData(true);
    try {
      const { data } = await axios.delete(
        `/api/admin/delete_course/${courseId}`
      );
      console.log("Delete successful:", data);

      setAllCourses((prevCourses) =>
        prevCourses.filter((course) => course.course_id !== courseId)
      );

      fetchCourses(currentPage);
    } catch (err) {
      console.error("Error deleting course data:", err);
      setError("Failed to delete course data.");
    } finally {
      setIsModalOpen(false);
      setLoadingData(false);
    }
  };

  const renderPagination = () => {
    return (
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 mx-2 bg-[#2F5FAC] hover:bg-[#3f74ca] rounded text-[#FFFFFF]"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 mx-2 bg-[#2F5FAC] hover:bg-[#3f74ca] rounded text-[#FFFFFF]"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </button>
      </div>
    );
  };

  const renderTableHeaders = () => {
    const headers = [
      "",
      "Image",
      "Course name",
      "Lesson",
      "Price",
      "Created date",
      "Updated date",
      "Action",
    ];
    return headers.map((header) => (
      <th key={header} className="p-2 text-[#424C6B] font-normal">
        {header}
      </th>
    ));
  };

  const renderTableBody = () => {
    const itemsPerPage = 6;
    return allCourses.map((course, index) => (
      <tr key={course.course_id} className="hover:bg-[#F6F7FC]">
        <td className="pl-4 py-4 border-t border-[#F1F2F6]">
          {index + 1 + (currentPage - 1) * itemsPerPage}
        </td>
        <td className="p-4 border-t border-[#F1F2F6] w-[120px] h-[100px] ">
          <img
            className="w-full h-full object-cover"
            src={course.image_file}
            alt="Course Image"
          />
        </td>
        <td className="p-4 border-t border-[#F1F2F6]">{course.course_name}</td>
        <td className="p-4 border-t border-[#F1F2F6]">
          {course.lesson_count} Lessons
        </td>
        <td className="p-4 border-t border-[#F1F2F6]">
          {course.price.toLocaleString()}
        </td>
        <td className="p-4 border-t border-[#F1F2F6]">
          {formatDate(course.created_at)}
        </td>
        <td className="p-4 border-t border-[#F1F2F6]">
          {formatDate(course.updated_at)}
        </td>
        <td className="p-4 border-t border-[#F1F2F6]">
          <button
            className="mr-2 hover:scale-110"
            onClick={() => {
              setIsModalOpen(true);
              setCourseToDelete(course.course_id);
            }}
          >
            <TrashIcon />
          </button>
          <button
            onClick={() => handleEdit(course)}
            className="hover:scale-110"
          >
            <EditIcon />
          </button>
        </td>
      </tr>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#F6F7FC]">
        <AdminHeaderbar
          title="Course"
          buttonLabel="+ Add Course"
          apiEndpoint="/api/admin/courses"
          onSearch={handleSearch}
          navigatePath="/admin/add_course"
        />
        <div className="p-6">
          {loadingData ? (
            <div className="absolute inset-0 bg-[#FFFFFF] bg-opacity-80 flex items-center justify-center z-10">
              <div className="loader border-t-4 border-[#2F5FAC] w-12 h-12 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <table className="w-[80vw] text-left m-8 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-[#E4E6ED]">
                  <tr>{renderTableHeaders()}</tr>
                </thead>
                <tbody className="bg-[#FFFFFF]">
                  {allCourses.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-[#6B7280]">
                        Course Not Found
                      </td>
                    </tr>
                  ) : (
                    renderTableBody()
                  )}
                </tbody>
              </table>
              {renderPagination()}
            </>
          )}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-3xl shadow-lg w-[30rem]">
                <div className="px-6 pt-6 pb-2 border-b flex justify-between">
                  <h3 className="text-xl">Confirmation</h3>
                  <div onClick={() => setIsModalOpen(false)}>
                    <ModalXIcon />
                  </div>
                </div>
                <div className="p-6">
                  <p>Are you sure you want to delete this course?</p>
                  <div className="flex justify-center gap-8 mt-6">
                    <button
                      className="px-4 py-3 bg-[#FFFFFF] border-1 border-[#F47E20] text-[#F47E20] rounded-xl hover:bg-[#F47E20] hover:text-[#FFFFFF]"
                      onClick={() => handleDelete(courseToDelete)}
                    >
                      Yes, I want to delete this course
                    </button>
                    <button
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
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
