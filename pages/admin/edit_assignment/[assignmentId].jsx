import Sidebar from "@/components/admin/AdminSidebar";
import useAdminAuth from "@/hooks/useAdminAuth";
import EditAssignment from "@/components/admin/EditAssignment";

const EditAssignmentPage = () => {
  const { loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="absolute inset-0 bg-[#FFFFFF] bg-opacity-20 flex items-center justify-center z-10">
        <div className="loader border-t-4 border-[#2F5FAC] w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar/>
      <EditAssignment />
    </div>
  );
};

export default EditAssignmentPage;
