import useAdminAuth from "@/hooks/useAdminAuth";

export function ErrorEditCoursePage() {
  const { loading } = useAdminAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" absolute inset-0 bg-[#FFFFFF] bg-opacity-80 flex flex-col items-center justify-center z-10">
      <h1 className=" text-[5rem] text-[#5483D0]">Error 404 Page Not Found</h1>
      <span>somthing worng with your url !</span>
    </div>
  );
}

export default ErrorEditCoursePage;
