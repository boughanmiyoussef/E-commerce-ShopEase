import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { updateProductStock } from "../redux/slices/productsSlice"; // Import the stock update thunk

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout); // Ensure checkout is in state
  const [isUpdatingStock, setIsUpdatingStock] = useState(false); // Loading state for stock update
  const [stockUpdateError, setStockUpdateError] = useState(null); // Error state for stock update

  // Update stock for each product in the checkout
  useEffect(() => {
    if (!checkout || !checkout._id || isUpdatingStock) return; // Skip if no checkout or already updating

    const updateStock = async () => {
      setIsUpdatingStock(true);
      setStockUpdateError(null);

      try {
        // Update stock for each product in the checkout
        for (const item of checkout.checkoutItems) {
          await dispatch(
            updateProductStock({ productId: item.productId, quantity: item.quantity })
          ).unwrap();
        }
      } catch (error) {
        console.error("Failed to update stock:", error);
        setStockUpdateError("Failed to update stock. Please contact support.");
      } finally {
        setIsUpdatingStock(false);
      }
    };

    updateStock();
  }, [checkout, dispatch, isUpdatingStock]);

  // Clear cart and handle checkout validation
  useEffect(() => {
    if (!checkout || !checkout._id) {
      navigate("/my-order"); // Redirect if no valid checkout
      return;
    }

    // Clear cart only after confirming checkout exists
    dispatch(clearCart());
    localStorage.removeItem("cart");
  }, [checkout, dispatch, navigate]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Enhanced delivery calculation
  const calculateDeliveryDate = (orderDate) => {
    const deliveryDays = 10; // Adjust based on shipping policy
    const date = new Date(orderDate);
    date.setDate(date.getDate() + deliveryDays);
    return date.toLocaleDateString();
  };

  // Format color/size labels (matches predefined options)
  const formatVariant = (item) => {
    return (
      <p className="text-sm text-gray-500">
        {item.color} | {item.size}
      </p>
    );
  };

  if (!checkout) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <p className="text-center text-gray-500">No order found. Please check your orders page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-6">
        Thank You For Your Order
      </h1>

      {/* Display loading or error state for stock update */}
      {isUpdatingStock && (
        <div className="text-center text-gray-500 mb-4">Updating stock...</div>
      )}
      {stockUpdateError && (
        <div className="text-center text-red-500 mb-4">{stockUpdateError}</div>
      )}

      <div className="p-6 rounded-lg border">
        {/* Order Summary */}
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Order ID: {checkout._id}</h2>
            <p className="text-gray-500">
              Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-emerald-700 text-sm">
              Delivery By: {calculateDeliveryDate(checkout.createdAt)}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-12">
          {checkout.checkoutItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex items-center mb-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div>
                <h4 className="text-md font-semibold">{item.name}</h4>
                {formatVariant(item)} {/* Reusable variant display */}
              </div>
              <div className="ml-auto text-right">
                <p className="text-md">${item.price}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment & Shipping */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
            <p className="text-gray-600">{checkout.paymentMethod}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Shipping Address</h4>
            <p className="text-gray-600">{checkout.shippingAddress.address}</p>
            <p className="text-gray-600">
              {checkout.shippingAddress.city}, 
              {checkout.shippingAddress.postalCode}, 
              {checkout.shippingAddress.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;