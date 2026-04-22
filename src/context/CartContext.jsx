import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
const [cartItems, setCartItems] = useState([]);
const [cartCount, setCartCount] = useState(0);
const [cartLoading, setCartLoading] = useState(false);
const { user } = useAuth();

const fetchCart = useCallback(async () => {
if (!user) {
setCartItems([]);
setCartCount(0);
return;
}

```
try {
  setCartLoading(true);

  const res = await cartAPI.getCart();

  // ✅ SAFE FIX
  const items = res.data?.items || [];

  setCartItems(items);
  setCartCount(items.reduce((s, i) => s + (i?.quantity || 0), 0));

} catch (err) {
  console.error('Fetch cart error:', err);

  // fallback safety
  setCartItems([]);
  setCartCount(0);

} finally {
  setCartLoading(false);
}
```

}, [user]);

useEffect(() => {
fetchCart();
}, [fetchCart]);

const addToCart = useCallback(async (productId, quantity = 1) => {
if (!user) {
toast.info('Please login to add items to cart');
return false;
}

```
try {
  await cartAPI.addItem(productId, quantity);
  await fetchCart();
  toast.success('Added to cart!');
  return true;

} catch (err) {
  toast.error(err.response?.data?.message || 'Failed to add to cart');
  return false;
}
```

}, [user, fetchCart]);

const updateQuantity = useCallback(async (itemId, quantity) => {
try {
await cartAPI.updateItem(itemId, quantity);
await fetchCart();
} catch {
toast.error('Failed to update quantity');
}
}, [fetchCart]);

const removeFromCart = useCallback(async (itemId) => {
try {
await cartAPI.removeItem(itemId);
await fetchCart();
toast.success('Item removed from cart');
} catch {
toast.error('Failed to remove item');
}
}, [fetchCart]);

const clearCart = useCallback(async () => {
try {
await cartAPI.clearCart();
setCartItems([]);
setCartCount(0);
} catch (err) {
console.error(err);
}
}, []);

// ✅ SAFE CALCULATIONS
const subtotal = (cartItems || []).reduce(
(s, i) => s + (parseFloat(i?.price || 0) * (i?.quantity || 0)),
0
);

const tax = subtotal * 0.18;
const shipping = subtotal > 5000 ? 0 : (subtotal > 0 ? 199 : 0);
const total = subtotal + tax + shipping;

return (
<CartContext.Provider value={{
cartItems,
cartCount,
cartLoading,
subtotal,
tax,
shipping,
total,
addToCart,
updateQuantity,
removeFromCart,
clearCart,
fetchCart
}}>
{children}
</CartContext.Provider>
);
};

export const useCart = () => {
const ctx = useContext(CartContext);
if (!ctx) throw new Error('useCart must be used within CartProvider');
return ctx;
};
