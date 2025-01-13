import Image from "next/image";
import Link from "next/link";
export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden bg-cover bg-center bg-[url('/assets/image/herobg.png')] md:bg-lightblue md:bg-none md:h-auto">
      <div className="hidden md:block md:absolute z-10 md:left-[200px] md:right-[-150px] md:top-[-10px] xl:left-[280px] xl:top-[-20px] xl:right-[-25px] 2xl:left-[700px] 2xl:top-[-100px] overflow-hidden">
        <img
          src="/assets/image/decoratehero02.png"
          alt="overlay decoration"
          className="opacity-100"
        />
      </div>
      <div className=" relative container mx-auto flex flex-col md:flex-row items-center justify-between p-8 text-black md:max-w-screen-md lg:max-w-screen-lg xl:h-[700px] xl:pt-30">
        {/* Text Content */}
        <div className="text-left  md:shrink-0 md:w-1/2 xl:pl-12 xl:ml-5">
          <h1 className="text-4xl font-semibold pt-10 md:text-6xl xl:text-[66px]">
            Best Virtual{" "}
            <span className="block xl:ml-[2px]">Classroom Software</span>
          </h1>
          <p className="mt-4 z-20 font-normal text-fmgray700 w-[330px] xl:w-[603px] xl:text-xl">
            Welcome to Schooler! The one-stop online class management system
            that caters to all your educational needs!
          </p>
          <div className="mt-20">
            <Link
              href="/course"
              className="bg-blue500 text-white mt-10 px-[32px] py-[18px] rounded-xl hover:bg-blue-600 font-bold text-base z-20 h-[60px] gap-[10px] xl:w-[193px] no-underline"
            >
              Explore Courses
            </Link>
          </div>
        </div>

        {/* Decoration Image */}

        <div className="hidden md:inline md:absolute md:z-50 md:left-[-30px] md:top-[10px] xl:top-[70px] xl:left-[-80px] 2xl:left-[-320px]">
          <Image
            src="/assets/icon/circle2.png"
            alt=" blue sphere1"
            width={64}
            height={16}
            className="opacity-100 xl:w-24"
          />
        </div>
        <div className="absolute z-50 hidden md:block md:left-[400px] md:top-[150px] lg:left-[450px] xl:left-[750px] xl:top-[200px]">
          <Image
            src="/assets/icon/cross.png"
            alt="cross"
            width={16}
            height={16}
            className="opacity-100"
          />
        </div>
        <div className="hidden md:inline md:absolute md:z-50 md:left-[220px] md:top-[360px] lg:top-[370px] xl:top-[550px] xl:left-[610px]">
          <Image
            src="/assets/icon/bluering.png"
            alt="blue circle"
            width={16}
            height={16}
            className="opacity-100 xl:w-[26px]"
          />
        </div>
        <div className="absolute z-50 left-[740px] top-[300px] lg:left-[990px] xl:top-[420px] xl:left-[1380px]">
          <Image
            src="/assets/icon/greenring.png"
            alt="green circle"
            width={16}
            height={16}
            className="opacity-100"
          />
        </div>
        <div className="absolute z-50 left-[650px] top-[400px] lg:left-[900px] lg:top-[450px] xl:left-[1250px] xl:top-[600px]">
          <Image
            src="/assets/icon/triangle.png"
            alt="triangle"
            width={32}
            height={32}
            className="opacity-100 xl:w-[50px]"
          />
        </div>

        {/* Image */}
        <div className="hidden md:block relative z-20 xl:right-20 xl:top-9">
          <img
            src="/assets/image/computer.png"
            alt="computer"
            className=" w-full xl:w-[452px] xl:h-[448px]"
          />
        </div>
      </div>
    </section>
  );
}
