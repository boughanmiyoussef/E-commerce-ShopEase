import React, { useEffect, useState, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import { useParams } from 'react-router-dom'; // Added to access :collection param
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';

const CollectionPage = () => {
  const [products, setProducts] = useState([])

  const sidebarRef  = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const handleClickOutside = (e) => {
    if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
      setIsSidebarOpen(false);
    }
  };



  useEffect (() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const fetchedProducts = [
        {
          _id: 1,
          name: 'Floral Blouse',
          price: 45,
          images: [
            {
              url: 'https://picsum.photos/500/500?random=1',
              altText: 'Floral Blouse',
            },
          ],
        },
        {
          _id: 2,
          name: 'Silk Tank Top',
          price: 60,
          images: [
            {
              url: 'https://picsum.photos/500/500?random=2',
              altText: 'Silk Tank Top',
            },
          ],
        },
        {
          _id: 3,
          name: 'Knit Sweater',
          price: 80,
          images: [
            {
              url: 'https://picsum.photos/500/500?random=3',
              altText: 'Knit Sweater',
            },
          ],
        },
        {
          _id: 4,
          name: 'Crop Top',
          price: 35,
          images: [
            {
              url: 'https://picsum.photos/500/500?random=4',
              altText: 'Crop Top',
            },
          ],
        },
        {
          _id: 5,
          name: 'Off-Shoulder Top',
          price: 50,
          images: [
            {
              url: 'https://picsum.photos/500/500?random=5',
              altText: 'Off-Shoulder Top',
            },
          ],
        },
        {
          _id: 6,
          name: 'Linen Shirt',
          price: 70,
          images: [
            {
              url: 'https://picsum.photos/500/500?random=6',
              altText: 'Linen Shirt',
            },
          ],
        },
        {
          _id: 7,
          name: 'Turtleneck Top',
          price: 55,
          images: [
            {
              url: 'https://picsum.photos/500/500?random=7',
              altText: 'Turtleneck Top',
            },
          ],
        },
        {
          _id: 8,
          name: 'Graphic Tee',
          price: 30,
          images: [
            {
              url: 'https://picsum.photos/500/500?random=8',
              altText: 'Graphic Tee',
            },
          ],
        },
      ];
      setProducts(fetchedProducts);
    }, 1000);
  }, []);

  return (
    <div className='flex flex-col lg:flex-row' >
        {/* Mobile Filter Button */}
        <button 
        onClick={toggleSidebar}
        className='lg:hidden border p-2 flex justify-end items-center'>
          <FaFilter className="mr-2" /> Filters
        </button>

      {/* Filter Sidebar */}
      <div  ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full" } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 `}>
        <FilterSidebar />
      </div>

      <div className="flex-grow p-4">
          <h2 className='text-2xl uppercase mb-4'>All Collection</h2>
          {/* Sort Options */}
          <SortOptions/>

      {/* Product Grid */}
      <ProductGrid products={products}/>


      </div>


    </div>
  );
};
export default CollectionPage;