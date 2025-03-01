import React from 'react';
import { RiDeleteBin3Line } from 'react-icons/ri';

const CartContent = () => {
  const cartProducts = [
    { productId: 1, name: 'T-Shirt', size: 'M', color: 'Red', quantity: 1, price: 15, image: 'https://picsum.photos/200?random=1' },
    { productId: 2, name: 'Jeans', size: 'L', color: 'Blue', quantity: 1, price: 25, image: 'https://picsum.photos/200?random=2' },
  ];

  return (
    <div>
      {cartProducts.map((product, index) => {
        return (
          <div key={index} className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-medium text-black">{product.name}</h3>
                <p className="text-sm text-gray-600">Size: {product.size}</p>
                <p className="text-sm text-gray-600">Color: {product.color}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <button className="border rounded px-1.5 py-0.5 text-xl font-medium text-gray-700">-</button>
                <p className="text-lg font-medium text-black mx-2">{product.quantity}</p>
                <button className="border rounded px-1.5 py-0.5 text-xl font-medium text-gray-700">+</button>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-black">${product.price}</p>
                <button>
                  <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContent;