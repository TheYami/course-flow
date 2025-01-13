import Image from "next/image";
export default function Feature() {
  const FeatureBlock = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4">
      <Image
        src={icon}
        alt={title}
        className="w-9 h-9"
        width={48}
        height={48}
      />
      <div className="flex flex-col">
        <h2 className="text-xl font-normal xl:text-2xl">{title}</h2>
        <span className="text-[#646D89] mt-2 xl:text-base">{description}</span>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex justify-center">
        <div className="decorative-image-container relative">
          <Image
            src="/assets/icon/halfsphere.png"
            alt="halfsphere"
            width={48}
            height={48}
            className="opacity-80 absolute left-7 md:hidden  lg:hidden xl:hidden"
          />
          <Image
            src="/assets/icon/partsphere.png"
            alt="partsphere"
            width={48}
            height={48}
            className="opacity-80 w-[20px] h-[20px] absolute z-50 hidden left-7 md:block md:left-[40px] md:top-[-11px] md:-rotate-90 lg:left-[50px] xl:top-[-10px] xl:left-[150px] 2xl:left-[390px]"
          />
          <Image
            src="/assets/icon/circle.png"
            alt="circle top left content"
            width={32}
            height={32}
            className="opacity-100 absolute top-9 left-3/4 md:top-[120px] md:left-[280px] lg:top-[60px] lg:left-[350px] 2xl:left-[750px]"
          />
        </div>
        <section className="flex flex-col items-center justify-center p-3 mt-10 gap-20 w-full md:w-[768px] lg:w-[1024px]  lg:my-20 relative xl:w-[1440px] xl:h-[780px] xl:mb-12 xl:mt-24 2xl:ml-[0px] 2xl:h-[1111px] 2xl:my-0">
          {/* First Feature Block */}
          <div className="flex flex-col md:flex-row items-start w-full space-y-6 md:space-y-0 md:space-x-10 lg:space-x-0 lg:w-[1024px] lg:pl-[45px] lg:gap-5 lg:items-center xl:ml-[0px] xl:h-[400px] xl:w-[1210px] xl:gap-[150px] xl:pl-[25px] relative">
            {/* Image */}
            <Image
              src="/assets/image/featureimage01.png"
              alt="feature1"
              width={600}
              height={400}
              className="w-full md:w-1/2 md:mt-[100px] lg:ml-[0px] lg:mt-0 lg:w-[400px] xl:ml-0 xl:w-[455px] xl:h-[330px] xl:mr-0"
            />
            <div className="absolute md:top-[250px] md:left-[670px] md:w-10 lg:top-[200px] lg:left-[900px] xl:top-[230px] xl:left-[1200px] xl:w-10 z-50 2xl:left-[1300px]">
              <Image
                src="/assets/icon/cross.png"
                alt="cross for lg"
                width={24}
                height={24}
                className="opacity-100"
              />
            </div>
            {/* Title and Feature Blocks */}
            <div className="flex flex-col md:w-1/2 space-y-6 lg:space-y-3 lg:w-1/2 lg:h-[292px] lg:pl-[20px] xl:space-y-10 xl:h-full xl:py-2 xl:w-[547px] xl:pl-0">
              <h1 className="font-medium text-2xl text-left md:text-[23px] lg:w-[400px] lg:text-[26px] xl:text-4xl xl:w-[547px]">
                Learning experience has been enhanced with new technologies
              </h1>
              <div className="flex flex-col space-y-6 xl:space-y-4 xl:w-[500px]">
                <FeatureBlock
                  icon="/assets/icon/secure.png"
                  title="Secure & Easy"
                  description="Duis aute irure dolor in reprehenderit in voluptate velit es se cillum dolore eu fugiat nulla pariatur. Excepteur sint."
                />
                <FeatureBlock
                  icon="/assets/icon/support.png"
                  title="Supports All Students"
                  description="Duis aute irure dolor in reprehenderit in voluptate velit es se cillum dolore eu fugiat nulla pariatur. Excepteur sint."
                />
              </div>
            </div>
          </div>

          <div className="absolute left-80 z-50 md:hidden">
            <Image
              src="/assets/icon/cross.png"
              alt="cross for small"
              width={24}
              height={24}
              className="opacity-100"
            />
          </div>
          <div className="absolute -bottom-10 left-80 md:top-[850px] md:left-[700px] lg:top-[710px] lg:left-[930px] lg:overflow-hidden xl:top-[795px] xl:left-[1250px] 2xl:top-[1100px] 2xl:left-[1200px]">
            <Image
              src="/assets/icon/circle.png"
              alt="circle2 under content"
              width={48}
              height={48}
              className="opacity-100 2xl:w-[85px] "
            />
          </div>

          {/* Second Feature Block */}
          <div className="flex flex-col md:flex-row-reverse items-start w-full space-y-6 md:space-y-0 md:space-x-6  md:gap-10 lg:space-x-0 lg:w-[1024px] lg:ml-[0px] lg:gap-0 lg:items-center xl:pr-[45px] xl:h-[400px] xl:w-[1210px] xl:gap-[138px]">
            {/* Image */}
            <Image
              src="/assets/image/featureimage02.png"
              alt="feature2"
              width={600}
              height={400}
              className="w-full md:w-1/2 md:mt-[100px] lg:mr-[50px] lg:mt-0 lg:w-[400px] xl:ml-0 xl:w-[455px] xl:h-[330px] xl:mr-0 "
            />
            {/* Title and Feature Blocks */}
            <div className="flex flex-col md:w-1/2 space-y-6 lg:space-y-3 lg:w-1/2 xl:space-y-10 xl:h-full xl:py-2 xl:w-[547px]">
              <h1 className="font-medium text-2xl text-left lg:w-[400px] lg:text-[26px] xl:text-4xl xl:w-[547px]">
                Interactions between the tutor and the learners
              </h1>
              <div className="flex flex-col space-y-6 xl:space-y-4 xl:w-[500px]">
                <FeatureBlock
                  icon="/assets/icon/collab.png"
                  title="Purely Collaborative"
                  description="Duis aute irure dolor in reprehenderit in voluptate velit es se cillum dolore eu fugiat nulla pariatur. Excepteur sint."
                />
                <FeatureBlock
                  icon="/assets/icon/support.png"
                  title="Supports All Students"
                  description="Duis aute irure dolor in reprehenderit in voluptate velit es se cillum dolore eu fugiat nulla pariatur. Excepteur sint."
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
