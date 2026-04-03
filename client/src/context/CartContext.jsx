import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      loadGuestCart();
    }
  }, [isAuthenticated]);

  const loadGuestCart = () => {
    try {
      const stored = localStorage.getItem('guest_cart');
      const parsed = stored ? JSON.parse(stored) : { CartItems: [] };
      setCart(parsed);
      const count = parsed.CartItems.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(count);
    } catch {
      setCart({ CartItems: [] });
      setItemCount(0);
    }
  };

  const saveGuestCart = (newCart) => {
    localStorage.setItem('guest_cart', JSON.stringify(newCart));
    setCart(newCart);
    const count = newCart.CartItems.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
  };

  const fetchCart = async () => {
    if (!isAuthenticated) return loadGuestCart();
    try {
      const response = await api.get('/cart');
      setCart(response.data);
      const count = response.data.CartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setItemCount(count);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1, productData = null) => {
    if (!isAuthenticated) {
      try {
        const pData = productData || (await api.get(`/products/${productId}`)).data;
        const currentCart = cart || { CartItems: [] };
        const existing = currentCart.CartItems.find(i => i.product_id === productId);
        if (existing) {
          if (existing.quantity + quantity > pData.stock) return { success: false, message: 'Stock limit reached' };
          existing.quantity += quantity;
        } else {
          currentCart.CartItems.push({
            id: Date.now(),
            product_id: productId,
            quantity,
            Product: pData
          });
        }
        saveGuestCart({...currentCart});
        return { success: true };
      } catch (e) {
        return { success: false, message: 'Failed to add guest item' };
      }
    }

    try {
      const response = await api.post('/cart', { product_id: productId, quantity });
      setCart(response.data);
      const count = response.data.CartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setItemCount(count);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error adding to cart' };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) {
      const currentCart = cart || { CartItems: [] };
      const item = currentCart.CartItems.find(i => i.id === itemId);
      if (item && quantity > 0) {
        item.quantity = quantity;
        saveGuestCart({...currentCart});
      } else if (item && quantity <= 0) {
        currentCart.CartItems = currentCart.CartItems.filter(i => i.id !== itemId);
        saveGuestCart({...currentCart});
      }
      return;
    }

    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      setCart(response.data);
      const count = response.data.CartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setItemCount(count);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (itemId) => {
    if (!isAuthenticated) {
      const currentCart = cart || { CartItems: [] };
      currentCart.CartItems = currentCart.CartItems.filter(i => i.id !== itemId);
      saveGuestCart({...currentCart});
      return;
    }

    try {
      const response = await api.delete(`/cart/${itemId}`);
      setCart(response.data);
      const count = response.data.CartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setItemCount(count);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const cartTotal = cart?.CartItems?.reduce((sum, item) => {
    return sum + (parseFloat(item.Product?.price || 0) * item.quantity);
  }, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      itemCount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeItem,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
