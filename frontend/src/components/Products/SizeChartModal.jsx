import React from 'react';

const SizeChartModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Size Chart</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Size</th>
              <th className="py-2">Chest (in)</th>
              <th className="py-2">Waist (in)</th>
              <th className="py-2">Hip (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">S</td>
              <td className="py-2">34-36</td>
              <td className="py-2">28-30</td>
              <td className="py-2">36-38</td>
            </tr>
            <tr>
              <td className="py-2">M</td>
              <td className="py-2">38-40</td>
              <td className="py-2">32-34</td>
              <td className="py-2">40-42</td>
            </tr>
            <tr>
              <td className="py-2">L</td>
              <td className="py-2">42-44</td>
              <td className="py-2">36-38</td>
              <td className="py-2">44-46</td>
            </tr>
            <tr>
              <td className="py-2">XL</td>
              <td className="py-2">46-48</td>
              <td className="py-2">40-42</td>
              <td className="py-2">48-50</td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SizeChartModal;