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

    <div>

      {/* HERO  */}
      <div>
        <h1 className="text-5xl m-12">Custom Artwork</h1>

        <p className="text-xl m-12"> Bring your vision to life with a personalized KiloBoy piece. Whether it's your favorite athlete, character, or moment — let's create something iconic together.</p>
      </div>
      
      {/* CUSTOM FORM */}
      <CustomForm />

      {/* CUSTOM WORK INSPIRATION */}
      <div className="p-4 m-12" >
        <h1 className="text-4xl"> Custom work inspiration</h1>
        <br />
        <p> Check out some of our previous custom pieces to see what's possible. From NBA legends to comic book heroes, we bring your favorite icons to life.</p>

        <div className="grid grid-cols-3 gap-4 mt-6">
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

      <div className="m-12">
        <Faq />
      </div>
      
    </div>
  )
}

export default CustomArtworkPage;