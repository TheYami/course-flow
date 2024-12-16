import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect } from 'react';
import { AuthProvider } from "@/contexts/useUserAuth";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
   return (
     <AuthProvider>
       <Component {...pageProps} />
     </AuthProvider>
   );
}
