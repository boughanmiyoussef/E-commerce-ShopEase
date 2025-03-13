import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice"; // Import the clearCart action

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages

  // Function to validate stock before proceeding to checkout
  const validateStock = () => {
    if (!cart || !cart.products || cart.products.length === 0) {
      setErrorMessage("Your cart is empty. Add items to proceed to checkout.");
      return false;
    }

    for (const item of cart.products) {
      if (item.quantity > item.countInStock) {
        setErrorMessage(
          `You cannot exceed the available stock of ${item.countInStock} for ${item.name}.`
        );
        return false;
      }
    }

    setErrorMessage(null); // Clear any previous error messages
    return true;
  };

  // Function to handle checkout
  const handleCheckout = () => {
    if (!validateStock()) {
      return; // Stop if stock validation fails
    }

    if (!user) {
      navigate("/login?redirect=checkout"); // Redirect to login with checkout as the next step
    } else {
      navigate("/checkout"); // Redirect to checkout
    }

    toggleCartDrawer(); // Close the drawer after navigation
  };

  // Function to clear the cart
  const handleClearCart = () => {
    dispatch(clearCart()); // Dispatch the clearCart action
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600 hover:text-gray-800 transition duration-200" />
        </button>
      </div>

      {/* Cart Content */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {cart && cart.products?.length > 0 ? (
          <CartContent cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      {/* Checkout and Clear Cart Buttons */}
      <div className="p-4 bg-white sticky bottom-0">
        {/* Display error message if stock validation fails */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
            {errorMessage}
          </div>
        )}

        {cart && cart.products?.length > 0 ? (
          <>
            <button
              onClick={handleClearCart}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition mb-4"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Checkout
            </button>
          </>
        ) : (
          <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
            Add items to your cart to proceed to checkout.
          </p>
        )}
        <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
          Shipping, taxes, and discount codes are calculated at checkout.
        </p>
      </div>
    </div>
  );
};

export default CartDrawer;