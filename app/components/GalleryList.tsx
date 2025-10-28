import React from "react";
import GalleryListItem from "./GalleryListItem";
import gallerySetArray from "../data/galleryData";

const GalleryList = () => {
  return (
    <div>
      <div className="bg-gray-600  p-6 ">
        <h1 className="text-4xl pb-4">Gallery</h1>
        <h2 className="text-l mb-4">Explore Duck Fashion</h2>
        <p className="text-xl">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Necessitatibus, distinctio odio. Aperiam illum laboriosam mollitia
          dolore nostrum saepe nesciunt voluptatum adipisci impedit quam
          reiciendis, magni fuga consequatur maiores accusantium illo?
        </p>
      </div>
      <div className="bg-gray-600 border-b-2 border-slate">
        {gallerySetArray.map((set) => (
          <GalleryListItem
            key={set.id}
            image={set.image}
            imageAlt={set.imageAlt}
            subtitle={set.subtitle}
            description={set.description}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryList;
