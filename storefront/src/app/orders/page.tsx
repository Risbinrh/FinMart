'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
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

// Get the best status to display for an order
// Flow: Order Placed → Order Confirmed → Shipped → Out for Delivery → Delivered
const getOrderDisplayStatus = (order: Order): string => {
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

  // Check if fulfillment has shipment (shipped_at indicates shipment created)
  if (order.fulfillments && order.fulfillments.length > 0) {
    const latestFulfillment = order.fulfillments[order.fulfillments.length - 1];

    // If delivered
    if (latestFulfillment.delivered_at) {
      return 'delivered';
    }

    // If shipped (has shipped_at or shipment was created)
    if (latestFulfillment.shipped_at) {
      return 'out_for_delivery';
    }

    // Fulfillment created but not shipped yet
    return 'shipped';
  }

  // Check if fulfillment exists (without detailed info)
  if (fulfillmentStatus === 'fulfilled' || fulfillmentStatus === 'partially_fulfilled') {
    return 'shipped';
  }

  // Check payment status - if captured, order is confirmed
  if (paymentStatus === 'captured') {
    return 'order_confirmed';
  }

  // Default - order just placed
  return 'order_placed';
};

export default function OrdersPage() {
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

    // Log for debugging
    console.log('[Orders] Order status:', {
      id: order.id,
      status: order.status,
      fulfillment_status: order.fulfillment_status,
      payment_status: order.payment_status,
      displayStatus,
    });

    return (
      <Link href={`/orders/${order.id}`}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold">Order #{order.display_id || order.id.slice(0, 8)}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <Badge className={`${status.color} text-white gap-1`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-2">
                {order.items?.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 rounded-full border-2 border-white overflow-hidden bg-muted"
                  >
                    <Image
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-bold text-primary">{formatPrice(order.total || 0)}</p>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary/5 border-b">
          <div className="container mx-auto px-4 py-6">
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Message */}
      {isSuccess && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Order placed successfully! We&apos;ll deliver your fresh fish soon.</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {!isAuthenticated ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please login to view your orders</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to track your orders and order history
            </p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="active" className="flex-1 sm:flex-none">
                Active ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1 sm:flex-none">
                Past Orders ({pastOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active orders</p>
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
                <div className="text-center py-8">
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
