import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/AdminSidebar";
import AdminHeaderbar from "@/components/admin/AdminHeaderbar";
import { TrashIcon, EditIcon } from "@/assets/icons/admin_icon/adminIcon";
import axios from "axios";
import formatDate from "@/utils/formatDate";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useRouter } from "next/router";

const AdminPanelAssignments = () => {
  const router = useRouter()
  const [assignments, setAssignments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { loading } = useAdminAuth();
  const [editLoading, setEditLoading] = useState(false);
  const [limit, setLimit] = useState(6);
  const [modalOpen, setIsModalOpen] = useState(false)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)

  useEffect(() => {
    if (!loading) {
      console.log("Fetching assignments with limit: ", limit); 
      fetchAssignments(currentPage, limit);
    }
  }, [currentPage, limit, loading]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setLimit(10); 
      } else {
        setLimit(6);
      }
      console.log("Updated limit: ", limit);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchAssignments = async (page, limit) => {
    setLoadingData(true);
    try {
      const { data } = await axios.get("/api/admin/assignments", {
        params: { page, limit },
      });
      setAssignments(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching assignments data:", err);
      setError("Failed to load assignments data.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSearch = async (searchQuery) => {
    setLoadingData(true);
    try {
      const { data } = await axios.get("/api/admin/assignments", {
        params: { description: searchQuery, page: 1, limit: limit },
      });
      setAssignments(data.data);
      setTotalPages(data.totalPages);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching assignments data:", err);
      setError("Failed to load assignments data.");
    } finally {
      setLoadingData(false);
    }
  };

  const renderPagination = () => {
    return (
      <div className="flex justify-center mt-4">
        <button
          className={`px-4 py-2 mx-2 bg-[#2F5FAC] hover:bg-[#3f74ca] rounded text-[#FFFFFF] ${currentPage === 1 ? 'hidden': 'block'}`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        {currentPage < totalPages && (<button
          className="px-4 py-2 mx-2 bg-[#2F5FAC] hover:bg-[#3f74ca] rounded text-[#FFFFFF]"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </button>)}
      </div>
    );
  };

  const renderTableHeaders = () => {
    const headers = [
      "Assignment Detail",
      "Course",
      "Lesson",
      "Sub-Lesson",
      "Created Date",
      "Action",
    ];
    return headers.map((header) => (
      <th key={header} className="py-2 px-3 text-[#424C6B] font-normal">
        {header}
      </th>
    ));
  };

  const renderTableBody = () => {
    return assignments.map((assignment) => (
      <tr key={assignment.assignment_id} className="hover:bg-[#F6F7FC] text-left">
        <td className="py-4 px-3 border-t border-[#F1F2F6] truncate">
          {assignment.description}
        </td>
        <td className="py-4 px-3 border-t border-[#F1F2F6] truncate">
          {assignment.course_name}
        </td>
        <td className="py-4 px-3 border-t border-[#F1F2F6] truncate">
          {assignment.lesson_name}
        </td>
        <td className="py-4 px-3 border-t border-[#F1F2F6] truncate">
          {assignment.sub_lesson_name}
        </td>
        <td className="py-4 px-3 border-t border-[#F1F2F6]">
          {formatDate(assignment.created_at)}
        </td>
        <td className="py-4 px-3 border-t flex gap-3 border-[#F1F2F6]">
          <button
            onClick={() => {
              setSelectedAssignmentId(assignment.assignment_id);
              setIsModalOpen(true)
            }} 
            className="hover:scale-110">
            <TrashIcon />
          </button>
          <button 
            onClick={() => router.push(`/admin/edit_assignment/${assignment.assignment_id}`)}
            className="hover:scale-110">
            <EditIcon />
          </button>
        </td>
      </tr>
    ));
  };

  const handleDeleteAssignments = async () => {
    if (!selectedAssignmentId) return;

    try {
      setEditLoading(true);
      const response = await axios.delete(
        `/api/admin/delete_assignment/${selectedAssignmentId}`
      );
  
      if (response.status === 200) {
        setEditLoading(false);
        fetchAssignments(currentPage, limit);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      setEditLoading(false);
    }
  };


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#F6F7FC]">
        <AdminHeaderbar
          title="Assignments"
          buttonLabel="+ Add Assignment"
          navigatePath="/admin/add_assignment"
          onSearch={handleSearch}
        />
        <div className="p-6">
          {loadingData ? (
            <div className="absolute inset-0 bg-[#FFFFFF] bg-opacity-80 flex items-center justify-center z-10">
              <div className="loader border-t-4 border-[#2F5FAC] w-12 h-12 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <table className="w-[80vw] text-left rounded-lg overflow-hidden shadow-sm xl:ml-2">
                <thead className="bg-[#E4E6ED]">
                  <tr>{renderTableHeaders()}</tr>
                </thead>
                <tbody className="bg-[#FFFFFF]">
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-[#6B7280]">
                        Assignments Not Found
                      </td>
                    </tr>
                  ) : (
                    renderTableBody()
                  )}
                </tbody>
              </table>
              {renderPagination()}

              {modalOpen && <div className="confirmation-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-3xl shadow-lg">
                  <div className="px-6 pt-6 pb-2 border-b flex justify-between">
                    <h3 className="text-xl">Confirmation</h3>
                  </div>
                  <div className="p-6">
                    <p>Are you sure you want to delete this assignment?</p>
                    <div className="flex justify-center gap-6 mt-6">
                      <button
                        type="button"
                        className="font-semibold px-4 py-3 bg-[#FFFFFF] border-1 border-[#F47E20] text-[#F47E20] rounded-xl hover:bg-[#F47E20] hover:text-[#FFFFFF]"
                        onClick={() => handleDeleteAssignments(assignments.assignment_id)}
                      >
                        Yes, I want to delete the assignment
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
              </div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelAssignments;
