import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

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
      // ✅ SAFE DATA HANDLING
      setFeaturedProducts(featured?.data?.products || []);
      setNewArrivals(newArr?.data?.products || []);
      setCategories(cats?.data?.categories || []);
    } catch (err) {
      console.error("API ERROR:", err);
      // fallback safety
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

return ( <div className="page-enter">

```
  {/* ===== HERO ===== */}
  <section className="hero-section">
    <div className="container">
      <h1>ElectroHub</h1>
      <p>Best Electronics Store</p>
    </div>
  </section>

  {/* ===== CATEGORIES ===== */}
  <section className="section-padding">
    <div className="container">
      <h2>Categories</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row g-3">
          {(categories || []).map(cat => (
            <div key={cat.id} className="col-6 col-md-4 col-lg-3">
              <Link to={`/shop?category=${cat.slug}`}>
                {cat.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>

  {/* ===== PRODUCTS ===== */}
  <section className="section-padding">
    <div className="container">

      <div className="d-flex gap-2 mb-3">
        <button onClick={() => setActiveTab('featured')}>
          Featured
        </button>
        <button onClick={() => setActiveTab('new')}>
          New Arrivals
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="row g-3">
          {(displayProducts || []).slice(0, 8).map(product => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

    </div>
  </section>

</div>


);
}
