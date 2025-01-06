import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabase";
import Loading from "@/components/Loding";
import axios from "axios";
import CourseCards from "@/components/course-cards";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [course, setCourse] = useState([]);
  const { slug } = router.query;

  // Load user session
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUserData(data);
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  // Load wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData) return;

      setLoading(true);

      try {
        const wishListResult = await axios.get(
          `/api/wishlist?user_id=${userData.id}`
        );
        setCourse(wishListResult.data.data || []);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.response?.data?.message || "Error fetching course");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/profile");
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <>
          <div className="flex justify-between items-center">
            <h1>
              Welcome back
              <span className="text-blue-400">{userData?.name || "User"}!</span>
            </h1>
            <div className="flex gap-4">
              <p>Email: {user.email}</p>
              <p>Date of Birth: {userData?.date_of_birth}</p>
              <p>Education: {userData?.education_background}</p>
              <p>Role: {userData?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Log out
            </button>
          </div>

          {/* Wishlist */}
          <h1 className="bg-slate-600 text-white text-center mt-4">Wishlist</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <CourseCards courses={course} />
          </div>
        </>
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
    </div>
  );
}
