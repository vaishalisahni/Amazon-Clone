import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AmazonLogo from '../assets/logo-amazon.svg';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-white">
      <img src={AmazonLogo} alt="Amazon" className="h-10 mb-8" />

      <div className="max-w-md">
        <div className="text-8xl font-bold text-gray-200 mb-2">404</div>
        <h1 className="text-2xl font-medium text-gray-800 mb-2">
          Oops! We can't seem to find that page.
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for might have been moved, deleted, or possibly never existed.
          Happens to the best of us.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate(-1)}
            className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-full text-sm hover:bg-gray-50 transition-colors">
            ← Go Back
          </button>
          <Link to="/"
            className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-6 rounded-full text-sm transition-colors">
            Go to Amazon Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Looking for something? Try searching:</p>
          <Link to="/search" className="text-[#007185] hover:text-[#c45500] hover:underline mt-1 block">
            Search Amazon.in →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;