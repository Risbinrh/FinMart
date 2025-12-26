'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { medusa, Customer, Address } from '@/lib/medusa';

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, name?: string) => void; // Demo mode phone login
  register: (data: { email: string; password: string; first_name: string; last_name: string; phone?: string }) => Promise<void>;
  registerWithPhone: (phone: string, firstName: string, lastName?: string) => void; // Demo mode phone register
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Customer>) => Promise<void>;
  addAddress: (address: Partial<Address>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  refreshCustomer: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CUSTOMER_KEY = 'freshcatch_demo_customer';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCustomer = useCallback(async () => {
    try {
      const { customer } = await medusa.getCustomer();
      setCustomer(customer);
    } catch {
      // Check for demo customer in localStorage
      if (typeof window !== 'undefined') {
        const demoCustomer = localStorage.getItem(DEMO_CUSTOMER_KEY);
        if (demoCustomer) {
          setCustomer(JSON.parse(demoCustomer));
          return;
        }
      }
      setCustomer(null);
    }
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        await refreshCustomer();
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [refreshCustomer]);

  // Demo mode: Login with phone (creates fake customer)
  const loginWithPhone = useCallback((phone: string, name?: string) => {
    const demoCustomer: Customer = {
      id: `demo_${Date.now()}`,
      email: `${phone}@demo.freshcatch.in`,
      first_name: name || 'Customer',
      last_name: '',
      phone: phone,
      has_account: true,
      shipping_addresses: [],
      created_at: new Date().toISOString(),
    };
    setCustomer(demoCustomer);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_CUSTOMER_KEY, JSON.stringify(demoCustomer));
    }
  }, []);

  // Demo mode: Register with phone (creates fake customer)
  const registerWithPhone = useCallback((phone: string, firstName: string, lastName?: string) => {
    const demoCustomer: Customer = {
      id: `demo_${Date.now()}`,
      email: `${phone}@demo.freshcatch.in`,
      first_name: firstName,
      last_name: lastName || '',
      phone: phone,
      has_account: true,
      shipping_addresses: [],
      created_at: new Date().toISOString(),
    };
    setCustomer(demoCustomer);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_CUSTOMER_KEY, JSON.stringify(demoCustomer));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { customer } = await medusa.login(email, password);
      setCustomer(customer);
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid email or password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const { customer } = await medusa.register(data);
      setCustomer(customer);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await medusa.logout();
      setCustomer(null);
      // Clear demo customer from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DEMO_CUSTOMER_KEY);
      }
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear customer on frontend even if backend fails
      setCustomer(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DEMO_CUSTOMER_KEY);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<Customer>) => {
    try {
      setIsLoading(true);
      setError(null);
      const { customer: updatedCustomer } = await medusa.updateCustomer(data);
      setCustomer(updatedCustomer);
    } catch (err: any) {
      console.error('Update profile failed:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAddress = useCallback(async (address: Partial<Address>) => {
    try {
      setIsLoading(true);
      setError(null);
      const { customer: updatedCustomer } = await medusa.addAddress(address);
      setCustomer(updatedCustomer);
    } catch (err: any) {
      console.error('Add address failed:', err);
      setError(err.message || 'Failed to add address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (addressId: string, address: Partial<Address>) => {
    try {
      setIsLoading(true);
      setError(null);
      const { customer: updatedCustomer } = await medusa.updateAddress(addressId, address);
      setCustomer(updatedCustomer);
    } catch (err: any) {
      console.error('Update address failed:', err);
      setError(err.message || 'Failed to update address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { customer: updatedCustomer } = await medusa.deleteAddress(addressId);
      setCustomer(updatedCustomer);
    } catch (err: any) {
      console.error('Delete address failed:', err);
      setError(err.message || 'Failed to delete address');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        error,
        login,
        loginWithPhone,
        register,
        registerWithPhone,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        refreshCustomer,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
