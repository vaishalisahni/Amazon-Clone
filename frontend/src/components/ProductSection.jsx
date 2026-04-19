import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../utils/cartSlice';
import { toggleWishlist } from '../utils/wishlistSlice';
import { useSelector } from 'react-redux';
import { productData } from '../data/productData';
import { cartItem } from '../data/cartItem';
import ProductImage from './ProductImage';
import toast from 'react-hot-toast';

function ProductSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    dispatch(addToCart(item));
    toast.success('Added to cart!');
  };

  const handleWishlist = (e, item) => {
    e.stopPropagation();
    const isWishlisted = wishlistItems.some((i) => i.product_id === item.product_id);
    dispatch(toggleWishlist(item));
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: isWishlisted ? '💔' : '❤️' });
  };

  return (
    <div className="relative -mt-[200px] sm:-mt-[250px] md:-mt-[300px] lg:-mt-[350px] z-10">
      <div className="max-w-screen-2xl mx-auto">
        {/* Category grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-8">
          {productData.map((section, index) => (
            <div key={index} className="bg-white p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              <div className="grid grid-cols-2 gap-3">
                {section.items.map((item, idx) => (
                  <div key={idx} className="cursor-pointer group">
                    <div className="overflow-hidden">
                      <ProductImage src={item.image} alt={item.name}
                        className="w-full h-[120px] object-cover group-hover:scale-105 transition-transform duration-200" />
                    </div>
                    <p className="text-xs mt-2 text-gray-800">{item.name}</p>
                  </div>
                ))}
              </div>
              <a href="#" className="text-[13px] text-[#007185] mt-4 block hover:text-[#C7511F] hover:underline">See more</a>
            </div>
          ))}
        </div>

        {/* Featured products */}
        <div className="px-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {cartItem.map((item, index) => {
              const isWishlisted = wishlistItems.some((i) => i.product_id === item.product_id);
              return (
                <div key={index}
                  className="bg-white p-3 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer relative group"
                  onClick={() => navigate(`/product/${item.product_id}`)}>

                  {/* Wishlist button */}
                  <button onClick={(e) => handleWishlist(e, item)}
                    className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? '#e74c3c' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isWishlisted ? '#e74c3c' : '#6b7280'} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>

                  <div className="overflow-hidden aspect-square mb-3 bg-gray-50 flex items-center justify-center rounded">
                    <ProductImage src={item.img_link} alt={item.product_name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm line-clamp-2 hover:text-[#C7511F]">{item.product_name}</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-yellow-500">{'★'.repeat(Math.floor(item.rating))}</span>
                      <span className="text-xs text-gray-500 ml-1">({item.rating_count})</span>
                    </div>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-base font-bold">{item.discounted_price}</span>
                      <span className="text-xs text-gray-400 line-through">{item.actual_price}</span>
                    </div>
                    <span className="text-xs text-red-600 font-medium">{item.discount_percentage} off</span>

                    <button onClick={(e) => handleAddToCart(e, item)}
                      className="w-full mt-1 bg-[#FFD814] hover:bg-[#F7CA00] text-black py-1 px-4 rounded-full
                                 font-medium text-xs transition-colors duration-200 border border-[#FCD200]">
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSection;