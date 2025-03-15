import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../utils/cartSlice';
import { productData } from '../data/productData';
import { cartItem } from '../data/cartItem';

function ProductSection() {
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <div className="relative -mt-[200px] sm:-mt-[250px] md:-mt-[300px] lg:-mt-[350px] z-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-8">
          {productData.map((section, index) => (
            <div key={index} className="bg-white p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              <div className="grid grid-cols-2 gap-3">
                {section.items.map((item, idx) => (
                  <div key={idx} className="cursor-pointer group">
                    <div className="overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-[120px] object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-xs mt-2 text-gray-800">{item.name}</p>
                  </div>
                ))}
              </div>
              <a href="#" className="text-[13px] text-[#007185] mt-4 block hover:text-[#C7511F] hover:underline">
                See more
              </a>
            </div>
          ))}
        </div>

        <div className="px-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cartItem.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="overflow-hidden aspect-square mb-4">
                  <img
                    src={item.img_link}
                    alt={item.product_name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm line-clamp-2 hover:text-[#C7511F] cursor-pointer">
                    {item.product_name}
                  </h3>
                  <div className="flex items-center">
                    <span className="text-sm text-yellow-500">★</span>
                    <span className="text-sm ml-1">{item.rating}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.rating_count})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">{item.discounted_price}</span>
                    <span className="text-sm text-gray-500 line-through">{item.actual_price}</span>
                    <span className="text-sm text-red-700">{item.discount_percentage} off</span>
                  </div>
                  <button 
                    className="w-full mt-2 bg-[#FFD814] hover:bg-[#F7CA00] text-black py-1 px-4 rounded-full 
                               font-medium text-sm transition-colors duration-200 border border-[#FCD200]
                               active:bg-[#F2C200] active:border-[#F0B800]"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSection;
