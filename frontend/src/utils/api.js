import axios from 'axios';

const isDev = import.meta.env.DEV;

const api = axios.create({
  baseURL: isDev
    ? '/api'
    : import.meta.env.VITE_API_BASE_URL + '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send/receive cookies (httpOnly jwt cookie) on cross-origin requests
});

// Attach Bearer token from localStorage on every request (fallback for API clients)
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore malformed userInfo
    }
  }
  return config;
});

// Handle 401 globally — clear stale token and redirect to sign-in
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export default api;