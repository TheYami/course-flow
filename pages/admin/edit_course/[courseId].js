import EditCourse from "@/components/admin/EditCourse";
import useAdminAuth from "@/hooks/useAdminAuth";

const EditCoursePage = () => {
  const { loading } = useAdminAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <EditCourse />;
};

export default EditCoursePage;
