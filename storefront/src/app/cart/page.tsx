'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface CartItem {
  id: string;
  name: string;
  tamilName: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
  cleaningOption: string;
  cleaningPrice: number;
}

const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Seer Fish',
    tamilName: 'வஞ்சிரம்',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop',
    price: 750,
    quantity: 1,
    unit: 'kg',
    cleaningOption: 'Cleaned',
    cleaningPrice: 20,
  },
  {
    id: '7',
    name: 'Tiger Prawns',
    tamilName: 'புலி இறால்',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200&h=200&fit=crop',
    price: 780,
    quantity: 0.5,
    unit: 'kg',
    cleaningOption: 'Cleaned & Deveined',
    cleaningPrice: 30,
  },
  {
    id: '3',
    name: 'Pomfret (White)',
    tamilName: 'வெள்ளை வாவல்',
    image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200&h=200&fit=crop',
    price: 650,
    quantity: 1,
    unit: 'kg',
    cleaningOption: 'Whole',
    cleaningPrice: 0,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0.5, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'FRESH50') {
      setAppliedCoupon('FRESH50');
      setDiscount(50);
    } else if (couponCode.toUpperCase() === 'FIRST100') {
      setAppliedCoupon('FIRST100');
      setDiscount(100);
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price + item.cleaningPrice) * item.quantity,
    0
  );
  const deliveryCharge = subtotal >= 300 ? 0 : 30;
  const total = subtotal - discount + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added any fish to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">{cartItems.length} items in your cart</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${item.id}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.tamilName}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.cleaningOption}
                          {item.cleaningPrice > 0 && ` (+₹${item.cleaningPrice})`}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -0.5)}
                            disabled={item.quantity <= 0.5}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-14 text-center text-sm font-medium">
                            {item.quantity} {item.unit}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 0.5)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-bold text-primary">
                            ₹{((item.price + item.cleaningPrice) * item.quantity).toFixed(0)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹{item.price + item.cleaningPrice}/{item.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Apply Coupon
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">
                          {appliedCoupon}
                        </span>
                        <span className="text-sm text-green-600">
                          (-₹{discount})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="h-auto p-1 text-green-700 hover:text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyCoupon}>
                        Apply
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Try: FRESH50 or FIRST100
                  </p>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{300 - subtotal} more for free delivery
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(0)}</span>
                </div>

                <Button className="w-full" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Trust Badges */}
                <div className="flex justify-center gap-4 text-xs text-muted-foreground pt-2">
                  <span>🔒 Secure Checkout</span>
                  <span>🚚 Free Delivery</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
