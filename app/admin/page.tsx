import { Product } from "@/src/types/product";
import Image from "next/image";
import Link from "next/link";

const AdminPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });

  const data: { products: Product[] } = await res.json();
  const products = data.products;

  return (
    <div>
      <div>
        <div className="flex flex-col items-center p-4">
          <h1 className="text-5xl">Products</h1>
          {products.map((product) => (
            <div key={product.id} className="bg-[#2E2E33] m-2 w-2/3 text-xl">
              <div className="relative w-full aspect-[1/1]  overflow-hidden">
                <Image
                  src={product.image_URL}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-center p-3 text-2xl ">
                <h2 >{product.title}</h2>
                <p>${product.price_cents / 100}</p>
                <Link href={`/admin/${product.id}`}>
                <button
                  className="mt-3 bg-[#E14747]
          px-6 py-2
          rounded-full
          font-semibold
          flex items-center gap-2
          transition
          duration-150
          hover:bg-[#f05a5a]
          active:scale-95
          cursor-pointer
          "
                >
                  
                  Edit
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
