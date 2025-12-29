
import Image from "next/image";


const AboutPage = () => {
  return (
    // PAGE CONTAINER 
    <div className="
      flex flex-col md:flex-row
      items-center md:items-start
      justify-between
      gap-10
      px-6 md:px-16 py-12 md:py-20 
      max-w-6xl mx-auto ">

      {/* TEXT + SIGNATURE */}
      {/* flex-1 tells an element to grow and take up all available space inside its flex container */}
      <div className="flex-1 space-y-5 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold" >Hi, I'm <span className="text-[#E14747]">Miles</span></h1>
        <h2 className="text-xl md:text-3xl text-gray-300">The artist behind KiloBoy</h2>
        <br />
        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          I make art that hits with attitude — bold lines, loud colors, and real emotion. Every design comes from a place of passion and energy you can feel.
        </p>

        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          KiloBoy started as a way for me to express what words couldn't. It's a reflection of the things that inspire me: music, culture, and the people around me. Through art, I get to share moments, moods, and stories that feel real and alive.
        </p>

        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
          At the end of the day, it's about connection. If someone feels something when they see my work, then I've done what I set out to do.
        </p>
        <Image
          src="/images/miles-signature.png"
                    alt="Miles Signature"
                    width={160}
                    height={80}
                    className="mx-auto md:mx-0 mt-8">

        </Image>

      </div>
      
      <div className="flex-1 flex justify-center md:justify-end">
        <Image
        src="/images/miles.jpg"
                  alt="Miles"
                  width={420}
                  height={420}
                  className="rounded-lg object-cover shadow-lg">

        </Image>


      </div>
      
      
    </div>
  );
};

export default AboutPage;
