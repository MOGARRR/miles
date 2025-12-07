"use client";
import Image from "next/image";
import NavMenu from "./NavMenu";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";


const TopNavBar = () => {
  const [navStatus, setNavStatus] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // Whenever the URL/path changes, close the mobile menu
    setNavStatus(false);
  }, [pathname]);

  const links = [
    { name: "About", path: "/about" },
    { name: "Gallery", path: "/store" },
    { name: "Custom", path: "/customArtwork" },
    { name: "Contact", path: "/contact" },
    { name: "Login", path: "/login" },
    { name: "CART", path: "/cart" },
  ]


  const handleNav = () => {
    setNavStatus((prev) => !prev);
  };


  return (
    <>
      <header className="
        fixed top-0 left-0 w-full z-20 
        bg-[#1c1c21] text-white shadow-sm 
        px-6 py-3 grid grid-cols-3 items-center
        border-b border-gray-700"
      >

        {/* Hamburger (md:hidden = only on small screens) */}
        <button
          className="
            btn btn-ghost btn-circle 
            md:hidden justify-self-start
          "
          aria-label="Open menu"
          onClick={() => {
            handleNav();
          }}
        >
          < Menu size={24} />
        </button>

        {/* ---------- CENTER Logo or Nav (depends on screen)---------- */}
        <div className="justify-self-center md:justify-self-start">

          {/* Logo (mobile)*/}
          <Link href="/" className=" text-xl font-semibold tracking-wide hover:text-gray-300">
            <Image
              src="/images/kiloboy-logo.png"
              alt="KiloBoy Logo"
              width={80}
              height={20}
              priority
              className="object-contain hover:opacity-90 transition-opacity duration-200"
            />
          </Link>
        </div>

        {/* ------ NAV LINKS desktop only ----- */}
        {/* hidden by default, starting from the md (medium) breakpoint and above, apply display: flex */}

        <nav className="hidden md:flex justify-center gap-6 font-semibold ">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="
                btn btn-ghost text-white hover:text-black rounded-md
                "
            >
              {link.name}
            </Link>

          ))}

        </nav>

        {/* ---------- RIGHT SECTION: CART ICON ---------- */}
        <div className="justify-self-end">
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Cart Page"
            onClick={handleNav}
          >
            < ShoppingCart
              size={24}
            />
          </button>
        </div>


        {/* ---------- MOBILE MENU + CART ---------- */}
        {navStatus && <NavMenu active={navStatus} />}


      </header>
    </>
  );
};

export default TopNavBar;
