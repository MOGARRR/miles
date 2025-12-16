"use client"
import Image from "next/image";

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
      
      {/* FORM */}
      <div className="p-4 text-xl m-12">
        <h2>Request your custom piece</h2>
        <p>Fill out the form below with as much detail as possible. The more specific you are, the better we can bring your idea to life.</p>
        <br />

        <form>
          <fieldset className="fieldset ">
            <label> Type of Request</label>
            <input 
              type="text"
              required
              placeholder="e.g. Portrait, Existing Design"
              className="border p-2 bg-black"
            />

            <label> Apparel Type (optional)</label>
            <input 
              type="text"
              placeholder="e.g. T-Shirt, Nike Shoes, Hat"
              className="border p-2 bg-black"
            />

            <label> Specifications</label>
            <input 
              type="text"
              required
              placeholder="e.g. Size, Colors, Style Preferences"
              className="border p-2 bg-black"
            />

            <label> Details </label>
            <textarea
              required
              placeholder="Describe your vision in detail. Include references, inspirations, or specific elements you want included."
              className="border p-2 bg-black"
            />

            <button>
              Submit Request
            </button>
            
          </fieldset>
        </form>
        <p className="text-sm ">We'll review your request and get back to you within 2-3 business days with a quote and timeline.</p>
      </div>

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