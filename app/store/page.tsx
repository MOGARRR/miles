import React from "react";
import ProductList from "../components/ProductList";
import Directory from "../components/Directory";


const storePage = () => {
  return (
    <div className="pt-15 bg-slate-500">
      <div>
        <Directory routeName={null} routeLink={null} />

        <div className="text-center p-8 ">
          <h1 className="text-5xl mb-8 border-b-2">Our Duck Collection</h1>
          <h2 className="text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
            beatae dolore pariatur sed dolores odio laudantium error enim rem!
            Cupiditate culpa ex eveniet voluptas sint nam nemo quaerat,
            architecto aliquid!
          </h2>
        </div>
        <ProductList />
      </div>
    </div>
  );
};

export default storePage;
