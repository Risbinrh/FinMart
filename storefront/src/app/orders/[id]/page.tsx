'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Dummy order data
const orderData = {
  id: 'FC12345',
  status: 'out-for-delivery',
  placedAt: '2024-12-24T08:30:00',
  deliverySlot: '8 AM - 12 PM',
  estimatedDelivery: '10:30 AM',
  items: [
    {
      id: '1',
      name: 'Seer Fish',
      tamilName: 'வஞ்சிரம்',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200',
      price: 770,
      quantity: 1,
      unit: 'kg',
      cleaning: 'Cleaned',
    },
    {
      id: '2',
      name: 'Tiger Prawns',
      tamilName: 'புலி இறால்',
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200',
      price: 405,
      quantity: 0.5,
      unit: 'kg',
      cleaning: 'Cleaned & Deveined',
    },
  ],
  deliveryAddress: {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    address: '123, ABC Street, T Nagar',
    city: 'Chennai',
    pincode: '600017',
  },
  deliveryPartner: {
    name: 'Ramesh K',
    phone: '+91 98765 12345',
    rating: 4.8,
  },
  payment: {
    method: 'Cash on Delivery',
    subtotal: 1175,
    delivery: 0,
    tax: 59,
    total: 1234,
  },
  timeline: [
    { status: 'placed', time: '8:30 AM', label: 'Order Placed', completed: true },
    { status: 'confirmed', time: '8:35 AM', label: 'Order Confirmed', completed: true },
    { status: 'processing', time: '9:00 AM', label: 'Being Prepared', completed: true },
    { status: 'out-for-delivery', time: '10:00 AM', label: 'Out for Delivery', completed: true },
    { status: 'delivered', time: '', label: 'Delivered', completed: false },
  ],
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;

  const currentStep = orderData.timeline.findIndex(t => !t.completed);

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
              <h1 className="text-xl font-bold">Order #{orderId}</h1>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(orderData.placedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <Badge className="bg-blue-500 text-white">
              <Truck className="h-3 w-3 mr-1" />
              Out for Delivery
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Delivery Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Your order is on the way!</p>
                <p className="text-sm text-green-600">Estimated arrival: {orderData.estimatedDelivery}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {orderData.timeline.map((step, index) => (
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
                    {index < orderData.timeline.length - 1 && (
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

        {/* Delivery Partner */}
        {orderData.status === 'out-for-delivery' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Delivery Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{orderData.deliveryPartner.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ⭐ {orderData.deliveryPartner.rating} rating
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-16 w-16 rounded overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.tamilName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} {item.unit} • {item.cleaning}
                  </p>
                </div>
                <p className="font-medium">₹{(item.price * item.quantity).toFixed(0)}</p>
              </div>
            ))}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{orderData.payment.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5% GST)</span>
                <span>₹{orderData.payment.tax}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">₹{orderData.payment.total}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Payment: {orderData.payment.method}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{orderData.deliveryAddress.name}</p>
                <p className="text-sm text-muted-foreground">{orderData.deliveryAddress.phone}</p>
                <p className="text-sm mt-1">{orderData.deliveryAddress.address}</p>
                <p className="text-sm">{orderData.deliveryAddress.city} - {orderData.deliveryAddress.pincode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">Need Help?</Button>
          <Link href="/products" className="flex-1">
            <Button className="w-full gap-2">
              <ShoppingBag className="h-4 w-4" />
              Reorder
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
