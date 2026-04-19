import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Use localStorage but with proper token management
// For httpOnly cookies you'd need backend changes; this uses secure client storage pattern
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Verify token not expired (JWT decode without verify)
        if (parsed.token) {
          const payload = JSON.parse(atob(parsed.token.split('.')[1]));
          if (payload.exp * 1000 > Date.now()) {
            setUser(parsed);
            api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
          } else {
            // Token expired, clear it
            localStorage.removeItem('userInfo');
          }
        }
      } catch {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    // Set a cookie as well for cross-tab awareness
    document.cookie = `isLoggedIn=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    document.cookie = `isLoggedIn=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    // Clear cookie
    document.cookie = 'isLoggedIn=; path=/; max-age=0';
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};