import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toggleWishlist } from '../utils/wishlistSlice';
import { addToCart } from '../utils/cartSlice';
import ProductImage from './ProductImage';
import toast from 'react-hot-toast';

function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.wishlist);

  const handleRemove = (item) => {
    dispatch(toggleWishlist(item));
    toast('Removed from wishlist', { icon: '💔' });
  };

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(toggleWishlist(item));
    toast.success('Moved to cart!');
  };

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 mx-auto text-gray-300 mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
      <h2 className="text-2xl font-medium mb-2">Your Wishlist is empty</h2>
      <p className="text-gray-500 mb-6 text-sm">Save items you love for later.</p>
      <Link to="/" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-8 rounded-full text-sm">
        Discover Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-medium mb-2">Your Wishlist</h1>
      <p className="text-sm text-gray-500 mb-6">{items.length} item{items.length !== 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.product_id} className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden group">
            {/* Image */}
            <Link to={`/product/${item.product_id}`}>
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-3 overflow-hidden">
                <ProductImage src={item.img_link} alt={item.product_name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200" />
              </div>
            </Link>

            <div className="p-3">
              <Link to={`/product/${item.product_id}`}>
                <h3 className="text-sm line-clamp-2 hover:text-[#c45500] mb-1">{item.product_name}</h3>
              </Link>

              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(item.rating || 4))}</span>
                <span className="text-xs text-gray-500">({item.rating_count})</span>
              </div>

              <div className="flex items-baseline gap-1 mb-3">
                <span className="font-bold">{item.discounted_price}</span>
                {item.actual_price && (
                  <span className="text-xs text-gray-400 line-through">{item.actual_price}</span>
                )}
              </div>

              <div className="space-y-2">
                <button onClick={() => handleMoveToCart(item)}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-1.5 rounded-full text-xs transition-colors">
                  Move to Cart
                </button>
                <button onClick={() => handleRemove(item)}
                  className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-1.5 rounded-full text-xs transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;