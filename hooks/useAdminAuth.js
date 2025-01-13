import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabase";

const useAdminAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/admin");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("users")
        .select("role")
        .eq("email", session.user.email)
        .single();

      if (fetchError || !data) {
        console.error("Error fetching user data:", fetchError);
        router.push("/admin");
        return;
      }

      setUserData(data);
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (userData) {
      if (userData.role !== "admin") {
        router.push("/admin"); 
      } else {
        setLoading(false);
      }
    }
  }, [userData, router]);

  return { loading, userData };
};

export default useAdminAuth;
