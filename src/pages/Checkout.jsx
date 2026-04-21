import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';
import { toast } from 'react-toastify';

const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir'];

export default function Checkout() {
  const { cartItems, subtotal, tax, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [payment, setPayment] = useState('cod');

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!address[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      const res = await ordersAPI.create({
        shippingAddress: address,
        paymentMethod: payment,
        notes: ''
      });
      setOrderId(res.data.order.id);
      await clearCart();
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="checkout-steps">
      {[
        { n: 1, label: 'Address' },
        { n: 2, label: 'Payment' },
        { n: 3, label: 'Confirm' }
      ].map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className={`step-number ${step > s.n ? 'completed' : step === s.n ? 'active' : ''}`}>
              {step > s.n ? <i className="bi bi-check2"></i> : s.n}
            </div>
            <span className={`step-label ${step === s.n ? 'active' : ''}`}>{s.label}</span>
          </div>
          {i < 2 && <div className={`step-divider ${step > s.n ? 'completed' : ''}`} style={{ flex: 1 }}></div>}
        </div>
      ))}
    </div>
  );

  const OrderSummaryPanel = () => (
    <div className="order-summary">
      <div className="order-summary-title">Order Summary</div>
      <div style={{ maxHeight: 250, overflowY: 'auto', marginBottom: '1rem' }}>
        {cartItems.map(item => {
          const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]');
          return (
            <div key={item.id} className="d-flex gap-2 mb-3 align-items-center">
              <img src={images[0]} alt={item.name} style={{ width: 48, height: 48, objectFit: 'contain', background: 'var(--gray-6)', borderRadius: 8, padding: 4, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)' }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>{formatPrice(item.price * item.quantity)}</div>
            </div>
          );
        })}
      </div>
      <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
      <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
      <div className="summary-row"><span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--accent)' : '' }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
      <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="breadcrumb-section">
        <div className="container">
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/cart">Cart</Link></li>
            <li className="breadcrumb-item active">Checkout</li>
          </ol></nav>
        </div>
      </div>

      <div className="container py-4">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>
        <StepIndicator />

        <div className="row g-4">
          <div className="col-lg-8">
            {/* Step 1: Address */}
            {step === 1 && (
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>
                  <i className="bi bi-geo-alt me-2" style={{ color: 'var(--primary)' }}></i>
                  Delivery Address
                </h5>
                <form onSubmit={handleAddressSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name *</label>
                      <input className="form-control" value={address.fullName} onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number *</label>
                      <input className="form-control" type="tel" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address Line 1 *</label>
                      <input className="form-control" placeholder="House No., Street, Area" value={address.addressLine1} onChange={e => setAddress(a => ({ ...a, addressLine1: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address Line 2</label>
                      <input className="form-control" placeholder="Landmark (optional)" value={address.addressLine2} onChange={e => setAddress(a => ({ ...a, addressLine2: e.target.value }))} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">City *</label>
                      <input className="form-control" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State *</label>
                      <select className="form-select" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} required>
                        <option value="">Select State</option>
                        {STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">PIN Code *</label>
                      <input className="form-control" maxLength={6} value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <Link to="/cart" className="btn btn-outline-secondary">
                      <i className="bi bi-arrow-left me-2"></i>Back to Cart
                    </Link>
                    <button type="submit" className="btn btn-primary px-4">
                      Continue to Payment <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>
                  <i className="bi bi-credit-card me-2" style={{ color: 'var(--primary)' }}></i>
                  Payment Method
                </h5>

                {/* Address Summary */}
                <div style={{ background: 'var(--gray-6)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{address.fullName} · {address.phone}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray-2)' }}>
                        {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}, {address.city}, {address.state} - {address.pincode}
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setStep(1)}>Change</button>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="d-flex flex-column gap-3">
                  {[
                    { value: 'cod', icon: 'bi-cash-coin', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'upi', icon: 'bi-phone', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                    { value: 'card', icon: 'bi-credit-card', label: 'Debit / Credit Card', desc: 'Visa, Mastercard, RuPay' },
                    { value: 'netbanking', icon: 'bi-bank', label: 'Net Banking', desc: 'All major banks supported' },
                    { value: 'emi', icon: 'bi-calendar-check', label: 'EMI', desc: 'No-cost EMI available on select cards' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        border: `2px solid ${payment === opt.value ? 'var(--primary)' : 'var(--gray-4)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        background: payment === opt.value ? 'var(--primary-light)' : 'white',
                        transition: 'var(--transition)'
                      }}
                    >
                      <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={e => setPayment(e.target.value)} style={{ display: 'none' }} />
                      <div style={{ width: 40, height: 40, background: payment === opt.value ? 'var(--primary)' : 'var(--gray-5)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: payment === opt.value ? 'white' : 'var(--gray-2)', fontSize: '1.1rem', flexShrink: 0 }}>
                        <i className={`bi ${opt.icon}`}></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray-3)' }}>{opt.desc}</div>
                      </div>
                      {payment === opt.value && <i className="bi bi-check-circle-fill ms-auto" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>}
                    </label>
                  ))}
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                    <i className="bi bi-arrow-left me-2"></i>Back
                  </button>
                  <button className="btn btn-primary px-4" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Placing Order...</>
                    ) : (
                      <><i className="bi bi-bag-check me-2"></i>Place Order · {formatPrice(total)}</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', color: '#059669' }}>
                  <i className="bi bi-check-lg"></i>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '0.5rem' }}>Order Confirmed! 🎉</h2>
                <p style={{ color: 'var(--gray-2)', marginBottom: '2rem' }}>
                  Thank you for your purchase! Your order has been placed successfully.<br />
                  You'll receive a confirmation email shortly.
                </p>
                <div style={{ background: 'var(--gray-6)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem', display: 'inline-block' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-3)', marginBottom: '0.25rem' }}>ORDER ID</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>#{orderId}</div>
                </div>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Link to={`/orders/${orderId}`} className="btn btn-primary px-4">
                    <i className="bi bi-bag me-2"></i>Track Order
                  </Link>
                  <Link to="/shop" className="btn btn-outline-primary px-4">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <OrderSummaryPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
