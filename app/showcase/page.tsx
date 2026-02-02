import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Calendar, Building, ArrowRight, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { CATEGORIES } from '@/types';

export default async function ShowcasePage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('showcase_releases')
    .select('*')
    .order('published_at', { ascending: false });

  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }

  if (searchParams.q) {
    query = query.or(`headline.ilike.%${searchParams.q}%,summary.ilike.%${searchParams.q}%,company_name.ilike.%${searchParams.q}%`);
  }

  const { data: releases, error } = await query;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PRBuild</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary">
              Home
            </Link>
            <Link href="/showcase" className="text-sm font-medium text-primary">
              Showcase
            </Link>
            <Link href="/journalist/subscribe" className="text-sm font-medium text-gray-600 hover:text-primary">
              For Journalists
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-secondary hover:bg-secondary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Press Release Showcase</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse the latest press releases from innovative companies. All releases are professionally written and journalist-reviewed.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form className="flex-1" action="/showcase" method="get">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="q"
                defaultValue={searchParams.q}
                placeholder="Search by company, headline, or keyword..."
                className="pl-10"
              />
            </div>
            {searchParams.category && (
              <input type="hidden" name="category" value={searchParams.category} />
            )}
          </form>
          
          <div className="flex gap-2 flex-wrap">
            <Link href="/showcase">
              <Button 
                variant={!searchParams.category ? 'default' : 'outline'}
                size="sm"
                className={!searchParams.category ? 'bg-secondary hover:bg-secondary/90' : ''}
              >
                All
              </Button>
            </Link>
            {CATEGORIES.slice(0, 5).map((category) => (
              <Link key={category} href={`/showcase?category=${encodeURIComponent(category)}`}>
                <Button 
                  variant={searchParams.category === category ? 'default' : 'outline'}
                  size="sm"
                  className={searchParams.category === category ? 'bg-secondary hover:bg-secondary/90' : ''}
                >
                  {category.split(' ')[0]}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Journalist CTA */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-primary/80 border-0">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Are you a journalist?</h3>
                <p className="text-white/80">Subscribe to receive relevant press releases directly to your inbox.</p>
              </div>
            </div>
            <Link href="/journalist/subscribe">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Subscribe Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Results */}
        {releases && releases.length > 0 ? (
          <div className="grid gap-6">
            {releases.map((release) => (
              <Link key={release.id} href={`/showcase/${release.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary">{release.category}</Badge>
                          {release.industry && (
                            <Badge variant="outline">{release.industry}</Badge>
                          )}
                        </div>
                        
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">
                          {release.headline}
                        </h2>
                        
                        {release.subhead && (
                          <p className="text-gray-600 italic mb-3">{release.subhead}</p>
                        )}
                        
                        <p className="text-gray-700 mb-4 line-clamp-2">{release.summary}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {release.company_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(release.published_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-gray-400 mt-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchParams.q || searchParams.category ? 'No releases found' : 'No releases yet'}
              </h3>
              <p className="text-gray-600 text-center">
                {searchParams.q || searchParams.category 
                  ? 'Try adjusting your search or filters'
                  : 'Check back soon for published press releases'}
              </p>
              {(searchParams.q || searchParams.category) && (
                <Link href="/showcase" className="mt-4">
                  <Button variant="outline">Clear Filters</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 bg-gray-50 border-t mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 PRBuild. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
