import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import axios from "axios";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products = [], loading, error } = useSelector(
    (state) => state.adminProducts || {}
  );
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    countInStock: 0,
    category: "Uncategorized", // Already present
    isPublished: true,
    collections: "",
    sizes: [],
    colors: [],
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "sizes" || name === "colors") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) || "" : 
                name === "countInStock" ? parseInt(value) || 0 : value, // Handle countInStock as integer
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formDataUpload = new FormData();

    try {
      setUploading(true);

      for (const file of files) {
        formDataUpload.append("image", file);

        const token = localStorage.getItem("userToken");
        const { data } = await axios.post(
          "http://localhost:9000/api/upload",
          formDataUpload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Uploaded image:", data);

        setFormData((prevData) => ({
          ...prevData,
          images: [
            ...prevData.images,
            { url: data.imageUrl, altText: `${prevData.name} Image` },
          ],
        }));

        formDataUpload.delete("image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setFormError("Failed to upload image(s). Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const token = localStorage.getItem("userToken");
    if (!token) {
      setFormError("No authentication token found. Please log in with admin credentials.");
      setFormLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Submitting form data:", formData);

      const response = await axios.post(
        "http://localhost:9000/api/products",
        formData,
        config
      );
      console.log("Server response:", response.data);

      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        sku: "",
        countInStock: 0,
        category: "Uncategorized",
        isPublished: true,
        collections: "",
        sizes: [],
        colors: [],
        images: [],
      });
      dispatch(fetchAdminProducts());
    } catch (err) {
      console.error("Full error:", err);
      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        setFormError("Cannot connect to the backend. Is it running on port 9000?");
      } else if (err.response) {
        setFormError(err.response.data.message || `Server error: ${err.response.status}`);
      } else {
        setFormError("An unexpected error occurred. Check the console.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-600">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="py-2 px-4">
                    <Link to={`/product/${product._id}`} className="block w-full h-full">
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link to={`/product/${product._id}`} className="block w-full h-full">
                      ${product.price}
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link to={`/product/${product._id}`} className="block w-full h-full">
                      {product.sku}
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Product</h3>
            {formError && <div className="text-red-500 mb-4">{formError}</div>}
            <div className="max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full p-2 border rounded"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="SKU"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    placeholder="Quantity in Stock"
                    className="w-full p-2 border rounded"
                    min="0"
                    required
                  />
                </div>
                <div className="mb-4">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="Uncategorized">Uncategorized</option>
                    <option value="Top Wear">Top Wear</option>
                    <option value="Bottom Wear">Bottom Wear</option>
                  </select>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="collections"
                    value={formData.collections}
                    onChange={handleChange}
                    placeholder="Collection (e.g., Summer)"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="sizes"
                    value={formData.sizes.join(",")}
                    onChange={handleChange}
                    placeholder="Sizes (e.g., S,M,L)"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="colors"
                    value={formData.colors.join(",")}
                    onChange={handleChange}
                    placeholder="Colors (e.g., Red,Blue)"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Upload Images</label>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    multiple
                    className="w-full p-2 border rounded"
                  />
                  {uploading && <p>Uploading images...</p>}
                  <div className="flex gap-4 mt-4 flex-wrap">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={image.altText || "Product Image"}
                          className="w-20 h-20 object-cover rounded-md shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-4 sticky bottom-0 bg-white pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    {formLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;