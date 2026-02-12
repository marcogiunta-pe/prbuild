import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileText, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { ReleaseStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { WelcomeModal } from '@/components/dashboard/WelcomeModal';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { DashboardGuide } from '@/components/dashboard/DashboardGuide';
import { HelpTip } from '@/components/dashboard/HelpTip';

const statusConfig: Record<ReleaseStatus, { label: string; color: string; icon: any }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Clock },
  draft_generated: { label: 'Draft Ready', color: 'bg-purple-100 text-purple-700', icon: FileText },
  panel_reviewed: { label: 'Panel Reviewed', color: 'bg-purple-100 text-purple-700', icon: FileText },
  admin_approved: { label: 'Admin Approved', color: 'bg-purple-100 text-purple-700', icon: FileText },
  awaiting_client: { label: 'Awaiting Your Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  client_feedback: { label: 'Feedback Received', color: 'bg-orange-100 text-orange-700', icon: Clock },
  client_approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  final_pending: { label: 'Final Review', color: 'bg-blue-100 text-blue-700', icon: Clock },
  final_approved: { label: 'Final Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  quality_review: { label: 'Quality Review', color: 'bg-blue-100 text-blue-700', icon: Clock },
  quality_approved: { label: 'Quality Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  published: { label: 'Published', color: 'bg-secondary/20 text-secondary', icon: Send },
  needs_revision: { label: 'Needs Revision', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

// Statuses that mean the client has seen/reviewed their draft
const reviewedStatuses: ReleaseStatus[] = [
  'awaiting_client',
  'client_feedback',
  'client_approved',
  'final_pending',
  'final_approved',
  'quality_review',
  'quality_approved',
  'published',
];

export default async function MyReleasesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: releases }, { data: profile }] = await Promise.all([
    supabase
      .from('release_requests')
      .select('*')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('company_name, onboarding_completed_at, onboarding_dismissed_at')
      .eq('id', user?.id)
      .single(),
  ]);

  const releaseCount = releases?.length ?? 0;
  const hasCompanyName = !!profile?.company_name;
  const hasReviewedRelease = releases?.some(
    (r: any) => reviewedStatuses.includes(r.status)
  ) ?? false;

  const showOnboarding = !profile?.onboarding_completed_at && !profile?.onboarding_dismissed_at;
  const showWelcomeModal = showOnboarding && releaseCount === 0;

  return (
    <div className="max-w-5xl">
      {showWelcomeModal && <WelcomeModal />}
      {showWelcomeModal && <DashboardGuide />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">My Press Releases</h1>
            <HelpTip text="Releases move through stages: Submitted → Draft Ready → Panel Reviewed → Published." />
          </div>
          <p className="text-gray-600 mt-1">Track and manage your press release requests</p>
        </div>
        <Link href="/dashboard/new-request">
          <Button className="bg-secondary hover:bg-secondary/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      {showOnboarding && (
        <OnboardingChecklist
          hasCompanyName={hasCompanyName}
          releaseCount={releaseCount}
          hasReviewedRelease={hasReviewedRelease}
        />
      )}

      {!releases || releases.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No press releases yet</h3>
            <p className="text-gray-600 text-center mb-6 max-w-sm">
              Get started by creating your first press release request. Our team will craft a professional release for you.
            </p>
            <Link href="/dashboard/new-request">
              <Button className="bg-secondary hover:bg-secondary/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Release
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {releases.map((release) => {
            const status = statusConfig[release.status as ReleaseStatus] || statusConfig.submitted;
            const StatusIcon = status.icon;
            const needsAction = release.status === 'awaiting_client';

            return (
              <Link key={release.id} href={`/dashboard/my-releases/${release.id}`}>
                <Card className={`hover:shadow-md transition-shadow cursor-pointer ${needsAction ? 'ring-2 ring-yellow-400' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {release.ai_selected_headline || release.news_hook || 'Untitled Release'}
                          </h3>
                          <Badge className={status.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {release.company_name} • {release.announcement_type.replace('_', ' ')}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Created {formatDistanceToNow(new Date(release.created_at))} ago</span>
                          <span>•</span>
                          <span className="capitalize">{release.plan} Plan</span>
                          {release.published_at && (
                            <>
                              <span>•</span>
                              <span className="text-secondary">Published</span>
                            </>
                          )}
                        </div>
                      </div>

                      {needsAction && (
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                          Review Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
