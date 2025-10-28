"use client";

import React from "react";
import NavMenu from "./NavMenu";
import Cart from "./Cart";
import { useState } from "react";

const TopNavBar = () => {
  const [navStatus, setNavStatus] = useState(false);
  const [cartStatus, setCartStatus] = useState(false);


  const handleNav = (type: boolean) =>
    type ? setNavStatus(false) : setNavStatus(true) ;
  
  const handleCart = (type: boolean) =>
    type ? setCartStatus(false) : setCartStatus(true);

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm fixed z-10">
        <div className="navbar-start">
          <div
            className="dropdown"
            onClick={() => {
              handleNav(navStatus);
              handleCart(true);
            }}
          >
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />{" "}
              </svg>
            </div>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-2xl">Duck Season</a>
        </div>
        <div className="navbar-end">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => {
              handleCart(cartStatus);
              handleNav(true);
            }}
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />{" "}
              </svg>
              {/* <span className="badge badge-xs badge-primary indicator-item"></span> */}
            </div>
          </button>
        </div>
      </div>
      {navStatus && <NavMenu active={navStatus} />}
      {cartStatus && <Cart active={cartStatus} />}
    </>
  );
};

export default TopNavBar;
