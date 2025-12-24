'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  MapPin,
  Clock,
  CreditCard,
  Wallet,
  Banknote,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const deliverySlots = [
  { id: 'sunrise', name: 'Sunrise Delivery', time: '6 AM - 8 AM', price: 0, icon: '🌅' },
  { id: 'morning', name: 'Morning Delivery', time: '8 AM - 12 PM', price: 0, icon: '🌞' },
  { id: 'evening', name: 'Evening Delivery', time: '4 PM - 7 PM', price: 30, icon: '🌆' },
];

const paymentMethods = [
  { id: 'upi', name: 'UPI', description: 'GPay, PhonePe, Paytm', icon: Wallet },
  { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive', icon: Banknote },
];

// Dummy cart items
const cartItems = [
  {
    id: '1',
    name: 'Seer Fish',
    tamilName: 'வஞ்சிரம்',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
    price: 770,
    quantity: 1,
    unit: 'kg',
    cleaning: 'Cleaned',
  },
  {
    id: '2',
    name: 'Tiger Prawns',
    tamilName: 'புலி இறால்',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100&h=100&fit=crop',
    price: 405,
    quantity: 0.5,
    unit: 'kg',
    cleaning: 'Cleaned',
  },
];

export default function CheckoutPage() {
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    address: '123, ABC Street, T Nagar',
    city: 'Chennai',
    pincode: '600017',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = deliverySlots.find(s => s.id === selectedSlot)?.price || 0;
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // Redirect to order confirmation
    window.location.href = '/orders/123';
  };

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
              <CardContent>
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">{address.name}</p>
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                        <p className="text-sm mt-1">{address.address}</p>
                        <p className="text-sm">{address.city} - {address.pincode}</p>
                        <Badge variant="secondary" className="mt-2">Zone A - Free Delivery</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
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
                            <span className="font-medium">₹{slot.price}</span>
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
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-14 w-14 rounded overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} {item.unit} • {item.cleaning}</p>
                      </div>
                      <p className="font-medium text-sm">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <span>₹{deliveryCharge}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (5% GST)</span>
                    <span>₹{(subtotal * 0.05).toFixed(0)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{(total + subtotal * 0.05).toFixed(0)}</span>
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
                    `Place Order • ₹${(total + subtotal * 0.05).toFixed(0)}`
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
