import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersAPI, authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';

const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

// ===== ORDERS PAGE =====
export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getAll().then(r => setOrders(r.data.orders)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const STATUS_COLORS = {
    pending: 'status-pending', processing: 'status-processing',
    shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled'
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="page-enter">
      <div className="breadcrumb-section">
        <div className="container">
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">My Orders</li>
          </ol></nav>
        </div>
      </div>
      <div className="container py-4">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="bi bi-bag-x"></i></div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet. Start shopping!</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order.id} style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', overflow: 'hidden' }}>
                {/* Order Header */}
                <div style={{ background: 'var(--gray-6)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-4)' }}>
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="d-flex gap-4 flex-wrap">
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order #</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)' }}>{order.order_number}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date</div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatDate(order.created_at)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{formatPrice(order.total)}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <span className={`status-badge ${STATUS_COLORS[order.status] || 'status-pending'}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                      <Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ padding: '1rem 1.5rem' }}>
                  <div className="d-flex flex-wrap gap-3">
                    {(order.items || []).slice(0, 3).map(item => {
                      const images = item.images ? (Array.isArray(item.images) ? item.images : JSON.parse(item.images)) : [];
                      return (
                        <div key={item.id} className="d-flex gap-2 align-items-center">
                          <img src={images[0] || 'https://via.placeholder.com/50'} alt={item.name} style={{ width: 50, height: 50, objectFit: 'contain', background: 'var(--gray-6)', borderRadius: 8, padding: 4 }} />
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dark)' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)' }}>Qty: {item.quantity} · {formatPrice(item.price)}</div>
                          </div>
                        </div>
                      );
                    })}
                    {(order.items || []).length > 3 && (
                      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--gray-2)', fontSize: '0.8rem' }}>
                        +{(order.items || []).length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== ORDER DETAIL PAGE =====
export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getById(id).then(r => setOrder(r.data.order)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrapper"><div className="spinner-border text-primary"></div></div>;
  if (!order) return <div className="container py-5 text-center"><h3>Order not found</h3><Link to="/orders">Back to Orders</Link></div>;

  const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="page-enter">
      <div className="breadcrumb-section">
        <div className="container">
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/orders">Orders</Link></li>
            <li className="breadcrumb-item active">#{order.order_number}</li>
          </ol></nav>
        </div>
      </div>

      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Order #{order.order_number}</h1>
            <div style={{ color: 'var(--gray-2)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Placed on {formatDate(order.created_at)}</div>
          </div>
          <span className={`status-badge status-${order.status}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </span>
        </div>

        {/* Progress Tracker */}
        {order.status !== 'cancelled' && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
            <div className="d-flex justify-content-between position-relative" style={{ paddingTop: '1rem' }}>
              <div style={{ position: 'absolute', top: '1.75rem', left: '10%', right: '10%', height: 3, background: 'var(--gray-4)', zIndex: 0 }}>
                <div style={{ width: `${(currentStep / 3) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s ease' }}></div>
              </div>
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="text-center" style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', margin: '0 auto 0.5rem',
                    background: i <= currentStep ? 'var(--primary)' : 'var(--gray-4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: i <= currentStep ? 'white' : 'var(--gray-2)',
                    transition: 'all 0.3s'
                  }}>
                    {i < currentStep ? <i className="bi bi-check2"></i> : <i className={`bi ${['bi-clock', 'bi-gear', 'bi-truck', 'bi-house-check'][i]}`}></i>}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: i <= currentStep ? 'var(--primary)' : 'var(--gray-3)', textTransform: 'capitalize' }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            {/* Items */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem' }}>
              <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.25rem' }}>
                Items ({order.items?.length})
              </h5>
              {(order.items || []).map(item => {
                const images = item.images ? (Array.isArray(item.images) ? item.images : JSON.parse(item.images)) : [];
                return (
                  <div key={item.id} className="d-flex gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid var(--gray-5)' }}>
                    <img src={images[0]} alt={item.name} style={{ width: 70, height: 70, objectFit: 'contain', background: 'var(--gray-6)', borderRadius: 8, padding: 6 }} />
                    <div className="flex-grow-1">
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-3)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Address */}
            {order.shipping_address && (
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem' }}>Delivery Address</h5>
                <div style={{ color: 'var(--gray-1)', lineHeight: '1.7' }}>
                  <strong>{order.shipping_address.fullName}</strong><br />
                  {order.shipping_address.addressLine1}<br />
                  {order.shipping_address.addressLine2 && <>{order.shipping_address.addressLine2}<br /></>}
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}<br />
                  {order.shipping_address.phone}
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="order-summary">
              <div className="order-summary-title">Price Details</div>
              <div className="summary-row"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="summary-row"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
              <div className="summary-row"><span>Shipping</span><span style={{ color: parseFloat(order.shipping) === 0 ? 'var(--accent)' : '' }}>{parseFloat(order.shipping) === 0 ? 'FREE' : formatPrice(order.shipping)}</span></div>
              <div className="summary-row total"><span>Total</span><span>{formatPrice(order.total)}</span></div>
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--gray-5)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-2)', marginBottom: '0.5rem' }}>Payment: <strong style={{ color: 'var(--dark)' }}>{order.payment_method?.toUpperCase()}</strong></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-2)' }}>Payment Status: <strong style={{ color: order.payment_status === 'paid' ? 'var(--accent)' : 'var(--gray-1)' }}>{order.payment_status}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== WISHLIST PAGE =====
export function Wishlist() {
  const { wishlistItems, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="page-enter">
      <div className="breadcrumb-section">
        <div className="container">
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Wishlist</li>
          </ol></nav>
        </div>
      </div>
      <div className="container py-4">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          My Wishlist <span style={{ color: 'var(--gray-3)', fontWeight: 400, fontSize: '1rem' }}>({wishlistItems.length})</span>
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="bi bi-heart"></i></div>
            <h3>Your Wishlist is Empty</h3>
            <p>Save items you love to your wishlist. Review them anytime and add to cart easily.</p>
            <Link to="/shop" className="btn btn-primary">Explore Products</Link>
          </div>
        ) : (
          <div className="row g-3">
            {wishlistItems.map(item => (
              <div key={item.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={{ ...item, id: item.product_id }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== PROFILE PAGE =====
export function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authAPI.updatePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password updated successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="breadcrumb-section">
        <div className="container">
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">My Profile</li>
          </ol></nav>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              {/* Avatar */}
              <div className="text-center mb-3">
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', margin: '0 auto 0.75rem' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{user?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-2)' }}>{user?.email}</div>
                {user?.role === 'admin' && <span className="badge bg-danger mt-1">Admin</span>}
              </div>

              <nav className="sidebar-nav d-flex flex-column">
                {[
                  { key: 'profile', icon: 'bi-person', label: 'Profile Info' },
                  { key: 'password', icon: 'bi-lock', label: 'Change Password' },
                ].map(item => (
                  <button
                    key={item.key}
                    className={`nav-link text-start ${activeTab === item.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.key)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <i className={`bi ${item.icon} me-2`}></i>{item.label}
                  </button>
                ))}
                <Link to="/orders" className="nav-link"><i className="bi bi-bag me-2"></i>My Orders</Link>
                <Link to="/wishlist" className="nav-link"><i className="bi bi-heart me-2"></i>Wishlist</Link>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-9">
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              {activeTab === 'profile' && (
                <>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>Profile Information</h5>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email Address</label>
                        <input className="form-control" value={user?.email} disabled style={{ background: 'var(--gray-5)', cursor: 'not-allowed' }} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)', marginTop: '0.25rem' }}>Email cannot be changed</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input className="form-control" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'password' && (
                <>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>Change Password</h5>
                  <form onSubmit={handlePasswordUpdate} style={{ maxWidth: 400 }}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-control" value={passForm.currentPassword} onChange={e => setPassForm(f => ({ ...f, currentPassword: e.target.value }))} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-control" placeholder="Min. 6 characters" value={passForm.newPassword} onChange={e => setPassForm(f => ({ ...f, newPassword: e.target.value }))} required />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Confirm New Password</label>
                      <input type="password" className="form-control" value={passForm.confirmPassword} onChange={e => setPassForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
