import React, { useEffect, useState, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import { useParams, useSearchParams } from "react-router-dom";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams(); // Correctly destructure useSearchParams
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries(searchParams.entries()); // Correctly create queryParams
  const sidebarRef = useRef(null);

  // Fetch products when collection or queryParams change
  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]); // Include searchParams in the dependency array

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  // Add event listener for clicking outside the sidebar
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-end items-center"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>

        {/* Sort Options */}
        <SortOptions />

        {/* Product Grid */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
