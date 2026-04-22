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
];

return (
<> <div className="promo-banner">
🚀 Free shipping on orders over ₹5,000  | 
Use code <strong>ELECTRO10</strong> for 10% off <a href="/shop">Shop Now</a> </div>

  <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`}>
    <div className="container">
      <div className="d-flex align-items-center gap-3 gap-lg-4">

        {/* Brand */}
        <Link to="/" className="navbar-brand me-2">
          Electro<span>Hub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="d-none d-lg-flex align-items-center gap-1">
          {(navLinks || []).map(l => (
            <NavLink key={l.to} to={l.to} className="nav-link" end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Search */}
        <div className="search-wrapper d-none d-md-block" ref={searchRef} style={{ flex: 1, maxWidth: 400 }}>
          <form onSubmit={handleSearchSubmit}>
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchResults.length > 0 && setShowSearch(true)}
            />
          </form>

          {showSearch && searchResults.length > 0 && (
            <div className="search-dropdown">
              {(searchResults || []).map(p => (
                <div
                  key={p.id}
                  className="d-flex align-items-center gap-3 p-3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSearchSelect(p.slug)}
                >
                  <img
                    src={p.images?.[0] || 'https://via.placeholder.com/48'}
                    alt={p.name}
                    style={{ width: 44, height: 44 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div>{p.name}</div>
                    <div>{p.brand}</div>
                  </div>
                  <div>{formatPrice(p.price)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="d-flex align-items-center gap-2 ms-auto">

          {/* Cart */}
          <button onClick={() => navigate('/cart')}>
            🛒 {cartCount || 0}
          </button>

          {/* User */}
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="d-lg-none mt-3">
          {(navLinks || []).map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setMobileMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  </nav>
</>


);
}
