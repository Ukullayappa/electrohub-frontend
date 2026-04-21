import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../utils/api';

const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

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
    if (val.length < 2) { setSearchResults([]); setShowSearch(false); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await productsAPI.search(val);
        setSearchResults(res.data.products);
        setShowSearch(true);
      } catch {}
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
      setShowSearch(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/categories', label: 'Categories' },
    { to: '/deals', label: 'Deals' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <div className="promo-banner">
        🚀 Free shipping on orders over ₹5,000 &nbsp;|&nbsp; Use code <strong>ELECTRO10</strong> for 10% off
        <a href="/shop">Shop Now</a>
      </div>

      <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="d-flex align-items-center gap-3 gap-lg-4">
            {/* Brand */}
            <Link to="/" className="navbar-brand me-2">
              Electro<span>Hub</span>
            </Link>

            {/* Nav Links - Desktop */}
            <div className="d-none d-lg-flex align-items-center gap-1">
              {navLinks.map(l => (
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
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                />
              </form>
              {showSearch && searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map(p => (
                    <div
                      key={p.id}
                      className="d-flex align-items-center gap-3 p-3"
                      style={{ cursor: 'pointer', borderBottom: '1px solid var(--gray-5)' }}
                      onClick={() => handleSearchSelect(p.slug)}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-6)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <img
                        src={p.images?.[0] || 'https://via.placeholder.com/48'}
                        alt={p.name}
                        style={{ width: 44, height: 44, objectFit: 'contain', background: 'var(--gray-6)', borderRadius: 6, padding: 4 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)' }}>{p.brand} · {p.category_name}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {formatPrice(p.price)}
                      </div>
                    </div>
                  ))}
                  <div
                    className="p-3 text-center"
                    style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
                    onClick={() => { navigate(`/shop?search=${encodeURIComponent(searchQuery)}`); setShowSearch(false); }}
                  >
                    See all results for "{searchQuery}"
                  </div>
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="d-flex align-items-center gap-2 ms-auto ms-lg-0">
              {/* Cart */}
              <button className="cart-btn" onClick={() => navigate('/cart')}>
                <i className="bi bi-bag"></i>
                {cartCount > 0 && <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
              </button>

              {/* Wishlist */}
              {user && (
                <button className="cart-btn" onClick={() => navigate('/wishlist')}>
                  <i className="bi bi-heart"></i>
                </button>
              )}

              {/* User Menu */}
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn d-flex align-items-center gap-2 px-3 py-2"
                    style={{ background: 'var(--gray-5)', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: '0.875rem', fontWeight: 600 }}
                    data-bs-toggle="dropdown"
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="d-none d-lg-block">{user.name?.split(' ')[0]}</span>
                    <i className="bi bi-chevron-down" style={{ fontSize: '0.7rem', color: 'var(--gray-2)' }}></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-4)', minWidth: 200, marginTop: 8 }}>
                    <li><div className="px-3 py-2" style={{ fontSize: '0.8rem', color: 'var(--gray-2)' }}>Signed in as <strong style={{ color: 'var(--dark)' }}>{user.email}</strong></div></li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>My Profile</Link></li>
                    <li><Link className="dropdown-item" to="/orders"><i className="bi bi-bag me-2"></i>My Orders</Link></li>
                    <li><Link className="dropdown-item" to="/wishlist"><i className="bi bi-heart me-2"></i>Wishlist</Link></li>
                    {isAdmin && (
                      <>
                        <li><hr className="dropdown-divider my-1" /></li>
                        <li><Link className="dropdown-item" to="/admin"><i className="bi bi-speedometer2 me-2"></i>Admin Dashboard</Link></li>
                      </>
                    )}
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-primary btn-sm px-3">Login</Link>
                  <Link to="/register" className="btn btn-primary btn-sm px-3 d-none d-sm-block">Sign Up</Link>
                </div>
              )}

              {/* Mobile menu */}
              <button
                className="btn d-lg-none"
                style={{ background: 'var(--gray-5)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <i className={`bi ${mobileMenuOpen ? 'bi-x' : 'bi-list'}`} style={{ fontSize: '1.2rem' }}></i>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="d-lg-none mt-3 pb-3" style={{ borderTop: '1px solid var(--gray-4)', paddingTop: '1rem' }}>
              <div className="search-wrapper mb-3" ref={null}>
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="d-flex flex-column gap-1">
                {navLinks.map(l => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className="nav-link"
                    end={l.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
