import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTshirt, FaShippingFast, FaCreditCard } from "react-icons/fa";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [topWearsForWomen, setTopWearsForWomen] = useState([]);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Top Wear",
        limit: 8
      })
    ).then((action) => {
      if (action.payload) {
        setTopWearsForWomen(action.payload);
      }
    });

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        console.log("Best Seller Response:", response.data);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Error fetching best seller product:", error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <section className="relative h-[400px] md:h-[600px] lg:h-[750px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://www.youtube.com/embed/zx2UL5pXUow?autoplay=1&mute=1&loop=1&playlist=zx2UL5pXUow&controls=0&showinfo=0&rel=0"
            title="Background Video"
            className="absolute top-0 left-0 w-full h-full object-cover"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center p-6">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4">
            ShopEase
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Your one-stop shop for trendy fashion and fast worldwide shipping.
          </p>
          <Link
            to="/collections/all"
            className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
          >
            Explore Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FaTshirt className="text-6xl text-gray-800" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trendy Collections</h3>
            <p className="text-gray-600">
              Discover the latest fashion trends for men and women.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FaShippingFast className="text-6xl text-gray-800" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
            <p className="text-gray-600">
              Get your orders delivered quickly, anywhere in the world.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FaCreditCard className="text-6xl text-gray-800" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Checkout</h3>
            <p className="text-gray-600">
              Enjoy a seamless and secure checkout experience.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            About ShopEase
          </h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 mb-8">
              ShopEase was inspired by my passion for fashion and the need for a
              seamless online shopping experience. As a Holberton School
              student, I wanted to create a project that combines functionality
              with style, and ShopEase is the result of that vision. This
              project is part of my portfolio for Holberton School.
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a
                href="https://linkedin.com/in/youssef-boughanmi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/boughanmiyoussef"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
            </div>
            <a
              href="https://github.com/boughanmiyoussef/E-commerce-ShopEase"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Existing Home Page Content */}
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
