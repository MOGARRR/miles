"use client";

import NavMenu from "./NavMenu";
import Cart from "./Cart";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";

const TopNavBar = () => {
  const [navStatus, setNavStatus] = useState(false);
  const [cartStatus, setCartStatus] = useState(false);

  const links = [
                  { name: "Home", path: "/" }, 
                  { name: "Gallery", path: "/store" }, 
                  { name: "Custom", path: "/customArtowork" }, 
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
        px-6 py-3 flex items-center">

        {/* ---------- LEFT SECTION: LOGO + HAMBURGER ---------- */}
        <div className=" flex-1 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-wide hover:text-gray-300">
            KiloBoy
          </Link>

          {/* Hamburger (md:hidden = only on small screens) */}
          <button
            className="btn btn-ghost btn-circle md:hidden"
            aria-label="Open menu"
            onClick={() => {
              handleNav(navStatus);
              handleCart(true);
            }}
          >
            < Menu size={24} />
          </button>
        </div>
  
        {/* ------ CENTER SECTION: NAV LINKS desktop only ----- */}
        {/* hidden by default, starting from the md (medium) breakpoint and above, apply display: flex */}
        
          <nav className="hidden md:flex flex-1 justify-center gap-10 ">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className=""
              >
                {link.name}
              </Link>

            ))}          
            
          </nav>

          {/* ---------- RIGHT SECTION: CART ICON ---------- */}
          <div className="flex-1 flex justify-end">
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
