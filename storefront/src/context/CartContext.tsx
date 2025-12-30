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
          const result = await medusa.getCart(storedCartId);
          const existingCart = result?.cart;

          // Check if cart is completed (has completed_at or no items after completion)
          if (existingCart && !(existingCart as Cart & { completed_at?: string }).completed_at) {
            setCart(existingCart);
            return existingCart;
          } else {
            // Cart is completed or invalid, remove and create new
            console.log('[Cart] Existing cart is completed, creating new one');
            localStorage.removeItem(CART_ID_KEY);
          }
        } catch {
          // Cart doesn't exist or expired, create new one
          localStorage.removeItem(CART_ID_KEY);
        }
      }

      // Create new cart
      const result = await medusa.createCart();
      if (result?.cart) {
        localStorage.setItem(CART_ID_KEY, result.cart.id);
        setCart(result.cart);
        return result.cart;
      }
      return null;
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
        const result = await medusa.getCart(cartId);
        const updatedCart = result?.cart;

        // Check if cart is completed
        if (updatedCart && !(updatedCart as Cart & { completed_at?: string }).completed_at) {
          setCart(updatedCart);
        } else {
          // Cart is completed, create new one
          console.log('[Cart] Refreshed cart is completed, creating new one');
          localStorage.removeItem(CART_ID_KEY);
          await getOrCreateCart();
        }
      } catch {
        localStorage.removeItem(CART_ID_KEY);
        await getOrCreateCart();
      }
    } else {
      await getOrCreateCart();
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

      const result = await medusa.addToCart(currentCart.id, variantId, quantity);

      // If cart was completed or invalid, create a new one and try again
      if (!result || !result.cart) {
        console.log('[Cart] Cart may be completed, creating new cart...');
        localStorage.removeItem(CART_ID_KEY);
        currentCart = await getOrCreateCart();
        if (!currentCart) throw new Error('Failed to create cart');

        const retryResult = await medusa.addToCart(currentCart.id, variantId, quantity);
        if (retryResult?.cart) {
          setCart(retryResult.cart);
        } else {
          throw new Error('Failed to add item after creating new cart');
        }
      } else {
        setCart(result.cart);
      }
    } catch (err: unknown) {
      console.error('Failed to add to cart:', err);

      // Check if error is due to completed cart
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('completed') || errorMessage.includes('400')) {
        // Cart is completed, create a new one
        console.log('[Cart] Cart is completed, creating new cart...');
        localStorage.removeItem(CART_ID_KEY);
        const newCart = await getOrCreateCart();
        if (newCart) {
          const result = await medusa.addToCart(newCart.id, variantId, quantity);
          if (result?.cart) {
            setCart(result.cart);
            return;
          }
        }
      }

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

      const result = await medusa.updateCartItem(cart.id, lineItemId, quantity);
      if (result?.cart) {
        setCart(result.cart);
      }
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

      const result = await medusa.removeFromCart(cart.id, lineItemId);
      if (result?.cart) {
        setCart(result.cart);
      }
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
