'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Check, 
  Loader2, 
  Mail, 
  User, 
  Building, 
  Newspaper,
  Bell,
  CheckCircle
} from 'lucide-react';
import { CATEGORIES } from '@/types';

export default function JournalistSubscribePage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    outlet: '',
    beat: '',
    categories: [] as string[],
    frequency: 'weekly',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Email is required');
      return;
    }

    if (formData.categories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { error: insertError } = await supabase
        .from('journalist_subscribers')
        .insert({
          email: formData.email,
          name: formData.name || null,
          outlet: formData.outlet || null,
          beat: formData.beat || null,
          categories: formData.categories,
          frequency: formData.frequency,
          is_verified: false,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This email is already subscribed');
        } else {
          setError(insertError.message);
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Subscribed!</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification email to <strong>{formData.email}</strong>. 
              Please check your inbox and click the link to confirm your subscription.
            </p>
            <Link href="/showcase">
              <Button className="bg-secondary hover:bg-secondary/90">
                Browse Press Releases
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="p-6 border-b bg-white">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center space-x-2 w-fit">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PRBuild</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Never Miss a Story
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Subscribe to receive curated press releases directly to your inbox. 
              All releases are professionally written and reviewed by our journalist panel.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Choose Your Frequency</h3>
                  <p className="text-gray-600 text-sm">
                    Get releases immediately, as a daily digest, or weekly roundup.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Newspaper className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Category Filtering</h3>
                  <p className="text-gray-600 text-sm">
                    Only receive releases relevant to your beat and interests.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quality Guaranteed</h3>
                  <p className="text-gray-600 text-sm">
                    Every release is reviewed by our journalist panel before publication.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Subscribe to Press Releases</CardTitle>
              <CardDescription>
                Fill out the form below to start receiving press releases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@outlet.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Smith"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="outlet">Media Outlet</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="outlet"
                        value={formData.outlet}
                        onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                        placeholder="TechCrunch"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beat">Beat/Focus</Label>
                    <Input
                      id="beat"
                      value={formData.beat}
                      onChange={(e) => setFormData({ ...formData, beat: e.target.value })}
                      placeholder="Technology"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categories of Interest *</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <Badge
                        key={category}
                        variant={formData.categories.includes(category) ? 'default' : 'outline'}
                        className={`cursor-pointer ${
                          formData.categories.includes(category) 
                            ? 'bg-secondary hover:bg-secondary/90' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => toggleCategory(category)}
                      >
                        {formData.categories.includes(category) && (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email Frequency</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['immediate', 'daily', 'weekly'].map((freq) => (
                      <label
                        key={freq}
                        className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.frequency === freq
                            ? 'border-secondary bg-secondary/5'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={freq}
                          checked={formData.frequency === freq}
                          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                          className="sr-only"
                        />
                        <span className={`text-sm capitalize ${
                          formData.frequency === freq ? 'text-secondary font-medium' : 'text-gray-700'
                        }`}>
                          {freq}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By subscribing, you agree to our{' '}
                  <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>.
                  Unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-gray-50 border-t mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 PRBuild. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
