import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import FeaturedEvents from "./components/FeaturedEvents";
import CallToAction from "./components/CallToAction";


export default function Home() {


  return (
    <>
      {/* ///HERO/// */}
      <Hero />

      {/* /// FEATURED GALLERY /// */}
      <FeaturedProducts />



      {/* ///UPCOMING EVENTS  */}
      <FeaturedEvents />


      {/* READY TO OWN A PICE?  */}
      <CallToAction />

    </>
  );
}
