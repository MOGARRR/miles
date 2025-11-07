
import Image from "next/image";


const aboutPage = () => {
  return (
    <div className="page container">

      <div className="page text">
        <h1>Hi, I'm Miles</h1>
        <h2>The artist behind KiloBoy</h2>

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
                    width={50}
                    height={20}
                    className="">

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
