'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  Package,
  Gift,
  Wallet,
  Globe,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { medusa, Order } from '@/lib/medusa';

export default function ProfilePage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading, logout } = useAuth();

  const [copied, setCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrderCount = async () => {
      if (isAuthenticated) {
        try {
          const { orders } = await medusa.getOrders();
          setOrderCount(orders?.length || 0);
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        }
      }
    };
    fetchOrderCount();
  }, [isAuthenticated]);

  const referralCode = customer?.email?.split('@')[0]?.toUpperCase().slice(0, 8) + '50' || 'FRESH50';

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="bg-primary">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-32 bg-white/20" />
                <Skeleton className="h-4 w-24 bg-white/20" />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please login</h2>
          <p className="text-muted-foreground mb-6">Sign in to view your profile</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = customer
    ? `${customer.first_name?.[0] || ''}${customer.last_name?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/orders', badge: orderCount > 0 ? `${orderCount} Orders` : undefined },
    { icon: MapPin, label: 'Saved Addresses', href: '/profile/addresses' },
    { icon: Gift, label: 'Referral Program', href: '/profile/referrals' },
    { icon: Wallet, label: 'Wallet & Credits', href: '/profile/wallet', badge: '₹0' },
    { icon: Globe, label: 'Language', href: '/profile/language', badge: 'English' },
    { icon: Bell, label: 'Notifications', href: '/profile/notifications' },
    { icon: HelpCircle, label: 'Help & Support', href: '/help' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarFallback className="bg-white text-primary text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-bold">
                {customer?.first_name} {customer?.last_name}
              </h1>
              <p className="text-sm opacity-90">{customer?.phone || 'No phone added'}</p>
              <p className="text-sm opacity-80">{customer?.email}</p>
            </div>
            <Button variant="secondary" size="sm" className="gap-1">
              <Edit className="h-3 w-3" />
              Edit
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{orderCount}</p>
              <p className="text-xs opacity-80">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">₹0</p>
              <p className="text-xs opacity-80">Wallet</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">₹0</p>
              <p className="text-xs opacity-80">Referral Earnings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Referral Card */}
        <Card className="bg-gradient-to-r from-accent/20 to-accent/5 border-accent/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Referral Code</p>
                <p className="text-2xl font-bold text-accent">{referralCode}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Share & earn ₹50 per referral
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyReferralCode}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/orders">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">My Orders</p>
                  <p className="text-xs text-muted-foreground">{orderCount} orders</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/profile/wallet">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Wallet</p>
                  <p className="text-xs text-green-600 font-medium">₹0</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Saved Addresses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Saved Addresses</CardTitle>
              <Button variant="ghost" size="sm">Add New</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer?.shipping_addresses && customer.shipping_addresses.length > 0 ? (
              customer.shipping_addresses.map((addr, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {addr.first_name} {addr.last_name}
                      </span>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{addr.address_1}</p>
                    <p className="text-sm text-muted-foreground">
                      {addr.city} - {addr.postal_code}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No saved addresses</p>
                <Button variant="link" size="sm">Add your first address</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <Link href={item.href}>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive hover:text-destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              Logout
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
