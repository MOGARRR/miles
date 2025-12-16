
import Image from "next/image";
import CustomArtworkForm from "../components/CustomArtworkForm";

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
      
      <CustomArtworkForm />

      {/* CUSTOM WORK INSPIRATION */}
      <div className="p-4 text-xl m-12">
        <h1> Custom work inspiration</h1>
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
      
    </div>
  )
}

export default CustomArtworkPage;