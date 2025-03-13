import React, { useEffect, useState } from 'react';
import Hero from '../components/Layout/Hero';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturesSection from '../components/Products/FeaturesSection';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [topWearsForWomen, setTopWearsForWomen] = useState([]);

  useEffect(() => {
    // Fetch Top Wears For Women
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Top Wear", // Changed from "Bottom Wear" to "Top Wear"
        limit: 8,
      })
    ).then((action) => {
      if (action.payload) {
        setTopWearsForWomen(action.payload); // Set the fetched products to state
      }
    });

    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        console.log("Best Seller Response:", response.data); // Log the response
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Error fetching best seller product:", error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller */}
      <div className="container mx-auto mt-20 px-4">
        <h2 className="text-3xl text-center font-bold">Best Seller</h2>
        {bestSellerProduct && bestSellerProduct._id ? (
          <ProductDetails productId={bestSellerProduct._id} />
        ) : (
          <p>No best seller product found.</p>
        )}
      </div>

      {/* Top Wears For Women */}
      <div className="container mx-auto mt-20 px-4">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Top Wears For Women
        </h2>
        <div className="bg-gray-50 py-10 rounded-lg shadow-sm">
          <ProductGrid products={topWearsForWomen} />
        </div>
      </div>

      {/* Featured Collection and Features Section */}
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;