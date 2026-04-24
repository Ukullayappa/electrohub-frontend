import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
? `${import.meta.env.VITE_API_URL}/api`
: '/api';

const API = axios.create({
baseURL: BASE_URL,
timeout: 15000,
headers: { 'Content-Type': 'application/json' },
});

// ─── REQUEST ─────────────────────────
API.interceptors.request.use((config) => {
const token = localStorage.getItem('token');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});

// ─── RESPONSE ────────────────────────
API.interceptors.response.use(
(res) => res,
(err) => {
if (err.response?.status === 401) {
localStorage.clear();
window.location.href = '/login';
}
return Promise.reject(err);
}
);

// ─── HELPER ─────────────────────────
const safe = (res, key, fallback = []) =>
res?.data?.[key] ?? fallback;

// ─── AUTH ───────────────────────────
export const authAPI = {
register: (data) => API.post('/auth/register', data),
login: (data) => API.post('/auth/login', data),
getMe: () => API.get('/auth/me'),
updateProfile: (data) => API.put('/auth/profile', data),
updatePassword: (data) => API.put('/auth/password', data),
};

// ─── PRODUCTS ───────────────────────
export const productsAPI = {
getAll: async (params) => {
const res = await API.get('/products', { params });
return {
data: {
products: safe(res, 'products'),
pagination: safe(res, 'pagination', {})
}
};
},
getFeatured: async () => {
const res = await API.get('/products/featured');
return { data: { products: safe(res, 'products') } };
},
getNewArrivals: async () => {
const res = await API.get('/products/new-arrivals');
return { data: { products: safe(res, 'products') } };
},
search: async (q) => {
const res = await API.get('/products/search', { params: { q } });
return { data: { products: safe(res, 'products') } };
},
getBrands: async () => {
const res = await API.get('/products/brands');
return { data: { brands: safe(res, 'brands') } };
},
getById: (id) => API.get(`/products/${id}`),
create: (data) => API.post('/products', data),
update: (id, data) => API.put(`/products/${id}`, data),
delete: (id) => API.delete(`/products/${id}`),
};

// ─── CATEGORIES ─────────────────────
export const categoriesAPI = {
getAll: async () => {
const res = await API.get('/categories');
return { data: { categories: safe(res, 'categories') } };
},
create: (data) => API.post('/categories', data),
update: (id, data) => API.put(`/categories/${id}`, data),
delete: (id) => API.delete(`/categories/${id}`),
};

// ─── CART ───────────────────────────
export const cartAPI = {
getCart: async () => {
const res = await API.get('/cart');
return { data: { items: safe(res, 'items') } };
},
addItem: (productId, quantity) =>
API.post('/cart', { productId, quantity }),
updateItem: (id, quantity) =>
API.put(`/cart/${id}`, { quantity }),
removeItem: (id) =>
API.delete(`/cart/${id}`),
clearCart: () =>
API.delete('/cart'),
};

// ─── ORDERS (FIXED) ─────────────────
export const ordersAPI = {
getAll: () => API.get('/orders'),
getById: (id) => API.get(`/orders/${id}`),
create: (data) => API.post('/orders', data),
updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
getStats: () => API.get('/orders/admin/stats'),
};

// ─── WISHLIST ───────────────────────
export const wishlistAPI = {
getAll: async () => {
const res = await API.get('/wishlist');
return { data: { items: safe(res, 'items') } };
},
toggle: (pid) => API.post('/wishlist', { productId: pid }),
remove: (pid) => API.delete(`/wishlist/${pid}`),
};

// ─── USERS (ADMIN) ──────────────────
export const usersAPI = {
getAll: () => API.get('/users'),
getById: (id) => API.get(`/users/${id}`),
delete: (id) => API.delete(`/users/${id}`),
};

export default API;
