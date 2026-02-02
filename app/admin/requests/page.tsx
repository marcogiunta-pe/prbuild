import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send,
  Eye,
  Filter
} from 'lucide-react';
import { ReleaseStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<ReleaseStatus, { label: string; color: string; priority: number }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-500', priority: 1 },
  draft_generated: { label: 'Draft Ready', color: 'bg-purple-500', priority: 2 },
  panel_reviewed: { label: 'Panel Reviewed', color: 'bg-purple-500', priority: 3 },
  admin_approved: { label: 'Admin Approved', color: 'bg-indigo-500', priority: 4 },
  awaiting_client: { label: 'Awaiting Client', color: 'bg-yellow-500', priority: 5 },
  client_feedback: { label: 'Client Feedback', color: 'bg-orange-500', priority: 6 },
  client_approved: { label: 'Client Approved', color: 'bg-green-500', priority: 7 },
  final_pending: { label: 'Final Pending', color: 'bg-blue-500', priority: 8 },
  final_approved: { label: 'Final Approved', color: 'bg-green-500', priority: 9 },
  quality_review: { label: 'Quality Review', color: 'bg-blue-500', priority: 10 },
  quality_approved: { label: 'Quality Approved', color: 'bg-green-500', priority: 11 },
  published: { label: 'Published', color: 'bg-secondary', priority: 12 },
  needs_revision: { label: 'Needs Revision', color: 'bg-red-500', priority: 0 },
  rejected: { label: 'Rejected', color: 'bg-red-700', priority: 13 },
};

export default async function AdminRequestsPage() {
  const supabase = await createClient();
  
  const { data: releases, error } = await supabase
    .from('release_requests')
    .select(`
      *,
      profiles:client_id (
        full_name,
        email,
        company_name
      )
    `)
    .order('created_at', { ascending: false });

  // Group by status
  const needsAction = releases?.filter(r => 
    ['submitted', 'client_feedback', 'needs_revision'].includes(r.status)
  ) || [];
  
  const inProgress = releases?.filter(r => 
    ['draft_generated', 'panel_reviewed', 'admin_approved', 'awaiting_client', 
     'client_approved', 'final_pending', 'final_approved', 'quality_review', 'quality_approved'].includes(r.status)
  ) || [];
  
  const completed = releases?.filter(r => 
    ['published', 'rejected'].includes(r.status)
  ) || [];

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">PR Requests</h1>
          <p className="text-slate-400 mt-1">Manage all press release requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{needsAction.length}</p>
                <p className="text-xs text-slate-400">Needs Action</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{inProgress.length}</p>
                <p className="text-xs text-slate-400">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{completed.length}</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Send className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {releases?.filter(r => r.status === 'published').length || 0}
                </p>
                <p className="text-xs text-slate-400">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Needs Action */}
      {needsAction.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            Needs Action ({needsAction.length})
          </h2>
          <div className="space-y-3">
            {needsAction.map((release: any) => (
              <RequestCard key={release.id} release={release} />
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            In Progress ({inProgress.length})
          </h2>
          <div className="space-y-3">
            {inProgress.map((release: any) => (
              <RequestCard key={release.id} release={release} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Completed ({completed.length})
          </h2>
          <div className="space-y-3">
            {completed.map((release: any) => (
              <RequestCard key={release.id} release={release} />
            ))}
          </div>
        </div>
      )}

      {(!releases || releases.length === 0) && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No requests yet</h3>
            <p className="text-slate-400">Requests will appear here when clients submit them.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RequestCard({ release }: { release: any }) {
  const status = statusConfig[release.status as ReleaseStatus] || statusConfig.submitted;
  
  return (
    <Link href={`/admin/requests/${release.id}`}>
      <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-medium text-white truncate">
                  {release.ai_selected_headline || release.news_hook || 'Untitled'}
                </h3>
                <Badge className={`${status.color} text-white text-xs`}>
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>{release.profiles?.company_name || release.company_name}</span>
                <span>•</span>
                <span className="capitalize">{release.announcement_type?.replace('_', ' ')}</span>
                <span>•</span>
                <span className="capitalize">{release.plan} plan</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(release.created_at))} ago</span>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
