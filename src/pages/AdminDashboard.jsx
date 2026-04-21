import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI, productsAPI, categoriesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const formatPrice = (p) => `₹${parseFloat(p || 0).toLocaleString('en-IN')}`;
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

const STATUS_COLORS = {
  pending: 'status-pending', processing: 'status-processing',
  shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled'
};

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    fetchData();
  }, [isAdmin, activeSection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSection === 'dashboard') {
        const [statsRes, ordersRes] = await Promise.all([
          ordersAPI.getStats(),
          ordersAPI.getAll()
        ]);
        setStats(statsRes.data.stats);
        setOrders(ordersRes.data.orders);
      } else if (activeSection === 'products') {
        const res = await productsAPI.getAll({ limit: 50 });
        setProducts(res.data.products);
      } else if (activeSection === 'orders') {
        const res = await ordersAPI.getAll();
        setOrders(res.data.orders);
      } else if (activeSection === 'categories') {
        const res = await categoriesAPI.getAll();
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, { status });
      toast.success('Order status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const navItems = [
    { key: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { key: 'products', icon: 'bi-box-seam', label: 'Products' },
    { key: 'orders', icon: 'bi-bag', label: 'Orders' },
    { key: 'categories', icon: 'bi-grid', label: 'Categories' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }} className="page-enter">
      {/* Sidebar */}
      <div style={{ width: 240, background: 'var(--dark)', flexShrink: 0, padding: '1.5rem 0' }}>
        <div style={{ padding: '0 1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1rem' }}>Admin Panel</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{user?.email}</div>
        </div>
        <nav style={{ padding: '1rem 0.75rem' }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.7rem 0.875rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.2rem',
                background: activeSection === item.key ? 'rgba(0,102,255,0.2)' : 'none',
                color: activeSection === item.key ? '#60A5FA' : 'rgba(255,255,255,0.6)',
                border: activeSection === item.key ? '1px solid rgba(0,102,255,0.3)' : '1px solid transparent',
                fontSize: '0.875rem', fontWeight: activeSection === item.key ? 600 : 400,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)',
                transition: 'var(--transition)'
              }}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '1rem', paddingTop: '1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.875rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none', borderRadius: 'var(--radius-sm)' }}>
              <i className="bi bi-arrow-left"></i> Back to Store
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--gray-6)' }}>
        <div style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid var(--gray-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, margin: 0, textTransform: 'capitalize' }}>{activeSection}</h1>
          {activeSection === 'products' && (
            <Link to="/admin/products/new" className="btn btn-primary btn-sm">
              <i className="bi bi-plus me-1"></i>Add Product
            </Link>
          )}
        </div>

        <div style={{ padding: '2rem' }}>
          {loading ? (
            <div className="spinner-wrapper"><div className="spinner-border text-primary"></div></div>
          ) : (
            <>
              {/* ===== DASHBOARD ===== */}
              {activeSection === 'dashboard' && stats && (
                <div>
                  {/* Stats Cards */}
                  <div className="row g-3 mb-4">
                    {[
                      { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: 'bi-currency-rupee', color: '#0066FF', bg: '#EBF2FF' },
                      { label: 'Total Orders', value: stats.totalOrders, icon: 'bi-bag-check', color: '#059669', bg: '#ECFDF5' },
                      { label: 'Customers', value: stats.totalUsers, icon: 'bi-people', color: '#7C3AED', bg: '#F3F0FF' },
                      { label: 'Products', value: stats.totalProducts, icon: 'bi-box-seam', color: '#DC2626', bg: '#FEF2F2' },
                    ].map(s => (
                      <div key={s.label} className="col-sm-6 col-xl-3">
                        <div className="stat-card">
                          <div className="stat-icon" style={{ background: s.bg, color: s.color }}><i className={`bi ${s.icon}`}></i></div>
                          <div className="stat-value">{s.value}</div>
                          <div className="stat-label">{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Products + Recent Orders */}
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <div style={{ background: 'white', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                        <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.25rem' }}>Top Selling Products</h5>
                        {stats.topProducts?.map((p, i) => {
                          const images = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]');
                          return (
                            <div key={i} className="d-flex align-items-center gap-3 mb-3">
                              <img src={images[0]} alt={p.name} style={{ width: 44, height: 44, objectFit: 'contain', background: 'var(--gray-6)', borderRadius: 8, padding: 4, flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)' }}>{p.sold_count} sold</div>
                              </div>
                              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>{formatPrice(p.price)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div style={{ background: 'white', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                        <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Orders</h5>
                        {stats.recentOrders?.map(order => (
                          <div key={order.id} className="d-flex align-items-center gap-3 mb-3">
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                              {order.user_name?.charAt(0)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.order_number}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)' }}>{order.user_name}</div>
                            </div>
                            <div>
                              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', textAlign: 'right' }}>{formatPrice(order.total)}</div>
                              <span className={`status-badge ${STATUS_COLORS[order.status]}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>{order.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== PRODUCTS ===== */}
              {activeSection === 'products' && (
                <div style={{ background: 'white', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => {
                        const images = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]');
                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <img src={images[0]} alt={p.name} style={{ width: 44, height: 44, objectFit: 'contain', background: 'var(--gray-6)', borderRadius: 6, padding: 4 }} />
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)' }}>{p.category_name}</div>
                                </div>
                              </div>
                            </td>
                            <td>{p.brand}</td>
                            <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatPrice(p.price)}</td>
                            <td>
                              <span style={{ color: p.stock < 5 ? 'var(--secondary)' : p.stock < 20 ? '#D97706' : 'var(--accent)', fontWeight: 600 }}>
                                {p.stock}
                              </span>
                            </td>
                            <td>
                              <span style={{ color: '#FBBF24' }}>★</span> {parseFloat(p.rating || 0).toFixed(1)}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link to={`/products/${p.slug}`} className="btn btn-sm btn-outline-primary" title="View">
                                  <i className="bi bi-eye"></i>
                                </Link>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(p.id)} title="Delete">
                                  <i className="bi bi-trash3"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ===== ORDERS ===== */}
              {activeSection === 'orders' && (
                <div style={{ background: 'white', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>
                            <Link to={`/orders/${order.id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-display)', textDecoration: 'none' }}>
                              {order.order_number}
                            </Link>
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{order.user_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)' }}>{order.user_email}</div>
                          </td>
                          <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatPrice(order.total)}</td>
                          <td><span className="text-capitalize">{order.payment_method}</span></td>
                          <td><span className={`status-badge ${STATUS_COLORS[order.status]}`}>{order.status}</span></td>
                          <td style={{ color: 'var(--gray-2)', fontSize: '0.8rem' }}>{formatDate(order.created_at)}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              style={{ width: 130 }}
                              value={order.status}
                              onChange={e => handleStatusUpdate(order.id, e.target.value)}
                            >
                              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ===== CATEGORIES ===== */}
              {activeSection === 'categories' && (
                <div className="row g-3">
                  {categories.map(cat => (
                    <div key={cat.id} className="col-6 col-md-4 col-lg-3">
                      <div style={{ background: 'white', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ width: 48, height: 48, background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: 'var(--primary)', fontSize: '1.25rem' }}>
                          <i className={`bi ${cat.icon || 'bi-box'}`}></i>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.25rem' }}>{cat.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-3)', marginBottom: '0.75rem' }}>{cat.product_count} products</div>
                        <Link to={`/shop?category=${cat.slug}`} className="btn btn-sm btn-outline-primary w-100">View Products</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
