import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../utils/cartSlice';
import { toggleWishlist } from '../utils/wishlistSlice';
import { cartItem as localProducts } from '../data/cartItem';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

function StarRating({ rating, size = 'md' }) {
  const stars = [1, 2, 3, 4, 5];
  const s = size === 'sm' ? 'w-3 h-3' : 'w-5 h-5';
  return (
    <div className="flex">
      {stars.map((star) => (
        <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={s}
          fill={star <= Math.round(rating) ? '#F3A847' : 'none'} stroke="#F3A847" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImg, setSelectedImg] = useState(0);

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((i) => i.product_id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        // fallback to local data
        const found = localProducts.find((p) => p.product_id === id);
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) dispatch(addToCart(product));
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    dispatch(addToCart(product));
    navigate('/checkout');
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: isWishlisted ? '💔' : '❤️' });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/sign-in'); return; }
    setReviewLoading(true);
    try {
      await api.post(`/products/${product._id}/reviews`, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      // Refresh product
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#febd69]" />
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-2">Product not found</h2>
      <button onClick={() => navigate('/')} className="text-[#007185] hover:underline">Go back home</button>
    </div>
  );

  const images = product.images?.length ? product.images : [product.img_link];
  const features = product.about_product?.split('|').map((f) => f.trim()).filter(Boolean) || [];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#007185] mb-4 flex gap-1 flex-wrap">
          <button onClick={() => navigate('/')} className="hover:underline">Home</button>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500">{product.category?.split('|')[0]}</span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700 line-clamp-1 max-w-xs">{product.product_name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Images */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="flex gap-3">
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex flex-col gap-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImg(i)}
                      className={`w-14 h-14 border-2 rounded ${i === selectedImg ? 'border-[#febd69]' : 'border-gray-200'}`}>
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
              {/* Main image */}
              <div className="flex-1 border border-gray-200 rounded-md flex items-center justify-center p-4 min-h-80 bg-white">
                <img src={images[selectedImg]} alt={product.product_name} className="max-h-80 object-contain" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-xl font-medium leading-snug mb-2">{product.product_name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={product.rating || 4} />
              <span className="text-[#007185] text-sm hover:text-[#c45500] cursor-pointer">
                {product.rating_count || '0'} ratings
              </span>
            </div>

            <div className="border-t border-b border-gray-200 py-3 mb-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl font-medium">{product.discounted_price}</span>
                {product.actual_price && (
                  <>
                    <span className="text-gray-500 text-sm line-through">M.R.P: {product.actual_price}</span>
                    <span className="text-red-600 text-sm">({product.discount_percentage} off)</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <ul className="mb-4 space-y-1">
                {features.map((f, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Availability */}
            <p className="text-green-700 font-medium text-sm mb-4">
              In Stock — Usually dispatched in 1–2 days
            </p>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none"
              >
                {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                  <option key={n} value={n}>Qty: {n}</option>
                ))}
              </select>

              <button onClick={handleAddToCart}
                className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-6 rounded-full text-sm transition-colors active:bg-[#F2C200]">
                Add to Cart
              </button>

              <button onClick={handleBuyNow}
                className="bg-[#FF9900] hover:bg-[#e68a00] border border-[#e68a00] text-black font-medium py-2 px-6 rounded-full text-sm transition-colors">
                Buy Now
              </button>
            </div>

            <button onClick={handleWishlist}
              className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#c45500] hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? '#e74c3c' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isWishlisted ? '#e74c3c' : 'currentColor'} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Delivery info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm space-y-1 border border-gray-200">
              <div className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span><b>FREE Delivery</b> on orders over ₹499</span>
              </div>
              <div className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>10-day easy returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="mt-10">
          <div className="flex border-b border-gray-200 mb-6">
            {['description', 'reviews'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'border-b-2 border-[#febd69] text-[#c45500]' : 'text-gray-600 hover:text-gray-900'}`}>
                {tab === 'reviews' ? `Reviews (${product.reviews?.length || 0})` : 'Description'}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="max-w-2xl">
              <h3 className="font-bold text-lg mb-3">About this item</h3>
              {features.length > 0 ? (
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-[#febd69] font-bold mt-0.5">›</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">{product.description || 'No description available.'}</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-2xl">
              {/* Rating summary */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-5xl font-bold">{(product.rating || 0).toFixed(1)}</p>
                  <StarRating rating={product.rating || 0} />
                  <p className="text-xs text-gray-500 mt-1">{product.rating_count || 0} ratings</p>
                </div>
              </div>

              {/* Existing reviews */}
              {product.reviews?.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {product.reviews.map((rev) => (
                    <div key={rev._id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-[#febd69] rounded-full flex items-center justify-center text-sm font-bold">
                          {rev.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{rev.name}</span>
                        <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <StarRating rating={rev.rating} size="sm" />
                      <p className="text-sm text-gray-700 mt-1">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-6">No reviews yet. Be the first!</p>
              )}

              {/* Write a review */}
              {user ? (
                <div>
                  <h3 className="font-bold text-base mb-3">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">Your Rating</label>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((s) => (
                          <button key={s} type="button" onClick={() => setReviewRating(s)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7"
                              fill={s <= reviewRating ? '#F3A847' : 'none'} stroke="#F3A847" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Review</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                        required
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#febd69]"
                        placeholder="What did you like or dislike?"
                      />
                    </div>
                    <button type="submit" disabled={reviewLoading}
                      className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-5 rounded-full text-sm disabled:opacity-50">
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <p className="text-sm">
                  <button onClick={() => navigate('/sign-in')} className="text-[#007185] hover:underline">Sign in</button> to write a review.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;