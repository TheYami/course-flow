export default function StickyDesktop({
  userData,
  inProgressCourses,
  completedCourses,
}) {
  return (
    <div className="desktop-sticky py-8 hidden xl:block xl:sticky xl:top-24 xl:h-full w-full xl:w-[357px] bg-white rounded-xl shadow-md ">
      <div className="profile  flex flex-col justify-center items-center gap-6">
        <img
          src={userData.profile_picture}
          alt={userData.name}
          className="xl:h-[120px] xl:w-[120px] rounded-full"
        />
        <div className="text-[#424C6B] text-[24px]">{userData.name}</div>
      </div>

      <div className="status h-[134px] flex items-center gap-4 justify-evenly mt-4 mx-4 bg-white">
        <div className="in-progress w-[142.5px] text-[#646D89] text-[16px] bg-[#F1F2F6] rounded-[8px] flex flex-col gap-2 p-4">
          Course Inprogress
          <div className="text-black text-[20px]">
            {inProgressCourses.length}
          </div>
        </div>
        <div className="complete w-[142.5px] text-[#646D89] text-[16px] bg-[#F1F2F6] rounded-[8px] flex flex-col gap-2 p-4">
          Course Complete
          <div className="text-black text-[20px]">
            {completedCourses.length}
          </div>
        </div>
      </div>
    </div>
  );
}
