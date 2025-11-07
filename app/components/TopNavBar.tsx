"use client";
import Image from "next/image";
import NavMenu from "./NavMenu";
import Cart from "./Cart";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";

const TopNavBar = () => {
  const [navStatus, setNavStatus] = useState(false);
  const [cartStatus, setCartStatus] = useState(false);

  const links = [
                
                  { name: "Gallery", path: "/store" }, 
                  { name: "Custom", path: "/customArtwork" }, 
                  { name: "About", path: "/about" }, 
                  { name: "Contact", path: "/contact" }, 
                  { name: "Login", path: "/login" }, 
                ]


  const handleNav = (type: boolean) =>
    type ? setNavStatus(false) : setNavStatus(true) ;
  
  const handleCart = (type: boolean) =>
    type ? setCartStatus(false) : setCartStatus(true);

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
            handleNav(navStatus);
            handleCart(true);
          }}
        >
          < Menu size={24} />
        </button>

        {/* ---------- CENTER Logo or Nav (depends on screen)---------- */}
        <div className="justify-self-center md:justify-self-start">
          
          {/* Logo (mobile)*/}
          <Link href="/" className=" text-xl font-semibold tracking-wide hover:text-gray-300">
            <Image
              src="/images/kiloboy-logo.jpg"
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
                px-3 py-2 rounded-md
                hover:bg-gray-800
                active:bg-gray-700
                transition-colors duration-200
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
              onClick={() => {
                handleCart(cartStatus);
                handleNav(true);
              }}
            >
              < ShoppingCart 
                size={24}
              />
            </button>
          </div>


        {/* ---------- MOBILE MENU + CART ---------- */}
        {navStatus && <NavMenu active={navStatus} />}
        {cartStatus && <Cart active={cartStatus} />}

      </header>
    </>
  );
};

export default TopNavBar;
