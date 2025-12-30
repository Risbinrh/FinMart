'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  ShoppingBag,
  Sparkles,
  PartyPopper,
  CalendarDays,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { medusa, Order, formatPrice } from '@/lib/medusa';

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  'order_placed': { label: 'Order Placed', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
  'order_confirmed': { label: 'Confirmed', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: CheckCircle },
  'shipped': { label: 'Shipped', color: 'text-indigo-700', bgColor: 'bg-indigo-100', icon: Package },
  'out_for_delivery': { label: 'Out for Delivery', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Truck },
  'delivered': { label: 'Delivered', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
  'completed': { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
};

const getOrderDisplayStatus = (order: Order): string => {
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

function OrdersContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const { orders } = await medusa.getOrders();
        setOrders(orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading]);

  const activeOrders = orders.filter(o => {
    const displayStatus = getOrderDisplayStatus(o);
    return ['order_placed', 'order_confirmed', 'shipped', 'out_for_delivery'].includes(displayStatus);
  });
  const pastOrders = orders.filter(o => {
    const displayStatus = getOrderDisplayStatus(o);
    return ['delivered', 'completed', 'cancelled'].includes(displayStatus);
  });

  const OrderCard = ({ order }: { order: Order }) => {
    const displayStatus = getOrderDisplayStatus(order);
    const status = statusConfig[displayStatus] || statusConfig.order_placed;
    const StatusIcon = status.icon;

    return (
      <Link href={`/orders/${order.id}`}>
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
          <CardContent className="p-0">
            {/* Status Header */}
            <div className={`${status.bgColor} px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${status.color}`} />
                <span className={`font-semibold text-sm ${status.color}`}>{status.label}</span>
              </div>
              <Badge variant="secondary" className="bg-white/80 text-gray-700 text-xs">
                #{order.display_id || order.id.slice(0, 8)}
              </Badge>
            </div>

            <div className="p-4 space-y-4">
              {/* Items Preview */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="relative h-14 w-14 rounded-xl border-2 border-white overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm"
                    >
                      <Image
                        src={item.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100'}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ))}
                  {(order.items?.length || 0) > 3 && (
                    <div className="relative h-14 w-14 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-gray-600">+{(order.items?.length || 0) - 3}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {order.items?.[0]?.title || 'Order Items'}
                    {(order.items?.length || 0) > 1 && ` +${(order.items?.length || 0) - 1} more`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Order Info */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{formatPrice(order.total || 0)}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-9 w-32 mb-2 bg-white/20" />
            <Skeleton className="h-5 w-48 bg-white/20" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <Skeleton className="h-12" />
                <div className="p-4 space-y-4">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Success Message */}
      {isSuccess && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                <PartyPopper className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Order placed successfully!</p>
                <p className="text-sm text-green-100">We'll deliver your fresh fish soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Orders</h1>
          </div>
          <p className="text-primary-foreground/80">Track and manage your orders</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {!isAuthenticated ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Package className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Please login to view your orders</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Sign in to track your orders and order history
            </p>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8">Sign In</Button>
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No orders yet</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Start shopping to see your orders here
            </p>
            <Link href="/products">
              <Button size="lg" className="h-12 px-8 gap-2">
                <Sparkles className="h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-white rounded-xl p-1 shadow-sm h-auto">
              <TabsTrigger
                value="active"
                className="flex-1 sm:flex-none rounded-lg px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Active
                  {activeOrders.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      {activeOrders.length}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="flex-1 sm:flex-none rounded-lg px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Past Orders
                  {pastOrders.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
                      {pastOrders.length}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                  <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">No active orders</p>
                  <Link href="/products" className="inline-block mt-4">
                    <Button variant="outline">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                  <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">No past orders</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pastOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="h-10 w-32 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
