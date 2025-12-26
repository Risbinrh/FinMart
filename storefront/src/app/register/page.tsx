'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fish, User, Phone, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { registerWithPhone } = useAuth();

  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    return newOtp;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSendOtp = async () => {
    if (!formData.first_name) {
      setError('Please enter your name');
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    setIsVerifying(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newOtp = generateOtp();
    console.log('Generated OTP:', newOtp);

    setIsVerifying(false);
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setError('');
    setIsVerifying(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (enteredOtp === generatedOtp) {
      // Register with phone (stores in context + localStorage)
      registerWithPhone(formData.phone, formData.first_name, formData.last_name);
      setStep('success');
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push(redirectTo);
    } else {
      setError('Invalid OTP. Please try again.');
    }

    setIsVerifying(false);
  };

  const handleResendOtp = async () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setIsVerifying(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newOtp = generateOtp();
    console.log('New OTP:', newOtp);

    setIsVerifying(false);
  };

  // Success Screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <div className="h-20 w-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome, {formData.first_name}!</h2>
            <p className="text-muted-foreground mb-4">Your account has been created successfully</p>
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-2">Redirecting to homepage...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Fish className="h-7 w-7 text-white" />
            </div>
          </Link>
          <CardTitle className="text-2xl">
            {step === 'details' ? 'Create Account' : 'Verify Phone'}
          </CardTitle>
          <CardDescription>
            {step === 'details'
              ? 'Join FreshCatch for fresh fish delivery'
              : `Enter the OTP sent to ${formData.phone}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {step === 'details' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name *</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="first_name"
                      placeholder="Rajesh"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="last_name"
                      placeholder="Kumar"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number *</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    maxLength={10}
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOtp}
                className="w-full"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* OTP Display Box - Demo Only */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-700 mb-1">Demo OTP (displayed for testing)</p>
                <p className="text-3xl font-mono font-bold text-green-800 tracking-widest">
                  {generatedOtp}
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <label className="text-sm font-medium mb-2 block text-center">Enter OTP</label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleVerifyOtp}
                className="w-full"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Create Account'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive OTP?{' '}
                  <button
                    onClick={handleResendOtp}
                    className="text-primary font-medium hover:underline"
                    disabled={isVerifying}
                  >
                    Resend
                  </button>
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setStep('details');
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                }}
                className="w-full"
              >
                Back to Details
              </Button>
            </>
          )}

          <p className="text-xs text-center text-muted-foreground pt-4">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
