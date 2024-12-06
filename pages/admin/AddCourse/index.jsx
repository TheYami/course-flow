import { AddCourse } from "@/components/admin/AddCourse";
import SideBar from "@/components/admin/AdminSidebar";
import useAdminAuth from "@/hooks/useAdminAuth";

const AddCoursePage = () => {

  const { loading } = useAdminAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex">
      <SideBar />
      <AddCourse />
    </div>
  );
};

export default AddCoursePage;
