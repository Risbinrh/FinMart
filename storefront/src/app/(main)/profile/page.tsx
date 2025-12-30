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
  Mail,
  Phone,
  Settings,
  Shield,
  Star,
  Crown,
  Sparkles,
  Heart,
  FileText,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { medusa } from '@/lib/medusa';

export default function ProfilePage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading, logout, updateProfile } = useAuth();

  const [copied, setCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [editError, setEditError] = useState('');

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

  useEffect(() => {
    if (customer) {
      setEditForm({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        phone: customer.phone || '',
      });
    }
  }, [customer]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
    setEditError('');
  };

  const handleSaveProfile = async () => {
    if (!editForm.first_name.trim()) {
      setEditError('First name is required');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        phone: editForm.phone.trim() || undefined,
      });
      setShowEditDialog(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setEditError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-24 lg:pb-8">
        <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full bg-white/20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-7 w-40 bg-white/20" />
                <Skeleton className="h-4 w-48 bg-white/20" />
                <Skeleton className="h-4 w-32 bg-white/20" />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="grid grid-cols-3 gap-4 -mt-10">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
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
              <User className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Please login</h2>
            <p className="text-muted-foreground mb-8">Sign in to view your profile</p>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 rounded-xl">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = customer
    ? `${customer.first_name?.[0] || ''}${customer.last_name?.[0] || ''}`.toUpperCase() || 'U'
    : 'U';

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/orders', badge: orderCount > 0 ? `${orderCount}` : undefined, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: MapPin, label: 'Saved Addresses', href: '/profile/addresses', color: 'text-green-600', bgColor: 'bg-green-100' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', color: 'text-red-500', bgColor: 'bg-red-100' },
    { icon: Gift, label: 'Referral Program', href: '/profile/referrals', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { icon: Bell, label: 'Notifications', href: '/profile/notifications', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  ];

  const settingsItems = [
    { icon: Globe, label: 'Language', href: '/profile/language', badge: 'English' },
    { icon: Shield, label: 'Privacy & Security', href: '/profile/privacy' },
    { icon: FileText, label: 'Terms & Conditions', href: '/terms' },
    { icon: HelpCircle, label: 'Help & Support', href: '/help' },
    { icon: MessageCircle, label: 'Contact Us', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8 pb-16">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                <AvatarFallback className="bg-white text-primary text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">
                  {customer?.first_name} {customer?.last_name}
                </h1>
                <Badge className="bg-white/20 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Member
                </Badge>
              </div>
              <p className="text-sm text-white/80 flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" />
                {customer?.email}
              </p>
              {customer?.phone && (
                <p className="text-sm text-white/80 flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5" />
                  {customer.phone}
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5 bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{orderCount}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-2">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹0</p>
              <p className="text-xs text-muted-foreground">Wallet</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹0</p>
              <p className="text-xs text-muted-foreground">Rewards</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Sparkles className="h-32 w-32" />
            </div>
            <div className="flex items-center justify-between relative">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5" />
                  <span className="text-sm font-medium text-white/90">Your Referral Code</span>
                </div>
                <p className="text-3xl font-bold tracking-wider">{referralCode}</p>
                <p className="text-sm text-white/80 mt-2">
                  Share & earn ₹50 per successful referral
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={copyReferralCode}
                className="gap-2 bg-white text-purple-600 hover:bg-white/90 rounded-xl h-10 px-4"
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
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href}>
                  <div className="group p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all hover:scale-[1.02] hover:shadow-md">
                    <div className={`h-11 w-11 ${item.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-900">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs h-5 min-w-5 px-1.5 bg-primary/10 text-primary">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Saved Addresses Preview */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Saved Addresses
              </CardTitle>
              <Link href="/profile/addresses">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  Manage
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              const customerAddresses = customer?.addresses || customer?.shipping_addresses || [];
              return customerAddresses.length > 0 ? (
                <>
                  {customerAddresses.slice(0, 2).map((addr, index) => (
                    <Link key={addr.id || index} href="/profile/addresses">
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {addr.first_name} {addr.last_name}
                            </span>
                            {index === 0 && (
                              <Badge className="bg-green-100 text-green-700 text-xs border-0">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-0.5">{addr.address_1}</p>
                          <p className="text-sm text-muted-foreground">
                            {addr.city} - {addr.postal_code}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </Link>
                  ))}
                  {customerAddresses.length > 2 && (
                    <Link href="/profile/addresses" className="block">
                      <p className="text-sm text-primary text-center font-medium py-2 hover:underline">
                        View all {customerAddresses.length} addresses
                      </p>
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/profile/addresses">
                  <div className="text-center py-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="h-12 w-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">No saved addresses</p>
                    <p className="text-sm text-primary font-medium mt-1">Add your first address</p>
                  </div>
                </Link>
              );
            })()}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              Settings & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <Link href={item.href}>
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-4.5 w-4.5 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="outline" className="text-xs font-normal">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                  {index < settingsItems.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full h-12 gap-2 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300 rounded-xl"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="h-5 w-5" />
              Logout
            </>
          )}
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          FreshCatch v1.0.0 | Made with love in Chennai
        </p>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="h-14 w-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
              <User className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {editError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">First Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="first_name"
                    placeholder="Rajesh"
                    value={editForm.first_name}
                    onChange={handleEditChange}
                    className="pl-11 h-11 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="last_name"
                    placeholder="Kumar"
                    value={editForm.last_name}
                    onChange={handleEditChange}
                    className="pl-11 h-11 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={customer?.email || ''}
                  disabled
                  className="pl-11 h-11 rounded-xl bg-gray-50"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Email cannot be changed</p>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="phone"
                  placeholder="9876543210"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="pl-11 h-11 rounded-xl"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-3">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1 h-11 rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-blue-600">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
