import useAdminAuth from "@/hooks/useAdminAuth";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AddcoursePageEditLesson from "@/components/admin/AddCoursePageEditLesson";

const AddCoursePageAddLessonPage = () => {
  const { loading } = useAdminAuth();
  const router = useRouter();

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
      <AddcoursePageEditLesson />
    </div>
  );
};

export default AddCoursePageAddLessonPage;
