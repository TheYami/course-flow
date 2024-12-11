import { AddLesson } from "@/components/admin/AddLesson";
import useAdminAuth from "@/hooks/useAdminAuth";

const AddLessonPage = () => {
  const { loading } = useAdminAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  return <AddLesson />;
};

export default AddLessonPage;
