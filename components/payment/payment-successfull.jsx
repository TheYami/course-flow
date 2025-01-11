import Image from "next/image";
import successfullIcon from "@/assets/icons/payment-icons/payment-successfull-icon.svg";
import { useRouter } from "next/router";
import useUserAuth from "@/hooks/useUserAuth";
import axios from "axios";
import { useEffect } from "react";

export default function PaymentSuccessfullCard() {
  const router = useRouter();
  const { courseId } = router.query;
  const { userData, loading } = useUserAuth();
  const [apiCalled, setApiCalled] = useState(false);

  const handleViewCourseDetail = () => {
    if (courseId) {
      router.push(`/course/${courseId}`);
    }
  };

  const handleStartLearning = () => {
    if (courseId) {
      router.push(`/mycourse/${courseId}`);
    }
  };

  useEffect(() => {
    if (userData && courseId && !apiCalled) {
      const manageDatabase = async () => {
        try {
          setApiCalled(true);
          const createSubLessonProgressResponse = await axios.post(
            `/api/createSublessonProgress?courseId=${courseId}&&user_id=${userData.id}`,
            null
          );
          const createSubmissionResponse = await axios.post(
            `/api/course-learning/createSubmission?courseId=${courseId}`,
            { user: userData }
          );
        } catch (error) {
          console.error("Error making API calls:", error);
        }
      };
      manageDatabase();
    }
  }, [userData, courseId]);

  return (
    <div className="payment-successfull-card flex flex-col items-center rounded-[8px] gap-8 p-10 shadow-[4px_4px_24px_0px_rgba(0,0,0,0.08)] xl:w-[739px]">
      <div className="alert-part flex flex-col gap-6 items-center justify-center">
        <Image src={successfullIcon} />
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="text-center text-[24px] font-[500]">
            Thank you for subscribing.
          </h1>
          <p className="text-center text-[#646D89]">
            Your payment is complete. You can start learning the course now.
          </p>
        </div>
      </div>
      <nav className="navigation-part w-full flex flex-col items-center justify-center gap-4 xl:flex-row">
        <div
          onClick={handleViewCourseDetail}
          className="w-full text-center text-[#F47E20] font-[500] border-[1px] border-[#F47E20] px-8 py-[18px] rounded-[12px]"
          type="button"
        >
          View Course detail
        </div>
        <div
          onClick={handleStartLearning}
          className="w-full text-center text-white bg-[#2F5FAC] font-[500] px-8 py-[18px] rounded-[12px]"
          type="button"
        >
          Start Learning
        </div>
      </nav>
    </div>
  );
}
