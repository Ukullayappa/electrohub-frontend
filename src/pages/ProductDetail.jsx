import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';

const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

const StarRating = ({ rating, interactive, onRate }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="d-flex gap-1" style={{ fontSize: interactive ? '1.5rem' : '0.9rem', cursor: interactive ? 'pointer' : 'default' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <i
          key={star}
          className={`bi ${(hover || rating) >= star ? 'bi-star-fill' : 'bi-star'}`}
          style={{ color: '#FBBF24', transition: 'all 0.1s' }}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(star)}
        ></i>
      ))}
    </div>
  );
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', body: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.getBySlug(slug);
        setProduct(res.data.product);
        setRelatedProducts(res.data.relatedProducts);
        setActiveImage(0);

        const reviewsRes = await productsAPI.getReviews(res.data.product.id);
        setReviews(reviewsRes.data.reviews);
      } catch (err) {
        console.error(err);
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product.id, quantity);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    const success = await addToCart(product.id, quantity);
    if (success) navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to submit a review'); return; }
    if (!reviewForm.rating) { toast.error('Please select a rating'); return; }
    setSubmittingReview(true);
    try {
      await productsAPI.addReview(product.id, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 0, title: '', body: '' });
      const res = await productsAPI.getReviews(product.id);
      setReviews(res.data.reviews);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="skeleton" style={{ height: 450, borderRadius: 'var(--radius-lg)' }}></div>
          </div>
          <div className="col-md-7">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton mb-3" style={{ height: i === 0 ? 40 : 20, borderRadius: 8, width: i === 0 ? '70%' : `${60 + i * 10}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  const features = Array.isArray(product.features) ? product.features : JSON.parse(product.features || '[]');
  const specs = typeof product.specifications === 'object' ? product.specifications : JSON.parse(product.specifications || '{}');

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="container">
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
              {product.category_name && (
                <li className="breadcrumb-item"><Link to={`/shop?category=${product.category_slug}`}>{product.category_name}</Link></li>
              )}
              <li className="breadcrumb-item active">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4 mb-5">
          {/* Images */}
          <div className="col-md-5">
            <div className="product-images">
              <div className="main-image">
                <img
                  src={images[activeImage] || 'https://via.placeholder.com/500'}
                  alt={product.name}
                />
              </div>
              {images.length > 1 && (
                <div className="thumbnail-grid">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className={`thumbnail ${activeImage === i ? 'active' : ''}`}
                      onClick={() => setActiveImage(i)}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="col-md-7">
            <div className="product-detail-info">
              <div className="product-detail-brand">{product.brand}</div>
              <h1 className="product-detail-name">{product.name}</h1>

              {/* Rating */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <StarRating rating={parseFloat(product.rating)} />
                <span style={{ color: 'var(--gray-2)', fontSize: '0.875rem' }}>
                  {parseFloat(product.rating).toFixed(1)} · {product.review_count} reviews
                </span>
                <span style={{ color: product.stock > 0 ? 'var(--accent)' : 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
                  <i className={`bi ${product.stock > 0 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="product-detail-price">{formatPrice(product.price)}</div>
                {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span style={{ color: 'var(--gray-3)', textDecoration: 'line-through', fontSize: '1rem' }}>
                      {formatPrice(product.original_price)}
                    </span>
                    <span style={{ background: 'var(--secondary)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.8rem', fontWeight: 700 }}>
                      {product.discount_percent}% OFF
                    </span>
                    <span style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600 }}>
                      You save {formatPrice(parseFloat(product.original_price) - parseFloat(product.price))}
                    </span>
                  </div>
                )}
                <p style={{ color: 'var(--gray-3)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                  Inclusive of all taxes. Free delivery on orders above ₹5,000.
                </p>
              </div>

              {/* Short Description */}
              {product.short_description && (
                <p style={{ color: 'var(--gray-1)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                  {product.short_description}
                </p>
              )}

              {/* Features */}
              {features.length > 0 && (
                <div className="mb-4">
                  <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.75rem' }}>Key Features</h6>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {features.slice(0, 4).map((f, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--gray-1)' }}>
                        <i className="bi bi-check2-circle" style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }}></i>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity + Actions */}
              <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-4">
                <div className="quantity-control mx-auto mx-sm-0">
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value px-3 fw-bold">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>

                <div className="d-flex gap-2 flex-grow-1">
                  <button
                    className="btn btn-dark flex-grow-1 py-3 px-4"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addingToCart}
                  >
                    {addingToCart ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <i className="bi bi-bag-plus me-2"></i>
                    )}
                    Add to Cart
                  </button>

                  <button
                    className={`btn ${isWishlisted(product.id) ? 'btn-danger' : 'btn-outline-secondary'} py-3 px-3`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <i className={`bi ${isWishlisted(product.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                </div>
              </div>

              <div className="d-grid mb-4">
                <button
                  className="btn btn-primary py-3 fw-bold"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  <i className="bi bi-lightning-fill me-2"></i>
                  Buy Now
                </button>
              </div>

              {/* Trust Row */}
              <div className="row g-2 p-3 bg-light rounded-4">
                {[
                  { icon: 'bi-truck', text: 'Free Delivery' },
                  { icon: 'bi-shield-check', text: '2 Year Warranty' },
                  { icon: 'bi-arrow-repeat', text: '30-Day Returns' },
                  { icon: 'bi-award', text: '100% Authentic' },
                ].map(item => (
                  <div key={item.text} className="col-6 col-md-3">
                    <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start" style={{ fontSize: '0.75rem', color: 'var(--gray-1)', fontWeight: 600 }}>
                      <i className={`bi ${item.icon} text-primary`}></i>
                      <span>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5">
          <ul className="nav nav-tabs mb-4" style={{ borderBottom: '2px solid var(--gray-4)' }}>
            {[
              { key: 'description', label: 'Description' },
              { key: 'specs', label: 'Specifications' },
              { key: 'reviews', label: `Reviews (${reviews.length})` },
            ].map(tab => (
              <li key={tab.key} className="nav-item">
                <button
                  className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: 'none',
                    borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                    borderRadius: 0,
                    marginBottom: '-2px',
                    color: activeTab === tab.key ? 'var(--primary)' : 'var(--gray-2)',
                    background: 'none',
                    padding: '0.75rem 1.25rem'
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="row">
              <div className="col-md-8">
                <p style={{ color: 'var(--gray-1)', lineHeight: '1.8', marginBottom: '1.5rem' }}>{product.description}</p>
                {features.length > 0 && (
                  <>
                    <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem' }}>Features</h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--gray-1)' }}>
                          <i className="bi bi-check2-circle" style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }}></i>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div style={{ maxWidth: 600 }}>
              <table className="data-table">
                <tbody>
                  {Object.entries(specs).map(([key, value]) => (
                    <tr key={key}>
                      <td style={{ fontWeight: 600, color: 'var(--dark)', width: '40%', background: 'var(--gray-6)' }}>{key}</td>
                      <td style={{ color: 'var(--gray-1)' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="row g-4">
              <div className="col-md-4">
                <div style={{ background: 'var(--gray-6)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, color: 'var(--dark)', lineHeight: 1 }}>
                    {parseFloat(product.rating).toFixed(1)}
                  </div>
                  <StarRating rating={parseFloat(product.rating)} />
                  <p style={{ color: 'var(--gray-2)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{product.review_count} reviews</p>

                  <div className="mt-3">
                    {ratingDistribution.map(r => (
                      <div key={r.star} className="d-flex align-items-center gap-2 mb-1">
                        <span style={{ fontSize: '0.75rem', width: 20, textAlign: 'right' }}>{r.star}</span>
                        <i className="bi bi-star-fill" style={{ color: '#FBBF24', fontSize: '0.75rem' }}></i>
                        <div style={{ flex: 1, height: 6, background: 'var(--gray-4)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${r.pct}%`, height: '100%', background: '#FBBF24', borderRadius: 3 }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-2)', width: 20 }}>{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Form */}
                <div style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginTop: '1rem' }}>
                  <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem' }}>Write a Review</h6>
                  {user ? (
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Your Rating</label>
                        <StarRating rating={reviewForm.rating} interactive onRate={(r) => setReviewForm(f => ({ ...f, rating: r }))} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Summary of your review"
                          value={reviewForm.title}
                          onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Review</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Share your experience..."
                          value={reviewForm.body}
                          onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary w-100" disabled={submittingReview}>
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <p style={{ color: 'var(--gray-2)', fontSize: '0.875rem' }}>
                      <Link to="/login">Login</Link> to write a review
                    </p>
                  )}
                </div>
              </div>

              <div className="col-md-8">
                {reviews.length === 0 ? (
                  <div className="empty-state" style={{ padding: '3rem 1rem' }}>
                    <div className="empty-state-icon"><i className="bi bi-chat-square-text"></i></div>
                    <h3>No Reviews Yet</h3>
                    <p>Be the first to review this product</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} style={{ background: 'var(--white)', border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1rem' }}>
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem' }}>
                            {review.user_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--dark)' }}>{review.user_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-3)' }}>{new Date(review.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                          </div>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      {review.title && <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{review.title}</div>}
                      {review.body && <p style={{ color: 'var(--gray-1)', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>{review.body}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="section-header">
              <div className="section-tag">You May Also Like</div>
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="row g-3">
              {relatedProducts.map(p => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
