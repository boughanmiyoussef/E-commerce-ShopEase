import React, { useEffect } from "react"; // Added useEffect import
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice"; // Import the logout action
import { clearCart } from "../redux/slices/cartSlice"; // Import the clearCart action
import MyOrdersPage from "./MyOrdersPage";

const Profile = () => {
  const { user } = useSelector((state) => state.auth); // Destructure user from auth state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    dispatch(clearCart()); // Clear the cart
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left Section */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{user?.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          {/* Right Section: Orders Table */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;