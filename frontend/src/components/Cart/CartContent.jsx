import React, { useState } from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  updateCartItemQuantity,
  removeFromCart
} from "../../redux/slices/cartSlice";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);

  // Function to handle quantity changes
  const handleQuantityChange = (
    productId,
    delta,
    quantity,
    size,
    color,
    countInStock
  ) => {
    const newQuantity = quantity + delta;

    // Use a fallback for countInStock
    const availableStock = countInStock !== undefined ? countInStock : Infinity;

    if (newQuantity > availableStock) {
      setErrorMessage(
        `You cannot exceed the available stock of ${availableStock}.`
      );
      return;
    }

    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          userId,
          guestId,
          size,
          color
        })
      );
      setErrorMessage(null);
    }
  };

  // Function to handle item removal
  const handleRemoveItem = (productId, size, color) => {
    dispatch(
      removeFromCart({
        productId,
        userId,
        guestId,
        size,
        color
      })
    );
  };

  return (
    <div>
      {/* Display error message if quantity exceeds stock */}
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
          {errorMessage}
        </div>
      )}

      {cart.products.map((product, index) => {
        console.log("Product Data:", product); // Debugging: Log the product object
        return (
          <div
            key={index}
            className="flex items-center justify-between p-4 border-b border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-medium text-black">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">Size: {product.size}</p>
                <p className="text-sm text-gray-600">Color: {product.color}</p>
                <p className="text-sm text-gray-600">
                  Stock:{" "}
                  {product.countInStock !== undefined
                    ? product.countInStock
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {/* Decrement Button */}
                <button
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color,
                      product.countInStock
                    )
                  }
                  className="border rounded px-1.5 py-0.5 text-xl font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  -
                </button>

                {/* Quantity Display */}
                <p className="text-lg font-medium text-black mx-2">
                  {product.quantity}
                </p>

                {/* Increment Button */}
                <button
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color,
                      product.countInStock
                    )
                  }
                  disabled={
                    product.countInStock !== undefined &&
                    product.quantity >= product.countInStock
                  }
                  className={`border rounded px-1.5 py-0.5 text-xl font-medium text-gray-700 hover:bg-gray-100 transition ${
                    product.countInStock !== undefined &&
                    product.quantity >= product.countInStock
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  +
                </button>
              </div>
              <div className="text-right">
                {/* Total Price */}
                <p className="text-lg font-medium text-black">
                  ${(parseFloat(product.price) * product.quantity).toFixed(2)}
                </p>

                {/* Remove Button */}
                <button
                  onClick={() =>
                    handleRemoveItem(
                      product.productId,
                      product.size,
                      product.color
                    )
                  }
                  className="hover:text-red-700 transition"
                >
                  <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContent;
