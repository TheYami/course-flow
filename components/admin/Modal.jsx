import React from "react";
import { ModalXIcon } from "@/assets/icons/admin_icon/adminIcon";

const Modal = ({ isModalOpen, setIsModalOpen, handleDelete, assignmentId }) => {
  if (!isModalOpen) return null;

  return (
    <div className="confirmation-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-3xl shadow-lg">
        <div className="px-6 pt-6 pb-2 border-b flex justify-between">
          <h3 className="text-xl">Confirmation</h3>
          <div className="cursor-pointer" onClick={() => setIsModalOpen(false)}>
            <ModalXIcon />
          </div>
        </div>
        <div className="p-6">
          <p>Are you sure you want to delete this assignment?</p>
          <div className="flex justify-center gap-6 mt-6">
            <button
              type="button"
              className="font-semibold px-4 py-3 bg-[#FFFFFF] border-1 border-[#F47E20] text-[#F47E20] rounded-xl hover:bg-[#F47E20] hover:text-[#FFFFFF]"
              onClick={() => handleDelete(assignmentId)}
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
    </div>
  );
};

export default Modal;
