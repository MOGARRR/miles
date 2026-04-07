
import Image from "next/image";


const AboutPage = () => {
  return (
    // PAGE CONTAINER 
    <div className="
      max-w-7xl mx-auto
      px-6 md:px-16 py-24
      ">


      {/* TEXT + SIGNATURE */}
      <div className="space-y-5 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold" >Meet <span className="text-[#E14747]">Miles</span></h1>
        <h2 className="text-xl md:text-3xl text-gray-300">The artist behind KiloBoy</h2>

        <Image
          src="/images/miles.jpg"
                    alt="Miles"
                    width={400}
                    height={480}
                    className="
                      float-right 
                      ml-10 mt-2 
                      rounded-lg 
                      object-cover 
                      shadow-lg">
        </Image>
        <br />
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          Miles Antwi is an artist driven by expression, identity, and the power of visual storytelling. His work blends bold style, character, and emotion, creating pieces that feel alive with personality and intention. Each artwork is an extension of his inner world—where imagination, culture, and individuality collide.
        </p>

        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          For Miles, art is more than creation—it's transformation. It's his way of shaping himself into a better man, channeling growth, discipline, and self-reflection through every piece he creates. At the same time, his work carries a simple but powerful purpose: to put a smile on someone's face. Whether it's through a striking visual, a relatable character, or an unexpected detail, he aims to bring a moment of joy and connection to those who experience his art.
        </p>

        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          With a deep passion for creating, Miles approaches every piece as an opportunity to explore new ideas while staying true to a signature edge that defines his style. His art doesn’t just aim to be seen—it aims to be felt. Whether through bold compositions or subtle details, his work invites viewers to connect, interpret, and find their own meaning within it.
        </p>

         <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          Beyond the canvas, Miles is committed to growth—both as an artist and as a person. He continues to evolve his craft, pushing boundaries and refining his voice, with the goal of building a body of work that resonates and stands the test of time.
        </p>

         <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          This is more than art—it's a reflection of perspective, energy, growth, and a journey still unfolding.
        </p>


        <Image
          src="/images/new-signature2.png"
                    alt="Miles Signature"
                    width={240}
                    height={160}
                    className="clear-both mt-8">

        </Image>

      </div>
      
    </div>
  );
};

export default AboutPage;
