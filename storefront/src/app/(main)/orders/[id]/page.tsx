'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Package,
  ShoppingBag,
  Loader2,
  XCircle,
  AlertTriangle,
  Receipt,
  CreditCard,
  Copy,
  Check,
  HelpCircle,
  MessageCircle,
  Sparkles,
  CalendarDays,
  CircleDot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import { medusa, Order, formatPrice } from '@/lib/medusa';

const statusConfig: Record<string, { label: string; color: string; bgColor: string; textColor: string; icon: React.ElementType }> = {
  'order_placed': { label: 'Order Placed', color: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700', icon: Clock },
  'order_confirmed': { label: 'Confirmed', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700', icon: CheckCircle },
  'shipped': { label: 'Shipped', color: 'bg-indigo-500', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700', icon: Package },
  'out_for_delivery': { label: 'Out for Delivery', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700', icon: Truck },
  'delivered': { label: 'Delivered', color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700', icon: XCircle },
  'completed': { label: 'Completed', color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700', icon: CheckCircle },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await medusa.getOrder(orderId);
        if (result?.order) {
          console.log('[Order] Fetched order:', {
            id: result.order.id,
            status: result.order.status,
            fulfillment_status: result.order.fulfillment_status,
            payment_status: result.order.payment_status,
            raw: result.order,
          });
          setOrder(result.order);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, authLoading]);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const result = await medusa.cancelOrder(orderId);
      if (result?.order) {
        setOrder(result.order);
        setShowCancelDialog(false);
      } else {
        alert('Failed to cancel order. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order. Please try again or contact support.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order?.display_id?.toString() || orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const canCancelOrder = (order: Order): boolean => {
    const status = getDisplayStatus(order);
    return ['order_placed', 'order_confirmed'].includes(status);
  };

  const getDisplayStatus = (order: Order): string => {
    const paymentStatus = order.payment_status;
    const fulfillmentStatus = order.fulfillment_status;
    const orderStatus = order.status;

    if (orderStatus === 'cancelled' || orderStatus === 'canceled') {
      return 'cancelled';
    }

    if (fulfillmentStatus === 'delivered' || orderStatus === 'completed') {
      return 'delivered';
    }

    if (order.fulfillments && order.fulfillments.length > 0) {
      const latestFulfillment = order.fulfillments[order.fulfillments.length - 1];

      if (latestFulfillment.delivered_at) {
        return 'delivered';
      }

      if (latestFulfillment.shipped_at) {
        return 'out_for_delivery';
      }

      return 'shipped';
    }

    if (fulfillmentStatus === 'fulfilled' || fulfillmentStatus === 'partially_fulfilled') {
      return 'shipped';
    }

    if (paymentStatus === 'captured') {
      return 'order_confirmed';
    }

    return 'order_placed';
  };

  const buildTimeline = (order: Order) => {
    const displayStatus = getDisplayStatus(order);
    const createdAt = new Date(order.created_at);

    const statusOrder = ['order_placed', 'order_confirmed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(displayStatus);

    const timeline = [
      {
        status: 'order_placed',
        time: createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        date: createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        label: 'Order Placed',
        description: 'Your order has been received',
        completed: currentIndex >= 0,
        current: currentIndex === 0
      },
      {
        status: 'order_confirmed',
        time: '',
        date: '',
        label: 'Order Confirmed',
        description: 'Payment verified, preparing order',
        completed: currentIndex >= 1,
        current: currentIndex === 1
      },
      {
        status: 'shipped',
        time: '',
        date: '',
        label: 'Shipped',
        description: 'Order dispatched from warehouse',
        completed: currentIndex >= 2,
        current: currentIndex === 2
      },
      {
        status: 'out_for_delivery',
        time: '',
        date: '',
        label: 'Out for Delivery',
        description: 'On the way to your location',
        completed: currentIndex >= 3,
        current: currentIndex === 3
      },
      {
        status: 'delivered',
        time: '',
        date: '',
        label: 'Delivered',
        description: 'Order delivered successfully',
        completed: currentIndex >= 4,
        current: currentIndex === 4
      },
    ];

    return timeline;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90">
          <div className="container mx-auto px-4 py-6">
            <Skeleton className="h-5 w-28 mb-4 bg-white/20" />
            <Skeleton className="h-8 w-48 mb-2 bg-white/20" />
            <Skeleton className="h-5 w-64 bg-white/20" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center border-0 shadow-2xl">
          <CardContent className="py-12">
            <div className="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Please login</h2>
            <p className="text-muted-foreground mb-8">Sign in to view your order details</p>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 rounded-xl">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center border-0 shadow-2xl">
          <CardContent className="py-12">
            <div className="h-20 w-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order not found</h2>
            <p className="text-muted-foreground mb-8">This order doesn&apos;t exist or you don&apos;t have access</p>
            <Link href="/orders">
              <Button size="lg" className="h-12 px-8 rounded-xl">Back to Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderStatus = getDisplayStatus(order);
  const status = statusConfig[orderStatus] || statusConfig.order_placed;
  const StatusIcon = status.icon;
  const timeline = buildTimeline(order);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold">Order #{order.display_id || orderId.slice(0, 8)}</h1>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy order ID"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-300" />
                  ) : (
                    <Copy className="h-4 w-4 text-white/70" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
            <Badge className={`${status.color} text-white px-3 py-1.5 text-sm font-medium shrink-0`}>
              <StatusIcon className="h-4 w-4 mr-1.5" />
              {status.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Status Banner */}
        <Card className={`border-0 shadow-lg overflow-hidden ${status.bgColor}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-2xl ${status.color} flex items-center justify-center shadow-lg`}>
                <StatusIcon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-lg ${status.textColor}`}>
                  {orderStatus === 'delivered' || orderStatus === 'completed'
                    ? 'Order delivered successfully!'
                    : orderStatus === 'cancelled'
                      ? 'Order was cancelled'
                      : orderStatus === 'out_for_delivery'
                        ? 'Your order is out for delivery!'
                        : orderStatus === 'shipped'
                          ? 'Your order has been shipped!'
                          : orderStatus === 'order_confirmed'
                            ? 'Your order has been confirmed!'
                            : 'Your order has been placed!'}
                </p>
                <p className={`text-sm ${status.textColor} opacity-80`}>
                  {orderStatus === 'delivered' || orderStatus === 'completed'
                    ? 'Thank you for shopping with FreshCatch'
                    : orderStatus === 'cancelled'
                      ? 'Your refund will be processed within 5-7 business days'
                      : orderStatus === 'out_for_delivery'
                        ? 'Expected delivery within the next few hours'
                        : orderStatus === 'shipped'
                          ? 'Your order is on its way'
                          : orderStatus === 'order_confirmed'
                            ? 'Preparing your fresh fish order'
                            : 'We\'ve received your order'}
                </p>
              </div>
              {canCancelOrder(order) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300 gap-1.5 shrink-0 hidden sm:flex"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Order Timeline
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative pl-2">
              {timeline.map((step, index) => (
                <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                      step.completed
                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                        : step.current
                          ? 'bg-gradient-to-br from-primary to-blue-500 text-white ring-4 ring-primary/20'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : step.current ? (
                        <CircleDot className="h-5 w-5 animate-pulse" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-2 rounded-full ${
                        step.completed ? 'bg-green-400' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="pt-1.5 flex-1">
                    <p className={`font-semibold ${step.completed || step.current ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                    <p className={`text-sm ${step.completed || step.current ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                      {step.description}
                    </p>
                    {step.time && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.date} at {step.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Order Items ({order.items?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0 bg-white shadow-sm">
                  <Image
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200'}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm line-clamp-2">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Qty: {item.quantity}
                  </p>
                  <p className="font-bold text-primary mt-1">{formatPrice(item.total || item.unit_price * item.quantity)}</p>
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className={`font-medium ${order.shipping_total === 0 ? 'text-green-600' : ''}`}>
                  {order.shipping_total === 0 ? 'FREE' : formatPrice(order.shipping_total || 0)}
                </span>
              </div>
              {order.tax_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">{formatPrice(order.tax_total || 0)}</span>
                </div>
              )}
              {order.discount_total > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600 font-medium">-{formatPrice(order.discount_total)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">{formatPrice(order.total || 0)}</span>
            </div>

            {/* Payment Badge */}
            <div className={`flex items-center gap-3 p-3 rounded-xl mt-4 ${
              order.payment_status === 'captured'
                ? 'bg-green-50 border border-green-200'
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <CreditCard className={`h-5 w-5 ${
                order.payment_status === 'captured' ? 'text-green-600' : 'text-amber-600'
              }`} />
              <span className={`text-sm font-medium ${
                order.payment_status === 'captured' ? 'text-green-700' : 'text-amber-700'
              }`}>
                Payment {order.payment_status === 'captured' ? 'Successful' : 'Pending'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        {order.shipping_address && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                  {order.shipping_address.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3.5 w-3.5" />
                      {order.shipping_address.phone}
                    </p>
                  )}
                  <p className="text-sm mt-2">{order.shipping_address.address_1}</p>
                  {order.shipping_address.address_2 && (
                    <p className="text-sm">{order.shipping_address.address_2}</p>
                  )}
                  <p className="text-sm">
                    {order.shipping_address.city}
                    {order.shipping_address.province && `, ${order.shipping_address.province}`}
                    {order.shipping_address.postal_code && ` - ${order.shipping_address.postal_code}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Need help with your order?</p>
                <p className="text-sm text-gray-600 mt-1">
                  Our support team is available 24/7 to assist you
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button variant="outline" size="sm" className="bg-white gap-1.5">
                    <MessageCircle className="h-4 w-4" />
                    Chat with us
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white gap-1.5">
                    <Phone className="h-4 w-4" />
                    Call Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Actions */}
        <div className="hidden lg:flex gap-4">
          {canCancelOrder(order) && (
            <Button
              variant="outline"
              className="flex-1 h-12 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300 gap-2"
              onClick={() => setShowCancelDialog(true)}
            >
              <XCircle className="h-5 w-5" />
              Cancel Order
            </Button>
          )}
          <Link href="/products" className="flex-1">
            <Button className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 rounded-xl">
              <Sparkles className="h-5 w-5" />
              Shop Again
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-50">
        <div className="flex gap-3">
          {canCancelOrder(order) ? (
            <>
              <Button
                variant="outline"
                className="flex-1 h-12 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowCancelDialog(true)}
              >
                <XCircle className="h-5 w-5 mr-2" />
                Cancel
              </Button>
              <Link href="/products" className="flex-1">
                <Button className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-blue-600 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                  Shop Again
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/products" className="flex-1">
              <Button className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-blue-600 rounded-xl">
                <Sparkles className="h-5 w-5" />
                Shop Again
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="h-16 w-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Cancel Order?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to cancel this order? This action cannot be undone.
              {order.payment_status === 'captured' && (
                <span className="block mt-3 p-3 bg-blue-50 rounded-xl text-blue-700 text-sm">
                  Your payment will be refunded within 5-7 business days.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-row gap-3 mt-4">
            <AlertDialogCancel disabled={isCancelling} className="flex-1 h-12 rounded-xl">
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="flex-1 h-12 bg-red-500 text-white hover:bg-red-600 rounded-xl"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel Order'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
