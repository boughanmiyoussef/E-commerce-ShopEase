import React from 'react';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
  const products = [
    {
      _id: 123456,
      name: "Shirt",
      price: 110,
      sku: "1234567890",
    },
  ];

  const handleDelete =(id) => {
    if (window.confirm('Are you sure you want to delete ?')){
        console.log('Deleting product with id:', id);
    }
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
                <tr key={product._id} className='hover:bg-gray-50 cursor-pointer'>
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{product.price}</td>
                  <td className="py-2 px-4">{product.sku}</td>
                  <td className="py-2 px-4">
                    <Link 
                    to={`/admin/products/${product._id}/edit`}
                    className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded">
                      Edit
                    </Link>
                    <button 
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded ml-2">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;