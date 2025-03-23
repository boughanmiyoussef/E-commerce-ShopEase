import { React, useEffect } from "react";
import { Link } from "react-router-dom";
import featured from "../../assets/featured.jpg";
const FeaturedCollection = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top when component mounts
  }, []);
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl">
        {/* Left Content */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Comfort And Style
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Apparel Made For <br /> Your Everyday Life
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Our selection of clothing is made with care, ethical production
            methods, and high-quality materials to ensure that your outfit is
            both comfortable and stylish.
          </p>
          <Link
            to="/collections/all"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
        {/* Right Content */}

        <div className="lg:w-1/2">
          <img
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
            src={featured}
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
