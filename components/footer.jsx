export default function Footer() {
  return (
    <footer className="bg-[#183056] py-8">
      <div className="container mx-auto flex flex-col items-start space-y-8 md:flex-row md:justify-between md:items-center md:space-y-0 md:h-32">
        {/* Logo Section */}
        <a href="#" className="md:flex-shrink-0">
          <img
            src="/assets/icon/CourseFlow.png"
            alt="CourseFlow Logo"
            className="w-[140px] h-auto py-2 2xl:ml-14"
          />
        </a>

        {/* Links Section */}
        <div>
          <ul className="space-y-2 m-0 p-0 text-left md:space-y-0 md:flex md:space-x-6 2xl:space-x-[100px]">
            <li>
              <a
                href="/course"
                className="text-[#C8CCDB] no-underline hover:text-blue-400 text-base font-normal"
              >
                All Courses
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[#C8CCDB] no-underline hover:text-blue-400 text-base font-normal"
              >
                Bundle Package
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="flex justify-center space-x-6 2xl:space-x-4 2xl:mr-[70px]">
          {/* Facebook */}
          <a
            href="https://www.facebook.com"
            className="text-white hover:text-blue-400"
          >
            <img
              src="/assets/icon/fb.png"
              alt="Facebook"
              className="w-10 h-10"
            />
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com"
            className="text-white hover:text-blue-400"
          >
            <img
              src="/assets/icon/ig.png"
              alt="Instagram"
              className="w-10 h-10"
            />
          </a>
          {/* Twitter */}
          <a
            href="https://www.twitter.com"
            className="text-white hover:text-blue-400"
          >
            <img
              src="/assets/icon/tw.png"
              alt="Twitter"
              className="w-10 h-10"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
