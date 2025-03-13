import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();

  // Correctly access the adminProducts slice of the state
  const { products = [], loading, error } = useSelector(
    (state) => state.adminProducts || {}
  );

  // Log the entire Redux state and products
  const state = useSelector((state) => state);
  console.log("Entire Redux State:", state);
  console.log("Products in component:", products);
  console.log("Is Array?", Array.isArray(products), "Length:", products.length);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
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
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  {/* Clickable Product Name */}
                  <td className="py-2 px-4">
                    <Link
                      to={`/product/${product._id}`} // Updated to match your product details route
                      className="block w-full h-full"
                    >
                      {product.name}
                    </Link>
                  </td>

                  {/* Clickable Price */}
                  <td className="py-2 px-4">
                    <Link
                      to={`/product/${product._id}`} // Updated to match your product details route
                      className="block w-full h-full"
                    >
                      ${product.price}
                    </Link>
                  </td>

                  {/* Clickable SKU */}
                  <td className="py-2 px-4">
                    <Link
                      to={`/product/${product._id}`} // Updated to match your product details route
                      className="block w-full h-full"
                    >
                      {product.sku}
                    </Link>
                  </td>

                  {/* Actions (Edit and Delete) */}
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
    </div>
  );
};

export default ProductManagement;