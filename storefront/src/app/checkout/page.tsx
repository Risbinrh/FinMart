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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { medusa, formatPrice } from '@/lib/medusa';

const deliverySlots = [
  { id: 'sunrise', name: 'Sunrise Delivery', time: '6 AM - 8 AM', price: 0, icon: '🌅' },
  { id: 'morning', name: 'Morning Delivery', time: '8 AM - 12 PM', price: 0, icon: '🌞' },
  { id: 'evening', name: 'Evening Delivery', time: '4 PM - 7 PM', price: 3000, icon: '🌆' },
];

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive', icon: Banknote },
  { id: 'upi', name: 'UPI', description: 'GPay, PhonePe, Paytm', icon: Wallet },
  { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay', icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const { customer } = useAuth();

  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [address, setAddress] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    city: 'Chennai',
    postal_code: '',
    country_code: 'in',
  });

  // Pre-fill address from customer if available
  useEffect(() => {
    if (customer) {
      const shippingAddr = customer.shipping_addresses?.[0];
      if (shippingAddr) {
        setAddress({
          first_name: shippingAddr.first_name || customer.first_name || '',
          last_name: shippingAddr.last_name || customer.last_name || '',
          phone: shippingAddr.phone || customer.phone || '',
          address_1: shippingAddr.address_1 || '',
          city: shippingAddr.city || 'Chennai',
          postal_code: shippingAddr.postal_code || '',
          country_code: 'in',
        });
      } else {
        setAddress(prev => ({
          ...prev,
          first_name: customer.first_name || '',
          last_name: customer.last_name || '',
          phone: customer.phone || '',
        }));
      }
    }
  }, [customer]);

  if (!cart || cart.items.length === 0) {
    if (step === 'success') {
      // Show success page even if cart is empty (just completed order)
    } else {
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      );
    }
  }

  const subtotal = cart?.subtotal || 0;
  const deliveryCharge = deliverySlots.find(s => s.id === selectedSlot)?.price || 0;
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + deliveryCharge + taxAmount;

  const handlePlaceOrder = async () => {
    if (!address.first_name || !address.phone || !address.address_1 || !address.postal_code) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      // Update cart with shipping address
      if (cart) {
        await medusa.updateCart(cart.id, {
          email: customer?.email || `guest_${Date.now()}@freshcatch.in`,
          shipping_address: address,
          billing_address: address,
        });
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate order ID
      const newOrderId = 'FC' + Date.now().toString().slice(-8);
      setOrderId(newOrderId);

      // Clear the cart
      localStorage.removeItem('freshcatch_cart_id');
      await refreshCart();

      // Show success
      setStep('success');
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
      setStep('checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  // Processing Screen
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="h-24 w-24 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Wallet className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-xl font-bold mb-2">Processing Payment...</h2>
          <p className="text-muted-foreground">Please wait while we confirm your order</p>
        </div>
      </div>
    );
  }

  // Success Screen
  if (step === 'success') {
    const selectedSlotInfo = deliverySlots.find(s => s.id === selectedSlot);

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto text-center">
            {/* Success Animation */}
            <div className="relative mb-8">
              <div className="h-32 w-32 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2 left-0 right-0 flex justify-center">
                <span className="text-4xl animate-bounce">🎉</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. Your fresh fish is on its way!
            </p>

            {/* Order Details Card */}
            <Card className="text-left mb-6">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-bold text-lg">#{orderId}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Delivery Time</p>
                      <p className="text-sm text-muted-foreground">
                        Today, {selectedSlotInfo?.time} {selectedSlotInfo?.icon}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 flex items-center justify-center">📍</div>
                    <div>
                      <p className="font-medium">Delivery Address</p>
                      <p className="text-sm text-muted-foreground">
                        {address.first_name} {address.last_name}<br />
                        {address.address_1}<br />
                        {address.city} - {address.postal_code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 flex items-center justify-center">💳</div>
                    <div>
                      <p className="font-medium">Payment</p>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethods.find(p => p.id === selectedPayment)?.name}
                        {selectedPayment !== 'cod' && ' - Paid'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                <strong>📱 SMS Sent:</strong> Order confirmation sent to {address.phone}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/orders" className="flex-1">
                <Button variant="outline" className="w-full">
                  Track Order
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button className="w-full">
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
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">1</div>
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name *</label>
                    <Input
                      value={address.first_name}
                      onChange={(e) => setAddress({ ...address, first_name: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={address.last_name}
                      onChange={(e) => setAddress({ ...address, last_name: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number *</label>
                  <Input
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Address *</label>
                  <Input
                    value={address.address_1}
                    onChange={(e) => setAddress({ ...address, address_1: e.target.value })}
                    placeholder="House/Flat No., Street, Area"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <Input
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Chennai"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pincode *</label>
                    <Input
                      value={address.postal_code}
                      onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                      placeholder="600001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Delivery Time */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">2</div>
                  Delivery Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Delivery Date</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1">
                      Today
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Tomorrow
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3">
                  {deliverySlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedSlot === slot.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{slot.icon}</span>
                          <div>
                            <p className="font-medium">{slot.name}</p>
                            <p className="text-sm text-muted-foreground">{slot.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {slot.price === 0 ? (
                            <span className="text-green-600 font-medium">FREE</span>
                          ) : (
                            <span className="font-medium">{formatPrice(slot.price)}</span>
                          )}
                          {selectedSlot === slot.id && (
                            <Check className="h-5 w-5 text-primary ml-auto mt-1" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Payment Method */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">3</div>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          {selectedPayment === method.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cart?.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-14 w-14 rounded overflow-hidden shrink-0">
                        <Image
                          src={item.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <p className="font-medium text-sm">{formatPrice(item.total)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <span>{formatPrice(deliveryCharge)}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (5% GST)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Place Order - ${formatPrice(total)}`
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing this order, you agree to our Terms of Service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
