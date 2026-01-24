import Link from "next/link";
import LinkButton from "./ui/LinkButton";

const CallToAction = () => {
  return (

    <section className="
      bg-gradient-to-l from-[#1C1C21] to-[#46403F]
      py-28
      "
    >
      <div className="
        max-w-7xl mx-auto
        px-6 md:px-16
        "
      >

        <div className="flex flex-col
          items-center
          text-center
          gap-8
          mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold">
            Ready to Own a Piece?
          </h1>

          <p className="text-base md:text-xl max-w-2xl">
            Browse the full collection or request a custom artwork tailored to your vision. Every piece tells a story.
          </p>

        </div>

        <div className="
          flex flex-col
          items-center
          gap-4
          md:flex-row
          md:justify-center"
        >
          <LinkButton href="/store">
            EXPLORE GALLERY
          </LinkButton>

          <LinkButton 
            href="/store" 
            variant="secondary" 
            className="border-white"
          >
            CUSTOM REQUEST
          </LinkButton>

        </div>
        
      

      </div>

    </section>
    
  )
};

export default CallToAction;
