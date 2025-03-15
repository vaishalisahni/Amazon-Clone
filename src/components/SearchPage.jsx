import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../utils/cartSlice";
import { cartItem } from "../data/cartItem";

const FilterSection = ({ title, options, selectedOptions, onOptionChange }) => (
    <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-bold mb-2">{title}</h3>
        <div className="space-y-2">
            {options.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        onChange={() => onOptionChange(option)}
                        className="h-4 w-4 text-amazon-yellow"
                    />
                    <span className="text-sm">{option}</span>
                </label>
            ))}
        </div>
    </div>
);

function SearchPage({ searchQuery }) {
    const dispatch = useDispatch();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
    };

    const parsePriceString = (priceStr) => {
        return parseFloat(priceStr.replace("₹", "").replace(",", ""));
    };

    const isPriceInRange = (price, range) => {
        const numericPrice = parsePriceString(price);
        switch (range) {
            case "Under ₹1,000":
                return numericPrice < 1000;
            case "₹1,000 - ₹5,000":
                return numericPrice >= 1000 && numericPrice <= 5000;
            case "₹5,000 - ₹10,000":
                return numericPrice >= 5000 && numericPrice <= 10000;
            case "Over ₹10,000":
                return numericPrice > 10000;
            default:
                return false;
        }
    };

    const filteredProducts = useMemo(() => {
        const query = searchQuery?.toLowerCase() || "";
        return cartItem.filter((item) => {
            const matchesSearch =
                item.product_name.toLowerCase().includes(query) ||
                item.category?.toLowerCase().includes(query);
            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.some((category) =>
                    item.category?.toLowerCase().includes(category.toLowerCase())
                );
            const matchesRating =
                selectedRatings.length === 0 ||
                selectedRatings.some((rating) => Math.floor(item.rating) >= parseInt(rating));
            const matchesPrice =
                selectedPriceRanges.length === 0 ||
                selectedPriceRanges.some((range) => isPriceInRange(item.discounted_price, range));
            return matchesSearch && matchesCategory && matchesRating && matchesPrice;
        });
    }, [searchQuery, selectedCategories, selectedRatings, selectedPriceRanges]);

    const filterSections = [
        {
            title: "Department",
            options: [
                "Electronics",
                "Home & Kitchen",
                "Fashion",
                "Books",
                "Beauty",
                "Toys & Games",
                "Sports & Fitness",
                "Automotive",
            ],
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

    return (
        <div className="max-w-screen-2xl mx-auto px-4 py-4 md:py-6">
            {/* Mobile Filter Button */}
            <button
                className="md:hidden w-full mb-4 bg-white p-3 rounded-lg shadow flex items-center justify-center space-x-2"
                onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                    />
                </svg>
                <span>Filter Products</span>
            </button>

            <div className="flex flex-col md:flex-row gap-4">
                {/* Filters Sidebar */}
                <div
                    className={`${
                        isFilterVisible ? "block" : "hidden"
                    } md:block w-full md:w-64 flex-shrink-0`}
                >
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center md:hidden mb-4">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button onClick={() => setIsFilterVisible(false)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
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
                                            ? prev.filter((item) => item !== option)
                                            : [...prev, option]
                                    );
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Product List */}
                <div className="flex-grow">
                    <h1 className="text-xl font-bold mb-4">
                        {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
                        <span className="text-gray-500 text-sm ml-2">
                            ({filteredProducts.length} items)
                        </span>
                    </h1>

                    <div className="space-y-4">
                        {filteredProducts.map((item) => (
                            <div
                                key={item.product_id}
                                className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row"
                            >
                                <div className="w-full sm:w-48 h-48 flex-shrink-0 mb-4 sm:mb-0">
                                    <img
                                        src={item.img_link || "https://via.placeholder.com/200"}
                                        alt={item.product_name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="sm:ml-6 flex-grow">
                                    <h3 className="text-lg font-medium hover:text-[#C7511F] cursor-pointer">
                                        {item.product_name}
                                    </h3>

                                    <div className="flex items-center mt-2">
                                        <span className="text-[#F3A847] text-sm">
                                            {"★".repeat(Math.floor(item.rating))}
                                        </span>
                                        <span className="text-[#007185] text-sm ml-2 hover:text-[#C7511F] cursor-pointer">
                                            {item.rating_count} ratings
                                        </span>
                                    </div>

                                    <div className="mt-2">
                                        <span className="text-2xl font-medium">
                                            {item.discounted_price}
                                        </span>
                                        {item.actual_price && (
                                            <>
                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                    {item.actual_price}
                                                </span>
                                                <span className="text-sm text-[#CC0C39] ml-2">
                                                    ({item.discount_percentage} off)
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="text-sm text-[#007600] mt-1">In Stock</div>

                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="mt-4 bg-[#FFD814] hover:bg-[#F7CA00] text-black py-1 px-4 rounded-full text-sm font-medium"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-8">
                                <h2 className="text-xl font-bold mb-2">No results found</h2>
                                <p className="text-gray-600">
                                    We couldn't find any matches for "{searchQuery}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
