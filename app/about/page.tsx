
import Image from "next/image";


const aboutPage = () => {
  return (
    // PAGE CONTAINER 
    <div className="flex flex-col items-center px-6 py-12 space-y-6">

      {/* TEXT + SIGNATURE */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold" >Hi, I'm <span className="text-[#E14747]">Miles</span></h1>
        <h2 className="text-3xl text-gray-300">The artist behind KiloBoy</h2>
        <br />
        <p>
          I make art that hits with attitude — bold lines, loud colors, and real emotion. Every design comes from a place of passion and energy you can feel.
        </p>

        <p>
          KiloBoy started as a way for me to express what words couldn't. It's a reflection of the things that inspire me: music, culture, and the people around me. Through art, I get to share moments, moods, and stories that feel real and alive.
        </p>

        <p>
          At the end of the day, it's about connection. If someone feels something when they see my work, then I've done what I set out to do.
        </p>
        <Image
          src="/images/miles-signature.png"
                    alt="Miles Signature"
                    width={120}
                    height={60}
                    className="mx-auto mt-4">

        </Image>

      </div>
      
      <div className="image">
        <Image
        src="/images/miles.jpg"
                  alt="Miles"
                  width={400}
                  height={20}
                  className="">

        </Image>


      </div>
      
      
    </div>
  );
};

export default aboutPage;
