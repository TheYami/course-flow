import useAdminAuth from "@/hooks/useAdminAuth";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/admin/AdminSidebar";
import EditPromoCodepage from "@/components/admin/editPromoCode";

const AddLessonPage = () => {
  const { loading } = useAdminAuth();
  const router = useRouter();
  const { promoCodeId } = router.query;

  if (loading) {
    return (
      <div className="absolute inset-0 bg-[#FFFFFF] bg-opacity-20 flex items-center justify-center z-10">
        <div className="loader border-t-4 border-[#2F5FAC] w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <EditPromoCodepage promoCodeId={promoCodeId} />
    </div>
  );
};

export default AddLessonPage;