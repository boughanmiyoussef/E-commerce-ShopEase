import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { updateProductStock } from "../../redux/slices/productsSlice"; // Add this import

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // 1. Create Checkout Session
  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.phone
    ) {
      alert("Please fill out all shipping address fields.");
      return;
    }

    if (!cart || !cart.products || cart.products.length === 0) {
      alert("Your cart is empty. Add items to proceed to checkout.");
      return;
    }

    setIsCreatingCheckout(true);

    try {
      const checkoutData = {
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "Paypal",
        totalPrice: cart.totalPrice,
      };
      console.log("Checkout data:", checkoutData);

      const res = await dispatch(createCheckout(checkoutData));

      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
      } else {
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("An error occurred while creating the checkout session. Please try again.");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  // 2. Handle Payment Success
  const handlePaymentSuccess = async (details) => {
    try {
      console.log("Updating checkout ID:", checkoutId);
      console.log("Payment payload:", {
        paymentStatus: "Paid",
        paymentDetails: details,
        totalPrice: cart.totalPrice,
      });

      // Send payment details to backend
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "Paid",
          paymentDetails: details,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.status === 200) {
        // Finalize checkout
        await handleFinalizeCheckout(checkoutId);
        navigate("/order-confirmation");
      } else {
        console.error("Payment failed:", response.statusText);
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      alert("Payment error. Please try again.");
    }
  };

  // 3. Finalize Checkout
  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Finalization error:", error);
      throw error;
    }
  };

  // Render loading/error states
  if (loading) return <p>Loading Cart....</p>;
  if (error) return <p>Error: {error}....</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your Cart Is Empty</p>;
  }

  // Render loading/error states
  if (loading) return <p>Loading Cart....</p>;
  if (error) return <p>Error: {error}....</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your Cart Is Empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-20 px-6 tracking-tighter">
      {/* Left Section: Checkout Form */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="name"
              value={user?.name || ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
        
          
          </div>
          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, address: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* City */}
          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Postal Code */}
          <div className="mb-4">
            <label className="block text-gray-700">Postal Code</label>
            <input
              type="text"
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Country */}
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, country: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, phone: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Submit Button */}
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
                disabled={isCreatingCheckout}
              >
                {isCreatingCheckout ? "Processing..." : "Continue To Payment"}
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay With PayPal</h3>
                <PayPalButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => alert("Payment Failed. Try Again")}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section: Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart?.products?.map((product, index) => {
            const productTotalPrice = (product.price * product.quantity).toFixed(2);
            return (
              <div
                key={index}
                className="flex items-start justify-between py-2 border-b"
              >
                <div className="flex items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-24 object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-md font-medium">{product.name}</h3>
                    <p className="text-gray-500">Size: {product.size}</p>
                    <p className="text-gray-500">Color: {product.color}</p>
                    <p className="text-gray-500">Quantity: {product.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl">${product.price?.toLocaleString()}</p>
                  <p className="text-gray-500">Total: ${productTotalPrice}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <p className="text-gray-700">Subtotal</p>
            <p className="text-gray-700">${cart.subtotal?.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-700">Shipping</p>
            <p className="text-gray-700">${cart.shipping?.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-700">Tax</p>
            <p className="text-gray-700">${cart.tax?.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-lg font-semibold">${cart.totalPrice?.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;