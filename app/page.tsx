import Hero from "./components/Hero";
import Contact from "./components/Contact";
import ProductListClient from "./components/ProductListClient";


export default function Home() {

  return (
    <>
      {/* ///HERO/// */}
      <Hero />

      <ProductListClient />


      {/* ///CONTACT INFO & HOURS///  */}
      <Contact />
    </>
  );
}
