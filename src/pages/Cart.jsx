import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const formatPrice = (p) => {
if (!p) return "₹0";
return `₹${parseFloat(p).toLocaleString('en-IN')}`;
};

export default function Cart() {
const {
cartItems,
cartLoading,
subtotal,
tax,
shipping,
total,
updateQuantity,
removeFromCart
} = useCart();

const { user } = useAuth();
const navigate = useNavigate();

if (cartLoading) return <p>Loading...</p>;

//  SAFE CHECK
if (!(cartItems || []).length) {
return <p>Your cart is empty</p>;
}

return ( <div className="container">


  {/* PRODUCTS */}
  {(cartItems || []).map(item => {

    //  SAFE IMAGE PARSE
    let images = [];
    try {
      if (Array.isArray(item.images)) {
        images = item.images;
      } else if (item.images) {
        images = JSON.parse(item.images);
      }
    } catch {
      images = [];
    }

    return (
      <div key={item.id}>

        <img
          src={images[0] || 'https://via.placeholder.com/90'}
          alt={item.name || 'Product'}
        />

        <p>{item.name || 'No Name'}</p>

        <p>{formatPrice(item.price)}</p>

        <button onClick={() => removeFromCart?.(item.id)}>
          Remove
        </button>

      </div>
    );
  })}

  <h3>Total: {formatPrice(total)}</h3>

  <button onClick={() => user ? navigate('/checkout') : navigate('/login')}>
    Checkout
  </button>

</div>


);
}
