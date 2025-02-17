import React, { useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { useEffect } from 'react';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products, setProducts } = useContext(ShopContext);

    const  [latestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
      // console.log("products in latest", products)
      
      setLatestProducts(products.slice(0,10))

    },[products])
    
      
  return (
    <div className='my-10'>
       <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='w-3/4 m-auto text-x5 sm:text-sm md:text-base text-gray-600'>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur quibusdam ullam aliquid totam! Rem, minima?</p>
       </div>

      {/* rendering pro */}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6'>

        {
          latestProducts.map((item,index)=>(
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))
        }

      </div>

    </div>
  )
}

export default LatestCollection