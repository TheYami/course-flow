import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Modal({ course, action, onClose, user }) {
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = (inWishlist) => {
    setIsModalOpen(false);
    onClose(inWishlist);
  };

  const handleAddToWishlist = async () => {
    // เรียกใช้ API เพื่อเพิ่ม course ใน wishlist
    try {
      await axios.post("/api/addToWishlist", {
        email: user.email,
        course_id: course.course_id,
      });
      setInWishlist(true);
      handleClose(true);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleSubscribe = () => {
    router.push("/"); // ไปยังหน้าแรกหรือที่กำหนด
    setIsModalOpen(false); // ปิด modal
    onClose(inWishlist); // ส่งค่า inWishlist กลับไปที่ parent
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Backdrop */}
      <div className="absolute top-0 left-0 w-full h-full"></div>

      {/* Modal Content */}
      <div className="model relative z-10 flex flex-col items-center w-[528px] h-fit bg-white shadow-[2px_2px_12px_rgba(64,50,133,0.12)] rounded-[24px]">
        <div className="model-top w-full flex justify-between items-center px-6 py-2 border-b-[1px] border-[#E4E6ED]">
          <div className="text-xl font-normal">Confirmation</div>
          <button
            className="close-button"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <svg
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5303 24.8483L25.4697 15.1514M15.5303 15.1514L25.4697 24.8483"
                stroke="#C8CCDB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="model-btm w-full flex flex-col gap-6 p-6">
          <p className="text-base font-normal text-[#646D89] m-0">
            Do you sure to {action} Course?
          </p>

          <div className="model-btm-button flex gap-4 h-[60px]">
            <button
              className="bg-white w-1/4 border-[1px] border-[#F47E20] rounded-xl text-[#F47E20] font-bold text-base"
              onClick={() => handleClose(false)}
            >
              No, I don’t
            </button>

            {action === "add" ? (
              <button
                className="w-1/2 bg-[#2F5FAC] rounded-xl text-white font-bold text-base"
                onClick={handleAddToWishlist}
              >
                Yes, add to wishlist
              </button>
            ) : (
              <button
                className="w-1/2 bg-[#2F5FAC] rounded-xl text-white font-bold text-base"
                onClick={handleSubscribe}
              >
                Yes, I want to subscribe
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
