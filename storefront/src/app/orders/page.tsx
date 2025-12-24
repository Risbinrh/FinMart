'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const orders = [
  {
    id: 'FC12345',
    date: '2024-12-24',
    status: 'delivered',
    total: 1245,
    items: [
      { name: 'Seer Fish', quantity: '1 kg', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100' },
      { name: 'Tiger Prawns', quantity: '500g', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100' },
    ],
  },
  {
    id: 'FC12344',
    date: '2024-12-22',
    status: 'out-for-delivery',
    total: 890,
    items: [
      { name: 'Pomfret White', quantity: '1 kg', image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=100' },
    ],
  },
  {
    id: 'FC12343',
    date: '2024-12-20',
    status: 'processing',
    total: 650,
    items: [
      { name: 'Mackerel', quantity: '2 kg', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100' },
      { name: 'Sardine', quantity: '1 kg', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=100' },
    ],
  },
  {
    id: 'FC12342',
    date: '2024-12-18',
    status: 'cancelled',
    total: 450,
    items: [
      { name: 'Rohu', quantity: '1.5 kg', image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=100' },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  'processing': { label: 'Processing', color: 'bg-yellow-500', icon: Clock },
  'out-for-delivery': { label: 'Out for Delivery', color: 'bg-blue-500', icon: Truck },
  'delivered': { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle },
  'cancelled': { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
};

export default function OrdersPage() {
  const activeOrders = orders.filter(o => ['processing', 'out-for-delivery'].includes(o.status));
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const OrderCard = ({ order }: { order: typeof orders[0] }) => {
    const status = statusConfig[order.status];
    const StatusIcon = status.icon;

    return (
      <Link href={`/orders/${order.id}`}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString('en-IN', {
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
                {order.items.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 rounded-full border-2 border-white overflow-hidden"
                  >
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {order.items.length} item{order.items.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-bold text-primary">₹{order.total}</p>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {orders.length === 0 ? (
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
