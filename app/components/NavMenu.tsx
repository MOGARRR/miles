"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NavMenuProps {
  active: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({ active }) => {
  const [display, setDisplay] = useState(active);

  const handleDisplay = () => setDisplay(false);

  return (
    <>
      {display && (
        <div className="flex ">
          <div className="bg-base-100 fixed top-15 w-screen h-3/6 flex flex-col select-none z-10 border-b-2">
            <div className="flex flex-col h-full text-4xl text-center">
              <Link
                href={{ pathname: "/" }}
                className=" m-1 w-full p-3 border-y-1"
                onClick={() => handleDisplay()}
              >
                Home
              </Link>
              <Link
                href={{ pathname: "/about" }}
                className="  w-full p-3 m-1 w-full p-3 border-b-1"
                onClick={() => handleDisplay()}
              >
                About
              </Link>
              <Link
                href={{ pathname: "/store" }}
                className="  w-full p-3 m-1 w-full p-3 border-b-1"
                onClick={() => handleDisplay()}
              >
                Store &gt;
                <ul className="text-2xl">
                  <li className="m-4">Category 1</li>
                  <li className="m-4">Category 2</li>
                  <li className="m-4">Category 3</li>
                </ul>
              </Link>
              <Link
                href={{ pathname: "/contact" }}
                className="  w-full p-3 m-1 w-full p-3"
                onClick={() => handleDisplay()}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavMenu;
