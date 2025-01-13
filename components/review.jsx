import { useState } from "react";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";
const cards = [
  {
    id: 1,
    title: "Chill Guy",
    description:
      "Start with something simple and small, then expand over time. If people call it a ‘toy’ you’re definitely onto something. If you’re waiting for encouragement from others, you’re doing it wrong. By the time people think an idea is good, it’s probably too late.",
    imageUrl: "/assets/image/chillguy.jpeg",
  },
  {
    id: 2,
    title: "Chill Girl",
    description:
      "Start with something simple and small, then expand over time. If people call it a ‘toy’ you’re definitely onto something. If you’re waiting for encouragement from others, you’re doing it wrong. By the time people think an idea is good, it’s probably too late.",
    imageUrl: "/assets/image/chillgirl.jpg",
  },
  {
    id: 3,
    title: "Hacker Man",
    description:
      "Start with something simple and small, then expand over time. If people call it a ‘toy’ you’re definitely onto something. If you’re waiting for encouragement from others, you’re doing it wrong. By the time people think an idea is good, it’s probably too late.",
    imageUrl: "/assets/image/hackerman.jpg",
  },
];
export default function Review() {
  const settings = {
    centerMode: true, // เปิดโหมด Center
    centerPadding: "30%", // ระยะ padding ซ้าย-ขวา
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // จำนวนสไลด์ที่แสดง
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "30%", // ลด Padding อีก
          centerMode: true,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "23%", // ลด Padding อีก
          centerMode: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "12%", // ลด Padding อีก
          centerMode: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "32%", // ลด Padding เมื่อหน้าจอแคบลง
          centerMode: true,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "10%", // ลด Padding เมื่อหน้าจอแคบลง
          centerMode: true,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "5%", // ลด Padding เมื่อหน้าจอแคบลง
          centerMode: true,
        },
      },
    ],
  };
  return (
    <>
      <div className="">
        <div className="relative w-full">
          <h1 className="text-center pt-20 text-2xl lg:text-4xl font-medium">
            Our Graduates
          </h1>
          <div className="absolute z-50 right-0 bottom-[10px]">
            <Image
              src="/assets/icon/partsphere.png"
              alt="sphere"
              width={24}
              height={24}
              className="opacity-100"
            />
          </div>
          <div className="absolute z-50 right-8 top-[105px]">
            <Image
              src="/assets/icon/circle.png"
              alt="circle"
              width={16}
              height={16}
              className="opacity-100"
            />
          </div>
          <div className="absolute z-10 top-[750px] left-[10px] lg:top-[550px] lg:left-[100px]">
            <Image
              src="/assets/icon/cross.png"
              alt="cross"
              width={24}
              height={24}
              className="opacity-100"
            />
          </div>
        </div>

        <div className="slider-container mx-0 w-full px-0 mb-0 h-[660px] lg:h-[500px]">
          <Slider {...settings}>
            {cards.map((card) => (
              <div
                key={card.id}
                className="p-2 relative mt-5 lg:p-0 md:left-40"
              >
                <div className="bg-blue-100 rounded-lg overflow-hidden flex flex-col items-center justify-center lg:flex lg:flex-row lg:items-center  w-[330px] lg:w-[578px] lg:h-[311px] lg:gap-6 h-[560px] mb-0 md:px-6 md:h-[560px] md:w-[250px] lg:pl-20 ">
                  <div className="absolute top-[520px] right-4 z-10 md:top-[530px] md:right-10 lg:top-[270px] lg:right-[220px] lg:w-[52px] lg:h-[36px] 2xl:right-[250px]">
                    <Image
                      src="/assets/icon/quotemarkright.png"
                      alt="quotemark"
                      layout="responsive"
                      width={40}
                      height={40}
                      className="opacity-100"
                    />
                  </div>
                  <div className="absolute w-12 h-12 z-10 top-[-25px] left-[70px] lg:top-[6px] lg:left-[-150px] lg:w-[80px] lg:h-[57px]">
                    <Image
                      src="/assets/icon/quotemarkleft.png"
                      alt="quotemark"
                      layout="responsive"
                      width={48}
                      height={48}
                      className="opacity-100"
                    />
                  </div>
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    width={500}
                    height={300}
                    className="object-cover w-[248px] h-[298px] md:w-[200px] md:h-[240px] -mt-10 lg:absolute lg:left-[-150px] lg:top-[80px]"
                  />
                  <div className="px-10 md:px-0">
                    <h3 className="text-xl font-normal text-[#2F5FAC] mb-0 lg:mb-4 mt-3 lg:mt-0">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 m-0 lg:w-[450px]">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}
