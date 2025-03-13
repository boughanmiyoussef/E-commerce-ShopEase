import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsList, BsPerson, BsCart, BsBoxArrowInRight } from "react-icons/bs";
import { MdSearch, MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import CartDrawer from "../Layout/CartDrawer";
import { setFilters, fetchProductsByFilters } from "../../redux/slices/productsSlice";

const Navbar = () => {
  const [navDrawerBar, setNavDrawerBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Calculate cart item count
  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  // Toggle navigation drawer
  const toggleNavDrawer = () => {
    setNavDrawerBar(!navDrawerBar);
  };

  // Toggle search bar
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Toggle cart drawer
  const toggleCartDrawer = () => {
    setCartDrawerOpen(!cartDrawerOpen);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <>
      {/* Sticky Search Bar */}
      <div
        className={`fixed top-0 left-0 w-full bg-white bg-opacity-95 backdrop-blur-sm shadow-md z-50 transform transition-transform duration-300 ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-6 py-6 flex items-center">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              id="searchInput"
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              ref={searchInputRef}
              className="w-full bg-transparent text-gray-800 text-lg border-b-2 border-gray-300 focus:border-gray-800 focus:outline-none py-2 pr-12 transition-all duration-300"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <MdSearch className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleSearchToggle}
              aria-label="Close search"
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <MdClose className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
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
          </div>

          {/* Right - Icons and Admin Link */}
          <div className="flex items-center space-x-6">
            <button
              onClick={handleSearchToggle}
              aria-label="Toggle search"
              className="hover:text-gray-800 transition duration-200"
            >
              <MdSearch className="h-6 w-6" />
            </button>
            <Link to="/login" aria-label="Login" className="hover:text-gray-800 transition duration-200">
              <BsBoxArrowInRight className="h-6 w-6" />
            </Link>
            <Link to="/profile" aria-label="Profile" className="hover:text-gray-800 transition duration-200">
              <BsPerson className="h-6 w-6" />
            </Link>
            <button
              onClick={toggleCartDrawer}
              aria-label="Cart"
              className="relative hover:text-gray-800 transition duration-200"
            >
              <BsCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">
                  {cartItemCount}
                </span>
              )}
            </button>
            {user?.role === "admin" && (
              <Link
                to="/admin/users"
                className="text-sm uppercase font-medium text-gray-600 hover:text-gray-800 transition duration-200"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleNavDrawer} aria-label="Toggle menu" className="md:hidden">
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
          <button onClick={toggleNavDrawer} aria-label="Close menu">
            <MdClose className="h-6 w-6 text-gray-600 hover:text-gray-800 transition duration-200" />
          </button>
        </div>
        <div className="flex-grow p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">ShopEase</h2>
          <div className="flex flex-col space-y-4">
            <Link
              to="/collections/all?gender=Men"
              className="text-lg font-medium text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={toggleNavDrawer}
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              className="text-lg font-medium text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={toggleNavDrawer}
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top+Wear"
              className="text-lg font-medium text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={toggleNavDrawer}
            >
              Topwear
            </Link>
            <Link
              to="/collections/all?category=Bottom+Wear"
              className="text-lg font-medium text-gray-600 hover:text-gray-800 transition duration-200"
              onClick={toggleNavDrawer}
            >
              Bottomwear
            </Link>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={cartDrawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </>
  );
};

export default Navbar;