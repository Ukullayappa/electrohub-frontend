import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">Electro<span>Hub</span></div>
            <p className="footer-desc">
              Your trusted destination for premium electronics. We bring you the latest gadgets, best deals, and exceptional service.
            </p>
            <div className="social-links mb-3">
              {[
                { icon: 'bi-facebook', href: 'https://www.facebook.com/share/1BGQr28RH5/' },
                { icon: 'bi-twitter-x', href: 'https://x.com/kullayappa_u' },
                { icon: 'bi-instagram', href: 'https://www.instagram.com/kullayappau?igsh=M2Zia3pqa3NpNnNh' },
                { icon: 'bi-youtube', href: 'https://youtube.com/@kullayappa-n5y?si=hhUytJiWgrpJI8ks' },
                { icon: 'bi-linkedin', href: 'https://linkedin.com/in/u-kullayappa-57a326368' },
              ].map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className={`bi ${s.icon}`}></i>
                </a>
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>
              <i className="bi bi-shield-check me-1" style={{ color: 'var(--accent)' }}></i>
              SSL Secured &nbsp;|&nbsp;
              <i className="bi bi-lock me-1" style={{ color: 'var(--accent)' }}></i>
              Safe Payments
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="footer-title">Shop</h6>
            <ul className="footer-links">
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/shop?featured=true">Featured</Link></li>
              <li><Link to="/shop?isNew=true">New Arrivals</Link></li>
              <li><Link to="/deals">Deals & Offers</Link></li>
              <li><Link to="/categories">Categories</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="footer-title">Help</h6>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns Policy</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="footer-title">Account</h6>
            <ul className="footer-links">
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-title">Newsletter</h6>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
              Subscribe for exclusive deals and tech news.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  padding: '0.6rem 0.875rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'white',
                  fontSize: '0.8rem',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <button
                style={{
                  padding: '0.6rem',
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
            <span>© 2026 ElectroHub. All rights reserved.</span>
            <div className="d-flex gap-3">
              <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
