import React, { useState } from 'react';
import { MdSearch, MdClose } from 'react-icons/md'; // Material Icons for search and close
import { BsPerson, BsCart } from 'react-icons/bs'; // Bootstrap Icons for user and cart
import { Link } from 'react-router-dom'; // Import Link

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => document.getElementById('searchInput').focus(), 300); // Focus after transition
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center transition-all duration-300">
        {isOpen ? (
          <div className="w-full flex items-center relative">
            <input 
              id="searchInput"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${isFocused ? 'shadow-lg' : ''}`}
            />
            <button 
              type="button" 
              onClick={handleSearchToggle}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              <MdClose className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 text-gray-600">
            <button onClick={handleSearchToggle} className="hover:text-blue-500 transition-colors duration-300">
              <MdSearch className='h-6 w-6' />
            </button>
            <Link to="/profile" className="hover:text-blue-500 transition-colors duration-300">
              <BsPerson className="h-6 w-6" />
            </Link>
            <Link to="/cart" className="relative hover:text-blue-500 transition-colors duration-300">
  <BsCart className="h-6 w-6" />
  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">3</span>
</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SearchBar;