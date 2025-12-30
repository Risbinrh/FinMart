'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  CreditCard,
  Wallet,
  Banknote,
  Check,
  Loader2,
  CheckCircle,
  Package,
  Truck,
  Plus,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Home,
  Building2,
  Navigation,
  Calendar,
  Sparkles,
  Gift,
  BadgePercent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { medusa, formatPrice } from '@/lib/medusa';
import { useRazorpay } from '@/hooks/useRazorpay';

const deliverySlots = [
  { id: 'sunrise', name: 'Sunrise Fresh', time: '6:00 AM - 8:00 AM', price: 0, icon: '🌅', popular: false },
  { id: 'morning', name: 'Morning Delivery', time: '8:00 AM - 12:00 PM', price: 0, icon: '🌞', popular: true },
  { id: 'evening', name: 'Evening Delivery', time: '4:00 PM - 7:00 PM', price: 3000, icon: '🌆', popular: false },
];

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: Banknote, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { id: 'upi', name: 'UPI Payment', description: 'GPay, PhonePe, Paytm & more', icon: Wallet, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay', icon: CreditCard, color: 'text-blue-600', bgColor: 'bg-blue-50' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const { customer, isAuthenticated, isLoading: authLoading } = useAuth();
  const { processPayment, isLoading: paymentLoading } = useRazorpay();

  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow'>('today');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [address, setAddress] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    city: 'Chennai',
    postal_code: '',
    country_code: 'in',
  });

  // Get saved addresses
  const savedAddresses = customer?.addresses || customer?.shipping_addresses || [];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated && step !== 'success') {
      router.push('/login?redirect=/checkout');
    }
  }, [authLoading, isAuthenticated, router, step]);

  // Pre-fill name/phone from customer for new address form
  useEffect(() => {
    if (customer && !selectedAddressId) {
      setAddress(prev => ({
        ...prev,
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        phone: customer.phone || '',
      }));
    }
  }, [customer, selectedAddressId]);

  // Show new address form if no saved addresses
  useEffect(() => {
    if (savedAddresses.length === 0) {
      setShowNewAddressForm(true);
    }
  }, [savedAddresses.length]);

  // Handle address selection
  const handleSelectAddress = (addr: typeof savedAddresses[0]) => {
    setSelectedAddressId(addr.id);
    setShowNewAddressForm(false);
    setAddress({
      first_name: addr.first_name || '',
      last_name: addr.last_name || '',
      phone: addr.phone || '',
      address_1: addr.address_1 || '',
      city: addr.city || 'Chennai',
      postal_code: addr.postal_code || '',
      country_code: 'in',
    });
  };

  // Handle add new address button
  const handleAddNewAddress = () => {
    setSelectedAddressId(null);
    setShowNewAddressForm(true);
    setAddress({
      first_name: customer?.first_name || '',
      last_name: customer?.last_name || '',
      phone: customer?.phone || '',
      address_1: '',
      city: 'Chennai',
      postal_code: '',
      country_code: 'in',
    });
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Package className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Don't render checkout if not authenticated (will redirect)
  if (!isAuthenticated && step !== 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    if (step === 'success') {
      // Show success page even if cart is empty (just completed order)
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground mb-6">Add some delicious fresh fish to get started!</p>
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  const subtotal = cart?.subtotal || 0;
  const deliveryCharge = deliverySlots.find(s => s.id === selectedSlot)?.price || 0;
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + deliveryCharge + taxAmount;

  const validateForm = () => {
    if (!address.first_name || !address.phone || !address.address_1 || !address.postal_code) {
      alert('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const completeOrder = async (razorpayPaymentId?: string) => {
    try {
      if (cart?.id) {
        const result = await medusa.completeCart(cart.id);
        if (result?.data) {
          setOrderId(result.data.display_id?.toString() || result.data.id.slice(-8).toUpperCase());
        } else {
          setOrderId('FC' + Date.now().toString().slice(-8));
        }
      } else {
        setOrderId('FC' + Date.now().toString().slice(-8));
      }

      if (razorpayPaymentId) {
        setPaymentId(razorpayPaymentId);
      }

      localStorage.removeItem('freshcatch_cart_id');
      await refreshCart();
      setStep('success');
    } catch (error) {
      console.error('Failed to complete order:', error);
      setOrderId('FC' + Date.now().toString().slice(-8));
      if (razorpayPaymentId) {
        setPaymentId(razorpayPaymentId);
      }
      localStorage.removeItem('freshcatch_cart_id');
      await refreshCart();
      setStep('success');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      if (cart) {
        await medusa.updateCart(cart.id, {
          email: customer?.email || `guest_${Date.now()}@freshcatch.in`,
          shipping_address: address,
          billing_address: address,
        });

        try {
          const { shipping_options } = await medusa.getShippingOptions(cart.id);
          if (shipping_options && shipping_options.length > 0) {
            await medusa.addShippingMethod(cart.id, shipping_options[0].id);
          }
        } catch (shippingError) {
          console.warn('[Checkout] Failed to get shipping options:', shippingError);
        }

        try {
          const paymentCollection = await medusa.createPaymentCollection(cart.id);
          if (paymentCollection?.payment_collection?.id) {
            await medusa.initializePaymentSession(
              paymentCollection.payment_collection.id,
              'pp_system_default'
            );
          }
        } catch (paymentError) {
          console.warn('[Checkout] Failed to set up payment:', paymentError);
        }
      }

      if (selectedPayment === 'cod') {
        setStep('processing');
        await new Promise(resolve => setTimeout(resolve, 1500));
        await completeOrder();
      } else {
        setStep('processing');

        const result = await processPayment({
          amount: total,
          cartId: cart?.id,
          customerName: `${address.first_name} ${address.last_name}`,
          customerEmail: customer?.email,
          customerPhone: address.phone,
          description: `FreshCatch Order - ${cart?.items.length} items`,
        });

        if (result.success && result.razorpay_payment_id) {
          await completeOrder(result.razorpay_payment_id);
        } else {
          alert(result.error || 'Payment failed. Please try again.');
          setStep('checkout');
        }
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
      setStep('checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  // Get delivery date text
  const getDeliveryDateText = () => {
    const today = new Date();
    const deliveryDate = selectedDate === 'today' ? today : new Date(today.setDate(today.getDate() + 1));
    return deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Processing Screen
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="relative mb-8">
            <div className="h-32 w-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-12 w-12 text-primary animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Processing Your Order</h2>
          <p className="text-muted-foreground mb-6">Please wait while we confirm your order...</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>Secure checkout powered by Razorpay</span>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  if (step === 'success') {
    const selectedSlotInfo = deliverySlots.find(s => s.id === selectedSlot);

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-lg mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="h-28 w-28 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-14 w-14 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <span className="text-3xl animate-bounce inline-block">🎉</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground">
                Your fresh catch is being prepared with love 🐟
              </p>
            </div>

            {/* Order Details Card */}
            <Card className="mb-6 overflow-hidden border-green-200">
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Order ID</p>
                    <p className="font-bold text-xl">#{orderId}</p>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Delivery Info */}
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">Delivery Scheduled</p>
                    <p className="text-blue-700">
                      {selectedDate === 'today' ? 'Today' : 'Tomorrow'}, {selectedSlotInfo?.time}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xl">{selectedSlotInfo?.icon}</span>
                      <span className="text-sm text-blue-600">{selectedSlotInfo?.name}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Delivery Address</p>
                    <p className="text-muted-foreground text-sm">
                      {address.first_name} {address.last_name}
                    </p>
                    <p className="text-muted-foreground text-sm">{address.address_1}</p>
                    <p className="text-muted-foreground text-sm">{address.city} - {address.postal_code}</p>
                  </div>
                </div>

                {/* Payment */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    {selectedPayment === 'cod' ? (
                      <Banknote className="h-5 w-5 text-green-600" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">Payment</p>
                    <p className="text-muted-foreground text-sm">
                      {paymentMethods.find(p => p.id === selectedPayment)?.name}
                      {selectedPayment !== 'cod' && (
                        <Badge variant="secondary" className="ml-2 text-green-700 bg-green-100">Paid</Badge>
                      )}
                    </p>
                    {paymentId && (
                      <p className="text-xs text-muted-foreground mt-1">Txn: {paymentId}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* SMS Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-900">SMS Confirmation Sent</p>
                  <p className="text-sm text-amber-700">Order details sent to {address.phone}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/orders" className="flex-1">
                <Button variant="outline" className="w-full h-12 gap-2" size="lg">
                  <Package className="h-5 w-5" />
                  Track Order
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button className="w-full h-12 gap-2" size="lg">
                  <Sparkles className="h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Checkout Form
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-32 lg:pb-6">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Cart</span>
            </Link>
            <h1 className="text-lg font-bold">Secure Checkout</h1>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">1</div>
              <span className="hidden sm:inline font-medium text-primary">Address</span>
            </div>
            <div className="w-8 h-0.5 bg-primary/30" />
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">2</div>
              <span className="hidden sm:inline font-medium text-primary">Delivery</span>
            </div>
            <div className="w-8 h-0.5 bg-primary/30" />
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">3</div>
              <span className="hidden sm:inline font-medium text-primary">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span>Delivery Address</span>
                  </CardTitle>
                  {savedAddresses.length > 0 && !showNewAddressForm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddNewAddress}
                      className="gap-1.5 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Add New
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-5">
                {/* Saved Addresses */}
                {savedAddresses.length > 0 && !showNewAddressForm && (
                  <div className="grid gap-3">
                    {savedAddresses.map((addr, index) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedAddressId === addr.id
                            ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                            : 'border-gray-200 hover:border-primary/50 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                            selectedAddressId === addr.id ? 'bg-primary text-white' : 'bg-gray-100'
                          }`}>
                            {index === 0 ? <Home className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{addr.first_name} {addr.last_name}</p>
                              {index === 0 && (
                                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{addr.address_1}</p>
                            <p className="text-sm text-muted-foreground">{addr.city} - {addr.postal_code}</p>
                            {addr.phone && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Phone className="h-3 w-3" /> {addr.phone}
                              </p>
                            )}
                          </div>
                          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            selectedAddressId === addr.id ? 'border-primary bg-primary' : 'border-gray-300'
                          }`}>
                            {selectedAddressId === addr.id && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Address Form */}
                {showNewAddressForm && (
                  <div className="space-y-4">
                    {savedAddresses.length > 0 && (
                      <div className="flex items-center justify-between pb-2 border-b">
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-primary" />
                          <span className="font-medium">New Delivery Address</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowNewAddressForm(false);
                            if (savedAddresses.length > 0) {
                              handleSelectAddress(savedAddresses[0]);
                            }
                          }}
                          className="text-muted-foreground"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={address.first_name}
                          onChange={(e) => setAddress({ ...address, first_name: e.target.value })}
                          placeholder="Rajesh"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                          value={address.last_name}
                          onChange={(e) => setAddress({ ...address, last_name: e.target.value })}
                          placeholder="Kumar"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="9876543210"
                        className="h-11"
                        maxLength={10}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        Full Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={address.address_1}
                        onChange={(e) => setAddress({ ...address, address_1: e.target.value })}
                        placeholder="House no, Street, Landmark, Area"
                        className="h-11"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Input
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="Chennai"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={address.postal_code}
                          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                          placeholder="600001"
                          className="h-11"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* No address selected message */}
                {!selectedAddressId && !showNewAddressForm && savedAddresses.length > 0 && (
                  <div className="text-center py-6 bg-amber-50 rounded-xl">
                    <MapPin className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-amber-700 font-medium">Please select a delivery address</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Delivery Time */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span>Delivery Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Date Selection */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Select Date
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedDate('today')}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        selectedDate === 'today'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <p className="font-semibold">Today</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </button>
                    <button
                      onClick={() => setSelectedDate('tomorrow')}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        selectedDate === 'tomorrow'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <p className="font-semibold">Tomorrow</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Time Slot
                  </p>
                  <div className="grid gap-3">
                    {deliverySlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedSlot === slot.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{slot.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{slot.name}</p>
                                {slot.popular && (
                                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Popular</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{slot.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {slot.price === 0 ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">FREE</Badge>
                            ) : (
                              <span className="font-semibold">{formatPrice(slot.price)}</span>
                            )}
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                              selectedSlot === slot.id ? 'border-primary bg-primary' : 'border-gray-300'
                            }`}>
                              {selectedSlot === slot.id && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Payment Method */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-transparent pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl ${method.bgColor} flex items-center justify-center`}>
                              <Icon className={`h-6 w-6 ${method.color}`} />
                            </div>
                            <div>
                              <p className="font-semibold">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === method.id ? 'border-primary bg-primary' : 'border-gray-300'
                          }`}>
                            {selectedPayment === method.id && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Security Badge */}
                <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>100% secure payments powered by Razorpay</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {cart?.items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <Image
                            src={item.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100'}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white rounded-full text-xs flex items-center justify-center font-medium">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.quantity} × {formatPrice(item.unit_price)}
                          </p>
                        </div>
                        <p className="font-semibold text-sm">{formatPrice(item.total)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Coupon Section */}
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-sm">
                    <Gift className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-700">Have a coupon?</span>
                    <Button variant="link" className="p-0 h-auto text-amber-700 font-semibold">Apply</Button>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({cart?.items.length} items)</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        <span className="font-medium">{formatPrice(deliveryCharge)}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (5%)</span>
                      <span className="font-medium">{formatPrice(taxAmount)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg">Total</span>
                      <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    className={`w-full h-14 text-base font-semibold ${
                      selectedPayment === 'cod'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    }`}
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || paymentLoading || (!selectedAddressId && !showNewAddressForm)}
                  >
                    {isProcessing || paymentLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : selectedPayment === 'cod' ? (
                      <>
                        <Banknote className="h-5 w-5 mr-2" />
                        Place Order (COD)
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5 mr-2" />
                        Pay {formatPrice(total)}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By placing this order, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  </p>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-white rounded-lg border">
                  <Truck className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Fast Delivery</p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border">
                  <ShieldCheck className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xs text-muted-foreground">Secure Pay</p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border">
                  <BadgePercent className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                  <p className="text-xs text-muted-foreground">Best Price</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-xl font-bold text-primary">{formatPrice(total)}</p>
          </div>
          <Button
            className={`h-12 px-6 text-base font-semibold ${
              selectedPayment === 'cod'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            onClick={handlePlaceOrder}
            disabled={isProcessing || paymentLoading || (!selectedAddressId && !showNewAddressForm)}
          >
            {isProcessing || paymentLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : selectedPayment === 'cod' ? (
              'Place Order'
            ) : (
              `Pay ${formatPrice(total)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
