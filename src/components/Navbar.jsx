import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../utils/api';

const formatPrice = (p) => {
if (!p) return "₹0";
return `₹${parseFloat(p).toLocaleString('en-IN')}`;
};

export default function Navbar() {
const { user, logout, isAdmin } = useAuth();
const { cartCount } = useCart();
const navigate = useNavigate();

const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [showSearch, setShowSearch] = useState(false);
const [scrolled, setScrolled] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const searchRef = useRef(null);
const searchTimeout = useRef(null);

useEffect(() => {
const handleScroll = () => setScrolled(window.scrollY > 20);
window.addEventListener('scroll', handleScroll);
return () => window.removeEventListener('scroll', handleScroll);
}, []);

useEffect(() => {
const handleClick = (e) => {
if (searchRef.current && !searchRef.current.contains(e.target)) {
setShowSearch(false);
}
};
document.addEventListener('mousedown', handleClick);
return () => document.removeEventListener('mousedown', handleClick);
}, []);

const handleSearch = (e) => {
const val = e.target.value;
setSearchQuery(val);


clearTimeout(searchTimeout.current);

if (val.length < 2) {
  setSearchResults([]);
  setShowSearch(false);
  return;
}

searchTimeout.current = setTimeout(async () => {
  try {
    const res = await productsAPI.search(val);

    
    setSearchResults(res.data?.products || []);
    setShowSearch(true);

  } catch (err) {
    console.error("Search error:", err);
    setSearchResults([]);
  }
}, 300);


};

const handleSearchSelect = (slug) => {
setSearchQuery('');
setShowSearch(false);
navigate(`/products/${slug}`);
};

const handleSearchSubmit = (e) => {
e.preventDefault();
if (searchQuery.trim()) {
navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
setSearchQuery('');
setShowSearch(false);
}
};

const handleLogout = () => {
logout();
navigate('/');
};

const navLinks = [
{ to: '/', label: 'Home' },
{ to: '/shop', label: 'Shop' },
{ to: '/categories', label: 'Categories' },
{ to: '/deals', label: 'Deals' },
{ to: '/about', label: 'About' },
{ to: '/contact', label: 'Contact' },
];

return (
<> <div className="promo-banner">
🚀 Free shipping on orders over ₹5,000  | 
Use code <strong>ELECTRO10</strong> for 10% off <a href="/shop">Shop Now</a> </div>

  <nav className={`main-navbar sticky-top ${scrolled ? 'scrolled shadow-sm' : ''}`}>
    <div className="container">
      <div className="d-flex align-items-center py-2">

        {/* Brand */}
        <Link to="/" className="navbar-brand me-auto me-lg-4">
          Electro<span>Hub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="d-none d-lg-flex align-items-center gap-1 me-auto">
          {(navLinks || []).map(l => (
            <NavLink key={l.to} to={l.to} className="nav-link" end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Search Desktop */}
        <div className="search-wrapper d-none d-md-block me-3" ref={searchRef} style={{ flex: 1, maxWidth: 350 }}>
          <form onSubmit={handleSearchSubmit} className="position-relative">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control ps-5 rounded-pill"
              placeholder="Search products..."
              style={{ background: 'var(--gray-6)' }}
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchResults.length > 0 && setShowSearch(true)}
            />
          </form>

          {showSearch && searchResults.length > 0 && (
            <div className="search-dropdown shadow-lg">
              {(searchResults || []).map(p => (
                <div
                  key={p.id}
                  className="search-item"
                  onClick={() => handleSearchSelect(p.slug)}
                >
                  <img
                    src={p.images?.[0] || 'https://via.placeholder.com/48'}
                    alt={p.name}
                  />
                  <div className="search-item-info">
                    <div className="name">{p.name}</div>
                    <div className="brand">{p.brand}</div>
                  </div>
                  <div className="price">{formatPrice(p.price)}</div>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Right side Actions */}
        <div className="d-flex align-items-center gap-1 gap-md-2 ms-auto">
          
          {/* Mobile Search Toggle */}
          <button className="icon-btn d-md-none" onClick={() => setShowSearch(!showSearch)}>
            <i className="bi bi-search fs-5"></i>
          </button>

          {/* Cart */}
          <button className="icon-btn position-relative" onClick={() => navigate('/cart')}>
            <i className="bi bi-bag fs-5"></i>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          {/* User Desktop Only */}
          <div className="d-none d-md-block">
            {user ? (
              <div className="dropdown">
                <button className="icon-btn dropdown-toggle no-caret" data-bs-toggle="dropdown">
                  <i className="bi bi-person fs-5"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                  <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                  <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                  {isAdmin && <li><Link className="dropdown-item text-primary" to="/admin">Admin Panel</Link></li>}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2 ms-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu toggle */}
          <button className="icon-btn d-lg-none" onClick={() => setMobileMenuOpen(true)}>
            <i className="bi bi-list fs-4"></i>
          </button>
        </div>

      </div>

      {/* Mobile Search Bar (Expandable) */}
      {showSearch && (
        <div className="d-md-none py-2 border-top">
          <form onSubmit={handleSearchSubmit} className="position-relative">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              autoFocus
              className="form-control ps-5 rounded-pill"
              placeholder="Search gadgets..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </form>
        </div>
      )}
    </div>

    {/* Mobile Offcanvas Menu */}
    {mobileMenuOpen && <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
    <div className={`mobile-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
      <div className="mobile-nav-header">
        <div className="navbar-brand">Electro<span>Hub</span></div>
        <button className="btn-close" onClick={() => setMobileMenuOpen(false)}></button>
      </div>
      
      <div className="mobile-nav-links">
        {(navLinks || []).map(l => (
          <NavLink key={l.to} to={l.to} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <hr className="my-3" />
        {user ? (
          <>
            <div className="px-3 mb-3 small text-muted">Signed in as <strong>{user.name || user.email}</strong></div>
            <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
            <Link to="/orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
            {isAdmin && <Link to="/admin" className="nav-link text-primary" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>}
            <button className="nav-link text-danger border-0 bg-transparent text-start" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary w-100 mt-3" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
        )}
      </div>
    </div>
  </nav>
</>);
}
