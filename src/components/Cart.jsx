import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../utils/cartSlice';
import { cartItem } from '../data/cartItem';

function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const recommendedItems = useMemo(() => {
    const shuffled = [...cartItem].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, []);

  const handleIncreaseQuantity = (item) => dispatch(addToCart(item));
  const handleDecreaseQuantity = (id) => dispatch(removeFromCart(id));
  const handleClearCart = () => dispatch(clearCart());

  const formatPrice = (price) => `₹${price.toFixed(2)}`;

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl lg:text-3xl font-medium">Shopping Cart</h1>
              <Link to="/" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
                Continue Shopping
              </Link>
            </div>
            <div className="border-b border-gray-200 mb-4">
              {cart.items.length === 0 ? (
                <div className="py-8 text-center">
                  <h2 className="text-lg lg:text-xl">Your Amazon Cart is empty</h2>
                  <div className="mt-2">
                    <Link to="/" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
                      Shop today's deals
                    </Link>
                  </div>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item.product_id} className="flex flex-col md:flex-row py-4 border-b gap-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 mx-auto md:mx-0">
                      <img
                        src={item.img_link}
                        alt={item.product_name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-base lg:text-lg font-medium line-clamp-2">{item.product_name}</h3>
                      <div className="text-sm text-green-600 mt-1">In Stock</div>
                      <div className="mt-1">
                        <span className="text-lg font-bold">{formatPrice(item.itemPrice)}</span>
                        {item.actual_price && (
                          <>
                            <span className="text-sm text-gray-500 line-through ml-2">{item.actual_price}</span>
                            <span className="text-sm text-green-600 ml-2">{item.discount_percentage}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center mt-2 space-x-2">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => handleDecreaseQuantity(item.product_id)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x">{item.quantity}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(item)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleDecreaseQuantity(item.product_id)}
                          className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Item Total: <span className="font-bold text-black">{formatPrice(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.items.length > 0 && (
              <div className="text-right text-lg">
                Subtotal ({cart.totalQuantity} items):{' '}
                <span className="font-bold">{formatPrice(cart.totalAmount)}</span>
              </div>
            )}
          </div>
          <div className="lg:w-[300px] space-y-8">
            {cart.items.length > 0 && (
              <div className="bg-white p-4 border rounded-lg sticky top-20">
                <div className="text-lg mb-4">
                  Subtotal ({cart.totalQuantity} items):{' '}
                  <span className="font-bold">{formatPrice(cart.totalAmount)}</span>
                </div>
                <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 border border-[#FCD200] active:bg-[#F2C200] active:border-[#F0B800] mb-2">
                  Proceed to Buy
                </button>
                <button
                  onClick={handleClearCart}
                  className="w-full mt-2 text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
                >
                  Clear cart
                </button>
              </div>
            )}
            <div className="bg-white p-4 border rounded-lg sticky top-80">
              <h2 className="text-lg font-bold mb-4">Customers Also Shopped For</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recommendedItems.map((item) => (
                  <div key={item.product_id} className="bg-white">
                    <img
                      src={item.img_link || 'https://via.placeholder.com/100'}
                      alt={item.product_name}
                      className="w-full object-contain mb-2"
                    />
                    <h3 className="text-sm line-clamp-2 mb-1">{item.product_name}</h3>
                    <div className="text-sm font-medium">{item.discounted_price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
