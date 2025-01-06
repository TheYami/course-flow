import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useUserAuth";
import { useRouter } from "next/router";
import axios from "axios";

export default function SubscriptionFloat({ course }) {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inWishlist, setInWishlist] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoggedIn, loading: authLoading, user, userData } = useAuth();

  // Load wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData) return;
      setLoading(true);

      try {
        const wishListResult = await axios.get(
          `/api/wishlist?user_id=${userData.id}`
        );
        setWishlist(wishListResult.data.data || []);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.response?.data?.message || "Error fetching course");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userData]);

  // set InWishlist ถ้าเคยเพิ่มไปแล้ว
  useEffect(() => {
    if (!wishlist || !course) return; // ดักกรณีที่ wishlist หรือ course ยังไม่มีค่า

    const result = wishlist.filter((w) => w.course_id === course.course_id);
    if (result.length > 0) {
      setInWishlist(true);
    } else {
      setInWishlist(false);
    }
  }, [wishlist, course]);

  // ล็อคจอ เมื่อแสดงModal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Reset เมื่อ component ถูก unmount
    };
  }, [isModalOpen]);

  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setLoading(true);
      try {
        if (inWishlist) {
          // Remove from wishlist
          await axios.delete("/api/removeFromWishlist", {
            params: { email: user.email, course_id: course.course_id },
          });
          setInWishlist(false);
          console.log("Removed from wishlist");
        } else {
          // Add to wishlist
          await axios.post("/api/addToWishlist", {
            email: user.email,
            course_id: course.course_id,
          });
          setInWishlist(true);
          console.log("Added to wishlist");
        }
      } catch (err) {
        console.error("Error updating wishlist:", err);
        setError(err.response.data.message || "Error updating wishlist");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlSubscription = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsModalOpen(true);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-US");
  };

  // ตรวจสอบว่า course มีค่าหรือไม่
  if (!course) {
    return (
      <div className="error-message text-red-500">
        Error: Course data is not available.
      </div>
    );
  }

  return (
    <div className="subscription-float  w-full lg:w-[357px] px-4 lg:px-6 flex flex-col gap-2 py-3 bg-white">
      {/* course label */}
      {showButton ? (
        <div className="text-xs text-orange-500 lg:hidden">Course</div>
      ) : null}
      <div className="text-xs text-orange-500 hidden lg:grid">Course</div>

      {/* header */}
      <div className="header flex justify-between gap-1 ">
        <div className="header-l flex flex-col gap-1 text-base font-normal">
          <div className="header-l-course m-0 lg:text-2xl">
            {course.course_name}
          </div>
          <div className="header-l-detail text-xs text-gray-700 hidden lg:grid lg:text-base">
            {course.summary}
          </div>
          {showButton ? (
            <div className="text-xs text-gray-700 lg:hidden">
              {course.detail}
            </div>
          ) : null}
          <p className="m-0 text-gray-700 lg:text-2xl">
            THB {formatPrice(course.price)}
          </p>
        </div>
        {/* ปุ่มซ่อน/แสดง */}
        <div className="header-r lg:hidden">
          {showButton ? (
            <button
              onClick={() => {
                setShowButton(!showButton);
                console.log(showButton);
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_11339_6014)">
                  <rect
                    width="24"
                    height="24"
                    transform="matrix(-1 0 0 -1 24 24)"
                    fill="white"
                  />
                  <path d="M17 14L12 9L7 14L17 14Z" fill="#646D89" />
                </g>
                <defs>
                  <clipPath id="clip0_11339_6014">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="matrix(-1 0 0 -1 24 24)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {
                setShowButton(!showButton);
                console.log(showButton);
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_11339_5947)">
                  <rect width="24" height="24" fill="white" />
                  <path d="M7 10L12 15L17 10H7Z" fill="#646D89" />
                </g>
                <defs>
                  <clipPath id="clip0_11339_5947">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="action flex lg:flex-col gap-2 text-xs lg:text-base font-bold">
        <button
          className="box-border lg:h-[60px] flex flex-row justify-center items-center px-2 py-2 gap-2 bg-white border border-orange-500 text-orange-500 shadow-[4px_4px_24px_rgba(0,0,0,0.08)] rounded-[12px] flex-none order-0 flex-grow"
          onClick={handleAddToWishlist}
        >
          {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
        <button
          className="box-border lg:h-[60px] flex flex-row justify-center items-center px-2 py-2 gap-2 bg-[#2F5FAC] text-white shadow-[4px_4px_24px_rgba(0,0,0,0.08)] rounded-[12px] flex-none order-1 flex-grow"
          onClick={handlSubscription}
        >
          Subscribe This Course
        </button>
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Backdrop */}
            <div
              className="absolute top-0 left-0 w-full h-full"
              onClick={() => setIsModalOpen(false)} // คลิกนอก Modal เพื่อปิด
            ></div>

            {/* Modal Content */}
            <div className="model relative z-10 flex flex-col items-center w-[528px] h-[212px] bg-white shadow-[2px_2px_12px_rgba(64,50,133,0.12)] rounded-[24px]">
              <div className="model-top w-full flex justify-between items-center px-6 py-2 border-b-[1px] border-[#E4E6ED]">
                <div className="text-xl font-normal">Confirmation</div>
                <div className="close-button">
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="model-btm w-full flex flex-col gap-6 p-6 ">
                <p className="text-base font-normal text-[#646D89] m-0">
                  Do you sure to subscribe {course.course_name} Course?
                </p>
                <div className="model-btm-button flex gap-4 h-[60px]">
                  <button
                    className="bg-white w-1/4 border-[1px] border-[#F47E20] rounded-xl text-[#F47E20] font-bold text-base"
                    onClick={() => setIsModalOpen(false)}
                  >
                    No, I don’t
                  </button>
                  <button
                    className="w-1/2 bg-[#2F5FAC] rounded-xl text-white font-normal text-base"
                    onClick={() => {
                      router.push(`/`);
                      setIsModalOpen(false);
                    }}
                  >
                    Yes, I want to subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
