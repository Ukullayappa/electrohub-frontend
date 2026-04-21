import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'created_at-DESC', label: 'Newest First' },
  { value: 'price-ASC', label: 'Price: Low to High' },
  { value: 'price-DESC', label: 'Price: High to Low' },
  { value: 'rating-DESC', label: 'Highest Rated' },
  { value: 'sold_count-DESC', label: 'Best Selling' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: 'created_at',
    order: 'DESC',
    search: searchParams.get('search') || '',
    featured: searchParams.get('featured') || '',
    isNew: searchParams.get('isNew') || '',
    page: 1,
  });

  const [sortValue, setSortValue] = useState('created_at-DESC');

  useEffect(() => {
    categoriesAPI.getAll().then(r => setCategories(r.data.categories)).catch(() => {});
    productsAPI.getBrands().then(r => setBrands(r.data.brands)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [sort, order] = sortValue.split('-');
      const params = { ...filters, sort, order, limit: 12 };
      const res = await productsAPI.getAll(params);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortValue]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', sort: 'created_at', order: 'DESC', search: '', featured: '', isNew: '', page: 1 });
    setSortValue('created_at-DESC');
    setSearchParams({});
  };

  const Skeleton = () => (
    <div className="col-6 col-md-4 col-lg-3">
      <div className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-lg)' }}></div>
    </div>
  );

  const FilterSidebar = () => (
    <div className="filter-sidebar">
      <div className="filter-title">
        Filters
        <button onClick={clearFilters} style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="filter-group">
        <div className="filter-group-title">Category</div>
        {categories.map(cat => (
          <label key={cat.id} className="filter-check">
            <input
              type="radio"
              name="category"
              checked={filters.category === cat.slug}
              onChange={() => updateFilter('category', filters.category === cat.slug ? '' : cat.slug)}
            />
            {cat.name}
            <span style={{ marginLeft: 'auto', color: 'var(--gray-3)', fontSize: '0.75rem' }}>({cat.product_count})</span>
          </label>
        ))}
      </div>

      {/* Brand */}
      <div className="filter-group">
        <div className="filter-group-title">Brand</div>
        {brands.slice(0, 8).map(b => (
          <label key={b.brand} className="filter-check">
            <input
              type="checkbox"
              checked={filters.brand === b.brand}
              onChange={() => updateFilter('brand', filters.brand === b.brand ? '' : b.brand)}
            />
            {b.brand}
            <span style={{ marginLeft: 'auto', color: 'var(--gray-3)', fontSize: '0.75rem' }}>({b.product_count})</span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <div className="filter-group-title">Price Range (₹)</div>
        <div className="price-range">
          <input
            type="number"
            className="price-input"
            placeholder="Min"
            value={filters.minPrice}
            onChange={e => updateFilter('minPrice', e.target.value)}
          />
          <span style={{ color: 'var(--gray-3)' }}>—</span>
          <input
            type="number"
            className="price-input"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={e => updateFilter('maxPrice', e.target.value)}
          />
        </div>
        <div className="d-flex flex-wrap gap-2 mt-2">
          {[['Under 10K', '', '10000'], ['10K–50K', '10000', '50000'], ['50K+', '50000', '']].map(([label, min, max]) => (
            <button
              key={label}
              onClick={() => setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max, page: 1 }))}
              style={{
                padding: '0.25rem 0.6rem',
                background: 'var(--gray-5)',
                border: '1px solid var(--gray-4)',
                borderRadius: 6,
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: 500
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="filter-group">
        <div className="filter-group-title">Availability</div>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={filters.featured === 'true'}
            onChange={() => updateFilter('featured', filters.featured === 'true' ? '' : 'true')}
          />
          Featured Products
        </label>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={filters.isNew === 'true'}
            onChange={() => updateFilter('isNew', filters.isNew === 'true' ? '' : 'true')}
          />
          New Arrivals
        </label>
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Shop</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Sidebar - Desktop */}
          <div className="col-lg-3 d-none d-lg-block">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Header Row */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                  {filters.category
                    ? categories.find(c => c.slug === filters.category)?.name || 'Products'
                    : filters.search
                    ? `Results for "${filters.search}"`
                    : 'All Products'}
                </h1>
                <p style={{ color: 'var(--gray-2)', fontSize: '0.875rem', margin: 0 }}>
                  {pagination.total} products found
                </p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                {/* Mobile Filter Toggle */}
                <button
                  className="btn btn-outline-primary btn-sm d-lg-none"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="bi bi-funnel me-1"></i> Filters
                </button>
                {/* Sort */}
                <select
                  className="form-select form-select-sm"
                  style={{ width: 180 }}
                  value={sortValue}
                  onChange={e => setSortValue(e.target.value)}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="d-lg-none mb-4">
                <FilterSidebar />
              </div>
            )}

            {/* Active Filters */}
            {(filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.search) && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {filters.category && (
                  <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 0.75rem', borderRadius: '50px', fontWeight: 500, cursor: 'pointer' }} onClick={() => updateFilter('category', '')}>
                    {categories.find(c => c.slug === filters.category)?.name} ×
                  </span>
                )}
                {filters.brand && (
                  <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 0.75rem', borderRadius: '50px', fontWeight: 500, cursor: 'pointer' }} onClick={() => updateFilter('brand', '')}>
                    {filters.brand} ×
                  </span>
                )}
                {filters.search && (
                  <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 0.75rem', borderRadius: '50px', fontWeight: 500, cursor: 'pointer' }} onClick={() => updateFilter('search', '')}>
                    "{filters.search}" ×
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="row g-3">
                {[...Array(12)].map((_, i) => <Skeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><i className="bi bi-search"></i></div>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or search term</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="row g-3">
                {products.map(product => (
                  <div key={product.id} className="col-6 col-md-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${pagination.page <= 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}>
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${pagination.page >= pagination.pages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
