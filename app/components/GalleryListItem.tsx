import React from "react";
import Image, { StaticImageData } from "next/image";

interface GalleryListItemProps {
  image: string;
  imageAlt: string;
  subtitle: string;
  description: string;
}

const GalleryListItem: React.FC<GalleryListItemProps> = ({
  image,
  imageAlt,
  subtitle,
  description,
}) => {
  return (
    <div>
      <div className="text-center relative h-[30vh] ">
        <Image className="w-1/3 object-cover" src={image} alt={imageAlt} fill />
      </div>
      <h2 className="text-xl p-4 ">{subtitle}</h2>
      <p className="text-l px-4 mb-6">{description}</p>
    </div>
  );
};

export default GalleryListItem;


