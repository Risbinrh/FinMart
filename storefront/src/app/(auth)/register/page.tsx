'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Fish, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    language: 'english',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill all required fields');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Fish className="h-7 w-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">
            Join FreshCatch for fresh fish delivery
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Mobile Number <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 border rounded-md bg-muted text-muted-foreground">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                    })
                  }
                  className="flex-1"
                  required
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Email <span className="text-muted-foreground">(Optional)</span>
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Delivery Address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                We&apos;ll verify your delivery zone after registration
              </p>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Preferred Language
              </label>
              <Select
                value={formData.language}
                onValueChange={(value) =>
                  setFormData({ ...formData, language: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Referral Code (Optional) */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Referral Code{' '}
                <span className="text-muted-foreground">(Optional)</span>
              </label>
              <Input type="text" placeholder="Enter referral code" />
              <p className="text-xs text-muted-foreground mt-1">
                Get ₹30 off on your first order!
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded"
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm pt-6 mt-6 border-t">
            <span className="text-muted-foreground">
              Already have an account?{' '}
            </span>
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
