import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

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

return ( <div className="page-enter">

  {/* HERO */}
  <section className="hero-section">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-3">Premium Electronics <br/><span className="text-primary">Next-Gen Tech</span></h1>
          <p className="lead mb-4 opacity-75">Discover the latest gadgets, from high-performance laptops to cutting-edge smartphones. Quality guaranteed.</p>
          <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
            <Link to="/shop" className="btn btn-primary btn-lg px-4">Shop Now</Link>
            <Link to="/deals" className="btn btn-outline-light btn-lg px-4">View Deals</Link>
          </div>
        </div>
        <div className="col-lg-6 d-none d-lg-block">
          {/* Placeholder for hero image */}
          <div className="p-5 rounded-4 shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Tech" className="img-fluid rounded-3 shadow" />
          </div>
        </div>
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
                  <div className="fs-3 mb-2 text-primary">
                    <i className="bi bi-tag"></i>
                  </div>
                  <div className="fw-bold text-dark">{cat.name}</div>
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
</div>
);
}
