'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Loader2,
  ShieldCheck,
  Truck,
  Clock,
  Gift,
  ChevronRight,
  Sparkles,
  Fish,
  BadgePercent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/medusa';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { language } = useLanguage();

  const handleUpdateQuantity = async (lineItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(lineItemId);
      return;
    }
    setUpdatingItems(prev => ({ ...prev, [lineItemId]: true }));
    try {
      await updateQuantity(lineItemId, newQuantity);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [lineItemId]: false }));
    }
  };

  const handleRemoveItem = async (lineItemId: string) => {
    setUpdatingItems(prev => ({ ...prev, [lineItemId]: true }));
    try {
      await removeFromCart(lineItemId);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [lineItemId]: false }));
    }
  };

  const applyCoupon = async () => {
    setIsApplyingCoupon(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (couponCode.toUpperCase() === 'FRESH50') {
      setAppliedCoupon('FRESH50');
      setDiscount(5000);
    } else if (couponCode.toUpperCase() === 'FIRST100') {
      setAppliedCoupon('FIRST100');
      setDiscount(10000);
    } else {
      alert('Invalid coupon code');
    }
    setIsApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
  };

  // Calculate subtotal from items if cart.subtotal is undefined
  const subtotal = cart?.subtotal || cart?.items?.reduce((sum, item) => sum + (item.total || (item.unit_price || 0) * item.quantity), 0) || 0;
  const deliveryCharge = subtotal >= 30000 ? 0 : 3000;
  const total = subtotal - discount + deliveryCharge;
  const amountForFreeDelivery = 30000 - subtotal;
  const freeDeliveryProgress = Math.min((subtotal / 30000) * 100, 100);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex gap-4">
                    <Skeleton className="h-28 w-28 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Skeleton className="h-[450px] rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="h-32 w-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3">{t('yourCartIsEmpty', language)}</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              {t('discoverFreshCatch', language)}
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2 h-14 px-8 text-base font-semibold shadow-lg">
                <Sparkles className="h-5 w-5" />
                {t('exploreProducts', language)}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            {/* Suggestions */}
            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">{t('popularCategories', language)}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Sea Fish', 'Prawns', 'Crabs', 'River Fish'].map((cat) => (
                  <Link key={cat} href={`/products?category=${cat.toLowerCase().replace(' ', '-')}`}>
                    <Badge className="px-4 py-2 cursor-pointer transition-colors">
                      {cat}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-32 lg:pb-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('shoppingCart', language)}</h1>
          </div>
          <p className="text-primary-foreground/80">
            {cart.items.length} {cart.items.length === 1 ? t('itemInCart', language) : t('itemsInCart', language)}
          </p>
        </div>
      </div>

      {/* Free Delivery Progress */}
      {deliveryCharge > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Truck className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-amber-800">
                    Add {formatPrice(amountForFreeDelivery)} more for FREE delivery!
                  </span>
                  <span className="text-xs text-amber-600">{Math.round(freeDeliveryProgress)}%</span>
                </div>
                <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <Card key={item.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <Link href={`/products/${item.product?.handle || item.id}`}>
                      <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-blue-50 to-cyan-50">
                        <Image
                          src={item.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop'}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                        />
                        {index === 0 && (
                          <Badge className="absolute top-2 left-2 bg-primary text-xs">
                            {t('bestSeller', language)}
                          </Badge>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${item.product?.handle || item.id}`}
                            className="font-bold text-lg hover:text-primary transition-colors line-clamp-1"
                          >
                            {language === 'ta' && item.product?.metadata?.tamil_name
                              ? (item.product.metadata.tamil_name as string)
                              : item.title}
                          </Link>
                          {item.variant?.title && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {item.variant.title}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              <Clock className="h-3 w-3 mr-1" />
                              {t('fresh', language)}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 rounded-full h-9 w-9"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updatingItems[item.id]}
                        >
                          {updatingItems[item.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg hover:bg-white"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems[item.id]}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-bold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg hover:bg-white"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updatingItems[item.id]}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            {formatPrice(item.total || (item.unit_price || 0) * item.quantity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(item.unit_price || 0)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="flex items-center justify-between pt-4">
              <Link href="/products">
                <Button variant="outline" className="gap-2 rounded-xl">
                  <Fish className="h-4 w-4" />
                  {t('continueShopping', language)}
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {cart.items.length} {t('items', language)}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 overflow-hidden border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BadgePercent className="h-5 w-5 text-primary" />
                  {t('orderSummary', language)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-5">
                {/* Coupon Code */}
                <div>
                  <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                    <Gift className="h-4 w-4 text-primary" />
                    {t('haveCoupon', language)}
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Tag className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <span className="font-bold text-green-700">{appliedCoupon}</span>
                          <p className="text-xs text-green-600">Saving {formatPrice(discount)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="text-green-700 hover:text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('enterCouponCode', language)}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="h-11 rounded-xl uppercase"
                      />
                      <Button
                        variant="outline"
                        onClick={applyCoupon}
                        disabled={!couponCode || isApplyingCoupon}
                        className="h-11 px-5 rounded-xl"
                      >
                        {isApplyingCoupon ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          t('apply', language)
                        )}
                      </Button>
                    </div>
                  )}
                  {!appliedCoupon && (
                    <div className="flex gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setCouponCode('FRESH50')}
                      >
                        FRESH50
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        onClick={() => setCouponCode('FIRST100')}
                      >
                        FIRST100
                      </Badge>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('subtotal', language)} ({cart.items.length} {t('items', language)})</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Coupon Discount
                      </span>
                      <span className="font-medium">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('delivery', language)}</span>
                    {deliveryCharge === 0 ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{t('free', language)}</Badge>
                    ) : (
                      <span className="font-medium">{formatPrice(deliveryCharge)}</span>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">{t('total', language)}</span>
                    <p className="text-xs text-muted-foreground">{t('inclusiveTaxes', language)}</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" className="block">
                  <Button className="w-full h-14 text-base font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg rounded-xl gap-2">
                    {t('proceedToCheckout', language)}
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>{t('secureCheckout', language)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>{t('fastDelivery', language)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-xl font-bold text-primary">{formatPrice(total)}</p>
          </div>
          <Link href="/checkout" className="flex-1 max-w-[200px]">
            <Button className="w-full h-12 font-semibold bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
              Checkout
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
