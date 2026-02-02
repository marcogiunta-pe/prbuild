import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Eye, Share2, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default async function AdminShowcasePage() {
  const supabase = await createClient();
  
  const { data: showcaseReleases, error } = await supabase
    .from('showcase_releases')
    .select('*')
    .order('published_at', { ascending: false });

  const totalViews = showcaseReleases?.reduce((sum, r) => sum + (r.view_count || 0), 0) || 0;
  const totalShares = showcaseReleases?.reduce((sum, r) => sum + (r.share_count || 0), 0) || 0;
  const totalJournalistClicks = showcaseReleases?.reduce((sum, r) => sum + (r.journalist_clicks || 0), 0) || 0;

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Showcase Management</h1>
          <p className="text-slate-400 mt-1">Manage published press releases</p>
        </div>
        <Link href="/showcase" target="_blank">
          <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Public Showcase
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Globe className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{showcaseReleases?.length || 0}</p>
                <p className="text-xs text-slate-400">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalViews}</p>
                <p className="text-xs text-slate-400">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalShares}</p>
                <p className="text-xs text-slate-400">Total Shares</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalJournalistClicks}</p>
                <p className="text-xs text-slate-400">Journalist Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Releases List */}
      {showcaseReleases && showcaseReleases.length > 0 ? (
        <div className="space-y-4">
          {showcaseReleases.map((release) => (
            <Card key={release.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white text-lg">{release.headline}</h3>
                      <Badge className="bg-secondary">{release.category}</Badge>
                    </div>
                    {release.subhead && (
                      <p className="text-slate-400 mb-2">{release.subhead}</p>
                    )}
                    <p className="text-slate-300 text-sm mb-3">{release.summary}</p>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <span>{release.company_name}</span>
                      <span>•</span>
                      <span>Published {format(new Date(release.published_at), 'PP')}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> {release.view_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" /> {release.share_count || 0}
                      </span>
                    </div>
                  </div>
                  <Link href={`/showcase/${release.id}`} target="_blank">
                    <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No published releases yet</h3>
            <p className="text-slate-400">Published releases will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
