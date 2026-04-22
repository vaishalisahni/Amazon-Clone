import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addToCart } from "../utils/cartSlice";
import { toggleWishlist } from "../utils/wishlistSlice";
import { useSelector } from "react-redux";
import { cartItem } from "../data/cartItem";
import ProductImage from "./ProductImage";
import toast from "react-hot-toast";

const FilterSection = ({ title, options, selectedOptions, onOptionChange }) => (
  <div className="mb-4 md:mb-6">
    <h3 className="text-base md:text-lg font-bold mb-2">{title}</h3>
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer hover:text-[#c45500]">
          <input
            type="checkbox"
            checked={selectedOptions.includes(option)}
            onChange={() => onOptionChange(option)}
            className="h-4 w-4 accent-[#febd69]"
          />
          <span className="text-sm">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const SORT_OPTIONS = [
  { value: "relevance", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "discount", label: "Best Discount" },
];

function SearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const parsePriceString = (priceStr) =>
    parseFloat((priceStr || "0").replace("₹", "").replace(/,/g, ""));

  const isPriceInRange = (price, range) => {
    const n = parsePriceString(price);
    if (range === "Under ₹1,000") return n < 1000;
    if (range === "₹1,000 - ₹5,000") return n >= 1000 && n <= 5000;
    if (range === "₹5,000 - ₹10,000") return n >= 5000 && n <= 10000;
    if (range === "Over ₹10,000") return n > 10000;
    return false;
  };

  const filteredProducts = useMemo(() => {
    const query = urlQuery.toLowerCase().trim();
    let results = cartItem.filter((item) => {
      // Search across name, category, about_product — this makes "best sellers",
      // "deals", "new releases", "gift cards", "amazon pay" all work
      const searchableText = [
        item.product_name,
        item.category,
        item.about_product,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((c) =>
          item.category?.toLowerCase().includes(c.toLowerCase())
        );
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((r) => isPriceInRange(item.discounted_price, r));

      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price_asc")
      results = [...results].sort(
        (a, b) => parsePriceString(a.discounted_price) - parsePriceString(b.discounted_price)
      );
    else if (sortBy === "price_desc")
      results = [...results].sort(
        (a, b) => parsePriceString(b.discounted_price) - parsePriceString(a.discounted_price)
      );
    else if (sortBy === "rating")
      results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "discount")
      results = [...results].sort(
        (a, b) => parseFloat(b.discount_percentage) - parseFloat(a.discount_percentage)
      );

    return results;
  }, [urlQuery, selectedCategories, selectedPriceRanges, sortBy]);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    dispatch(addToCart(item));
    toast.success("Added to cart!");
  };

  const handleWishlist = (e, item) => {
    e.stopPropagation();
    const isWishlisted = wishlistItems.some((i) => i.product_id === item.product_id);
    dispatch(toggleWishlist(item));
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      icon: isWishlisted ? "💔" : "❤️",
    });
  };

  const filterSections = [
    {
      title: "Department",
      options: ["Electronics", "Home & Kitchen", "Fashion", "Books", "Beauty", "Toys & Games", "Sports & Fitness"],
      selected: selectedCategories,
      onChange: setSelectedCategories,
    },
    {
      title: "Price",
      options: ["Under ₹1,000", "₹1,000 - ₹5,000", "₹5,000 - ₹10,000", "Over ₹10,000"],
      selected: selectedPriceRanges,
      onChange: setSelectedPriceRanges,
    },
  ];

  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRanges.length > 0;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-4 md:py-6">
      {/* Mobile Filter Button */}
      <button
        className="md:hidden w-full mb-4 bg-white p-3 rounded-lg shadow flex items-center justify-center space-x-2 border border-gray-200"
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
        <span className="font-medium">Filter Products</span>
        {hasActiveFilters && (
          <span className="bg-[#febd69] text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
            {selectedCategories.length + selectedPriceRanges.length}
          </span>
        )}
      </button>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters Sidebar */}
        <div className={`${isFilterVisible ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0`}>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={() => { setSelectedCategories([]); setSelectedPriceRanges([]); }}
                  className="text-xs text-[#007185] hover:text-[#c45500] hover:underline"
                >
                  Clear all
                </button>
              )}
              <button onClick={() => setIsFilterVisible(false)} className="md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {filterSections.map((section, index) => (
              <FilterSection
                key={index}
                title={section.title}
                options={section.options}
                selectedOptions={section.selected}
                onOptionChange={(option) => {
                  section.onChange((prev) =>
                    prev.includes(option)
                      ? prev.filter((i) => i !== option)
                      : [...prev, option]
                  );
                }}
              />
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="flex-grow">
          {/* Header with sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h1 className="text-xl font-medium">
              {urlQuery ? (
                <>
                  Results for <span className="font-bold">"{urlQuery}"</span>
                </>
              ) : (
                "All Products"
              )}
              <span className="text-gray-500 text-sm font-normal ml-2">
                ({filteredProducts.length} results)
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded p-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#febd69]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredProducts.map((item) => {
              const isWishlisted = wishlistItems.some((i) => i.product_id === item.product_id);
              return (
                <div
                  key={item.product_id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col sm:flex-row hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-full sm:w-48 h-48 flex-shrink-0 mb-4 sm:mb-0 rounded overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  >
                    {/* Pass product={item} so SVG icon is category-aware */}
                    <ProductImage
                      src={item.img_link}
                      alt={item.product_name}
                      className="w-full h-full object-contain"
                      product={item}
                    />
                  </div>
                  <div className="sm:ml-6 flex-grow">
                    <h3
                      className="text-base font-medium hover:text-[#C7511F] cursor-pointer line-clamp-2"
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    >
                      {item.product_name}
                    </h3>
                    <div className="flex items-center mt-1.5">
                      <span className="text-[#F3A847] text-sm">{"★".repeat(Math.floor(item.rating))}</span>
                      <span className="text-xs text-gray-400 ml-0.5">{"☆".repeat(5 - Math.floor(item.rating))}</span>
                      <span className="text-[#007185] text-sm ml-2 hover:text-[#C7511F] cursor-pointer">
                        {item.rating_count} ratings
                      </span>
                    </div>
                    {item.about_product && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {item.about_product.split("|")[0]}
                      </p>
                    )}
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-medium">{item.discounted_price}</span>
                      {item.actual_price && item.discount_percentage !== "0%" && (
                        <>
                          <span className="text-sm text-gray-500 line-through">{item.actual_price}</span>
                          <span className="text-sm text-red-600 font-medium">({item.discount_percentage} off)</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-green-700 font-medium mt-0.5">In Stock</div>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="bg-[#FFD814] hover:bg-[#F7CA00] text-black py-1.5 px-5 rounded-full text-sm font-medium border border-[#FCD200] transition-colors"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => handleWishlist(e, item)}
                        className="flex items-center gap-1 text-sm text-[#007185] hover:text-[#c45500] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "#e74c3c" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isWishlisted ? "#e74c3c" : "currentColor"} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        {isWishlisted ? "Wishlisted" : "Wishlist"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <h2 className="text-xl font-bold mb-2">No results found</h2>
                <p className="text-gray-500 text-sm mb-4">
                  {urlQuery ? `We couldn't find any matches for "${urlQuery}"` : "No products match your filters"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setSelectedCategories([]); setSelectedPriceRanges([]); }}
                    className="text-[#007185] hover:underline text-sm mr-4"
                  >
                    Clear filters
                  </button>
                )}
                <button onClick={() => navigate("/")} className="text-[#007185] hover:underline text-sm">
                  Go back home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;