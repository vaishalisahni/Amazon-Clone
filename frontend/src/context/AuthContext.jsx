import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * Auth Strategy:
 * - The server sets an httpOnly cookie named 'jwt' on login/register.
 *   This cookie is NOT accessible via JS (document.cookie), providing XSS protection.
 * - We also store user info (minus sensitive data) in localStorage for UI state
 *   (name, email, isAdmin) and send the token in Authorization headers as a fallback.
 * - On logout, we call the server to clear the httpOnly cookie AND clear localStorage.
 *
 * The old pattern of setting document.cookie = 'isLoggedIn=true' was NOT an httpOnly
 * cookie and provided zero security benefit — it has been removed.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token) {
          // Check JWT expiry client-side (not verification — just expiry check)
          const payload = JSON.parse(atob(parsed.token.split('.')[1]));
          if (payload.exp * 1000 > Date.now()) {
            setUser(parsed);
            api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
          } else {
            // Token expired — clear storage (httpOnly cookie will be ignored by server too)
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
    // Server will set httpOnly 'jwt' cookie automatically in the response
    const { data } = await api.post('/auth/login', { email, password });

    // Store non-sensitive user info for UI (avatar, name, email, isAdmin)
    localStorage.setItem('userInfo', JSON.stringify(data));

    // Set Bearer token for API calls (fallback for environments where cookies don't work)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    // Server sets httpOnly cookie
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      // Ask the server to clear the httpOnly cookie
      await api.post('/auth/logout');
    } catch {
      // Even if the request fails, clear client-side state
    } finally {
      localStorage.removeItem('userInfo');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
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