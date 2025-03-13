import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import SizeChartModal from "./SizeChartModal"; // Corrected import
import { FaTruck, FaUndo, FaShieldAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Icons for delivery, return, security, and Q&A
import { SiVisa, SiMastercard, SiPaypal } from 'react-icons/si'; // Payment method icons

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts = [] } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false); // State for size chart modal
  const [openQuestionId, setOpenQuestionId] = useState(null); // State for Q&A toggle

  const productFetchId = productId || id;

  // Fetch product details and similar products
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }))
        .unwrap()
        .then((response) => {
          console.log('Similar Products Response:', response);
        })
        .catch((error) => {
          console.error('Error fetching similar products:', error);
        });
    }
  }, [dispatch, productFetchId]);

  // Destructure selectedProduct with default values
  const {
    images = [],
    colors = [],
    sizes = [],
    name = '',
    price = 0,
    originalPrice = 0,
    description = '',
    brand = '',
    material = '',
  } = selectedProduct || {};

  // Set initial main image
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0].url);
    }
  }, [images]);

  // Scroll to top on mount or when productId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productFetchId]);

  // Handle quantity change
  const handleQuantityChange = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1);
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please Select A Size And A Color Before Adding To Cart', { duration: 700 });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success('Product Added To Cart', { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  // Toggle Q&A answer visibility
  const toggleQuestion = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  // Q&A Data
  const qaData = [
    {
      id: 1,
      question: 'What is the return policy?',
      answer: 'You can return the product within 30 days of purchase for a full refund or exchange.',
    },
    {
      id: 2,
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-5 business days. Express delivery is available for an additional fee.',
    },
    {
      id: 3,
      question: 'Is international shipping available?',
      answer: 'Yes, we ship internationally. Additional fees may apply depending on the destination.',
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, Mastercard, PayPal, and other major payment methods.',
    },
  ];

  // Loading state
  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  // Error state
  if (error) {
    return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  }

  // If no product is found
  if (!selectedProduct) {
    return <p className="text-center py-10">No product found.</p>;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {images?.map((image, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredImage(image.url)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <img
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? 'border-black' : 'border-gray-300'}`}
                  onClick={() => setMainImage(image.url)}
                />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <img
                src={hoveredImage || mainImage}
                alt="Main Product"
                className="w-full h-auto object-cover rounded-lg transition-opacity duration-300"
              />
            </div>
          </div>
          {/* Mobile Thumbnail */}
          <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
            {images?.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? 'border-black' : 'border-gray-300'}`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{name}</h1>
            <p className="text-lg text-gray-600 mb-1 line-through">
              ${originalPrice && `${originalPrice}`}
            </p>
            <p className="text-xl text-gray-500 mb-2">${price}</p>
            <p className="text-gray-600 mb-2">{description}</p>

            <div className="mb-4">
              <p className="text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border ${selectedColor === color ? 'border-4 border-black' : 'border-gray-300'}`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      filter: 'brightness(0.5)',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border ${selectedSize === size ? 'bg-black text-white' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowSizeChart(true)}
                className="text-sm text-gray-600 underline hover:text-gray-800 mt-2"
              >
                View Size Chart
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">Quantity</p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChange('minus')}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('plus')}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-900'}`}
            >
              {isButtonDisabled ? 'Adding...' : 'ADD TO CART'}
            </button>

            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
              <table className="w-full text-left text-sm text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-1">Brand</td>
                    <td className="py-1">{brand}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Material</td>
                    <td className="py-1">{material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
                





            {/* Q&A Section */}
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {qaData.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4">
                    <button
                      onClick={() => toggleQuestion(item.id)}
                      className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                      <span className="font-medium text-gray-700">{item.question}</span>
                      {openQuestionId === item.id ? (
                        <FaChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <FaChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    {openQuestionId === item.id && (
                      <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Size Chart Modal */}
        <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} />

        {/* You May Also Like Section */}
        <div className="mt-20 px-4">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
            You May Also Like
          </h2>
          <div className="bg-gray-50 py-10 rounded-lg shadow-sm">
            {similarProducts.length > 0 ? (
              <ProductGrid products={similarProducts} />
            ) : (
              <p className="text-center">No similar products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;