// Medusa API Client for FreshCatch Storefront

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

// Types
export interface Product {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  handle: string;
  thumbnail: string | null;
  images: { id: string; url: string }[];
  variants: ProductVariant[];
  options: ProductOption[];
  categories: ProductCategory[];
  tags: { id: string; value: string }[];
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  prices: Price[];
  options: { id: string; value: string; option_id: string }[];
  inventory_quantity?: number;
  manage_inventory?: boolean;
  metadata: Record<string, unknown> | null;
}

export interface ProductOption {
  id: string;
  title: string;
  values: { id: string; value: string }[];
}

export interface ProductCategory {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  parent_category: ProductCategory | null;
  category_children: ProductCategory[];
  metadata: Record<string, unknown> | null;
}

export interface Price {
  id: string;
  amount: number;
  currency_code: string;
}

export interface Cart {
  id: string;
  email: string | null;
  items: LineItem[];
  region: Region | null;
  shipping_address: Address | null;
  billing_address: Address | null;
  shipping_methods: ShippingMethod[];
  payment_session: PaymentSession | null;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;
}

export interface LineItem {
  id: string;
  cart_id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  total: number;
  variant: ProductVariant;
  product: Product;
  metadata: Record<string, unknown> | null;
}

export interface Region {
  id: string;
  name: string;
  currency_code: string;
  countries: Country[];
}

export interface Country {
  iso_2: string;
  name: string;
}

export interface Address {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address_1: string;
  address_2: string | null;
  city: string;
  province: string | null;
  postal_code: string;
  country_code: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
}

export interface PaymentSession {
  id: string;
  provider_id: string;
  status: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  billing_address: Address | null;
  shipping_addresses: Address[];
  metadata: Record<string, unknown> | null;
}

export interface Order {
  id: string;
  display_id: number;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  email: string;
  items: LineItem[];
  shipping_address: Address;
  billing_address: Address;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  created_at: string;
}

// API Client class
class MedusaClient {
  private baseUrl: string;
  private publishableKey: string;

  constructor() {
    this.baseUrl = MEDUSA_BACKEND_URL;
    this.publishableKey = PUBLISHABLE_API_KEY;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.publishableKey && { 'x-publishable-api-key': this.publishableKey }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Products
  async getProducts(params?: {
    limit?: number;
    offset?: number;
    category_id?: string[];
    q?: string;
    order?: string;
  }): Promise<{ products: Product[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.category_id) {
      params.category_id.forEach(id => searchParams.append('category_id[]', id));
    }
    if (params?.q) searchParams.set('q', params.q);
    if (params?.order) searchParams.set('order', params.order);

    const query = searchParams.toString();
    return this.fetch(`/store/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string): Promise<{ product: Product }> {
    return this.fetch(`/store/products/${id}`);
  }

  async getProductByHandle(handle: string): Promise<{ products: Product[] }> {
    return this.fetch(`/store/products?handle=${handle}`);
  }

  // Categories
  async getCategories(): Promise<{ product_categories: ProductCategory[] }> {
    return this.fetch('/store/product-categories');
  }

  async getCategory(id: string): Promise<{ product_category: ProductCategory }> {
    return this.fetch(`/store/product-categories/${id}`);
  }

  // Cart
  async createCart(regionId?: string): Promise<{ cart: Cart }> {
    return this.fetch('/store/carts', {
      method: 'POST',
      body: JSON.stringify({ region_id: regionId }),
    });
  }

  async getCart(cartId: string): Promise<{ cart: Cart }> {
    return this.fetch(`/store/carts/${cartId}`);
  }

  async addToCart(
    cartId: string,
    variantId: string,
    quantity: number
  ): Promise<{ cart: Cart }> {
    return this.fetch(`/store/carts/${cartId}/line-items`, {
      method: 'POST',
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });
  }

  async updateCartItem(
    cartId: string,
    lineItemId: string,
    quantity: number
  ): Promise<{ cart: Cart }> {
    return this.fetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartId: string, lineItemId: string): Promise<{ cart: Cart }> {
    return this.fetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'DELETE',
    });
  }

  async updateCart(
    cartId: string,
    data: {
      email?: string;
      shipping_address?: Partial<Address>;
      billing_address?: Partial<Address>;
    }
  ): Promise<{ cart: Cart }> {
    return this.fetch(`/store/carts/${cartId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addShippingMethod(
    cartId: string,
    optionId: string
  ): Promise<{ cart: Cart }> {
    return this.fetch(`/store/carts/${cartId}/shipping-methods`, {
      method: 'POST',
      body: JSON.stringify({ option_id: optionId }),
    });
  }

  async createPaymentSessions(cartId: string): Promise<{ cart: Cart }> {
    return this.fetch(`/store/carts/${cartId}/payment-sessions`, {
      method: 'POST',
    });
  }

  async setPaymentSession(
    cartId: string,
    providerId: string
  ): Promise<{ cart: Cart }> {
    return this.fetch(`/store/carts/${cartId}/payment-session`, {
      method: 'POST',
      body: JSON.stringify({ provider_id: providerId }),
    });
  }

  async completeCart(cartId: string): Promise<{ type: string; data: Order }> {
    return this.fetch(`/store/carts/${cartId}/complete`, {
      method: 'POST',
    });
  }

  // Regions
  async getRegions(): Promise<{ regions: Region[] }> {
    return this.fetch('/store/regions');
  }

  // Shipping Options
  async getShippingOptions(cartId: string): Promise<{ shipping_options: ShippingMethod[] }> {
    return this.fetch(`/store/shipping-options/${cartId}`);
  }

  // Customer / Auth
  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }): Promise<{ customer: Customer }> {
    return this.fetch('/store/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<{ customer: Customer }> {
    return this.fetch('/store/auth/token', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCustomer(): Promise<{ customer: Customer }> {
    return this.fetch('/store/customers/me');
  }

  async updateCustomer(data: Partial<Customer>): Promise<{ customer: Customer }> {
    return this.fetch('/store/customers/me', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    return this.fetch('/store/auth', { method: 'DELETE' });
  }

  // Orders
  async getOrders(): Promise<{ orders: Order[] }> {
    return this.fetch('/store/customers/me/orders');
  }

  async getOrder(id: string): Promise<{ order: Order }> {
    return this.fetch(`/store/orders/${id}`);
  }

  // Addresses
  async addAddress(address: Partial<Address>): Promise<{ customer: Customer }> {
    return this.fetch('/store/customers/me/addresses', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async updateAddress(
    addressId: string,
    address: Partial<Address>
  ): Promise<{ customer: Customer }> {
    return this.fetch(`/store/customers/me/addresses/${addressId}`, {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }

  async deleteAddress(addressId: string): Promise<{ customer: Customer }> {
    return this.fetch(`/store/customers/me/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const medusa = new MedusaClient();

// Helper function to format price
export function formatPrice(amount: number, currencyCode: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(amount / 100); // Medusa stores amounts in smallest currency unit
}

// Helper to get variant price
export function getVariantPrice(variant: ProductVariant, currencyCode: string = 'inr'): number {
  const price = variant.prices?.find(p => p.currency_code === currencyCode);
  return price?.amount || 0;
}
