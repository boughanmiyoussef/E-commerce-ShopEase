// In ../components/Products/ProductGrid.jsx
import { React, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products }) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top when component mounts
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="w-full h-96 mb-4">
            <img
              src={product.images[0]?.url}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h3 className="text-sm mb-2">{product.name}</h3>
          <p className="text-gray-500 font-medium text-sm tracking-tighter">
            ${product.price}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
