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

// Offer cards shown at top of home page
const OFFER_CARDS = [
  {
    title: "Today's Deals",
    subtitle: "Up to 70% off",
    badge: "Limited time",
    badgeColor: "bg-red-600",
    search: "deals",
    gradient: "from-orange-400 to-red-500",
    icon: "🔥",
  },
  {
    title: "Electronics",
    subtitle: "Top brands, best prices",
    badge: "Hot picks",
    badgeColor: "bg-blue-600",
    search: "electronics",
    gradient: "from-blue-500 to-indigo-600",
    icon: "⚡",
  },
  {
    title: "Home & Kitchen",
    subtitle: "Up to 60% off essentials",
    badge: "New arrivals",
    badgeColor: "bg-green-600",
    search: "home kitchen",
    gradient: "from-green-400 to-teal-500",
    icon: "🏠",
  },
  {
    title: "Fashion",
    subtitle: "Trending styles for less",
    badge: "Bestsellers",
    badgeColor: "bg-purple-600",
    search: "fashion",
    gradient: "from-purple-400 to-pink-500",
    icon: "👗",
  },
];

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

  const handleOfferClick = (search) => {
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  const handleCategoryItemClick = (itemName) => {
    navigate(`/search?q=${encodeURIComponent(itemName)}`);
  };

  return (
    <div className="relative -mt-[200px] sm:-mt-[250px] md:-mt-[300px] lg:-mt-[350px] z-10">
      <div className="max-w-screen-2xl mx-auto">

        {/* Offer Cards - NEW clickable offer boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 mb-6">
          {OFFER_CARDS.map((offer, i) => (
            <button
              key={i}
              onClick={() => handleOfferClick(offer.search)}
              className="group bg-white rounded-md shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden text-left hover:-translate-y-0.5 active:scale-95"
            >
              <div className={`bg-gradient-to-br ${offer.gradient} p-4 flex items-center justify-between`}>
                <span className="text-3xl">{offer.icon}</span>
                <span className={`${offer.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                  {offer.badge}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#c45500] transition-colors">{offer.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{offer.subtitle}</p>
                <p className="text-xs text-[#007185] mt-2 group-hover:text-[#c45500] font-medium flex items-center gap-1">
                  Shop now
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-8">
          {productData.map((section, index) => (
            <div key={index} className="bg-white p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              <div className="grid grid-cols-2 gap-3">
                {section.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCategoryItemClick(item.name)}
                    className="cursor-pointer group text-left"
                  >
                    <div className="overflow-hidden rounded">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-[120px] object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-xs mt-2 text-gray-800 group-hover:text-[#c45500] transition-colors">{item.name}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleCategoryItemClick(section.title)}
                className="text-[13px] text-[#007185] mt-4 block hover:text-[#C7511F] hover:underline"
              >
                See more
              </button>
            </div>
          ))}
        </div>

        {/* Featured products */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <button
              onClick={() => navigate('/search')}
              className="text-sm text-[#007185] hover:text-[#c45500] hover:underline font-medium"
            >
              See all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {cartItem.map((item, index) => {
              const isWishlisted = wishlistItems.some((i) => i.product_id === item.product_id);
              return (
                <div
                  key={index}
                  className="bg-white p-3 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer relative group"
                  onClick={() => navigate(`/product/${item.product_id}`)}
                >
                  {/* Discount badge */}
                  {item.discount_percentage && (
                    <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      -{item.discount_percentage}
                    </div>
                  )}

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => handleWishlist(e, item)}
                    className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow-md hover:shadow-lg"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? '#e74c3c' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isWishlisted ? '#e74c3c' : '#6b7280'} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>

                  <div className="overflow-hidden aspect-square mb-3 bg-gray-50 flex items-center justify-center rounded">
                    <ProductImage
                      src={item.img_link}
                      alt={item.product_name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
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

                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      className="w-full mt-1 bg-[#FFD814] hover:bg-[#F7CA00] text-black py-1 px-4 rounded-full font-medium text-xs transition-colors duration-200 border border-[#FCD200] active:bg-[#F2C200]"
                    >
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