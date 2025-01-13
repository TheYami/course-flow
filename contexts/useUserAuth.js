import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }

        setIsLoggedIn(!!session);
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
      } catch (error) {
        console.error("Error during session check:", error);
      } finally {
        setLoading(false);
        
        
      }
    };

    checkSession();
  }, []);


//Load Subscriptions
useEffect(() => {
  const fetchSubscription = async () => {
    if (userData?.id) {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userData.id)
        
      if (error) {
        console.error("Error fetching subscriptions:", error);
      } else {        
        if (data.length === 0) {
          console.log("No subscriptions available for this user.");
        } else {
          setSubscriptions(data)
        }
      }
    }
  };

  fetchSubscription();
}, [userData]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loading, user, userData, subscriptions }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
