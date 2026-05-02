import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const formatPrice = (p) => {
  if (!p) return "₹0";
  return `₹${parseFloat(p).toLocaleString("en-IN")}`;
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
    removeFromCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartLoading) return <p className="text-center mt-5">Loading...</p>;

  if (!(cartItems || []).length) {
    return <h3 className="text-center mt-5">Your cart is empty 🛒</h3>;
  }

  return (
    <div className="container mt-4">
      <div className="row">

        {/* LEFT: CART ITEMS */}
        <div className="col-md-8">
          <h3 className="mb-3">Shopping Cart</h3>

          {cartItems.map((item) => {
            let images = [];
            try {
              images = Array.isArray(item.images)
                ? item.images
                : JSON.parse(item.images || "[]");
            } catch {
              images = [];
            }

            return (
              <div key={item.id} className="card mb-3 shadow-sm">
                <div className="row g-0 align-items-center">

                  <div className="col-md-4">
                    <img
                      src={images[0] || "https://via.placeholder.com/150"}
                      className="img-fluid rounded-start"
                      alt={item.name}
                    />
                  </div>

                  <div className="col-md-8">
                    <div className="card-body">

                      <h5 className="card-title">{item.name}</h5>
                      <p className="text-muted">{formatPrice(item.price)}</p>

                      {/* Quantity */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3">

            <h4 className="mb-3">Order Summary</h4>

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() =>
                user ? navigate("/checkout") : navigate("/login")
              }
            >
              Checkout
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}