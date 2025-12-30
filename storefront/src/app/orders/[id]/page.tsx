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

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  'order_placed': { label: 'Order Placed', color: 'bg-yellow-500', icon: Clock },
  'order_confirmed': { label: 'Order Confirmed', color: 'bg-blue-500', icon: CheckCircle },
  'shipped': { label: 'Shipped', color: 'bg-blue-500', icon: Package },
  'out_for_delivery': { label: 'Out for Delivery', color: 'bg-purple-500', icon: Truck },
  'delivered': { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
  'completed': { label: 'Completed', color: 'bg-green-500', icon: CheckCircle },
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

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await medusa.getOrder(orderId);
        if (result?.order) {
          // Log the order status fields to debug
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

  // Check if order can be cancelled (only before shipping)
  const canCancelOrder = (order: Order): boolean => {
    const status = getDisplayStatus(order);
    // Can only cancel if order is placed or confirmed (not yet shipped)
    return ['order_placed', 'order_confirmed'].includes(status);
  };

  // Get the best status to display
  // Flow: Order Placed → Order Confirmed → Shipped → Out for Delivery → Delivered
  const getDisplayStatus = (order: Order): string => {
    const paymentStatus = order.payment_status;
    const fulfillmentStatus = order.fulfillment_status;
    const orderStatus = order.status;

    // Check for cancellation first
    if (orderStatus === 'cancelled' || orderStatus === 'canceled') {
      return 'cancelled';
    }

    // Check fulfillment status for delivery tracking
    if (fulfillmentStatus === 'delivered' || orderStatus === 'completed') {
      return 'delivered';
    }

    // Check if fulfillment has shipment
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

  // Build timeline based on order status
  // Flow: Order Placed → Order Confirmed → Shipped → Out for Delivery → Delivered
  const buildTimeline = (order: Order) => {
    const displayStatus = getDisplayStatus(order);
    const createdAt = new Date(order.created_at);

    // Define the status progression
    const statusOrder = ['order_placed', 'order_confirmed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(displayStatus);

    const timeline = [
      {
        status: 'order_placed',
        time: createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        label: 'Order Placed',
        completed: currentIndex >= 0
      },
      {
        status: 'order_confirmed',
        time: '',
        label: 'Order Confirmed',
        completed: currentIndex >= 1
      },
      {
        status: 'shipped',
        time: '',
        label: 'Shipped',
        completed: currentIndex >= 2
      },
      {
        status: 'out_for_delivery',
        time: '',
        label: 'Out for Delivery',
        completed: currentIndex >= 3
      },
      {
        status: 'delivered',
        time: '',
        label: 'Delivered',
        completed: currentIndex >= 4
      },
    ];

    return timeline;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="bg-primary/5 border-b">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please login</h2>
          <p className="text-muted-foreground mb-6">Sign in to view your order</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">This order doesn&apos;t exist or you don&apos;t have access</p>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderStatus = getDisplayStatus(order);
  const status = statusConfig[orderStatus] || statusConfig.order_placed;
  const StatusIcon = status.icon;
  const timeline = buildTimeline(order);

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Order #{order.display_id || orderId.slice(0, 8)}</h1>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <Badge className={`${status.color} text-white`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Delivery Status */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Order Status</CardTitle>
              {canCancelOrder(order) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Order
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
              orderStatus === 'delivered' || orderStatus === 'completed'
                ? 'bg-green-50'
                : orderStatus === 'cancelled'
                  ? 'bg-red-50'
                  : orderStatus === 'out_for_delivery'
                    ? 'bg-purple-50'
                    : 'bg-blue-50'
            }`}>
              <StatusIcon className={`h-5 w-5 ${
                orderStatus === 'delivered' || orderStatus === 'completed'
                  ? 'text-green-600'
                  : orderStatus === 'cancelled'
                    ? 'text-red-600'
                    : orderStatus === 'out_for_delivery'
                      ? 'text-purple-600'
                      : 'text-blue-600'
              }`} />
              <div>
                <p className={`font-medium ${
                  orderStatus === 'delivered' || orderStatus === 'completed'
                    ? 'text-green-800'
                    : orderStatus === 'cancelled'
                      ? 'text-red-800'
                      : orderStatus === 'out_for_delivery'
                        ? 'text-purple-800'
                        : 'text-blue-800'
                }`}>
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
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {timeline.map((step, index) => (
                <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-2 ${
                        step.completed ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className={`font-medium ${step.completed ? '' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-sm text-muted-foreground">{step.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Order Items ({order.items?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-16 w-16 rounded overflow-hidden shrink-0 bg-slate-50">
                  <Image
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200'}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.total || item.unit_price * item.quantity)}</p>
              </div>
            ))}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={order.shipping_total === 0 ? 'text-green-600' : ''}>
                  {order.shipping_total === 0 ? 'FREE' : formatPrice(order.shipping_total || 0)}
                </span>
              </div>
              {order.tax_total > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.tax_total || 0)}</span>
                </div>
              )}
              {order.discount_total > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-{formatPrice(order.discount_total)}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total || 0)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Payment: {order.payment_status === 'captured' ? 'Paid' : 'Pending'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        {order.shipping_address && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                  {order.shipping_address.phone && (
                    <p className="text-sm text-muted-foreground">{order.shipping_address.phone}</p>
                  )}
                  <p className="text-sm mt-1">{order.shipping_address.address_1}</p>
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

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">Need Help?</Button>
          <Link href="/products" className="flex-1">
            <Button className="w-full gap-2">
              <ShoppingBag className="h-4 w-4" />
              Shop Again
            </Button>
          </Link>
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancel Order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
              {order.payment_status === 'captured' && (
                <span className="block mt-2 text-sm">
                  Your payment will be refunded within 5-7 business days.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
