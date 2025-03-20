import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import login from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, guestId, error: authError } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // Handle login errors
  useEffect(() => {
    if (authError) {
      setError(authError); // Set error message from Redux store
    }
  }, [authError]);

  // Redirect after login
  useEffect(() => {
    if (userId) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, userId })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [userId, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">ShopEase</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey There! 👋</h2>
          <p className="text-center mb-6">
            Enter Your Email And Password To Login
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Your Email"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded pr-10"
                placeholder="Enter Your Password"
              />
              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Sign In
          </button>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm">
            Don't Have An Account? {}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Login"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login; 