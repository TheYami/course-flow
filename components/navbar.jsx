import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white h-14 xl:h-[88px] xl:pt-4">
      <div className="container flex items-center justify-between px-4 py-3 xl:py-9">
        {/* Logo */}
        <a href="#">
          <img
            src="/assets/icon/CourseFlow.png"
            alt="courseflow"
            className="w-[117px] h-[13px] xl:w-[140px] xl:h-4 xl:ml-[60px] "
          />
        </a>

        {/* Navigation Links and Button */}
        <div className="flex items-center gap-4 xl:mr-5">
          {/* Navigation Links */}
          <ul className="flex items-center text-gray-700 font-medium m-0 p-0 gap-3 md:gap-6 xl:w-[265px]">
            <li>
              <a
                href="#"
                className=" text-darkBlue500 font-bold no-underline text-sm md:text-base xl:mr-5"
              >
                Our Courses
              </a>
            </li>
            <li>
              <Link
                href="/login"
                className="bg-[#2F5FAC] text-white px-3 py-2 rounded-xl font-semibold no-underline w-[74px] h-[37px] md:text-base text-sm xl:w-[112px] xl:h-[60px] xl:border-[#2F5FAC] xl:border-8"
              >
                Log in
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
