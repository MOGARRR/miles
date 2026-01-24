import Link from "next/link";

const CallToAction = () => {
  return (

    <section className="
      bg-gradient-to-l from-[#1C1C21] to-[#46403F]"
    >
      <div className="
        max-w-7xl mx-auto
        px-6 md:px-16
      ">

        <div className="py-8">
          <h1 className="text-3xl md:text-5xl font-bold">Ready to Own a Piece?</h1>
          <p>Browse the full collection or request a custom artwork tailored to your vision. Every piece tells a story.</p>
        </div>

        <div className=" flex justify-center gap-4 p-4 ">
          <Link 
            href="/store"
            className="
              inline-block
              px-4 py-2
              border
              rounded
              text-sm
              hover:underline"
          >
            Explore Gallery
          </Link>

          <Link 
            href="/customArtwork"
            className="
              inline-block
              px-4 py-2
              border
              rounded
              text-sm
              hover:underline"
          >
            Custom Request
          </Link>

        </div>
        
      

      </div>

    </section>
    
  )
};

export default CallToAction;
