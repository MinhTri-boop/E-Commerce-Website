import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const CART_STORAGE_KEY = 'hexashop_cart';

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const [prevAuth, setPrevAuth] = useState(isAuthenticated);

  // Clear cart state immediately if user logs out
  if (prevAuth && !isAuthenticated) {
    setCartItems([]);
    setPrevAuth(false);
    localStorage.removeItem(CART_STORAGE_KEY);
  } else if (!prevAuth && isAuthenticated) {
    setPrevAuth(true);
  }

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  useEffect(() => {
    const syncGuestCart = async () => {
      const localCart = loadCartFromStorage();
      if (localCart.length > 0) {
        try {
          await Promise.all(
            localCart.map((item) =>
              axiosClient.post('/cart', {
                productId: item.product.id,
                quantity: item.quantity,
              })
            )
          );
          localStorage.removeItem(CART_STORAGE_KEY);
        } catch (err) {
          console.error("Failed to sync guest cart", err);
        }
      }
    };

    const fetchRemoteCart = async () => {
      try {
        const response = await axiosClient.get('/cart');
        setCartItems(response.data.cartItems || []);
      } catch (err) {
        console.error('Failed to fetch remote cart', err);
      }
    };

    if (isAuthenticated) {
      syncGuestCart().then(fetchRemoteCart);
    } else {
      setCartItems(loadCartFromStorage());
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (isAuthenticated) {
      const existing = cartItems.find((item) => item.product?.id === product.id || item.productId === product.id);
      const newQuantity = existing ? existing.quantity + quantity : quantity;
      
      try {
        const response = await axiosClient.post('/cart', { productId: product.id, quantity: newQuantity });
        setCartItems(response.data.cartItems || []);
      } catch (err) {
        console.error('Failed to add to cart on server', err);
      }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
    }
  }, [isAuthenticated, cartItems]);

  const removeFromCart = useCallback(async (productId) => {
    if (isAuthenticated) {
      try {
        const response = await axiosClient.post('/cart', { productId, quantity: 0 });
        setCartItems(response.data.cartItems || []);
      } catch (err) {
        console.error('Failed to remove from cart on server', err);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    if (isAuthenticated) {
      try {
        const response = await axiosClient.post('/cart', { productId, quantity });
        setCartItems(response.data.cartItems || []);
      } catch (err) {
        console.error('Failed to update quantity on server', err);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [isAuthenticated, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await Promise.all(
          cartItems.map((item) => 
             axiosClient.post('/cart', { productId: item.product.id, quantity: 0 })
          )
        );
        setCartItems([]);
      } catch (err) {
        console.error('Failed to clear cart on server', err);
      }
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, cartItems]);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isCartOpen,
      toggleCart,
      closeCart,
    }),
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, isCartOpen, toggleCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
