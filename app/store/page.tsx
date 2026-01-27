import React from "react";
import ProductList from "../components/ProductList";


const StorePage = () => {
  return (
  
    // PAGE CONTAINER 
    <section className="
      bg-gradient-to-l from-kilodarkgrey to-kiloblack
      text-white
      py-24
      "
    >
      <div className="max-w-7xl mx-auto
      px-6 md:px-16 ">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#E14747]">
            THE GALLERY
          </h1>
          <p className=" text-base md:text-lg text-gray-200 max-w-[800px] mx-auto mt-8">
            Explore KiloBoy's collection of pop culture-inspired artwork. From NBA legends to DC and Marvel heroes, each piece captures the raw energy of street culture.
          </p>

        </div>

        <div>
          <ProductList />
        </div>
       
      </div>

      
    </section>

  );
};

export default StorePage;