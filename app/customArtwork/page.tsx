import Image from "next/image";
import CustomForm from "../components/CustomForm";
import Faq from "../components/Faq";

const CustomArtworkPage = () => {

  const images = [
    "/images/custom-artwork1.jpg",
    "/images/custom-artwork2.jpg",
    "/images/custom-artwork3.jpg",
  ]; 

  return (

    <section className=""
    >

      {/* HERO  */}
      <div className="bg-kilodarkgrey py-24">
        <div className="
          max-w-7xl mx-auto
          px-6 md:px-16 
          text-center"
        >
            <h1 className="text-4xl md:text-6xl font-bold text-kilored">
              Custom Artwork
            </h1>

            <p className="text-base md:text-lg text-gray-200 max-w-[800px] mx-auto mt-8"> 
              Bring your vision to life with a personalized KiloBoy piece. Whether it's your favorite athlete, character, or moment — let's create something iconic together.
            </p>
        </div>
      </div>
      
      
      {/* CUSTOM FORM */}
      <CustomForm />

      {/* CUSTOM WORK INSPIRATION */}
      <div className="bg-kilodarkgrey" >
        <div className="
          max-w-7xl mx-auto
          px-6 md:px-16 py-16
          "
        >
          {/* TEXT */}
          <div className="
            max-w-3xl mx-auto
            text-center 
            flex flex-col 
            mb-16
            "
          >
            
            <h2 className="text-3xl mb-10 text-kilored"> 
              Custom work inspiration
            </h2>
            <p className=" text-base text-kilotextgrey"> 
              Check out some custom pieces ideas to see what's possible. From NBA legends to comic book heroes, we bring your favorite icons to life.
            </p>

          </div>
          
          {/* IMAGES */}
          <div className="
            grid grid-cols-1 md:grid-cols-3
            gap-4 mt-6">
            {images.map((src, index) => (
              <div key={index} className="relative w-full aspect-square"> 
                <Image
                  src={src}
                  alt={`Custom artwork inspiration ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="">
        <Faq />
      </div>
      
    </section>
  )
}

export default CustomArtworkPage;