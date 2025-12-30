'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Fish,
  Mail,
  Lock,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  Truck,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { login } = useAuth();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setError('Please enter your email');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await login(formData.email.trim(), formData.password.trim());
      setStep('success');
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push(redirectTo);
    } catch (err: unknown) {
      console.error('Login failed:', err);
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center border-0 shadow-2xl">
          <CardContent className="py-12">
            <div className="relative inline-block mb-6">
              <div className="h-24 w-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                <span>🎉</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground mb-6">You are now logged in</p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Redirecting to your destination...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-blue-50 to-cyan-50 flex">
      {/* Left Side - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-blue-600 text-white p-12 flex-col justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Fish className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold">FreshCatch</span>
          </Link>

          <h1 className="text-4xl font-bold mb-4">
            Fresh Fish,<br />Delivered Daily
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Sign in to order the freshest seafood in Chennai, straight from the coast to your kitchen.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur rounded-xl">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Free Delivery</p>
              <p className="text-sm text-primary-foreground/70">On orders above ₹300</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur rounded-xl">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Same Day Delivery</p>
              <p className="text-sm text-primary-foreground/70">Order before 10 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur rounded-xl">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Quality Guaranteed</p>
              <p className="text-sm text-primary-foreground/70">100% fresh or money back</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <Link href="/" className="lg:hidden inline-flex items-center justify-center gap-2 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg">
                <Fish className="h-8 w-8 text-white" />
              </div>
            </Link>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-base">Sign in to your FreshCatch account</CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-semibold mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-12 h-12 rounded-xl text-base"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-12 pr-12 h-12 rounded-xl text-base"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 rounded-xl shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Demo credentials */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-800 text-sm">Demo Account</span>
                </div>
                <p className="text-blue-700 text-sm">Email: demo@freshcatch.in</p>
                <p className="text-blue-700 text-sm">Password: demo1234</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-muted-foreground">New to FreshCatch?</span>
                </div>
              </div>

              <Link href="/register" className="block">
                <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-xl border-2">
                  Create an Account
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-blue-50 to-cyan-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
