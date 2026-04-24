import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

export const getCategoryIcon = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('laptop')) return 'bi-laptop';
  if (n.includes('phone') || n.includes('mobile')) return 'bi-phone';
  if (n.includes('watch') || n.includes('wearable')) return 'bi-smartwatch';
  if (n.includes('audio') || n.includes('headphone') || n.includes('earbud')) return 'bi-headphones';
  if (n.includes('camera')) return 'bi-camera';
  if (n.includes('gaming') || n.includes('console')) return 'bi-controller';
  if (n.includes('tv') || n.includes('television')) return 'bi-tv';
  if (n.includes('tablet') || n.includes('pad')) return 'bi-tablet';
  if (n.includes('accessory') || n.includes('accessories')) return 'bi-usb-c-fill';
  if (n.includes('speaker')) return 'bi-speaker';
  return 'bi-tag';
};

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


    setFeaturedProducts(featured?.data?.products || []);
    setNewArrivals(newArr?.data?.products || []);
    setCategories(cats?.data?.categories || []);
  } catch (err) {
    console.error("API ERROR:", err);
    setFeaturedProducts([]);
    setNewArrivals([]);
    setCategories([]);
  } finally {
    setLoading(false);
  }
};

fetchAll();


}, []);

const displayProducts =
activeTab === 'featured' ? featuredProducts : newArrivals;

return ( <motion.div className="page-enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>

  {/* HERO */}
  <section style={{ background: '#0F172A', position: 'relative', overflow: 'hidden', padding: '6rem 0' }}>
    {/* Decorative Elements */}
    <div style={{ position: 'absolute', top: 0, left: '20%', width: 500, height: 500, background: 'rgba(0, 102, 255, 0.15)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
    <div style={{ position: 'absolute', bottom: 0, right: '10%', width: 400, height: 400, background: 'rgba(0, 212, 170, 0.1)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
    
    <div className="container position-relative z-1">
      <div className="row align-items-center g-5">
        <motion.div 
          className="col-lg-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#60A5FA', padding: '0.4rem 1rem', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '2rem' }}>
            <i className="bi bi-lightning-charge-fill"></i> NEW SEASON, NEW TECH
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, color: 'white', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            The Future<br/>
            of<br/>
            <span style={{ color: '#0066FF' }}>Electronics</span><br/>
            Is Here
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Discover cutting-edge smartphones, laptops, audio gear and more. Premium quality, unbeatable prices, delivered to your door.
          </p>
          
          <div className="d-flex flex-wrap gap-3">
            <Link to="/shop" className="btn" style={{ background: '#0066FF', color: 'white', fontWeight: 600, padding: '0.8rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Shop Now <i className="bi bi-arrow-right"></i>
            </Link>
            <Link to="/categories" className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, padding: '0.8rem 2rem', borderRadius: '12px' }}>
              Browse Categories
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="col-lg-6 position-relative mt-5 mt-lg-0"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          {/* Floating Image matching screenshot style */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto' }}>
            <img 
              src="/hero-phone.png" 
              alt="Premium Phone" 
              style={{ width: '100%', height: 'auto', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', objectFit: 'cover', display: 'block', border: '1px solid rgba(255,255,255,0.05)' }} 
            />
            
            {/* Floating Price Tag */}
            <motion.div 
              style={{ position: 'absolute', bottom: -20, left: -40, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem 1.5rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', color: 'white' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: '#60A5FA' }}>₹1,34,999</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>iPhone 15 Pro Max</div>
            </motion.div>

            {/* Floating Warranty Tag */}
            <motion.div 
              style={{ position: 'absolute', top: 40, right: -30, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.6rem 1rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <i className="bi bi-shield-check" style={{ color: '#059669' }}></i>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>2 Year Warranty</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>

  {/* CATEGORIES */}
  <section className="section-padding bg-light">
    <div className="container">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1">Browse Categories</h2>
          <p className="text-muted mb-0">Find what you need by category</p>
        </div>
        <Link to="/categories" className="text-primary text-decoration-none fw-semibold">View All <i className="bi bi-arrow-right"></i></Link>
      </div>

      {loading ? (
        <div className="row g-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="col-6 col-md-3">
              <div className="category-card p-4 bg-white border rounded-4 animate-pulse" style={{ height: '120px' }}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-3">
          {(categories || []).slice(0, 8).map(cat => (
            <div key={cat.id} className="col-6 col-md-3">
              <Link to={`/shop?category=${cat.slug}`} className="text-decoration-none">
                <div className="category-card h-100">
                  <div className="fs-3 mb-2 category-icon">
                    <i className={`bi ${getCategoryIcon(cat.name)}`}></i>
                  </div>
                  <div className="fw-bold category-name">{cat.name}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>

  {/* PRODUCTS */}
  <section className="section-padding">
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Featured Products</h2>
          <p className="text-muted mb-0">Handpicked gadgets for you</p>
        </div>
        
        <div className="bg-light p-1 rounded-3 d-inline-flex">
          <button 
            className={`btn btn-sm px-4 rounded-2 ${activeTab === 'featured' ? 'btn-primary shadow-sm' : 'btn-link text-dark text-decoration-none'}`} 
            onClick={() => setActiveTab('featured')}
          >
            Featured
          </button>
          <button 
            className={`btn btn-sm px-4 rounded-2 ${activeTab === 'newArrivals' ? 'btn-primary shadow-sm' : 'btn-link text-dark text-decoration-none'}`} 
            onClick={() => setActiveTab('newArrivals')}
          >
            New Arrivals
          </button>
        </div>
      </div>

      {loading ? (
        <div className="row g-3">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="col-6 col-md-4 col-lg-3">
              <div className="product-card border rounded-4" style={{ height: '300px' }}></div>
            </div>
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-box-seam display-4 text-muted"></i>
          <h3 className="mt-3">No products found</h3>
          <p>We couldn't find any products in this collection.</p>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {(displayProducts || []).slice(0, 8).map(product => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-5">
        <Link to="/shop" className="btn btn-outline-primary px-5 py-2 fw-semibold rounded-pill">View All Products</Link>
      </div>

    </div>
  </section>
</motion.div>
);
}
