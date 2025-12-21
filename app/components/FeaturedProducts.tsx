import Link from "next/link";

const FeaturedProducts = () => {
  return (
    <div>

      {/* HEADING */}
      <div>
        <h2 className="text-2xl font-semibold">Featured Drops</h2>
        <p> Limited edition artworks and exclusive pieces straight from the studio.</p>
      </div>

      {/* DISPLAY 3 CARDS  */}
      <div>

      </div>

      {/* SEE ALL BUTTON - REDIRECTS TO STORE PAGE */}
      <div>
        <Link href="/store">
          Shop 
        </Link>

      </div>
     
      
    </div>
  )
};

export default FeaturedProducts;
