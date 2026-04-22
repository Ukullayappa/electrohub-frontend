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

```
productsAPI.getBrands()
  .then(r => setBrands(r.data?.brands || []))
  .catch(() => setBrands([]));
```

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

return ( <div className="container py-4">


  <h2>Shop</h2>

  {/* PRODUCTS */}
  {loading ? (
    <p>Loading...</p>
  ) : (products || []).length === 0 ? (
    <p>No Products Found</p>
  ) : (
    <div className="row g-3">
      {(products || []).map(product => (
        <div key={product.id} className="col-6 col-md-4">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )}

  {/* PAGINATION */}
  {pagination?.pages > 1 && (
    <div className="mt-3">
      {(Array.from({ length: pagination.pages }) || []).map((_, i) => (
        <button
          key={i}
          onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )}

</div>


);
}
