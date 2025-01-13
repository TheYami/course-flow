import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import supabase from "@/lib/supabase";
import profilePicture from "@/assets/images/photo.svg";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const menuRef = useRef(null);
  const svgRef = useRef(null);

  const [boxMenu, setBoxMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);

  const toggleMenu = () => {
    setBoxMenu(!boxMenu);
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); //email auth

      if (!session) {
        setUser(null);
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single(); // ดึงข้อมูลของแถวที่ตรงกับอีเมลเดียว

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUserData(data); // เก็บข้อมูลผู้ใช้จากฐานข้อมูล
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      svgRef.current &&
      !svgRef.current.contains(event.target)
    ) {
      setBoxMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  return (
    <nav
      className="bg-white h-14 xl:h-[88px] xl:pt-4 shadow-md
    "
    >
      <div className="container flex items-center justify-between px-4 py-3 xl:py-9">
        {/* Logo */}
        <a href="/homepage">
          <img
            src="/assets/icon/CourseFlow.png"
            alt="courseflow"
            onClick={() => {
              router.push("/");
            }}
            className="w-[117px] h-[13px] xl:w-[140px] xl:h-4 xl:ml-[60px] "
          />
        </a>

        {/* Navigation Links and Button */}
        <div>
          {/* Navigation Links */}
          <ul className="flex items-center text-gray-700 font-medium m-0 p-0 gap-2 lg:gap-8">
            <li>
              <Link
                href="/course"
                className=" text-darkBlue500 font-bold no-underline text-sm md:text-base lg:pr-6"
              >
                Our Courses
              </Link>
            </li>

            {user === null ? (
              <li>
                <Link
                  href="/login"
                  className="bg-[#2F5FAC] text-white px-3 py-2 rounded-xl font-semibold no-underline w-[74px] h-[37px] md:text-base text-sm xl:w-[112px] xl:h-[60px] xl:border-[#2F5FAC] xl:border-8"
                >
                  Log in
                </Link>
              </li>
            ) : (
              <li>
                <div className="flex gap-3 items-center relative">
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                    {userData && (
                      <Link href={"/profile"}>
                        <Image
                          src={
                            userData.profile_picture
                              ? userData.profile_picture
                              : profilePicture || "/default-profile.png"
                          }
                          alt="Profile picture"
                          width={60}
                          height={60}
                          className="object-cover w-[40px] h-[40px]"
                        />
                      </Link>
                    )}
                  </div>

                  <h3 className="font-normal m-0 text-base text-[#424C6B] hidden lg:block">
                    {userData.name}
                  </h3>

                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer"
                    onClick={toggleMenu}
                    ref={svgRef}
                  >
                    <path
                      d="M0 0.500092L5 5.50009L10 0.500092H0Z"
                      fill="#646D89"
                    />
                  </svg>

                  {boxMenu && (
                    <div
                      ref={menuRef}
                      className="rounded-lg absolute top-16 left-[-106px] lg:top-12 md:left-[-95px] lg:left-[45px] z-50 pt-2 bg-white w-[198px] shadow-lg"
                    >
                      <ul className="flex flex-col gap-2 py-2 px-3.5">
                        <li
                          className="cursor-pointer hover:bg-gray-300 p-1 rounded-md"
                          onClick={() => router.push("/profile")}
                        >
                          <div className="flex gap-3 items-center">
                            <svg
                              width="12"
                              height="15"
                              viewBox="0 0 12 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.50031 3.5C8.50031 4.16304 8.23692 4.79893 7.76808 5.26777C7.29924 5.73661 6.66335 6 6.00031 6C5.33727 6 4.70138 5.73661 4.23254 5.26777C3.7637 4.79893 3.50031 4.16304 3.50031 3.5C3.50031 2.83696 3.7637 2.20107 4.23254 1.73223C4.70138 1.26339 5.33727 1 6.00031 1C6.66335 1 7.29924 1.26339 7.76808 1.73223C8.23692 2.20107 8.50031 2.83696 8.50031 3.5V3.5ZM1.00098 12.912C1.0224 11.6002 1.55854 10.3494 2.49376 9.42936C3.42899 8.50929 4.68837 7.99365 6.00031 7.99365C7.31225 7.99365 8.57163 8.50929 9.50686 9.42936C10.4421 10.3494 10.9782 11.6002 10.9996 12.912C9.43124 13.6312 7.72574 14.0023 6.00031 14C4.21631 14 2.52298 13.6107 1.00098 12.912Z"
                                stroke="#8DADE0"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <h2 className="text-[#646D89]  font-medium m-0 text-sm">
                              Profile
                            </h2>
                          </div>
                        </li>

                        <li
                          onClick={() => router.push("/mycourse")}
                          className="cursor-pointer hover:bg-gray-300 p-1 rounded-md"
                        >
                          <div className="flex gap-3 items-center">
                            <svg
                              width="14"
                              height="13"
                              viewBox="0 0 14 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 2.52801C5.90107 1.54224 4.47626 0.997968 3 1.00001C2.29867 1.00001 1.62533 1.12001 1 1.34134V10.8413C1.64241 10.6147 2.31878 10.4993 3 10.5C4.53667 10.5 5.93867 11.078 7 12.028M7 2.52801C8.09889 1.54219 9.52372 0.997905 11 1.00001C11.7013 1.00001 12.3747 1.12001 13 1.34134V10.8413C12.3576 10.6147 11.6812 10.4993 11 10.5C9.52374 10.498 8.09893 11.0422 7 12.028M7 2.52801V12.028"
                                stroke="#8DADE0"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <h2 className="text-[#646D89]  font-medium m-0 text-sm">
                              My Courses
                            </h2>
                          </div>
                        </li>

                        <li
                          className="cursor-pointer hover:bg-gray-300 p-1 rounded-md"
                          onClick={() => {
                            router.push("/my-assignment");
                          }}
                        >
                          <div className="flex gap-3 items-center">
                            <svg
                              width="12"
                              height="15"
                              viewBox="0 0 12 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.56667 2.05733C5.52333 2.19733 5.5 2.346 5.5 2.5C5.5 2.776 5.724 3 6 3H9C9.13261 3 9.25979 2.94732 9.35355 2.85355C9.44732 2.75979 9.5 2.63261 9.5 2.5C9.50005 2.34994 9.47757 2.20072 9.43333 2.05733M5.56667 2.05733C5.66135 1.75113 5.85158 1.48329 6.10951 1.29303C6.36743 1.10276 6.67949 1.00008 7 1H8C8.67467 1 9.24467 1.44533 9.43333 2.05733M5.56667 2.05733C5.316 2.07267 5.06667 2.09067 4.81733 2.11067C4.06333 2.17333 3.5 2.81533 3.5 3.572V5M9.43333 2.05733C9.684 2.07267 9.93333 2.09067 10.1827 2.11067C10.9367 2.17333 11.5 2.81533 11.5 3.572V10.5C11.5 10.8978 11.342 11.2794 11.0607 11.5607C10.7794 11.842 10.3978 12 10 12H8.5M3.5 5H1.25C0.836 5 0.5 5.336 0.5 5.75V13.25C0.5 13.664 0.836 14 1.25 14H7.75C8.164 14 8.5 13.664 8.5 13.25V12M3.5 5H7.75C8.164 5 8.5 5.336 8.5 5.75V12M3 10L4 11L6 8.5"
                                stroke="#8DADE0"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <h2 className="text-[#646D89] font-medium m-0 text-sm">
                              My Assignments
                            </h2>
                          </div>
                        </li>

                        <li
                          className="cursor-pointer hover:bg-gray-300 p-1 rounded-md"
                          onClick={() => router.push("/wishlist")}
                        >
                          <div className="flex gap-3 items-center">
                            <svg
                              width="14"
                              height="13"
                              viewBox="0 0 14 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.65311 0.832678C6.6813 0.763898 6.72932 0.705061 6.79105 0.66365C6.85279 0.62224 6.92544 0.600128 6.99977 0.600128C7.07411 0.600128 7.14676 0.62224 7.2085 0.66365C7.27023 0.705061 7.31825 0.763898 7.34644 0.832678L8.76311 4.24001C8.78963 4.30377 8.83322 4.35897 8.88909 4.39955C8.94496 4.44013 9.01094 4.46451 9.07977 4.47001L12.7584 4.76468C13.0911 4.79134 13.2258 5.20668 12.9724 5.42334L10.1698 7.82468C10.1174 7.86947 10.0784 7.92782 10.057 7.99331C10.0356 8.05881 10.0326 8.12894 10.0484 8.19601L10.9051 11.786C10.9223 11.858 10.9178 11.9335 10.8921 12.003C10.8665 12.0725 10.8208 12.1328 10.7609 12.1763C10.7009 12.2198 10.6295 12.2446 10.5555 12.2475C10.4815 12.2504 10.4083 12.2313 10.3451 12.1927L7.19511 10.2693C7.13627 10.2335 7.06868 10.2145 6.99977 10.2145C6.93086 10.2145 6.86328 10.2335 6.80444 10.2693L3.65444 12.1933C3.59128 12.232 3.51808 12.2511 3.44408 12.2482C3.37008 12.2452 3.29861 12.2205 3.23869 12.177C3.17877 12.1334 3.13308 12.0731 3.10741 12.0037C3.08174 11.9342 3.07722 11.8587 3.09444 11.7867L3.95111 8.19601C3.967 8.12894 3.96408 8.05879 3.94267 7.99328C3.92126 7.92776 3.8822 7.86942 3.82977 7.82468L1.02711 5.42334C0.970984 5.37509 0.930382 5.31131 0.910408 5.24003C0.890434 5.16876 0.89198 5.09317 0.914852 5.02278C0.937724 4.95238 0.980901 4.89031 1.03895 4.84439C1.097 4.79847 1.16734 4.77073 1.24111 4.76468L4.91978 4.47001C4.98861 4.46451 5.05459 4.44013 5.11046 4.39955C5.16633 4.35897 5.20992 4.30377 5.23644 4.24001L6.65311 0.833344V0.832678Z"
                                stroke="#8DADE0"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <h2 className="text-[#646D89]  font-medium m-0 text-sm">
                              My Wishlist
                            </h2>
                          </div>
                        </li>
                      </ul>

                      <div
                        className="border-t border-[#E4E6ED] cursor-pointer px-2 hover:bg-gray-300 rounded-md"
                        onClick={handleLogout}
                      >
                        <div className="flex gap-3 items-center px-3.5 py-3">
                          <svg
                            width="14"
                            height="13"
                            viewBox="0 0 14 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.66667 9.1665V9.83317C7.66667 10.3636 7.45595 10.8723 7.08088 11.2474C6.70581 11.6225 6.1971 11.8332 5.66667 11.8332H3C2.46957 11.8332 1.96086 11.6225 1.58579 11.2474C1.21071 10.8723 1 10.3636 1 9.83317V3.1665C1 2.63607 1.21071 2.12736 1.58579 1.75229C1.96086 1.37722 2.46957 1.1665 3 1.1665H5.66667C6.1971 1.1665 6.70581 1.37722 7.08088 1.75229C7.45595 2.12736 7.66667 2.63607 7.66667 3.1665V3.83317M10.3333 9.1665L13 6.49984L10.3333 9.1665ZM13 6.49984L10.3333 3.83317L13 6.49984ZM13 6.49984H3.66667H13Z"
                              stroke="#646D89"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>

                          <h2 className="text-[#646D89]  font-medium m-0 text-sm">
                            Log out
                          </h2>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
