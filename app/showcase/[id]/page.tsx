import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ArrowLeft, 
  Calendar, 
  Building, 
  Mail, 
  Phone, 
  Globe,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon
} from 'lucide-react';
import { format } from 'date-fns';

export default async function ShowcaseDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Fetch the release
  const { data: release, error } = await supabase
    .from('showcase_releases')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!release) {
    notFound();
  }

  // Increment view count
  await supabase
    .from('showcase_releases')
    .update({ view_count: (release.view_count || 0) + 1 })
    .eq('id', params.id);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/showcase/${release.id}`;
  const shareText = encodeURIComponent(release.headline);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PRBuild</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/showcase">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Showcase
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/showcase" className="hover:text-primary">Showcase</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{release.headline}</span>
        </nav>

        <article>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="text-sm">{release.category}</Badge>
              {release.industry && (
                <Badge variant="outline">{release.industry}</Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{release.headline}</h1>
            
            {release.subhead && (
              <p className="text-xl text-gray-600 italic mb-6">{release.subhead}</p>
            )}
            
            <div className="flex items-center gap-6 text-gray-500">
              <span className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                {release.company_name}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(release.published_at), 'MMMM d, yyyy')}
              </span>
            </div>
          </header>

          {/* Share buttons */}
          <Card className="mb-8">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share this release
              </span>
              <div className="flex gap-2">
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </a>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // This would need to be a client component for copy functionality
                  }}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {release.full_content}
            </div>
          </div>

          {/* Tags */}
          {release.tags && release.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {release.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Media Contact */}
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Media Contact</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{release.contact_name}</p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${release.contact_email}`} className="text-secondary hover:underline">
                    {release.contact_email}
                  </a>
                </p>
                {release.contact_phone && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${release.contact_phone}`} className="hover:underline">
                      {release.contact_phone}
                    </a>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </article>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Want professional press releases like this for your company?
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
              Get Started with PRBuild
            </Button>
          </Link>
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
