'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Mail, Lock, User, Building, Check, Gift } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteReleases, setInviteReleases] = useState<number | null>(null);

  useEffect(() => {
    const token = searchParams.get('invite');
    if (!token) return;
    setInviteToken(token);
    fetch(`/api/invite?token=${encodeURIComponent(token)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.email) {
          setFormData((prev) => ({ ...prev, email: data.email }));
          setInviteReleases(data.free_releases_remaining ?? 3);
        } else {
          setInviteToken(null);
        }
      })
      .catch(() => setInviteToken(null));
  }, [searchParams]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            company_name: formData.companyName,
          })
          .eq('id', data.user.id);

        await fetch('/api/invite/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: inviteToken ? JSON.stringify({ token: inviteToken }) : '{}',
        });

        router.refresh();
        router.push('/dashboard/my-releases');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const features = [
    'Written in 24 hours — not weeks',
    'Reviewed by our journalist panel before you see it',
    'Sent to journalists who opted in for your category',
    'First release free — no credit card required',
  ];

  return (
    <div className="flex gap-8 w-full max-w-4xl">
      {/* Benefits panel */}
      <div className="hidden lg:flex flex-col justify-center flex-1 pr-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Press releases that journalists actually read
        </h2>
        <p className="text-gray-600 mb-6">
          Join 500+ companies who stopped paying $400 per release and started getting real coverage at a fraction of the cost.
        </p>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-secondary/10 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-secondary" />
              </div>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Signup form */}
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
          <CardDescription>
            Start creating professional press releases today
          </CardDescription>
          {inviteToken && inviteReleases != null && (
            <div className="flex items-center justify-center gap-2 p-3 mt-2 rounded-lg bg-green-50 text-green-800 text-sm">
              <Gift className="h-4 w-4 flex-shrink-0" />
              <span>
                You&apos;re invited — you&apos;ll get {inviteReleases === -1 ? 'unlimited' : inviteReleases} free release{inviteReleases === 1 ? '' : 's'} when you sign up.
              </span>
            </div>
          )}
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Acme Inc."
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>

            <p className="text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <Link href="/login" className="text-secondary font-medium hover:underline">
                Sign in
              </Link>
            </p>

            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
