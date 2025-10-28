import Image, { StaticImageData } from "next/image";
import React from "react";

interface servicesProductsProps {
  image: StaticImageData;
  imageAlt: string;
}

const ServicesProducts: React.FC<servicesProductsProps> = ({
  image,
  imageAlt,
}) => {
  return (
    <div className="bg-slate-500 border-b-2 border-slate ">
      <div>
        <Image src={image} alt={imageAlt} />
      </div>
      <h1 className="text-4xl m-10 border-b-2 ">Producks</h1>
      <div className="carousel rounded-box">
        <div className="carousel-item ">
          <Image
            width={350}
            height={60}
            src="/images/Gallery-Duck-1.jpg"
            alt="Burger"
            priority
          />
        </div>
        <div className="carousel-item">
          <Image
            width={350}
            height={60}
            src="/images/Gallery-Duck-2.jpg"
            alt="Burger"
            priority
          />
        </div>
        <div className="carousel-item ">
          <Image
            width={350}
            height={60}
            src="/images/Gallery-Duck-3.jpg"
            alt="Burger"
            priority
          />
        </div>
        <div className="carousel-item ">
          <Image
            width={350}
            height={60}
            src="/images/Classy-Rubber-Hat-Duck.jpeg"
            alt="Burger"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesProducts;
