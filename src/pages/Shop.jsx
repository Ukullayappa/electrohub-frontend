import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
const [searchParams, setSearchParams] = useSearchParams();

const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [brands, setBrands] = useState([]);
const [loading, setLoading] = useState(true);
const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

const [filters, setFilters] = useState({
category: searchParams.get('category') || '',
brand: searchParams.get('brand') || '',
search: searchParams.get('search') || '',
page: 1,
});

// ✅ SAFE FETCH
useEffect(() => {
categoriesAPI.getAll()
.then(r => setCategories(r.data?.categories || []))
.catch(() => setCategories([]));

    productsAPI.getBrands()
      .then(r => setBrands(r.data?.brands || []))
      .catch(() => setBrands([]));


}, []);

const fetchProducts = useCallback(async () => {
setLoading(true);
try {
const res = await productsAPI.getAll({ ...filters, limit: 12 });



  setProducts(res.data?.products || []);
  setPagination(res.data?.pagination || { page: 1, total: 0, pages: 1 });

} catch (err) {
  console.error(err);
  setProducts([]);
} finally {
  setLoading(false);
}


}, [filters]);

useEffect(() => {
fetchProducts();
}, [fetchProducts]);

const clearFilters = () => {
setFilters({ category: '', brand: '', search: '', page: 1 });
setSearchParams({});
};

  return (
    <div className="container py-5 page-enter">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h1 className="fw-bold h2 mb-1">Our Collection</h1>
          <p className="text-muted mb-0">Discover {pagination.total} premium gadgets ready for you</p>
        </div>
        
        <div className="d-flex gap-2">
          <select 
            className="form-select rounded-pill px-3" 
            style={{ width: 'auto' }}
            value={filters.category}
            onChange={(e) => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          
          <button className="btn btn-outline-secondary rounded-pill px-3" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <div className="row g-3 g-md-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="col-6 col-md-4 col-lg-3">
              <div className="product-card border rounded-4 animate-pulse" style={{ height: '350px' }}></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-search display-1 text-muted opacity-25"></i>
          <h2 className="mt-4 fw-bold">No products found</h2>
          <p className="text-muted">Try adjusting your filters or search terms.</p>
          <button className="btn btn-primary mt-3" onClick={clearFilters}>Clear all filters</button>
        </div>
      ) : (
        <>
          <div className="row g-3 g-md-4">
            {products.map(product => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {pagination?.pages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <nav>
                <ul className="pagination gap-2">
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link rounded-3 border-0 shadow-sm"
                        onClick={() => {
                          setFilters(p => ({ ...p, page: i + 1 }));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
