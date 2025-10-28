interface DataSet {
  id: number;
  image: string;
  imageAlt: string;
  name: string;
  description: string;
  price: number;
}

const productSet1: DataSet = {
  id: 1,
  image: "/images/Gallery-Duck-1.jpg",
  imageAlt: "Rubber duck wearing holiday items in a tree",
  name: "Garry the Duck",
  description: 'description',
  price: 9.99,
};

const productSet2: DataSet = {
  id: 2,
  image: "/images/Gallery-Duck-2.jpg",
  imageAlt: "Rubber duck wearing sunglasses while in a pool",
  name: "Harold Duck jr.",
  description: 'description',
  price: 11.99,
};

const productSet3: DataSet = {
  id: 3,
  image: "/images/Gallery-Duck-3.jpg",
  imageAlt:
    "Rubber duck wearing black top and hat, sitting in the grass beside a flower",
  name: "Sir. Quackington",
  description: 'description',
  price: 13.99,
};

const productSet4: DataSet = {
  id: 4,
  image: "/images/StockCake-Floating-Rubber.jpg",
  imageAlt:
    "Rubber duck floating on top of water",
  name: "Burt the Duck",
  description: 'description',
  price: 9.99,
};

const productSet5: DataSet = {
  id: 5,
  image: "/images/Classy-Rubber-Hat-Duck.jpeg",
  imageAlt:
    "Rubber duck wearing glasses and a hat in a pool",
  name: "Edaward the Duck",
  description: 'description',
  price: 11.99,
};


const productSetArray = [productSet1, productSet2, productSet3, productSet4, productSet5];

export default productSetArray;
