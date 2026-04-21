import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlistItems([]); setWishlistIds(new Set()); return; }
    try {
      const res = await wishlistAPI.getAll();
      setWishlistItems(res.data.items);
      setWishlistIds(new Set(res.data.items.map(i => i.product_id)));
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!user) { toast.info('Please login to use wishlist'); return; }
    try {
      const res = await wishlistAPI.toggle(productId);
      await fetchWishlist();
      if (res.data.action === 'added') toast.success('Added to wishlist');
      else toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  }, [user, fetchWishlist]);

  const isWishlisted = useCallback((productId) => wishlistIds.has(productId), [wishlistIds]);

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistIds, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
