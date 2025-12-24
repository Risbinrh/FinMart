'use client';

import { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const user = {
  name: 'Rajesh Kumar',
  email: 'rajesh@email.com',
  phone: '+91 98765 43210',
  referralCode: 'RAJESH50',
  walletBalance: 150,
  totalOrders: 12,
  referralEarnings: 250,
};

const addresses = [
  {
    id: '1',
    type: 'Home',
    name: 'Rajesh Kumar',
    address: '123, ABC Street, T Nagar',
    city: 'Chennai - 600017',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Office',
    name: 'Rajesh Kumar',
    address: '456, XYZ Tower, Anna Salai',
    city: 'Chennai - 600002',
    isDefault: false,
  },
];

const menuItems = [
  { icon: Package, label: 'My Orders', href: '/orders', badge: '3 Active' },
  { icon: MapPin, label: 'Saved Addresses', href: '/profile/addresses' },
  { icon: Gift, label: 'Referral Program', href: '/profile/referrals' },
  { icon: Wallet, label: 'Wallet & Credits', href: '/profile/wallet', badge: '₹150' },
  { icon: Globe, label: 'Language', href: '/profile/language', badge: 'English' },
  { icon: Bell, label: 'Notifications', href: '/profile/notifications' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
];

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarFallback className="bg-white text-primary text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm opacity-90">{user.phone}</p>
              <p className="text-sm opacity-80">{user.email}</p>
            </div>
            <Button variant="secondary" size="sm" className="gap-1">
              <Edit className="h-3 w-3" />
              Edit
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{user.totalOrders}</p>
              <p className="text-xs opacity-80">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">₹{user.walletBalance}</p>
              <p className="text-xs opacity-80">Wallet</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">₹{user.referralEarnings}</p>
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
                <p className="text-2xl font-bold text-accent">{user.referralCode}</p>
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
                  <p className="text-xs text-muted-foreground">3 Active</p>
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
                  <p className="text-xs text-green-600 font-medium">₹{user.walletBalance}</p>
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
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{addr.type}</span>
                    {addr.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{addr.address}</p>
                  <p className="text-sm text-muted-foreground">{addr.city}</p>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            ))}
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
        <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
