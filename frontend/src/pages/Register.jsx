import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import login from "../assets/login.webp"; // Reuse the same image
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [agreeToPolicy, setAgreeToPolicy] = useState(false); // State for policy agreement
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Get redirect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // Redirect if user is already logged in
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

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Check if user agreed to the policy
    if (!agreeToPolicy) {
      alert("You must agree to the terms and conditions");
      return;
    }

    // Dispatch registerUser action
    dispatch(registerUser({ name, email, password }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex">
      {/* Left Side - Register Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">ShopEase</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
          <p className="text-center mb-6">
            Enter Your Details To Register
          </p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Your Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded pr-10"
              placeholder="Enter Your Password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
            >
              {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
            </button>
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded pr-10"
              placeholder="Confirm Your Password"
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
            >
              {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
            </button>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={agreeToPolicy}
              onChange={(e) => setAgreeToPolicy(e.target.checked)}
              className="mr-2"
              required
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <Link to="/terms" className="text-blue-500 hover:underline">
                terms and conditions
              </Link>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
            disabled={!agreeToPolicy} // Disable button if policy is not agreed
          >
            Register
          </button>
          <p className="mt-6 text-center text-sm">
            Already Have An Account? {}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side - Image (Hidden on Mobile) */}
      <div className="hidden md:block w-1/2">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Register"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;