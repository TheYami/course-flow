import Image from "next/image";
function InstructorCard({ name, role, imageSrc, altText }) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <img
        src={imageSrc}
        alt={altText}
        className="rounded-lg width={600}
        height={400} xl:w-[357px] xl:h-[420px] "
      />
      <div className="text-center">
        <h2 className="font-medium md:text-2xl">{name}</h2>
        <h2 className="text-xl text-blue-400 font-normal md:text-lg">{role}</h2>
      </div>
    </div>
  );
}

export default function Instructor() {
  const instructors = [
    {
      name: "Jane Copper",
      role: "UX/UI Designer",
      imageSrc: "/assets/image/jane.png",
      altText: "UX/UI Designer",
    },
    {
      name: "Esther Howard",
      role: "Program Manager",
      imageSrc: "/assets/image/howard.png",
      altText: "Program Manager",
    },
    {
      name: "Brooklyn Simmons",
      role: "Software Engineer",
      imageSrc: "/assets/image/simmons.png",
      altText: "Software Engineer",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center space-y-6 relative lg:mx-[20px] xl:pt-[40px] xl:gap-5">
      <div className="absolute left-10 top-16 md:left-3 md:top-[550px] xl:top-[630px]">
        <Image
          src="/assets/icon/triangle.png"
          alt="triangle"
          width={64}
          height={64}
          className="opacity-100"
        />
      </div>
      <h1 className="text-2xl font-medium pt-28 lg:pt-0 lg:m-0 xl:text-4xl">
        Our Professional Instructors
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6  md:gap-4 md:mx-5 xl:w-[1180px] xl:h-[506px] xl:gap-0 xl:mx-0">
        {instructors.map((instructor, index) => (
          <InstructorCard
            key={index}
            name={instructor.name}
            role={instructor.role}
            imageSrc={instructor.imageSrc}
            altText={instructor.altText}
          />
        ))}
      </div>
    </section>
  );
}
