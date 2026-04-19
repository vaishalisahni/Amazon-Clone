import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CATEGORIES = [
  {
    title: "Trending",
    items: [
      { title: "Best Sellers", search: "best sellers" },
      { title: "New Releases", search: "new releases" },
      { title: "Movers and Shakers", search: "trending" },
    ],
  },
  {
    title: "Digital Content & Devices",
    items: [
      { title: "Echo & Alexa", search: "echo alexa" },
      { title: "Fire TV", search: "fire tv" },
      { title: "Kindle eBooks", search: "kindle" },
      { title: "Amazon Prime Video", search: "prime video" },
    ],
  },
  {
    title: "Shop by Category",
    items: [
      { title: "Mobiles & Computers", search: "mobile computers" },
      { title: "TV & Appliances", search: "television" },
      { title: "Men's Fashion", search: "fashion" },
      { title: "Home & Kitchen", search: "home kitchen" },
      { title: "Electronics", search: "electronics" },
      { title: "Books", search: "books" },
      { title: "Toys & Games", search: "toys games" },
      { title: "Sports & Fitness", search: "sports fitness" },
      { title: "See All Categories", search: "" },
    ],
  },
  {
    title: "Programs & Features",
    items: [
      { title: "Gift Cards", search: "gift cards" },
      { title: "Amazon Pay", search: "amazon pay" },
      { title: "Today's Deals", search: "deals" },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  const handleCategoryClick = (search) => {
    onClose();
    if (search) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    } else {
      navigate('/search');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    toast.success('Signed out');
    navigate('/');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-70 z-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-white transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#febd69] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#232f3e" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            {user ? (
              <span className="text-base font-bold">Hello, {user.name.split(' ')[0]}</span>
            ) : (
              <Link to="/sign-in" onClick={onClose} className="text-base font-bold hover:text-[#febd69]">
                Hello, sign in
              </Link>
            )}
          </div>
          <button onClick={onClose} className="text-white hover:text-[#febd69] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {CATEGORIES.map((section, index) => (
            <div key={index}>
              <div className="px-4 pt-4 pb-1">
                <h2 className="text-base font-bold text-gray-900">{section.title}</h2>
              </div>
              <ul>
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleCategoryClick(item.search)}
                      className="w-full flex justify-between items-center px-4 py-2.5 text-sm text-black hover:bg-gray-100 text-left transition-colors"
                    >
                      <span>{item.title}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-b border-gray-200 mx-4 my-2" />
            </div>
          ))}

          {/* Quick links */}
          <div className="px-4 pt-2 pb-1">
            <h2 className="text-base font-bold text-gray-900">Help & Settings</h2>
          </div>
          <ul className="mb-4">
            {user && (
              <li>
                <Link to="/account" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  Your Account
                </Link>
              </li>
            )}
            <li>
              <Link to="/orders" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                Your Orders
              </Link>
            </li>
            <li>
              <Link to="/wishlist" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                Your Wishlist
              </Link>
            </li>
            {user ? (
              <li>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 text-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  Sign Out
                </button>
              </li>
            ) : (
              <li>
                <Link to="/sign-in" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors font-medium text-[#007185]">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;