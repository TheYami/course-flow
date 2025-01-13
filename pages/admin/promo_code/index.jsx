import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/AdminSidebar";
import AdminHeaderbar from "@/components/admin/AdminHeaderbar";
import {
  TrashIcon,
  EditIcon,
  ModalXIcon,
} from "@/assets/icons/admin_icon/adminIcon";
import axios from "axios";
import formatDate from "@/utils/formatDate";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useRouter } from "next/router";

const AdminPanelPromoCode = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { loading } = useAdminAuth();
  const [promoCodeToDelete, setPromoCodeToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalNumOFAllCourse, setTotalNumOFAllCourse] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      fetchPromoCodes(currentPage);
    }
  }, [currentPage, loading]);

  const fetchPromoCodes = async (page) => {
    setLoadingData(true);
    try {
      const [data, courseData] = await Promise.all([
        await axios.get("/api/admin/promo_codes", {
          params: { page, limit: 6 },
        }),
        await axios.get("/api/admin/fetch_all_courses"),
      ]);
      setPromoCodes(data.data.data);
      setTotalPages(data.data.totalPages);
      setTotalNumOFAllCourse(courseData.data.total);
    } catch (err) {
      console.error("Error fetching promo codes data:", err);
      setError("Failed to load promo codes. data");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSearch = async (searchQuery) => {
    setLoadingData(true);
    try {
      const { data } = await axios.get("/api/admin/promo_codes", {
        params: { code: searchQuery, page: 1, limit: 6 },
      });
      if (data && data.data) {
        setPromoCodes(data.data);
        setTotalPages(data.totalPages);
        setCurrentPage(1);
      } else {
        console.error("Invalid response structure:", data);
        setError("Unexpected response structure.");
      }
    } catch (err) {
      console.error("Error fetching promo_code data:", err);
      setError("Failed to load promo_code data.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (promoCodeId) => {
    setLoadingData(true);
    try {
      const { data } = await axios.delete(
        `/api/admin/delete_promo_code/${promoCodeId}`
      );

      fetchPromoCodes(currentPage);
    } catch (err) {
      console.error("Error deleting promo code:", err);
      setError("Failed to delete promo code.");
    } finally {
      setLoadingData(false);
      setIsModalOpen(false);
    }
  };

  const handleEdit = (promo_code_id) => {
    router.push(`/admin/edit_promo_code/${promo_code_id}`);
  };

  const renderPagination = () => {
    return (
      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="px-4 py-2 mx-2 bg-[#2F5FAC] hover:bg-[#3f74ca] rounded text-[#FFFFFF]"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          type="button"
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
      "Promo Code",
      "Minimum Purchase (THB)",
      "Discount Type",
      "Courses Included",
      "Created Date",
      "Action",
    ];
    return headers.map((header) => (
      <th key={header} className="p-2 text-[#424C6B] font-normal">
        {header}
      </th>
    ));
  };

  const renderTableBody = () => {
    return promoCodes.map((promoCode, index) => (
      <tr key={promoCode.promo_code_id} className="hover:bg-[#F6F7FC]">
        <td className="px-2 py-4 border-t border-[#F1F2F6]">
          {promoCode.code}
        </td>
        <td className="px-2 py-4 border-t border-[#F1F2F6]">
          {Number(promoCode.min_price).toLocaleString('en-US',{
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
        <td className="px-2 py-4 border-t border-[#F1F2F6]">
          {promoCode.discount_type}
        </td>
        <td className="px-2 py-4 border-t border-[#F1F2F6]">
          {promoCodes[index]?.courses?.length === Number(totalNumOFAllCourse)
            ? "All Courses"
            : promoCode.courses[0].course_name.length > 20
            ? `${promoCode.courses[0].course_name.slice(0, 20)}...`
            : promoCode.courses[0].course_name}
        </td>
        <td className="px-2 py-4 border-t border-[#F1F2F6]">
          {formatDate(promoCode.created_at)}
        </td>
        <td className="px-2 py-4 border-t border-[#F1F2F6]">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setPromoCodeToDelete(promoCode.promo_code_id);
            }}
            type="button"
            className="mr-2 hover:scale-110"
          >
            <TrashIcon />
          </button>
          <button
            type="button"
            onClick={() => handleEdit(promoCode.promo_code_id)}
            className="hover:scale-110"
          >
            <EditIcon />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-[#F6F7FC]">
        <AdminHeaderbar
          title="Promo Code"
          buttonLabel="+ Add Promo Code"
          apiEndpoint="/api/promo_codes"
          onSearch={handleSearch}
          navigatePath="/admin/add_promo_code"
        />
        <div className="p-6">
          {loadingData ? (
            <div className="absolute inset-0 bg-[#FFFFFF] bg-opacity-80 flex items-center justify-center z-10">
              <div className="loader border-t-4 border-[#2F5FAC] w-12 h-12 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <table className="w-[80vw]  text-left m-8 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-[#E4E6ED]">
                  <tr>{renderTableHeaders()}</tr>
                </thead>
                <tbody className="bg-[#FFFFFF]">
                  {promoCodes.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-[#6B7280]">
                        Promo_code Not Found
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
              <div className="bg-white rounded-3xl shadow-lg w-[34rem]">
                <div className="px-6 pt-6 pb-2 border-b flex justify-between">
                  <h3 className="text-xl">Confirmation</h3>
                  <div onClick={() => setIsModalOpen(false)}>
                    <ModalXIcon />
                  </div>
                </div>
                <div className="py-6">
                  <p className="ml-8">
                    Are you sure you want to delete this Promo Code?
                  </p>
                  <div className="flex justify-center gap-8 mt-6">
                    <button
                      className="px-4 py-3 bg-[#FFFFFF] border-1 border-[#F47E20] text-[#F47E20] rounded-xl hover:bg-[#F47E20] hover:text-[#FFFFFF]"
                      onClick={() => handleDelete(promoCodeToDelete)}
                    >
                      Yes, I want to delete this Promo Code
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

export default AdminPanelPromoCode;
