import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const {products,setProducts}= useContext(ShopContext); // Fetch products from context
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    // console.log("products in bestseller", products)
    // Filter bestsellers and limit to 5 items
    const bestProducts = products.filter((item) => item.bestseller).slice(0, 5);
    setBestSellers(bestProducts);
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our top-selling products handpicked just for you!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6" >
        {bestSellers.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image[0]} // Use the first image from the array
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
