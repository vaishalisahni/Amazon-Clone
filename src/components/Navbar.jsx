import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

const Navbar = ({ onSearch }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const toggleSearch = () => {
        setIsSearchVisible((prev) => !prev);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/search");
        onSearch(searchQuery);
        setIsSearchVisible(false);
    };

    return (
        <nav className="bg-[#131921] text-white sticky top-0 z-50">
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            <div className="flex flex-col">
                <div className="flex items-center p-1 pl-4 pr-2 py-2">
                    <button className="lg:hidden mr-2" onClick={toggleSidebar}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                            />
                        </svg>
                    </button>

                    <Link
                        to="/"
                        className={`flex-shrink-0 ${isSearchVisible ? "hidden md:flex" : "flex"}`}
                    >
                        <div className="flex items-center mr-2 md:mr-4">
                            <img
                                src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                                alt="Amazon Logo"
                                className="h-[25px] md:h-[35px] object-contain cursor-pointer mt-2"
                            />
                        </div>
                    </Link>

                    <div
                        className={`hidden md:flex items-center mr-4 hover:outline hover:outline-1 hover:outline-white p-2 cursor-pointer ${
                            isSearchVisible ? "md:hidden" : ""
                        }`}
                    >
                        <div className="pr-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-200">Deliver to Asansol</p>
                            <p className="text-sm font-bold">West Bengal 713333</p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className={`flex-grow mx-2 ${isSearchVisible ? "flex" : "hidden md:flex"}`}
                    >
                        <div className="flex items-center h-10 rounded-md w-full">
                            <div className="hidden md:flex items-center h-full px-4 bg-gray-200 text-gray-600 text-sm rounded-l-md hover:bg-gray-300 cursor-pointer">
                                All
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 h-4 ml-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="h-full p-2 flex-grow focus:outline-none text-black rounded-l-md md:rounded-none"
                                placeholder="Search Amazon.in"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="h-full px-5 bg-[#febd69] hover:bg-[#f3a847] cursor-pointer rounded-r-md flex items-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>

                    <button
                        onClick={toggleSearch}
                        className={`md:hidden mx-2 ${isSearchVisible ? "hidden" : "block"}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </button>

                    {isSearchVisible && (
                        <button onClick={toggleSearch} className="md:hidden mx-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
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
                    )}

                    <div
                        className={`hidden md:flex items-center space-x-4 mx-6 whitespace-nowrap ${
                            isSearchVisible ? "md:hidden" : ""
                        }`}
                    >
                        <div className="flex items-center hover:outline hover:outline-1 hover:outline-white p-2 cursor-pointer">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png"
                                alt="Flag"
                                className="h-4 mr-1"
                            />
                            <span className="font-bold text-sm">EN</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                />
                            </svg>
                        </div>
                        <div className="link hover:outline hover:outline-1 hover:outline-white p-2 cursor-pointer">
                            <Link to={"sign-in"}><p className="text-xs">Sign Up/Login</p></Link>
                            <p className="font-bold text-sm">
                                Account & Lists
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={3}
                                    stroke="currentColor"
                                    className="w-4 h-4 inline ml-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </p>
                        </div>
                        <div className="link hover:outline hover:outline-1 hover:outline-white p-2 cursor-pointer">
                            <p className="text-xs">Returns</p>
                            <p className="font-bold text-sm">& Orders</p>
                        </div>
                    </div>

                    <Link
                        to="/cart"
                        className={`flex items-center hover:outline hover:outline-1 hover:outline-white p-2 rounded-sm cursor-pointer ${
                            isSearchVisible ? "hidden md:flex" : "flex"
                        }`}
                    >
                        <div className="relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-8 md:w-10 h-8 md:h-10"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                />
                            </svg>
                            <span className="absolute top-0 right-0 h-4 w-4 bg-[#f3a847] text-black font-bold rounded-full flex items-center justify-center text-xs">
                                {cartTotalQuantity}
                            </span>
                        </div>
                        <span className="hidden md:inline font-bold text-sm mt-3 ml-1">Cart</span>
                    </Link>
                </div>

                <div
                    className={`flex items-center bg-[#232f3e] text-sm w-full overflow-x-auto ${
                        isSearchVisible ? "hidden md:flex" : "flex"
                    }`}
                >
                    <div className="flex items-center w-full px-4 py-2 space-x-4 text-base">
                        <div
                            className="flex items-center cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1"
                            onClick={toggleSidebar}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-6 h-6 mr-1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                                />
                            </svg>
                            <span>All</span>
                        </div>
                        <p className="cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            MX Player
                        </p>
                        <p className="cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Sell
                        </p>
                        <p className="cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Gift Cards
                        </p>
                        <p className="hidden md:block cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Amazon Pay
                        </p>
                        <p className="hidden lg:block cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Buy Again
                        </p>
                        <p className="hidden lg:block cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Books
                        </p>
                        <p className="hidden xl:block cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Health, Houshold and Personal Care
                        </p>
                        <p className="hidden xl:block cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Coupons
                        </p>
                        <p className="hidden xl:block cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Gift Ideas
                        </p>
                        <p className="hidden xl:block cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Amazon Basics
                        </p>
                        <p className="hidden xl:block cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                            Home Improvement
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
