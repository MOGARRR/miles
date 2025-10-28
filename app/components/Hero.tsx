import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";


const Hero = () => {
  return (
    <div className="text-center relative w-screen h-[95vh] border-b-2 border-slate ">
      <Image
        className="w-screen object-cover blur-[3px]"
        src='/images/StockCake-Floating-Rubber.jpg'
        alt="Rubber duck floating in water"
        fill
        priority 
      />
      <div className="text-5xl absolute inset-x-0 bottom-70 z-0 flex flex-col justify-between text-white">
        <h1>It's</h1>
        <h1>Duck</h1>
        <h1>Season!</h1>
        <Link href={{ pathname: '/store'}} className=" text-2xl text-white btn btn-neutral btn-outline m-5 rounded-sm border-white">
          Shop
        </Link>
      </div>
    </div>
  );
};

export default Hero;
