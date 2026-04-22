import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const formatPrice = (p) => {
if (!p) return "₹0";
return `₹${parseFloat(p).toLocaleString('en-IN')}`;
};

const StarRating = ({ rating = 0, count = 0 }) => {
const stars = [];
for (let i = 1; i <= 5; i++) {
stars.push(
<i
key={i}
className={`bi ${
          i <= Math.round(rating)
            ? 'bi-star-fill'
            : i - 0.5 <= rating
            ? 'bi-star-half'
            : 'bi-star'
        }`}
></i>
);
}
return ( <div className="product-rating"> <span className="stars">{stars}</span> <span className="rating-count">({count || 0})</span> </div>
);
};

export default function ProductCard({ product }) {
const { addToCart } = useCart();
const { toggleWishlist, isWishlisted } = useWishlist();

// SAFETY: if product is missing
if (!product) return null;

// SAFETY: images parsing
let images = [];
try {
if (Array.isArray(product.images)) {
images = product.images;
} else if (product.images) {
images = JSON.parse(product.images);
}
} catch {
images = [];
}

const mainImage =
images[0] || 'https://via.placeholder.com/300x300?text=No+Image';

const wishlisted = isWishlisted?.(product.id);

return ( <div className="product-card"> <div className="product-card-image">
<Link to={`/products/${product.slug || ''}`}>
<img
src={mainImage}
alt={product.name || 'Product'}
loading="lazy"
/> </Link>


    {/* Badges */}
    <div className="product-card-badges">
      {product.discount_percent > 0 && (
        <span className="badge-discount">
          -{product.discount_percent}%
        </span>
      )}
      {product.is_new && <span className="badge-new">NEW</span>}
    </div>

    {/* Actions */}
    <div className="product-card-actions">
      <button
        className={`action-btn ${wishlisted ? 'wishlisted' : ''}`}
        onClick={() => toggleWishlist?.(product.id)}
        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <i
          className={`bi ${
            wishlisted ? 'bi-heart-fill' : 'bi-heart'
          }`}
        ></i>
      </button>

      <Link
        to={`/products/${product.slug || ''}`}
        className="action-btn"
        title="Quick view"
      >
        <i className="bi bi-eye"></i>
      </Link>
    </div>
  </div>

  <div className="product-card-body">
    <div className="product-brand">{product.brand || ''}</div>

    <Link
      to={`/products/${product.slug || ''}`}
      className="product-name"
    >
      {product.name || 'No Name'}
    </Link>

    <StarRating
      rating={product.rating || 0}
      count={product.review_count || 0}
    />

    <div className="product-price">
      <span className="price-current">
        {formatPrice(product.price)}
      </span>

      {product.original_price &&
        parseFloat(product.original_price) >
          parseFloat(product.price || 0) && (
          <span className="price-original">
            {formatPrice(product.original_price)}
          </span>
        )}
    </div>
  </div>

  <div className="product-card-footer">
    <button
      className="btn-add-cart"
      onClick={() => addToCart?.(product.id)}
      disabled={product.stock === 0}
    >
      {product.stock === 0 ? (
        <>
          <i className="bi bi-x-circle"></i> Out of Stock
        </>
      ) : (
        <>
          <i className="bi bi-bag-plus"></i> Add to Cart
        </>
      )}
    </button>
  </div>
</div>


);
}
