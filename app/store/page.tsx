import React from "react";
import ProductList from "../components/ProductList";


const storePage = () => {
  return (
  
    // PAGE CONTAINER 
    <div>
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

export default storePage;
