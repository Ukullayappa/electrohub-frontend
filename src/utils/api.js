import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
? `${import.meta.env.VITE_API_URL}/api`
: '/api';

const API = axios.create({
baseURL: BASE_URL,
timeout: 15000,
headers: { 'Content-Type': 'application/json' },
});

// Attach token
API.interceptors.request.use((config) => {
const token = localStorage.getItem('token');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});

// Handle 401
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

// 🔥 HELPER: safe data extractor
const safe = (res, key, fallback = []) => {
return res?.data?.[key] ?? fallback;
};

// ── PRODUCTS ─────────────────────────────────────
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
};

// ── CATEGORIES ───────────────────────────────────
export const categoriesAPI = {
getAll: async () => {
const res = await API.get('/categories');
return { data: { categories: safe(res, 'categories') } };
}
};

// ── CART ─────────────────────────────────────────
export const cartAPI = {
getCart: async () => {
const res = await API.get('/cart');
return { data: { items: safe(res, 'items') } };
}
};

// ── WISHLIST ─────────────────────────────────────
export const wishlistAPI = {
getAll: async () => {
const res = await API.get('/wishlist');
return { data: { items: safe(res, 'items') } };
},

toggle: (pid) => API.post('/wishlist', { productId: pid }),
};

export default API;
