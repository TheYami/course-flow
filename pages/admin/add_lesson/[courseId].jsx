import { AddLesson } from "@/components/admin/AddLesson";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AddLessonPage = () => {
  const { loading } = useAdminAuth();
  const router = useRouter();
  const { courseId } = router.query;

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
      <AddLesson courseId={courseId} />
    </div>
  );
};

export default AddLessonPage;
