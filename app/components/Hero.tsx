import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";


const Hero = () => {
  return (
    <section className="
      bg-gradient-to-l from-[#46403F] to-[#26262B]
      text-white
      py-20
      ">
      
      {/* CONTENT SECTION */}
      <div className="
        max-w-7xl mx-auto
        px-6 md:px-16
        flex flex-col 
        items-start text-left
        space-y-6">

        <h1 className="text-4xl md:text-6xl font-bold text-[#E14747] ">
          Bold Art. Fierce Style.
        </h1>

        <h2 className="text-lg md:text-3xl max-w-2xl leading-relaxed">
          Pop culture-inspired artworks that speak to the streets.
        </h2>


        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {/* RED BUTTON */}
          <Link
            href="/store"
            className="
              bg-[#E14747] text-white text-center
              px-6 py-2 text-sm
              md:px-8 md:py-3 md:text-base
              rounded-md font-semibold 
              hover:bg-[#B53535] transition-colors duration-200"
          >
            SHOP NOW
          </Link>

          {/* BLACK BUTTON */}
          <Link
            href="/customArtwork"
            className="
              bg-[#1C1C21] text-white text-center
              px-6 py-2 text-sm
              md:px-8 md:py-3 md:text-base
              rounded-md font-semibold 
              hover:bg-[#0f0f11] transition-colors duration-200"
          >
            REQUEST CUSTOM
          </Link>

        </div>
      </div>
    </section>
  );
};

export default Hero;
