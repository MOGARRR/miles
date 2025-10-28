import React from "react";
import Image from "next/image";
// /StockCake-Floating-Rubber.jpg

const aboutPage = () => {
  return (
    <>
      <div className="text-center relative w-screen h-[60vh] border-b-2 border-slate ">
        <Image
          className="w-screen object-cover blur-[2px]"
          src={"/images/Classy-Rubber-Hat-Duck.jpeg"}
          alt=""
          fill
        />
        <div className="text-5xl absolute inset-x-0 bottom-70 z-0 flex flex-col justify-between text-white">
          <h1>About us</h1>
        </div>
      </div>
      <div className="bg-slate-500 p-4 border-b-2 border-slate ">
        <p className="text-2xl text-center p-4 m-3">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Necessitatibus, distinctio odio. Aperiam illum laboriosam mollitia
          dolore nostrum saepe nesciunt voluptatum adipisci impedit quam
          reiciendis, magni fuga consequatur maiores accusantium illo.
        </p>
        <div className="text-center relative h-[30vh] mt-4 ">
          <Image
            className="w-1/4 object-cover"
            src="/images/StockCake-Floating-Rubber.jpg"
            alt=""
            fill
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl m-5 border-b-2 pb-4">Our story</h1>
          <p className="text-xl">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Necessitatibus, distinctio odio. Aperiam illum laboriosam mollitia
            dolore nostrum saepe nesciunt voluptatum adipisci impedit quam
            reiciendis, magni fuga consequatur maiores accusantium illo? Lorem
            ipsum dolor, sit amet consectetur adipisicing elit. Sunt consectetur
            saepe a! Architecto perspiciatis, ratione nam enim voluptate debitis
            dolor aut sunt rerum. Nulla maiores ut similique officiis
            repudiandae adipisci.
          </p>
        </div>
      </div>
    </>
  );
};

export default aboutPage;
