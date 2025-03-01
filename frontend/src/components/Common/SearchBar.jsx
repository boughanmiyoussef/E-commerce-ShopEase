import React, { useState } from 'react';
import { MdSearch, MdClose } from 'react-icons/md'; // Material Icons for search and close
import { BsPerson, BsCart } from 'react-icons/bs'; // Bootstrap Icons for user and cart
import { Link } from 'react-router-dom'; // Import Link
import CartDrawer from '../Layout/CartDrawer'; // Import CartDrawer

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => document.getElementById('searchInput')?.focus(), 300); // Focus after transition
    }
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log("Search term submitted:", searchTerm); // Replace with your search logic
    setIsOpen(false); // Close the search bar after submission
    setSearchTerm(""); // Clear the search term
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-600">
            {/* Always visible icons */}
            <button
              onClick={handleSearchToggle}
              className="hover:text-gray-800 transition duration-200"
            >
              <MdSearch className="h-6 w-6" />
            </button>
            <Link to="/profile" className="hover:text-gray-800 transition duration-200">
              <BsPerson className="h-6 w-6" />
            </Link>
            <button
              onClick={toggleCartDrawer}
              className="relative hover:text-gray-800 transition duration-200"
            >
              <BsCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">
                3
              </span>
            </button>
            {/* Search form that expands responsively */}
            <form
              onSubmit={handleSearch}
              className={`flex items-center transition-all duration-300 ease-in-out relative ${
                isOpen
                  ? 'w-full sm:w-64 opacity-100'
                  : 'w-0 opacity-0 overflow-hidden'
              }`}
            >
              <input
                id="searchInput"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg py-2 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 ${
                  isFocused ? 'shadow-lg' : ''
                }`}
              />
              <button
                type="submit"
                className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1 rounded-lg font-semibold hover:bg-gray-800 transition duration-200"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleSearchToggle}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition duration-200"
              >
                <MdClose className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </>
  );
};

export default SearchBar;