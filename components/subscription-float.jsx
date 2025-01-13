import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useUserAuth";
import { useRouter } from "next/router";
import axios from "axios";
import Modal from "./modal";

export default function SubscriptionFloat({ course, subscriptionStatus }) {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inWishlist, setInWishlist] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState(null);

  const {
    isLoggedIn,
    loading: authLoading,
    user,
    userData,
    subscriptions,
  } = useAuth();

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

  // set InWishlist ถ้าเคยเพิ่มไปในDBแล้ว
  useEffect(() => {
    if (!wishlist || !course) return;

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

  // Add-Remove to wishlist
  const handleRemoveFromWishlist = async () => {
    if (!isLoggedIn) {
      alert("Please Login");
      router.push("/login");
    } else {
      setLoading(true);
      try {
        if (inWishlist) {
          await axios.delete("/api/removeFromWishlist", {
            params: { email: user.email, course_id: course.course_id },
          });
          setInWishlist(false);
        } else {
          // Add to wishlist
          setAction("add");
          setIsModalOpen(true);
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
      router;
      setAction("subscribe");
      setIsModalOpen(true);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString("en-US");
  };

  const handleModalClose = (wishlist) => {
    setInWishlist(wishlist);
    setIsModalOpen(false); // ปิด Modal
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
        {subscriptionStatus ? (
          <button
            className="box-border lg:h-[60px] flex flex-row justify-center items-center px-2 py-2 gap-2 bg-[#2F5FAC] text-white shadow-[4px_4px_24px_rgba(0,0,0,0.08)] rounded-[12px] flex-none order-1 flex-grow"
            onClick={() => router.push(`/mycourse/${course.course_id}`)}
          >
            Start Learning
          </button>
        ) : (
          <>
            <button
              className="box-border lg:h-[60px] flex flex-row justify-center items-center px-2 py-2 gap-2 bg-white border border-orange-500 text-orange-500 shadow-[4px_4px_24px_rgba(0,0,0,0.08)] rounded-[12px] flex-none order-0 flex-grow"
              onClick={() => {
                if (!user) {
                  router.push("/login");
                } else {
                  if (!inWishlist) {
                    setIsModalOpen(true);
                    setAction("add");
                  } else {
                    handleRemoveFromWishlist();
                  }
                }
              }}
            >
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
            <button
              className="box-border lg:h-[60px] flex flex-row justify-center items-center px-2 py-2 gap-2 bg-[#2F5FAC] text-white shadow-[4px_4px_24px_rgba(0,0,0,0.08)] rounded-[12px] flex-none order-1 flex-grow"
              onClick={handlSubscription}
            >
              Subscribe This Course
            </button>
          </>
        )}
        {isModalOpen && (
          <Modal
            course={course}
            action={action}
            onClose={handleModalClose}
            user={user}
          />
        )}
      </div>
    </div>
  );
}
