import coverPhoto from "../public/images/StockCake-Floating-Rubber-blur.jpg";
import heroPhoto from "../public/images/Classy-Rubber-Hat-Duck.jpeg";
import Hero from "./components/Hero";
import MissionStatement from "./components/MissionStatement";
import ServicesProducts from "./components/ServicesProducts";
import Contact from "./components/Contact";
import GalleryList from "./components/GalleryList";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  let { data: Users, error } = await supabase.from("Users").select("*");

  return (
    <>
      {/* ///HERO/// */}
      <Hero />
      <pre>{JSON.stringify(Users, null, 2)}</pre>
      {/* Our Mission */}
      <MissionStatement />
      {/* ///SERVICES/PRODUCT/// */}
      <ServicesProducts
        image={heroPhoto}
        imageAlt="Rubber duck with hat and glasses floating in a pool"
      />
      {/* ///Gallery/// */}
      <GalleryList />
      {/* ///CONTACT INFO & HOURS///  */}
      <Contact />
    </>
  );
}
