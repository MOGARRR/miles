import Image from "next/image";
import CustomForm from "../components/CustomForm";
import Faq from "../components/Faq";

const CustomArtworkPage = () => {

  const images = [
    "/images/custom-artwork1.jpg",
    "/images/custom-artwork2.jpg",
    "/images/custom-artwork3.jpg",
  ];

  const customOptionLabels = [
    "Original Hand-Painted Artwork",
    "Personalized Portraits",
    "Custom Canvas Pieces",
    "Specialty Prints",
    "Commissioned Concept Artwork",
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
    
            Custom artwork and made-to-order art prints tailored to your vision, in a unique concept brought to life in my signature style. <br/><br/>

            Each custom piece is created with intention, creativity, and close attention to detail to ensure it reflects both your idea and my artistic vision.
            </p>
        </div>
      </div>
      
      
  
      

      {/* CUSTOM WORK INSPIRATION */}
      <div  >
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
              Inspiration
            </h2>
            <p className="mx-auto mt-6 flex max-w-2xl flex-wrap items-baseline justify-center gap-x-2 gap-y-1.5 text-sm leading-snug text-kilotextgrey md:text-base md:leading-relaxed">
              {customOptionLabels.map((label, i) => (
                <span key={label} className="contents">
                  {i > 0 && (
                    <span className="select-none text-kilored/50" aria-hidden>
                      •
                    </span>
                  )}
                  <span>{label}</span>
                </span>
              ))}
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

         

      <div className="bg-kilodarkgrey">
        <Faq />
      </div>

       {/* CUSTOM FORM */}
       <div className="
            max-w-7xl mx-auto
            px-6 md:px-16 "
          >
            <CustomForm />

          </div>
      
    </section>
  )
}

export default CustomArtworkPage;