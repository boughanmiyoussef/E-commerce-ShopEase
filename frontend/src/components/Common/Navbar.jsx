import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsList } from "react-icons/bs";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [navDrawerBar, setNavDrawerBar] = useState(false);

  const toggleNavDrawer = () => {
    setNavDrawerBar(!navDrawerBar);
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-6 transition-all duration-300">
          {/* Left Logo */}
          <div>
            <Link
              to="/"
              className="text-xl font-semibold text-gray-600 hover:text-gray-800 transition duration-200"
            >
              ShopEase
            </Link>
          </div>

          {/* Center - Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/collections/all?gender=Men"              
              className="text-sm uppercase font-medium text-gray-600 hover:text-gray-800 transition duration-200"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              className="text-sm uppercase font-medium text-gray-600 hover:text-gray-800 transition duration-200"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top+Wear"
              className="text-sm uppercase font-medium text-gray-600 hover:text-gray-800 transition duration-200"
            >
              Topwear
            </Link>
            <Link
              to="/collections/all?category=Bottom+Wear"
              className="text-sm uppercase font-medium text-gray-600 hover:text-gray-800 transition duration-200"
            >
              Bottomwear
            </Link>
          <Link to="/admin" className='block bg-black px-2 rounded text-sm text-white'> Admin</Link>
          </div>

          {/* Right - SearchBar */}
          <SearchBar />
  

          {/* Mobile Menu Button */}
          <button onClick={toggleNavDrawer} className="md:hidden">
            <BsList className="h-6 w-6 text-gray-600 hover:text-gray-800 transition duration-200" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
          navDrawerBar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600 hover:text-gray-800 transition duration-200" />
          </button>
        </div>
        <div className="flex-grow p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">ShopEase</h2>
          <div className="flex flex-col space-y-4">
            <Link
              to="#"
              className="text-lg font-medium text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={toggleNavDrawer}
            >
              Men
            </Link>
            <Link
              to="#"
              className="text-lg font-medium text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={toggleNavDrawer}
            >
              Women
            </Link>
            <Link
              to="#"
              className="text-lg font-medium text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={toggleNavDrawer}
            >
              Topwear
            </Link>
            <Link
              to="#"
              className="text-lg font-medium text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={toggleNavDrawer}
            >
              Bottomwear
            </Link>
          </div>
        </div>
      </div>

      <CartDrawer />
    </>
  );
};

export default Navbar;
