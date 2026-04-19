import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import AmazonLogo from '../assets/logo-amazon.svg';
import toast from 'react-hot-toast';

const Navbar = ({ onSearch }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search');
    onSearch(searchQuery);
    setIsSearchVisible(false);
  };

  const handleLogout = () => {
    logout();
    setAccountDropdown(false);
    toast.success('Signed out');
    navigate('/');
  };

  return (
    <nav className="bg-[#131921] text-white sticky top-0 z-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col">
        {/* Top bar */}
        <div className="flex items-center p-1 pl-4 pr-2 py-2">
          {/* Hamburger (mobile) */}
          <button className="lg:hidden mr-2" onClick={() => setIsSidebarOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className={`flex-shrink-0 ${isSearchVisible ? 'hidden md:flex' : 'flex'}`}>
            <img src={AmazonLogo} alt="Amazon" className="h-[25px] md:h-[35px] object-contain cursor-pointer mt-2" />
          </Link>

          {/* Deliver to */}
          <div className={`hidden md:flex items-center mr-4 hover:outline hover:outline-1 hover:outline-white p-2 cursor-pointer ${isSearchVisible ? 'md:hidden' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <div>
              <p className="text-xs text-gray-300">Deliver to</p>
              <p className="text-sm font-bold">India</p>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className={`flex-grow mx-2 ${isSearchVisible ? 'flex' : 'hidden md:flex'}`}>
            <div className="flex items-center h-10 rounded-md w-full">
              <div className="hidden md:flex items-center h-full px-4 bg-gray-200 text-gray-700 text-sm rounded-l-md hover:bg-gray-300 cursor-pointer select-none">
                All
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <input
                type="text"
                className="h-full p-2 flex-grow focus:outline-none text-black rounded-l-md md:rounded-none bg-white text-sm"
                placeholder="Search Amazon.in"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="h-full px-5 bg-[#febd69] hover:bg-[#f3a847] cursor-pointer rounded-r-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Mobile search toggle */}
          <button onClick={() => setIsSearchVisible(!isSearchVisible)} className={`md:hidden mx-2`}>
            {isSearchVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            )}
          </button>

          {/* Right links */}
          <div className={`hidden md:flex items-center space-x-1 ${isSearchVisible ? 'md:hidden' : ''}`}>
            {/* Account & Lists */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="hover:outline hover:outline-1 hover:outline-white p-2 cursor-pointer"
                onClick={() => user ? setAccountDropdown(!accountDropdown) : navigate('/sign-in')}
              >
                <p className="text-xs text-gray-300">{user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}</p>
                <p className="font-bold text-sm flex items-center">
                  Account & Lists
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </p>
              </div>

              {accountDropdown && user && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white text-black rounded shadow-xl border z-50">
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link to="/account" onClick={() => setAccountDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Your Account
                  </Link>
                  <Link to="/orders" onClick={() => setAccountDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    Your Orders
                  </Link>
                  <Link to="/wishlist" onClick={() => setAccountDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    Wishlist
                  </Link>
                  <div className="border-t">
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link to="/orders" className="hover:outline hover:outline-1 hover:outline-white p-2 cursor-pointer">
              <p className="text-xs text-gray-300">Returns</p>
              <p className="font-bold text-sm">& Orders</p>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="hover:outline hover:outline-1 hover:outline-white p-2 cursor-pointer relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>
          </div>

          {/* Cart */}
          <Link to="/cart" className={`flex items-center hover:outline hover:outline-1 hover:outline-white p-2 rounded-sm cursor-pointer ${isSearchVisible ? 'hidden md:flex' : 'flex'}`}>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 md:w-10 h-8 md:h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <span className="absolute top-0 right-0 h-4 w-4 bg-[#f3a847] text-black font-bold rounded-full flex items-center justify-center text-xs">
                {cartTotalQuantity}
              </span>
            </div>
            <span className="hidden md:inline font-bold text-sm mt-3 ml-1">Cart</span>
          </Link>
        </div>

        {/* Bottom nav bar */}
        <div className={`flex items-center bg-[#232f3e] text-sm w-full overflow-x-auto ${isSearchVisible ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex items-center w-full px-4 py-2 space-x-4">
            <div className="flex items-center cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1" onClick={() => setIsSidebarOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" />
              </svg>
              <span className="font-bold">All</span>
            </div>
            {['Best Sellers', 'Today\'s Deals', 'New Releases', 'Gift Cards', 'Amazon Pay', 'Books', 'Electronics', 'Fashion'].map((item) => (
              <p key={item} className="cursor-pointer hover:outline hover:outline-1 hover:outline-white px-2 py-1 whitespace-nowrap hidden md:block">{item}</p>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;