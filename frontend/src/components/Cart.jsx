import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, clearCart } from '../utils/cartSlice';
import ProductImage from './ProductImage';
import toast from 'react-hot-toast';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast('Item removed', { icon: '🗑️' });
  };

  const handleClear = () => {
    dispatch(clearCart());
    toast('Cart cleared');
  };

  const shippingPrice = totalAmount > 499 ? 0 : 40;
  const finalTotal = totalAmount + shippingPrice;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 mx-auto text-gray-300 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        <h2 className="text-2xl font-medium mb-2">Your Amazon Cart is empty</h2>
        <p className="text-gray-500 mb-6 text-sm">Your shopping cart lives here. Start adding some items!</p>
        <Link to="/" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-8 rounded-full text-sm">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-medium mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart items */}
        <div className="flex-1 bg-white rounded-md shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-500">{totalQuantity} item{totalQuantity !== 1 ? 's' : ''}</span>
            <button onClick={handleClear} className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">
              Clear cart
            </button>
          </div>

          {items.map((item) => (
            <div key={item.product_id} className="flex gap-4 p-4 border-b border-gray-100 last:border-b-0">
              {/* Image */}
              <div className="w-28 h-28 bg-gray-50 flex-shrink-0 rounded flex items-center justify-center border border-gray-100">
                <ProductImage src={item.img_link} alt={item.product_name} className="w-full h-full object-contain" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product_id}`} className="text-sm font-medium hover:text-[#c45500] line-clamp-2 block mb-1">
                  {item.product_name}
                </Link>
                <p className="text-green-700 text-xs mb-2">In Stock</p>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                    <button onClick={() => dispatch(removeFromCart(item.product_id))}
                      className="px-3 py-1 hover:bg-gray-100 text-lg leading-none font-medium">−</button>
                    <span className="px-3 py-1 text-sm font-medium border-x border-gray-300">{item.quantity}</span>
                    <button onClick={() => dispatch(addToCart(item))}
                      className="px-3 py-1 hover:bg-gray-100 text-lg leading-none font-medium">+</button>
                  </div>

                  <button onClick={() => handleRemove(item.product_id)}
                    className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">
                    Delete
                  </button>

                  <Link to={`/wishlist`} onClick={() => {}}
                    className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">
                    Save for later
                  </Link>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-base">₹{item.totalPrice.toLocaleString('en-IN')}</p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-500">{item.discounted_price} each</p>
                )}
              </div>
            </div>
          ))}

          <div className="p-4 text-right border-t border-gray-200">
            <p className="text-lg font-medium">
              Subtotal ({totalQuantity} item{totalQuantity !== 1 ? 's' : ''}):
              <span className="font-bold ml-2">₹{totalAmount.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
            {totalAmount > 499 && (
              <div className="flex items-center gap-2 text-green-700 text-sm mb-3 bg-green-50 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Your order qualifies for FREE Delivery!
              </div>
            )}

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalQuantity} items)</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shippingPrice === 0 ? 'text-green-600' : ''}>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
                <span>Order Total</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 rounded-full text-sm transition-colors"
            >
              Proceed to Buy ({totalQuantity} item{totalQuantity !== 1 ? 's' : ''})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;