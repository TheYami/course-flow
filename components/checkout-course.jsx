import Link from "next/link";
import Image from "next/image";
export default function Checkout() {
  return (
    <section className="h-full relative bg-gradient-to-r from-blue-500 to-blue-400 mt-4 pb-4 flex flex-col items-center lg:flex-row lg:justify-center lg:items-center lg:py-0 lg:px-0 lg:h-[500px] lg:gap-6 lg:mt-0">
      {/* Text and Button */}
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:mb-32 xl:mb-44 2xl:mr-[50px]">
        <h3 className="text-white  mb-0 mt-5 py-4 text-2xl font-normal lg:py-0 xl:text-4xl">
          Want to start learning?
        </h3>
        <Link
          href="/register"
          className="text-[#F47E20] border-1 border-[#F47E20] bg-white px-8 py-3 rounded-xl text-center text-base font-bold lg:mt-4 no-underline"
        >
          Register Here
        </Link>
      </div>

      {/* Image */}
      <img
        src="/assets/image/learning2.png"
        alt="Learning"
        className="w-[328px] h-[298px] mt-6 lg:mt-[80px] lg:w-[592px] lg:h-[448px] lg:ml-[70px] xl:ml-[250px] 2xl:ml-[150px]"
      />
      <Image
        src="/assets/icon/greenring.png"
        alt="green ring under content"
        width={20}
        height={20}
        className="opacity-100 z-20 absolute hidden lg:block lg:top-[410px] lg:left-[300px] xl:left-[550px] 2xl:left-[840px] "
      />
      <Image
        src="/assets/icon/triangle.png"
        alt="triangle right content"
        width={48}
        height={48}
        className="opacity-100 z-20 absolute hidden lg:block lg:top-[110px] lg:left-[950px] lg:sepia xl:left-[1350px] 2xl:left-[1600px]"
      />
    </section>
  );
}
