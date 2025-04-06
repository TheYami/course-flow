import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import React from "react";
import { useRouter} from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import useUserAuth from "@/hooks/useUserAuth";
import axios from "axios";

export default function index() {
  const router = useRouter();
  const { slug } = router.query;
  const { userData, loading: userLoading } = useUserAuth();
  const [apiCalled, setApiCalled] = useState(false);

  useEffect(() => {
    if (userData && slug && !apiCalled) {
      const manageDatabase = async () => {
        try {
          setApiCalled(true);
          const createSubLessonProgressResponse = await axios.post(
            `/api/createSublessonProgress?courseId=${slug}&&user_id=${userData.id}`,
            null
          );
          const createSubmissionResponse = await axios.post(
            `/api/course-learning/createSubmission?courseId=${slug}`,
            { user: userData }
          );
        } catch (error) {
          console.error("Error making API calls:", error);
        }
      };
      manageDatabase();
    }
  }, [userData, slug]);

  return (
    <>
      <Navbar />

      <div className="relative md:flex md:justify-center p-4">
        <Link
          href={`/course/${slug}`}
          className="md:hidden flex gap-2 no-underline text-[#2F5FAC] font-bold hover:text-blue-500 w-20 px-2 py-1 items-center"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.7915 11.0051H7.62148L12.5015 6.1251C12.8915 5.7351 12.8915 5.0951 12.5015 4.7051C12.1115 4.3151 11.4815 4.3151 11.0915 4.7051L4.50148 11.2951C4.11148 11.6851 4.11148 12.3151 4.50148 12.7051L11.0915 19.2951C11.4815 19.6851 12.1115 19.6851 12.5015 19.2951C12.8915 18.9051 12.8915 18.2751 12.5015 17.8851L7.62148 13.0051H18.7915C19.3415 13.0051 19.7915 12.5551 19.7915 12.0051C19.7915 11.4551 19.3415 11.0051 18.7915 11.0051Z"
              fill="#2F5FAC"
            />
          </svg>
          Back
        </Link>

        <div className="mt-8 md:mt-[100px] mb-8 lg:mb-60 flex flex-col gap-12 items-center shadow-lg rounded-lg p-10">
          <svg
            width="65"
            height="66"
            viewBox="0 0 65 66"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 33C0 15.05 14.55 0.5 32.5 0.5C50.45 0.5 65 15.05 65 33C65 50.95 50.45 65.5 32.5 65.5C14.55 65.5 0 50.95 0 33ZM44.5333 26.9533C44.7333 26.6868 44.878 26.3831 44.959 26.0598C45.0399 25.7366 45.0554 25.4005 45.0045 25.0712C44.9537 24.7419 44.8375 24.4261 44.6628 24.1423C44.4882 23.8586 44.2586 23.6126 43.9875 23.4188C43.7164 23.2251 43.4094 23.0875 43.0844 23.0141C42.7593 22.9407 42.4229 22.933 42.0949 22.9915C41.7669 23.05 41.4539 23.1735 41.1743 23.3547C40.8946 23.5359 40.6541 23.7712 40.4667 24.0467L29.68 39.1467L24.2667 33.7333C23.7927 33.2917 23.1659 33.0513 22.5183 33.0627C21.8706 33.0742 21.2526 33.3366 20.7946 33.7946C20.3366 34.2526 20.0742 34.8706 20.0627 35.5183C20.0513 36.1659 20.2917 36.7927 20.7333 37.2667L28.2333 44.7667C28.49 45.0231 28.7993 45.2206 29.14 45.3455C29.4806 45.4704 29.8443 45.5196 30.2059 45.4898C30.5674 45.46 30.9182 45.3518 31.2338 45.1728C31.5493 44.9939 31.8222 44.7483 32.0333 44.4533L44.5333 26.9533Z"
              fill="#2FAC8E"
            />
          </svg>

          <div className="text-center">
            <h2 className="text-2xl font-medium">
              Thank you for subscribing.{" "}
            </h2>
            <h3 className="text-[#646D89] text-base font-normal">
              Your payment is complete. You can start learning the course now.
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <button
              onClick={() => router.push(`/course/${slug}`)}
              className="w-[263px] lg:w-[321.5px] px-8 py-[18px] border-1 border-[#F47E20] text-[#F47E20] font-bold rounded-xl"
            >
              View Course detail
            </button>

            <button
              onClick={() => router.push(`/mycourse/${slug}`)}
              className="w-[263px] lg:w-[321.5px] px-8 py-[18px] bg-[#2F5FAC] text-white font-bold rounded-xl"
            >
              Start Learning
            </button>
          </div>
        </div>

        <div className="hidden md:block absolute top-10 lg:top-[100px] left-5 lg:left-[102px] w-2 h-2 border-3 border-[#2F5FAC] rounded-full"></div>

        <div className="hidden md:block  absolute top-[67px] lg:top-[159px] left-[-16px] lg:left-[43px] w-7 h-7 rounded-full bg-[#C6DCFF]"></div>

        <div className="hidden md:block  absolute z-[-1] top-[211px] lg:top-[216px] right-[-21px] lg:right-[-28px] w-[74px] h-[74px] rounded-full bg-[#C6DCFF]"></div>

        <svg
          width="51"
          height="51"
          viewBox="0 0 51 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden md:block  absolute top-[53px] lg:top-[126px] right-[-18px] lg:right-28"
        >
          <path
            d="M11.3581 19.9099L37.1499 15.9774L27.6597 40.28L11.3581 19.9099Z"
            stroke="#FBAA1C"
            strokeWidth="3"
          />
        </svg>
      </div>
      <Footer />
    </>
  );
}
