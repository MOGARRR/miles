import React from "react";
import LinkButton from "./ui/LinkButton";

const Hero = () => {
  return (
    <section className="
      bg-gradient-to-l from-[#46403F] to-[#26262B]
      text-white
      py-24
      ">
      
      {/* CONTENT SECTION */}
      <div className="
        max-w-7xl mx-auto
        px-6 md:px-16
        flex flex-col 
        items-start text-left
        space-y-6">


        <h1 className="text-4xl md:text-6xl font-bold text-kilored ">
          Bold Art. Fierce Style.
        </h1>

        <p className="
          text-lg md:text-2xl 
          mt-6
          text-kilotextlight">
          Pop culture-inspired artworks that speak to the streets.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <LinkButton href="/store">
            SHOP NOW
          </LinkButton>

          <LinkButton href="/customArtwork" variant="secondary">
            REQUEST CUSTOM
          </LinkButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;