import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI, productsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

// ===== CATEGORIES PAGE =====
export function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll().then(r => setCategories(r.data.categories)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      <div className="breadcrumb-section">
        <div className="container">
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Categories</li>
          </ol></nav>
        </div>
      </div>

      <div className="container section-padding">
        <div className="section-header text-center">
          <div className="section-tag">Browse</div>
          <h1 className="section-title">All Categories</h1>
          <p className="section-subtitle mx-auto">Explore our wide range of electronics across all categories</p>
        </div>

        {loading ? (
          <div className="row g-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3">
                <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {categories.map(cat => (
              <div key={cat.id} className="col-6 col-md-4 col-lg-3">
                <Link to={`/shop?category=${cat.slug}`} className="category-card" style={{ padding: '2.5rem 1.5rem' }}>
                  <div style={{ marginBottom: '1rem', overflow: 'hidden', borderRadius: 'var(--radius-md)', height: 120, position: 'relative' }}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }}
                      onError={e => e.target.style.display = 'none'}
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
                      <i className={`bi ${cat.icon || 'bi-box'}`} style={{ fontSize: '2.5rem', color: 'var(--primary)', opacity: 0.3 }}></i>
                    </div>
                  </div>
                  <div className="category-icon">
                    <i className={`bi ${cat.icon || 'bi-box'}`}></i>
                  </div>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.product_count} Products</div>
                  {cat.description && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-3)', marginTop: '0.4rem', position: 'relative', zIndex: 1, transition: 'all 0.25s' }}>
                      {cat.description}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== DEALS PAGE =====
export function Deals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ sort: 'discount_percent', order: 'DESC', limit: 24 })
      .then(r => setProducts(r.data.products.filter(p => p.discount_percent > 0)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)', color: 'white', padding: '4rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,...") repeat', opacity: 0.05 }}></div>
        <div className="container position-relative">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: 50, padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            <i className="bi bi-lightning-fill" style={{ color: '#FCD34D' }}></i>
            Hot Deals — Limited Time
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            🔥 Mega Sale Event
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto' }}>
            Massive discounts on top electronics. Don't miss out on these incredible deals!
          </p>
        </div>
      </div>

      <div className="container section-padding">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, margin: 0 }}>All Deals</h2>
            <p style={{ color: 'var(--gray-2)', margin: 0 }}>{products.length} products on sale</p>
          </div>
        </div>

        {loading ? (
          <div className="row g-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3">
                <div className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-lg)' }}></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="bi bi-tag"></i></div>
            <h3>No Active Deals</h3>
            <p>Check back soon for new deals!</p>
          </div>
        ) : (
          <div className="row g-3">
            {products.map(p => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== ABOUT PAGE =====
export function About() {
  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '1000+', label: 'Products' },
    { value: '50+', label: 'Top Brands' },
    { value: '99.9%', label: 'Uptime' },
  ];

  const team = [
    { name: 'kullayappa', role: 'CEO & Founder', color: '#0066FF' },
    { name: 'ismail', role: 'CTO', color: '#7C3AED' },
    { name: 'sadha', role: 'Head of Operations', color: '#059669' },
    { name: 'jay', role: 'Customer Success', color: '#DC2626' },
  ];

  return (
    <div className="page-enter">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--dark), var(--dark-2))', color: 'white', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'inline-block', background: 'rgba(0,102,255,0.2)', border: '1px solid rgba(0,102,255,0.3)', color: '#60A5FA', padding: '0.4rem 1rem', borderRadius: 50, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            About Us
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            We Love <span style={{ color: '#60A5FA' }}>Tech</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto' }}>
            ElectroHub is India's premium destination for authentic electronics. We're passionate about bringing you the latest technology at the best prices.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'var(--gray-6)', padding: '3rem 0', borderBottom: '1px solid var(--gray-4)' }}>
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map(s => (
              <div key={s.label} className="col-6 col-md-3">
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
                <div style={{ color: 'var(--gray-2)', fontSize: '0.875rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <div className="section-tag">Our Mission</div>
              <h2 className="section-title">Technology for Everyone</h2>
              <p style={{ color: 'var(--gray-1)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                At ElectroHub, we believe that cutting-edge technology should be accessible to everyone. Founded in 2020, we've been committed to providing the best electronics shopping experience in India.
              </p>
              <p style={{ color: 'var(--gray-1)', lineHeight: '1.8' }}>
                From premium smartphones to powerful laptops, we curate only the finest products from trusted brands worldwide. Every product in our store is 100% authentic and backed by manufacturer warranty.
              </p>
              <div className="d-flex flex-column gap-2 mt-4">
                {['100% Authentic Products', '30-day Easy Returns', 'Expert Customer Support', 'Secure & Fast Delivery'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'var(--gray-1)' }}>
                    <i className="bi bi-check-circle-fill" style={{ color: 'var(--primary)', flexShrink: 0 }}></i>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <img
                  src="https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=600"
                  alt="Our team"
                  style={{ width: '100%', height: 400, objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding" style={{ background: 'var(--gray-6)' }}>
        <div className="container">
          <div className="section-header text-center">
            <div className="section-tag">The People</div>
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {team.map(member => (
              <div key={member.name} className="col-6 col-md-3">
                <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '2rem 1.5rem', textAlign: 'center', transition: 'var(--transition)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: member.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', margin: '0 auto 1rem' }}>
                    {member.name.charAt(0)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.25rem' }}>{member.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-3)' }}>{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--primary)', color: 'white', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Upgrade Your Tech?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1rem' }}>
            Shop from 1000+ premium electronics products
          </p>
          <Link to="/shop" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, padding: '0.875rem 2.5rem' }}>
            Shop Now <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
