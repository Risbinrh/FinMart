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
      const result = await medusa.getCustomer();
      if (result && result.customer) {
        setCustomer(result.customer);
        return;
      }
      throw new Error('No customer data');
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
      const result = await medusa.login(email, password);
      if (!result || !result.customer) {
        throw new Error('Invalid email or password');
      }
      setCustomer(result.customer);
    } catch (err: unknown) {
      console.error('Login failed:', err);
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      setError(message);
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

      // Step 1: Register auth identity (Medusa v2)
      const authResponse = await fetch('/api/auth/customer/emailpass/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password.trim(),
        }),
      });

      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.token) {
        // Provide user-friendly error messages
        let errorMessage = authData.message || 'Registration failed';
        if (authData.message?.includes('already exists')) {
          errorMessage = 'An account with this email already exists. Please login instead.';
        }
        throw new Error(errorMessage);
      }

      // Store token for subsequent requests
      medusa.setAuthToken(authData.token);

      // Step 2: Create customer profile
      const customerResponse = await fetch('/api/store/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          email: data.email.trim(),
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
          phone: data.phone || undefined,
        }),
      });

      const customerData = await customerResponse.json();

      if (!customerResponse.ok) {
        throw new Error(customerData.message || 'Failed to create profile');
      }

      setCustomer(customerData.customer);
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
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
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      // Always clear customer and tokens on frontend
      setCustomer(null);
      medusa.setAuthToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DEMO_CUSTOMER_KEY);
      }
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<Customer>) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await medusa.updateCustomer(data);
      if (!result || !result.customer) {
        throw new Error('Failed to update profile');
      }
      setCustomer(result.customer);
    } catch (err: unknown) {
      console.error('Update profile failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAddress = useCallback(async (address: Partial<Address>) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await medusa.addAddress(address);
      if (!result || !result.customer) {
        throw new Error('Failed to add address');
      }
      setCustomer(result.customer);
    } catch (err: unknown) {
      console.error('Add address failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to add address';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (addressId: string, address: Partial<Address>) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await medusa.updateAddress(addressId, address);
      if (!result || !result.customer) {
        throw new Error('Failed to update address');
      }
      setCustomer(result.customer);
    } catch (err: unknown) {
      console.error('Update address failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to update address';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await medusa.deleteAddress(addressId);
      if (!result || !result.customer) {
        throw new Error('Failed to delete address');
      }
      setCustomer(result.customer);
    } catch (err: unknown) {
      console.error('Delete address failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to delete address';
      setError(message);
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
