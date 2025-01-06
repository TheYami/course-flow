import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabase";
import Loading from "@/components/Loding";
import axios from "axios";
import CourseCards from "@/components/course-cards";
import { useAuth } from "@/contexts/useUserAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const { isLoggedIn, user, userData } = useAuth();

  // Load wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData) return;
      setLoading(false);

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
  }, [userData, wishlist.length]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/profile");
  };


  if (error) {
    <div className="error-message text-red-500">
      <p>{error}</p>
      <button
        onClick={() => router.replace(`/course`)}
        className="box-border lg:h-[60px] flex flex-row justify-center items-center px-2 py-2 gap-2 bg-[#2F5FAC] text-white shadow-[4px_4px_24px_rgba(0,0,0,0.08)] rounded-[12px] flex-none order-1 flex-grow"
      >
        Back to Course
      </button>
    </div>;
  }

  return (
    <>
      {user ? (
        <div className="w-full">
          <Navbar />

          {/* Wishlist */}
          <div className="wishlist flex flex-col items-center mb-12 lg:mb-48">
            <div className="relative w-full -z-40">
              {/* gliter */}
              <svg
                width="100%"
                height="157"
                viewBox="0 0 375 157"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-10 md:hidden"
              >
                <circle cx="369" cy="139" r="18" fill="#C6DCFF" />
                <path
                  d="M300.372 20.5449L318.99 17.7062L312.139 35.249L300.372 20.5449Z"
                  stroke="#FBAA1C"
                  strokeWidth="3"
                />
                <circle
                  cx="40.2011"
                  cy="4.28073"
                  r="2.78073"
                  stroke="#2F5FAC"
                  strokeWidth="3"
                />
                <circle cx="0.253627" cy="56.1735" r="10.2536" fill="#C6DCFF" />
                <path
                  d="M80.2176 137.001L76.3218 151.54"
                  stroke="#2FAC61"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M71 142.322L85.5393 146.217"
                  stroke="#2FAC61"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                width="100%"
                height="190"
                viewBox="0 0 1397 190"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-10 hidden md:block"
              >
                <circle
                  cx="64.5"
                  cy="5.5"
                  r="4"
                  stroke="#2F5FAC"
                  strokeWidth="3"
                />
                <circle cx="1381" cy="153" r="37" fill="#C6DCFF" />
                <circle cx="13.1741" cy="72.1741" r="13.1741" fill="#C6DCFF" />
                <path
                  d="M1231.36 45.9099L1257.15 41.9774L1247.66 66.28L1231.36 45.9099Z"
                  stroke="#FBAA1C"
                  strokeWidth="3"
                />
                <path
                  d="M248.843 132L243.838 150.68"
                  stroke="#2FAC61"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M237 138.838L255.68 143.843"
                  stroke="#2FAC61"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              {/*end of gliter */}

              <div className="search-bar w-full flex flex-col justify-center items-center mt-10 mb-12 lg:my-16">
                <h3 className="font-medium text-2xl lg:text-4xl">My Wishlist</h3>
              </div>
            </div>

            <CourseCards courses={wishlist} />
          </div>
          <Footer />
        </div>
      ) : (
        <>
          <h1>Hello, Guest!</h1>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Log in
          </button>
        </>
      )}
    </>
  );
}
