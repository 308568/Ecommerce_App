
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {  // Ensure token is passed as a prop

  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      // Ensure you are passing the token in the request header
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { token }  // Pass token here
      });

      if (response.data.success) {
      setList(response.data.products);  // Set list state if response is valid
        
      } else {
        toast.error(response.data.message)
      }


    } catch (error) {
      console.error('Error fetching the list:', error);
      toast.error(error.message)
    }
  };

  const removeProduct = async (id) => {

    try {
      
      const response = await axios.post(backendUrl + '/api/product/remove' , {id}, {headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }
    
  }

  useEffect(() => {
    if (token) {
      fetchList();  // Only fetch the list if a token is available
    }
  }, [token]);

  return (
    <>
     
     <p className='mb-2'>All Products list</p>

     <div className='flex flex-col gap-2'>

{/* List Table */}

       <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b className='text-center'>Action</b>

       </div>

       {/* Product List */}

       {
        list.map((item,index) => (
          
          <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
             <img className='w-12' src={item.image[0]} alt="" />

              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>

          </div>

        ))
       
      }

     </div>

    </>
  );
};

export default List;
