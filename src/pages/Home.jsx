import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

const TrustBadge = ({ icon, title, desc }) => (
  <div className="col-6 col-md-3">
    <div className="trust-badge">
      <div className="trust-badge-icon"><i className={`bi ${icon}`}></i></div>
      <div className="trust-badge-text">
        <h6>{title}</h6>
        <p>{desc}</p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [featured, newArr, cats] = await Promise.all([
          productsAPI.getFeatured(),
          productsAPI.getNewArrivals(),
          categoriesAPI.getAll()
        ]);
        setFeaturedProducts(featured.data.products);
        setNewArrivals(newArr.data.products);
        setCategories(cats.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const displayProducts = activeTab === 'featured' ? featuredProducts : newArrivals;

  return (
    <div className="page-enter">
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-badge">
                <i className="bi bi-lightning-charge-fill"></i>
                New Season, New Tech
              </div>
              <h1 className="hero-title">
                The Future of<br />
                <span className="highlight">Electronics</span><br />
                Is Here
              </h1>
              <p className="hero-desc">
                Discover cutting-edge smartphones, laptops, audio gear and more. Premium quality, unbeatable prices, delivered to your door.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  Shop Now <i className="bi bi-arrow-right ms-1"></i>
                </Link>
                <Link to="/categories" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                  Browse Categories
                </Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value">50K+</div>
                  <div className="hero-stat-label">Happy Customers</div>
                </div>
                <div>
                  <div className="hero-stat-value">1000+</div>
                  <div className="hero-stat-label">Products</div>
                </div>
                <div>
                  <div className="hero-stat-value">50+</div>
                  <div className="hero-stat-label">Top Brands</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80"
                  alt="Featured Product"
                />
                {/* Floating cards */}
                <div style={{
                  position: 'absolute', top: '10%', right: '5%',
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
                  color: 'white', fontSize: '0.8rem', fontWeight: 600
                }}>
                  <i className="bi bi-shield-check text-success me-2"></i>
                  2 Year Warranty
                </div>
                <div style={{
                  position: 'absolute', bottom: '15%', left: '0%',
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
                  color: 'white', fontSize: '0.8rem'
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#60A5FA' }}>₹1,34,999</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>iPhone 15 Pro Max</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section style={{ background: 'var(--gray-6)', borderBottom: '1px solid var(--gray-4)', padding: '2rem 0' }}>
        <div className="container">
          <div className="row g-4">
            <TrustBadge icon="bi-truck" title="Free Delivery" desc="On orders above ₹5,000" />
            <TrustBadge icon="bi-shield-check" title="Secure Payment" desc="100% secure transactions" />
            <TrustBadge icon="bi-arrow-repeat" title="Easy Returns" desc="30-day return policy" />
            <TrustBadge icon="bi-headset" title="24/7 Support" desc="Dedicated customer support" />
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-tag">Browse</div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle mx-auto">Find exactly what you're looking for across our wide range of product categories</p>
          </div>
          {loading ? (
            <div className="row g-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                  <div className="skeleton" style={{ height: 150, borderRadius: 'var(--radius-lg)' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-3">
              {categories.map(cat => (
                <div key={cat.id} className="col-6 col-md-4 col-lg-3">
                  <Link to={`/shop?category=${cat.slug}`} className="category-card">
                    <div className="category-icon">
                      <i className={`bi ${cat.icon || 'bi-box'}`}></i>
                    </div>
                    <div className="category-name">{cat.name}</div>
                    <div className="category-count">{cat.product_count} Products</div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className="section-padding" style={{ background: 'var(--gray-6)' }}>
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
            <div className="section-header mb-0">
              <div className="section-tag">Curated</div>
              <h2 className="section-title mb-0">Our Top Picks</h2>
            </div>
            <div className="d-flex gap-2">
              {[
                { key: 'featured', label: 'Featured' },
                { key: 'new', label: 'New Arrivals' }
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`btn btn-sm ${activeTab === tab.key ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
              <Link to="/shop" className="btn btn-sm btn-dark">View All</Link>
            </div>
          </div>

          {loading ? (
            <div className="row g-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                  <div className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-lg)' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-3">
              {displayProducts.slice(0, 8).map(product => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PROMO SECTION ===== */}
      <section className="section-padding">
        <div className="container">
          <div className="row g-4">
            {/* Big promo */}
            <div className="col-lg-8">
              <div style={{
                background: 'linear-gradient(135deg, #0A0F1E, #1a237e)',
                borderRadius: 'var(--radius-xl)',
                padding: '3rem',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ position: 'absolute', right: -50, top: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,102,255,0.15)' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ color: '#60A5FA', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Limited Time Offer</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'white', margin: '0.5rem 0', letterSpacing: '-0.02em' }}>
                    Up to 40% Off on<br /><span style={{ color: '#60A5FA' }}>Apple Products</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Premium Apple devices at unbeatable prices. Limited stock available.</p>
                  <Link to="/shop?brand=Apple" className="btn btn-primary btn-lg">
                    Shop Apple <i className="bi bi-apple ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Two small promos */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-4">
                <div style={{
                  background: 'linear-gradient(135deg, #065F46, #047857)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  flex: 1
                }}>
                  <span style={{ color: '#6EE7B7', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>New Arrivals</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: '0.4rem 0' }}>Latest Laptops</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1rem' }}>From M3 MacBooks to Gaming Beasts</p>
                  <Link to="/shop?category=laptops" style={{ color: '#6EE7B7', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    Explore →
                  </Link>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  flex: 1
                }}>
                  <span style={{ color: '#C4B5FD', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hot Deal</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: '0.4rem 0' }}>Gaming Gear</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1rem' }}>Consoles, headsets & more</p>
                  <Link to="/shop?category=gaming" style={{ color: '#C4B5FD', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section style={{ background: 'var(--gray-6)', padding: '3rem 0', borderTop: '1px solid var(--gray-4)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-3)' }}>
              Trusted Brands We Carry
            </p>
          </div>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
            {['Apple', 'Samsung', 'Sony', 'Dell', 'ASUS', 'OnePlus', 'GoPro', 'Bose'].map(brand => (
              <Link
                key={brand}
                to={`/shop?brand=${brand}`}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--gray-3)',
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                  letterSpacing: '-0.01em'
                }}
                onMouseEnter={e => e.target.style.color = 'var(--dark)'}
                onMouseLeave={e => e.target.style.color = 'var(--gray-3)'}
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
