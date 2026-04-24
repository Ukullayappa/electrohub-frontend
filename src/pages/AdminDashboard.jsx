import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI, productsAPI, categoriesAPI, usersAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const formatPrice = (p) => `₹${parseFloat(p || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
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
  const [users, setUsers] = useState([]);
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
      } else if (activeSection === 'users') {
        const res = await usersAPI.getAll();
        setUsers(res.data.users);
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
    { key: 'users', icon: 'bi-people', label: 'Users' },
  ];

  return (
    <div className="page-enter d-flex flex-column flex-lg-row" style={{ minHeight: 'calc(100vh - 60px)', background: '#F8FAFC' }}>
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ background: 'white', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 24px rgba(0,0,0,0.02)', zIndex: 10 }}>
        <div style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, rgba(0,102,255,0.03) 0%, rgba(0,212,170,0.03) 100%)', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary), #00D4AA)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', boxShadow: '0 8px 16px rgba(0,102,255,0.2)' }}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--dark)', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Admin Panel</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-2)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: '1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.875rem 1.25rem', borderRadius: '12px',
                background: activeSection === item.key ? 'var(--primary)' : 'transparent',
                color: activeSection === item.key ? 'white' : 'var(--gray-1)',
                border: 'none',
                fontSize: '0.95rem', fontWeight: activeSection === item.key ? 600 : 500,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-main)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeSection === item.key ? '0 8px 20px rgba(0,102,255,0.25)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.key) {
                  e.currentTarget.style.background = 'var(--gray-6)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.key) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem', opacity: activeSection === item.key ? 1 : 0.6 }}></i>
              <span className="d-none d-sm-inline">{item.label}</span>
            </button>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1.25rem', color: 'var(--gray-2)', fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none', borderRadius: '12px', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF0F0'; e.currentTarget.style.color = 'var(--secondary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-2)'; }}>
              <i className="bi bi-box-arrow-left" style={{ fontSize: '1.2rem' }}></i> Back to Store
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <div className="admin-header" style={{ position: 'sticky', top: 0, zIndex: 5, background: 'rgba(248, 250, 252, 0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, margin: 0, textTransform: 'capitalize', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, var(--dark) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {activeSection}
            </h1>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-2)', marginTop: '4px' }}>Overview and management</p>
          </div>
          <div>
            {activeSection === 'products' && (
              <Link to="/admin/products/new" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,102,255,0.2)' }}>
                <i className="bi bi-plus-lg me-2"></i>Add Product
              </Link>
            )}
            {activeSection === 'categories' && (
              <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,102,255,0.2)' }} onClick={() => {
                const name = window.prompt('Enter Category Name:');
                if (name) categoriesAPI.create({ name, slug: name.toLowerCase().replace(/ /g, '-') }).then(() => fetchData());
              }}>
                <i className="bi bi-plus-lg me-2"></i>Add Category
              </button>
            )}
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
              <div className="spinner-border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }}></div>
            </div>
          ) : (
            <>
              {/* ===== DASHBOARD ===== */}
              {activeSection === 'dashboard' && stats && (
                <div>
                  {/* Stats Cards */}
                  <div className="row g-4 mb-5">
                    {[
                      { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: 'bi-graph-up-arrow', color: '#0066FF', bg: 'linear-gradient(135deg, #EEF4FF 0%, #E0EFFF 100%)' },
                      { label: 'Total Orders', value: stats.totalOrders, icon: 'bi-bag-check-fill', color: '#059669', bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' },
                      { label: 'Total Customers', value: stats.totalUsers, icon: 'bi-people-fill', color: '#7C3AED', bg: 'linear-gradient(135deg, #F3F0FF 0%, #EDE9FE 100%)' },
                      { label: 'Total Products', value: stats.totalProducts, icon: 'bi-box-seam-fill', color: '#EA580C', bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)' },
                    ].map(s => (
                      <div key={s.label} className="col-sm-6 col-xl-3">
                        <div style={{ background: 'white', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', height: '100%' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)'; }}
                        >
                          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: s.bg, borderRadius: '50%', opacity: 0.5, zIndex: 0 }}></div>
                          <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ width: 56, height: 56, background: s.bg, color: s.color, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                              <i className={s.icon}></i>
                            </div>
                            <div style={{ color: 'var(--gray-2)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{s.label}</div>
                            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)', letterSpacing: '-0.02em', lineHeight: 1.2, wordBreak: 'break-word' }}>{s.value}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Products + Recent Orders */}
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                          <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0, fontSize: '1.25rem' }}>Top Products</h5>
                          <button onClick={() => setActiveSection('products')} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>View All</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {stats.topProducts?.map((p, i) => {
                            const images = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]');
                            return (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#F8FAFC', borderRadius: '14px', transition: 'all 0.2s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}
                              >
                                <div style={{ width: 56, height: 56, background: 'white', borderRadius: '10px', padding: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <img src={images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>{p.name}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <i className="bi bi-graph-up"></i> {p.sold_count} sold
                                  </div>
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)', flexShrink: 0 }}>{formatPrice(p.price)}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                          <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, margin: 0, fontSize: '1.25rem' }}>Recent Orders</h5>
                          <button onClick={() => setActiveSection('orders')} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>View All</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {stats.recentOrders?.map(order => (
                            <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '14px', transition: 'all 0.2s ease' }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,102,255,0.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), #0052CC)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,102,255,0.2)' }}>
                                {order.user_name?.charAt(0)}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark)' }}>{order.order_number}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--gray-2)' }}>{order.user_name}</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: 'var(--dark)', marginBottom: '4px' }}>{formatPrice(order.total)}</div>
                                <span style={{ 
                                  fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                                  background: order.status === 'delivered' ? '#ECFDF5' : order.status === 'shipped' ? '#EEF4FF' : '#FFFBEB',
                                  color: order.status === 'delivered' ? '#059669' : order.status === 'shipped' ? '#0066FF' : '#D97706'
                                }}>{order.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== PRODUCTS ===== */}
              {activeSection === 'products' && (
                <div className="table-responsive" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Product</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Brand</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Price</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Stock</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Rating</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => {
                        const images = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]');
                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                            <td style={{ padding: '1rem 1.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 48, height: 48, background: '#F1F5F9', borderRadius: '10px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <img src={images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--dark)', marginBottom: '2px' }}>{p.name}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-3)', fontWeight: 500 }}>{p.category_name}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--gray-1)', fontWeight: 500 }}>{p.brand}</td>
                            <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--dark)' }}>{formatPrice(p.price)}</td>
                            <td style={{ padding: '1rem 1.5rem' }}>
                              <span style={{ 
                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                                background: p.stock < 5 ? '#FEF2F2' : p.stock < 20 ? '#FFFBEB' : '#ECFDF5',
                                color: p.stock < 5 ? '#DC2626' : p.stock < 20 ? '#D97706' : '#059669'
                              }}>
                                {p.stock} in stock
                              </span>
                            </td>
                            <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--dark)' }}>
                              <span style={{ color: '#FBBF24', marginRight: '4px' }}>★</span>{parseFloat(p.rating || 0).toFixed(1)}
                            </td>
                            <td style={{ padding: '1rem 1.5rem' }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <Link to={`/products/${p.slug}`} style={{ width: 32, height: 32, borderRadius: '8px', background: '#EEF4FF', color: '#0066FF', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }} title="View" onMouseEnter={e => {e.currentTarget.style.background='#0066FF'; e.currentTarget.style.color='white';}} onMouseLeave={e => {e.currentTarget.style.background='#EEF4FF'; e.currentTarget.style.color='#0066FF';}}>
                                  <i className="bi bi-eye"></i>
                                </Link>
                                <Link to={`/admin/products/edit/${p.id}`} style={{ width: 32, height: 32, borderRadius: '8px', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }} title="Edit" onMouseEnter={e => {e.currentTarget.style.background='#D97706'; e.currentTarget.style.color='white';}} onMouseLeave={e => {e.currentTarget.style.background='#FFFBEB'; e.currentTarget.style.color='#D97706';}}>
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button style={{ width: 32, height: 32, borderRadius: '8px', background: '#FEF2F2', color: '#DC2626', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => handleDeleteProduct(p.id)} title="Delete" onMouseEnter={e => {e.currentTarget.style.background='#DC2626'; e.currentTarget.style.color='white';}} onMouseLeave={e => {e.currentTarget.style.background='#FEF2F2'; e.currentTarget.style.color='#DC2626';}}>
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
                <div className="table-responsive" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Order #</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Customer</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Total</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Payment</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <Link to={`/orders/${order.id}`} style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-heading)', textDecoration: 'none', background: '#EEF4FF', padding: '4px 10px', borderRadius: '8px' }}>
                              {order.order_number}
                            </Link>
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{order.user_name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--gray-3)', fontWeight: 500 }}>{order.user_email}</div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--dark)' }}>{formatPrice(order.total)}</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--gray-1)', fontWeight: 500, textTransform: 'capitalize' }}>{order.payment_method}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ 
                              padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                              background: order.status === 'delivered' ? '#ECFDF5' : order.status === 'shipped' ? '#EEF4FF' : order.status === 'cancelled' ? '#FEF2F2' : '#FFFBEB',
                              color: order.status === 'delivered' ? '#059669' : order.status === 'shipped' ? '#0066FF' : order.status === 'cancelled' ? '#DC2626' : '#D97706'
                            }}>{order.status}</span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--gray-2)', fontSize: '0.85rem', fontWeight: 500 }}>{formatDate(order.created_at)}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <select
                              style={{ width: 130, padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#F8FAFC', color: 'var(--dark)', fontWeight: 500, fontSize: '0.85rem', outline: 'none' }}
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
                <div className="row g-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="col-6 col-md-4 col-lg-3">
                      <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '20px', padding: '2rem 1.5rem', textAlign: 'center', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.03)'; }}
                      >
                        <button 
                          style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '8px', background: '#FEF2F2', color: '#DC2626', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', opacity: 0.7 }}
                          onMouseEnter={e => {e.currentTarget.style.opacity = 1; e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = 'white';}}
                          onMouseLeave={e => {e.currentTarget.style.opacity = 0.7; e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626';}}
                          onClick={() => {
                            if (window.confirm('Delete category?')) categoriesAPI.delete(cat.id).then(() => fetchData());
                          }}
                        >
                          <i className="bi bi-x" style={{ fontSize: '1.2rem' }}></i>
                        </button>
                        <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #EEF4FF 0%, #D6E4FF 100%)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--primary)', fontSize: '1.75rem', boxShadow: '0 8px 16px rgba(0,102,255,0.1)' }}>
                          <i className={`bi ${cat.icon || 'bi-box'}`}></i>
                        </div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)', marginBottom: '0.25rem' }}>{cat.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--gray-3)', fontWeight: 500, marginBottom: '1.25rem' }}>{cat.product_count} products</div>
                        <Link to={`/shop?category=${cat.slug}`} style={{ display: 'block', padding: '0.6rem', background: '#F8FAFC', color: 'var(--primary)', fontWeight: 600, borderRadius: '10px', textDecoration: 'none', transition: 'all 0.2s' }}
                          onMouseEnter={e => {e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white';}}
                          onMouseLeave={e => {e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = 'var(--primary)';}}
                        >
                          View Products
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== USERS ===== */}
              {activeSection === 'users' && (
                <div className="table-responsive" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>User</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Role</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Joined</th>
                        <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-2)', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)', color: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontFamily: 'var(--font-heading)', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{u.name}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--gray-1)', fontWeight: 500 }}>{u.email}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ 
                              padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                              background: u.role === 'admin' ? '#FEF2F2' : '#F3F4F6',
                              color: u.role === 'admin' ? '#DC2626' : '#4B5563'
                            }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--gray-2)', fontSize: '0.85rem', fontWeight: 500 }}>{formatDate(u.created_at)}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <button style={{ width: 32, height: 32, borderRadius: '8px', background: '#FEF2F2', color: '#DC2626', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: u.id === user.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: u.id === user.id ? 0.5 : 1 }} 
                              onClick={() => { if (window.confirm('Delete user?')) usersAPI.delete(u.id).then(() => fetchData()); }} 
                              disabled={u.id === user.id}
                              onMouseEnter={e => {if(u.id !== user.id) {e.currentTarget.style.background='#DC2626'; e.currentTarget.style.color='white';}}} 
                              onMouseLeave={e => {if(u.id !== user.id) {e.currentTarget.style.background='#FEF2F2'; e.currentTarget.style.color='#DC2626';}}}
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
