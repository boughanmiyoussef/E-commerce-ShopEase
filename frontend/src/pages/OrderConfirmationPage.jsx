import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (!checkout || !checkout._id) {
      navigate("/my-order");
      return;
    }
    dispatch(clearCart());
    localStorage.removeItem("cart");
  }, [checkout, dispatch, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const calculateDeliveryDate = (orderDate) => {
    const deliveryDays = 10;
    const date = new Date(orderDate);
    date.setDate(date.getDate() + deliveryDays);
    return date.toLocaleDateString();
  };

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
        <p className="text-center text-gray-500">
          No order found. Please check your orders page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-6">
        Thank You For Your Order
      </h1>
      <div className="p-6 rounded-lg border">
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
                {formatVariant(item)}
              </div>
              <div className="ml-auto text-right">
                <p className="text-md">${item.price}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
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
