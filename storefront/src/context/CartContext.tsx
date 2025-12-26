'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { medusa, Cart, formatPrice } from '@/lib/medusa';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'freshcatch_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getOrCreateCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we have a cart ID stored
      const storedCartId = localStorage.getItem(CART_ID_KEY);

      if (storedCartId) {
        try {
          // Try to fetch existing cart
          const { cart: existingCart } = await medusa.getCart(storedCartId);
          setCart(existingCart);
          return existingCart;
        } catch {
          // Cart doesn't exist or expired, create new one
          localStorage.removeItem(CART_ID_KEY);
        }
      }

      // Create new cart
      const { cart: newCart } = await medusa.createCart();
      localStorage.setItem(CART_ID_KEY, newCart.id);
      setCart(newCart);
      return newCart;
    } catch (err) {
      console.error('Failed to get/create cart:', err);
      setError('Failed to initialize cart');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getOrCreateCart();
  }, [getOrCreateCart]);

  const refreshCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (cartId) {
      try {
        const { cart: updatedCart } = await medusa.getCart(cartId);
        setCart(updatedCart);
      } catch {
        await getOrCreateCart();
      }
    }
  }, [getOrCreateCart]);

  const addToCart = useCallback(async (variantId: string, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);

      let currentCart = cart;
      if (!currentCart) {
        currentCart = await getOrCreateCart();
        if (!currentCart) throw new Error('Failed to create cart');
      }

      const { cart: updatedCart } = await medusa.addToCart(currentCart.id, variantId, quantity);
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add item to cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart, getOrCreateCart]);

  const updateQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      setError(null);

      if (quantity <= 0) {
        await removeFromCart(lineItemId);
        return;
      }

      const { cart: updatedCart } = await medusa.updateCartItem(cart.id, lineItemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update item quantity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const removeFromCart = useCallback(async (lineItemId: string) => {
    if (!cart) return;

    try {
      setIsLoading(true);
      setError(null);

      const { cart: updatedCart } = await medusa.removeFromCart(cart.id, lineItemId);
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError('Failed to remove item from cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
