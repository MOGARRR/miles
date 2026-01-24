import React from "react";
import ProductList from "../components/ProductList";


const StorePage = () => {
  return (
  
    // PAGE CONTAINER 
    <div className="
        max-w-7xl mx-auto
        px-6 md:px-16 py-8
      ">
      <div className="text-center p-8 ">
        <h1 className="text-4xl md:text-6xl font-bold text-[#E14747] p-3">
          THE GALLERY
        </h1>
        <p className=" text-base md:text-lg text-gray-200 max-w-[800px] mx-auto ">
          Explore KiloBoy's collection of pop culture-inspired artwork. From NBA legends to DC and Marvel heroes, each piece captures the raw energy of street culture.
        </p>
      </div>


      <ProductList />
    </div>

  );
};

export default StorePage;