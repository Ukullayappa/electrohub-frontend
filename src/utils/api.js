import axios from 'axios';

/**
 * On Vercel the frontend build sets VITE_API_URL to the Render backend URL.
 * Locally the Vite proxy rewrites /api → http://localhost:5000 so we use ''.
 */
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register:       (data) => API.post('/auth/register', data),
  login:          (data) => API.post('/auth/login', data),
  getMe:          ()     => API.get('/auth/me'),
  updateProfile:  (data) => API.put('/auth/profile', data),
  updatePassword: (data) => API.put('/auth/password', data),
};

// ── Products ──────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll:       (params) => API.get('/products', { params }),
  getFeatured:  ()       => API.get('/products/featured'),
  getNewArrivals: ()     => API.get('/products/new-arrivals'),
  search:       (q)      => API.get('/products/search', { params: { q } }),
  getBrands:    ()       => API.get('/products/brands'),
  getBySlug:    (slug)   => API.get(`/products/${slug}`),
  getReviews:   (id)     => API.get(`/products/${id}/reviews`),
  addReview:    (id, d)  => API.post(`/products/${id}/reviews`, d),
  create:       (data)   => API.post('/products', data),
  update:       (id, d)  => API.put(`/products/${id}`, d),
  delete:       (id)     => API.delete(`/products/${id}`),
};

// ── Categories ────────────────────────────────────────────────────────────
export const categoriesAPI = {
  getAll:    ()        => API.get('/categories'),
  getBySlug: (slug)    => API.get(`/categories/${slug}`),
  create:    (data)    => API.post('/categories', data),
  update:    (id, d)   => API.put(`/categories/${id}`, d),
  delete:    (id)      => API.delete(`/categories/${id}`),
};

// ── Cart ──────────────────────────────────────────────────────────────────
export const cartAPI = {
  getCart:    ()                 => API.get('/cart'),
  addItem:    (productId, qty)   => API.post('/cart', { productId, quantity: qty }),
  updateItem: (id, qty)          => API.put(`/cart/${id}`, { quantity: qty }),
  removeItem: (id)               => API.delete(`/cart/${id}`),
  clearCart:  ()                 => API.delete('/cart'),
  getCount:   ()                 => API.get('/cart/count'),
};

// ── Orders ────────────────────────────────────────────────────────────────
export const ordersAPI = {
  getAll:       ()       => API.get('/orders'),
  getById:      (id)     => API.get(`/orders/${id}`),
  create:       (data)   => API.post('/orders', data),
  updateStatus: (id, d)  => API.put(`/orders/${id}/status`, d),
  getStats:     ()       => API.get('/orders/admin/stats'),
};

// ── Wishlist ──────────────────────────────────────────────────────────────
export const wishlistAPI = {
  getAll: ()    => API.get('/wishlist'),
  toggle: (pid) => API.post('/wishlist', { productId: pid }),
  remove: (pid) => API.delete(`/wishlist/${pid}`),
};

export default API;
