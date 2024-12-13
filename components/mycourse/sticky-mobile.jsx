export default function StickyMobile({
  userData,
  inProgressCourses,
  completedCourses,
}) {
  return (
    <div className="mobile-sticky xl:hidden fixed bottom-[-2px] left-0 right-0 z-20 p-4 bg-white flex flex-col gap-2 shadow-xl">
      <div className="header flex items-center gap-3">
        <img
          src={userData.profile_picture}
          alt={userData.name}
          className="h-10 w-10 rounded-full"
        />
        <div className="text-[#424C6B]">{userData.name}</div>
      </div>
      <div className="status flex items-center justify-between bg-white">
        <div className="in-progress text-[#646D89] text-[12px] bg-[#F1F2F6] px-4 py-1 rounded-[8px] flex items-center gap-2">
          Course Inprogress
          <div className="text-black text-[20px]">
            {inProgressCourses.length}
          </div>
        </div>
        <div className="complete text-[#646D89] text-[12px] bg-[#F1F2F6] px-4 py-1 rounded-[8px] flex items-center gap-2">
          Course Complete
          <div className="text-black text-[20px]">
            {completedCourses.length}
          </div>
        </div>
      </div>
    </div>
  );
}
