import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import ProductSection from './components/ProductSection';
import Cart from './components/Cart';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import SignIn from './components/SignIn';
import ProductDetail from './components/ProductDetail';
import OrdersPage from './components/OrdersPage';
import AccountPage from './components/AccountPage';
import CheckoutPage from './components/CheckoutPage';
import WishlistPage from './components/WishlistPage';
import NotFound from './components/NotFound';

import './App.css';

function App() {
  // searchQuery is still kept for Navbar's onSearch callback
  // but SearchPage now reads from URL ?q= param directly
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <Router>
        <div className="App flex flex-col min-h-screen">
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2500,
              style: { borderRadius: '8px', fontSize: '14px' },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Navbar onSearch={setSearchQuery} />
          <div className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Carousel />
                    <ProductSection searchQuery={searchQuery} />
                  </>
                }
              />
              {/* SearchPage reads ?q= from URL itself */}
              <Route path="/search" element={<SearchPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/sign-in" element={<SignIn />} />

              {/* Protected Routes */}
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;