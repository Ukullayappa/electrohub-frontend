// App Main Entry & Routing
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { Login, Register } from './pages/Auth';
import { Orders, OrderDetail, Wishlist, Profile } from './pages/UserPages';
import { Categories, Deals, About, Contact, FAQ, Shipping, Returns, Privacy, Terms } from './pages/MiscPages';
import AdminDashboard from './pages/AdminDashboard';

function Layout({ children, hideFooter = false }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}

function NotFound() {
  return (
    <Layout>
      <div className="container text-center" style={{ padding: '8rem 1rem' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', fontWeight: 800, color: 'var(--gray-4)', lineHeight: 1 }}>404</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, margin: '1rem 0' }}>Page Not Found</h2>
        <p style={{ color: 'var(--gray-2)', marginBottom: '2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="btn btn-primary btn-lg">Go Home</a>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/shop" element={<Layout><Shop /></Layout>} />
              <Route path="/products/:slug" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/categories" element={<Layout><Categories /></Layout>} />
              <Route path="/deals" element={<Layout><Deals /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/faq" element={<Layout><FAQ /></Layout>} />
              <Route path="/shipping" element={<Layout><Shipping /></Layout>} />
              <Route path="/returns" element={<Layout><Returns /></Layout>} />
              <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/terms" element={<Layout><Terms /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/checkout" element={
                <ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute><Layout><OrderDetail /></Layout></ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute><Layout><Wishlist /></Layout></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute><Layout hideFooter><AdminDashboard /></Layout></AdminRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
