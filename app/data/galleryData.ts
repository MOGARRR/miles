interface DataSet {
  id: number;
  image: string;
  imageAlt: string;
  subtitle: string;
  description: string;
}

const gallerySet1: DataSet = {
  id: 1,
  image: "/images/Gallery-Duck-1.jpg",
  imageAlt: "Rubber duck wearing holiday items in a tree",
  subtitle: "Ducks For every season",
  description:
    "Aperiam illum laboriosam mollitia dolore nostrum saepe nesciunt voluptatum adipisci impedit quam reiciendis, magni fuga consequatur maiores accusantium illo?",
};

const gallerySet2: DataSet = {
  id: 2,
  image: "/images/Gallery-Duck-2.jpg",
  imageAlt: "Rubber duck wearing sunglasses while in a pool",
  subtitle: "Laid back Ducks",
  description:
    "Aperiam illum laboriosam mollitia dolore nostrum saepe nesciunt voluptatum adipisci impedit quam reiciendis, magni fuga consequatur maiores accusantium illo?",
};

const gallerySet3: DataSet = {
  id: 3,
  image: "/images/Gallery-Duck-3.jpg",
  imageAlt:
    "Rubber duck wearing black top and hat, sitting in the grass beside a flower",
  subtitle: "Ducks from around the world",
  description:
    "Aperiam illum laboriosam mollitia dolore nostrum saepe nesciunt voluptatum adipisci impedit quam reiciendis, magni fuga consequatur maiores accusantium illo?",
};

const gallerySetArray = [gallerySet1, gallerySet2, gallerySet3];

export default gallerySetArray;
