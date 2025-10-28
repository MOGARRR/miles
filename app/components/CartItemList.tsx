import React from 'react'
import productSetArray from '../data/productData'
import CartItem from './CartItem'


const CartItemList = () => {
  return (
    <div className='p-2 m-1'>
       {productSetArray.map((item) => (
      <CartItem
      key={item.id}
      id={item.id}
      image={item.image}
      imageAlt={item.imageAlt}
      name={item.name}
      price={item.price}
      />
    ))}

    </div>
  )
}

export default CartItemList