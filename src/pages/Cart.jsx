import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

export default function Cart() {
  const { cartItems, cartLoading, subtotal, tax, shipping, total, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartLoading) {
    return (
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton mb-3" style={{ height: 120, borderRadius: 'var(--radius-md)' }}></div>
            ))}
          </div>
          <div className="col-lg-4">
            <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container page-container">
        <div className="empty-state" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className="empty-state-icon"><i className="bi bi-bag"></i></div>
          <h3>Your Cart is Empty</h3>
          <p>Looks like you haven't added anything to your cart yet. Start shopping to fill it up!</p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            <i className="bi bi-bag-plus me-2"></i>Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="breadcrumb-section">
        <div className="container">
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Cart</li>
          </ol></nav>
        </div>
      </div>

      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            Shopping Cart
          </h1>
          <span style={{ color: 'var(--gray-2)', fontSize: '0.9rem' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            {cartItems.map(item => {
              const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]');
              return (
                <div key={item.id} className="cart-item">
                  <div className="d-flex gap-3 align-items-start">
                    <Link to={`/products/${item.slug}`}>
                      <img
                        src={images[0] || 'https://via.placeholder.com/90'}
                        alt={item.name}
                        className="cart-item-img"
                      />
                    </Link>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
                            {item.brand}
                          </div>
                          <Link to={`/products/${item.slug}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark)', textDecoration: 'none' }}>
                            {item.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--gray-3)', cursor: 'pointer', padding: '0.25rem', flexShrink: 0 }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
                        <div className="quantity-control">
                          <button
                            className="qty-btn"
                            onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, item.quantity - 1)}
                          >
                            {item.quantity === 1 ? <i className="bi bi-trash3" style={{ fontSize: '0.7rem' }}></i> : '−'}
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                        <div>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark)' }}>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-3)', marginLeft: '0.5rem' }}>
                              ({formatPrice(item.price)} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <i className="bi bi-arrow-left"></i> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="order-summary">
              <div className="order-summary-title">Order Summary</div>

              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--accent)' : 'inherit' }}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping === 0 && (
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  <i className="bi bi-check-circle-fill me-1"></i>
                  You qualify for free shipping!
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                className="btn btn-primary w-100 mt-3"
                style={{ padding: '0.875rem', fontSize: '1rem' }}
                onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=/checkout')}
              >
                {user ? (
                  <><i className="bi bi-lock-fill me-2"></i>Proceed to Checkout</>
                ) : (
                  <><i className="bi bi-person me-2"></i>Login to Checkout</>
                )}
              </button>

              <div className="mt-3 text-center">
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <i className="bi bi-shield-lock"></i>
                  Secure checkout with SSL encryption
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--gray-5)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)', marginBottom: '0.5rem', textAlign: 'center' }}>We Accept</div>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  {['Visa', 'MC', 'UPI', 'NetBanking', 'EMI'].map(m => (
                    <span key={m} style={{ padding: '0.2rem 0.5rem', background: 'var(--gray-5)', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, color: 'var(--gray-2)' }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginTop: '1rem' }}>
              <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.75rem' }}>
                <i className="bi bi-tag me-2" style={{ color: 'var(--primary)' }}></i>Promo Code
              </h6>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Enter promo code" />
                <button className="btn btn-outline-primary">Apply</button>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--gray-3)' }}>
                Try: <strong>ELECTRO10</strong> for 10% off
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
