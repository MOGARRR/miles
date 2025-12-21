import Link from "next/link";

const CallToAction = () => {
  return (
    <div className="max-w-7xl mx-auto">

      <div className="p-8">
        <h1 className="text-2xl font-semibold">Ready to Own a Piece?</h1>
        <p>Browse the full collection or request a custom artwork tailored to your vision. Every piece tells a story.</p>
      </div>

      <div className=" flex justify-center gap-4 m-4 p-4 ">
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
  )
};

export default CallToAction;
