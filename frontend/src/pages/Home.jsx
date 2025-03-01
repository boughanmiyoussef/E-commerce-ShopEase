import React from 'react';
import Hero from '../components/Layout/Hero';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturesSection from '../components/Products/FeaturesSection';

const placeHolderProducts = [
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

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      {/* Best Seller */}
      <h2 className="text-3xl text-center font-bold">Best Seller</h2>
      <ProductDetails />
      {/* Top Wears For Women */}
      <div className="container mx-auto mt-20 px-4">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Top Wears For Women
        </h2>
        <div className="bg-gray-50 py-10 rounded-lg shadow-sm">
          <ProductGrid products={placeHolderProducts} />
        </div>
        <FeaturedCollection/>
        <FeaturesSection/>
      </div>
    </div>
  );
};

export default Home;