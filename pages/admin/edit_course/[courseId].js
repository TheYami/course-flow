import EditCourse from "@/components/admin/editCourse";
import useAdminAuth from "@/hooks/useAdminAuth";

const AddCoursePage = () => {
  const { loading } = useAdminAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <EditCourse />;
};

export default AddCoursePage;
