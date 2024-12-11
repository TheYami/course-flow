import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/router';

const useUserAuth = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
  
        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }
  
        setUser(session.user);
        setLoading(false);
  
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();
  
        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData(data); 
        }
      };
  
      checkSession();
    }, [router]);
  
    return { userData, loading };
  };
  
  export default useUserAuth;