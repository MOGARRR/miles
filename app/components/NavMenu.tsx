"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NavMenuProps {
  active: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({ active }) => {
  const [display, setDisplay] = useState(active);

  const handleDisplay = () => setDisplay(false);

  const links = [
                  { name: "Home", path: "/" }, 
                  { name: "About", path: "/about" }, 
                  { name: "Gallery", path: "/store" }, 
                  { name: "Custom", path: "/customArtwork" }, 
                  { name: "Events", path: "/events" }, 

                  // ADMIN LINK JUST FOR TESTING, REMOVE IT LATER 
                  // { name: "Admin", path: "/admin" }, 

                ]

  return (
    <>
      {display && (
        <div className="
          bg-[#1c1c21] text-white 
          fixed top-16 left-0 w-full z-50
          flex flex-col border-t border-gray-700
          " 
        >

          <nav className=" flex flex-col text-left text-lg select-none ">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={handleDisplay}
                className="
                  w-full px-6 py-4 m-1
                  hover:bg-gray-800 active:bg-gray-700
                  transition=colors duration-150 rounded-md
                  "
              >
                {link.name}
              </Link>
            ))}          
          </nav>
        </div>
      )}
    </>
  );
};

export default NavMenu;