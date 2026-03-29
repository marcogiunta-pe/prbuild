'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  FileText,
  Loader2,
  MessageSquare,
  ThumbsUp,
  Users,
  Sparkles,
  Lightbulb,
  RefreshCw,
  Edit3,
  Save,
  X,
  Mail
} from 'lucide-react';
import { ReleaseRequest, ReleaseStatus, PanelFeedback } from '@/types';
import { format } from 'date-fns';

// Convert markdown-style text to HTML
function formatDraftAsHtml(content: string): string {
  if (!content) return '';

  // If content is already HTML (contains HTML tags), render it directly
  // Strip script tags for safety but allow formatting tags
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  }

  // Otherwise treat as markdown-style text
  let html = content
    // Escape HTML entities in plain text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Remove ### markers
    .replace(/###/g, '')
    // Numbered list items with bold headers (1. **Title:**)
    .replace(/(\d+)\.\s*\*\*([^*]+):\*\*/g, '<div class="mt-3"><span class="font-semibold text-primary">$1. $2:</span></div>')
    // Bullet points with bold headers (- **Title:**)
    .replace(/-\s*\*\*([^*]+):\*\*/g, '<div class="mt-2 ml-4"><span class="font-semibold">$1:</span></div>')
    // Headers (** at start of line)
    .replace(/^\*\*([^*]+):\*\*$/gm, '<h3 class="text-base font-bold text-ink mt-4 mb-2">$1</h3>')
    .replace(/^\*\*([^*]+)\*\*$/gm, '<h3 class="text-base font-bold text-ink mt-4 mb-2">$1</h3>')
    // Bold text inline
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic text
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="mb-3">')
    // Single newlines
    .replace(/\n/g, ' ')
    // Wrap in paragraph
    .replace(/^/, '<p class="mb-3">')
    .replace(/$/, '</p>')
    // Clean up empty paragraphs
    .replace(/<p class="mb-3"><\/p>/g, '')
    .replace(/<p class="mb-3">\s*<\/p>/g, '');

  return html;
}

const statusConfig: Record<ReleaseStatus, { label: string; color: string; description: string; emailNote?: string }> = {
  submitted: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-700',
    description: 'Your press release is being written and reviewed. You\'ll receive an email when it\'s ready.',
    emailNote: "We'll email you when your draft is ready for review."
  },
  draft_generated: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-700',
    description: 'Your press release is being written and reviewed. You\'ll receive an email when it\'s ready.',
    emailNote: "We'll email you when it's ready for your review."
  },
  panel_reviewed: {
    label: 'Panel Reviewed',
    color: 'bg-purple-100 text-purple-700',
    description: 'Our journalist panel has reviewed the draft.',
    emailNote: "We'll email you when it's ready for your review."
  },
  admin_approved: { 
    label: 'Admin Approved', 
    color: 'bg-purple-100 text-purple-700',
    description: 'The draft has been approved by our team.',
    emailNote: "We'll email you when it's ready for your review."
  },
  awaiting_client: { 
    label: 'Awaiting Your Review', 
    color: 'bg-yellow-100 text-yellow-700',
    description: 'Please review the draft and provide feedback or approve it.'
  },
  client_feedback: { 
    label: 'Feedback Received', 
    color: 'bg-orange-100 text-orange-700',
    description: 'We received your feedback and are making revisions.',
    emailNote: "We'll email you when the revised draft is ready."
  },
  client_approved: { 
    label: 'Approved', 
    color: 'bg-green-100 text-green-700',
    description: 'You have approved the release. Final review in progress.',
    emailNote: "We'll email you when your release is published."
  },
  final_pending: { 
    label: 'Final Review', 
    color: 'bg-blue-100 text-blue-700',
    description: 'Final formatting and review in progress.',
    emailNote: "We'll email you when your release is published."
  },
  final_approved: { 
    label: 'Final Approved', 
    color: 'bg-green-100 text-green-700',
    description: 'Final version approved. Preparing for publication.',
    emailNote: "We'll email you when your release is published."
  },
  quality_review: { 
    label: 'Quality Review', 
    color: 'bg-blue-100 text-blue-700',
    description: 'Undergoing final quality review.',
    emailNote: "We'll email you when your release is published."
  },
  quality_approved: { 
    label: 'Quality Approved', 
    color: 'bg-green-100 text-green-700',
    description: 'Quality review passed. Ready for publication.',
    emailNote: "We'll email you when your release is published."
  },
  published: { 
    label: 'Published', 
    color: 'bg-secondary/20 text-secondary',
    description: 'Your press release has been published!'
  },
  needs_revision: { 
    label: 'Needs Revision', 
    color: 'bg-red-100 text-red-700',
    description: 'Revisions are being made based on feedback.',
    emailNote: "We'll email you when the revised draft is ready."
  },
  rejected: { 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-700',
    description: 'This request was rejected.'
  },
};

export default function ReleaseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [release, setRelease] = useState<ReleaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestingRewrite, setRequestingRewrite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [showPanelDetail, setShowPanelDetail] = useState(false);
  const [requestingPanel, setRequestingPanel] = useState(false);
  const [panelProgress, setPanelProgress] = useState(0);
  const [rewriteProgress, setRewriteProgress] = useState(0);

  useEffect(() => {
    loadRelease();
  }, [params.id]);

  const loadRelease = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('release_requests')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data) {
      setRelease(data as ReleaseRequest);
    }
    setLoading(false);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || !release) return;
    
    setSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('release_requests')
      .update({
        client_feedback: feedback,
        client_feedback_at: new Date().toISOString(),
        status: 'client_feedback',
      })
      .eq('id', release.id);

    if (!error) {
      alert("Thank you for your feedback! We'll revise the draft and email you when it's ready.");
      await loadRelease();
      setFeedback('');
    }
    setSubmitting(false);
  };

  const handleApprove = async () => {
    if (!release) return;

    setSubmitting(true);
    const supabase = createClient();

    // Set to client_approved, then immediately auto-publish
    const { error } = await supabase
      .from('release_requests')
      .update({
        status: 'client_approved',
      })
      .eq('id', release.id);

    if (!error) {
      // Auto-publish: move straight to published status
      await supabase
        .from('release_requests')
        .update({
          status: 'published',
          final_content: release.client_edited_content || release.admin_refined_content || release.ai_draft_content || '',
          final_approved_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
        })
        .eq('id', release.id);

      alert("Thank you! Your release has been approved and published.");
      await loadRelease();
    }
    setSubmitting(false);
  };

  const REWRITE_STEPS = [
    'Analyzing panel feedback...',
    'Identifying key improvements...',
    'Restructuring the lead...',
    'Strengthening the headline...',
    'Refining quotes and attribution...',
    'Polishing final draft...',
  ];

  const handleRequestRewrite = async () => {
    if (!release) return;
    setRequestingRewrite(true);
    setRewriteProgress(0);

    const interval = setInterval(() => {
      setRewriteProgress(prev => {
        if (prev >= 5) { clearInterval(interval); return 5; }
        return prev + 1;
      });
    }, 3500);

    try {
      const response = await fetch('/api/ai/rewrite-from-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseRequestId: release.id }),
      });
      clearInterval(interval);
      setRewriteProgress(6);

      if (response.ok) {
        await new Promise(r => setTimeout(r, 800));
        await loadRelease();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to request rewrite');
      }
    } catch (err) {
      clearInterval(interval);
      alert('Failed to request rewrite');
    }

    setRequestingRewrite(false);
    setRewriteProgress(0);
  };

  const handleAcceptRewrite = async () => {
    if (!release) return;
    
    setSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('release_requests')
      .update({
        admin_refined_content: release.pending_rewrite_content,
        pending_rewrite_content: null,
      })
      .eq('id', release.id);

    if (!error) {
      await loadRelease();
    }
    setSubmitting(false);
  };

  const handleRejectRewrite = async () => {
    if (!release) return;
    
    setSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('release_requests')
      .update({
        pending_rewrite_content: null,
      })
      .eq('id', release.id);

    if (!error) {
      await loadRelease();
    }
    setSubmitting(false);
  };

  const handleStartEditing = () => {
    if (!release) return;
    const currentContent = release.client_edited_content || release.admin_refined_content || release.ai_draft_content || '';
    setEditedContent(currentContent);
    setIsEditing(true);
  };

  const handleSaveEdits = async () => {
    if (!release) return;
    
    setSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('release_requests')
      .update({
        client_edited_content: editedContent,
      })
      .eq('id', release.id);

    if (!error) {
      await loadRelease();
      setIsEditing(false);
    }
    setSubmitting(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const REVIEWER_NAMES = [
    'Sarah Lin', 'Marcus Reid', 'Jenna Huang', 'David Kessler',
    'Aisha Patel', 'Tom Nguyen', 'Rachel Chen', 'Eli Washington',
    'Lisa Monroe', 'Jake Barrett', 'Nina Kowalski', 'Wei Chen',
    'Diana Ortiz', 'Paul Jensen', 'Sofia Martinez', 'Raj Kapoor',
  ];

  const handleRequestPanelReview = async () => {
    if (!release) return;
    setRequestingPanel(true);
    setPanelProgress(0);

    // Animate reviewer progress while waiting for the API
    const interval = setInterval(() => {
      setPanelProgress(prev => {
        if (prev >= 15) { clearInterval(interval); return 15; }
        return prev + 1;
      });
    }, 1800);

    try {
      const response = await fetch('/api/process-release', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_PROCESS_API_KEY || '',
        },
        body: JSON.stringify({ releaseRequestId: release.id }),
      });
      clearInterval(interval);
      setPanelProgress(16);
      if (response.ok) {
        await new Promise(r => setTimeout(r, 1000));
        await loadRelease();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to request panel review');
      }
    } catch {
      clearInterval(interval);
      alert('Failed to request panel review');
    }
    setRequestingPanel(false);
    setPanelProgress(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!release) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900">Release not found</h2>
        <Link href="/dashboard/my-releases" className="text-secondary hover:underline mt-2 inline-block">
          Back to My Releases
        </Link>
      </div>
    );
  }

  const status = statusConfig[release.status as ReleaseStatus] || statusConfig.submitted;
  const canReview = ['awaiting_client', 'panel_reviewed', 'sent_to_client'].includes(release.status);

  return (
    <div className="max-w-4xl">
      <Link 
        href="/dashboard/my-releases"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to My Releases
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {release.ai_selected_headline || release.news_hook || 'Press Release'}
            </h1>
            <p className="text-gray-600">
              {release.company_name} • {release.announcement_type.replace('_', ' ')}
            </p>
          </div>
          <Badge className={`${status.color} text-sm px-3 py-1`}>
            {status.label}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-gray-500">{status.description}</p>
        {status.emailNote && (
          <p className="mt-1 text-sm text-indigo-600 flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            {status.emailNote}
          </p>
        )}
      </div>

      <div className="grid gap-6">
        {/* Headline Selection — shown when headlines exist and none selected yet */}
        {release.ai_headline_options && (release.ai_headline_options as string[]).length > 0 && !release.ai_selected_headline && canReview && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                Choose Your Headline
              </CardTitle>
              <CardDescription>
                Select the headline that best represents your announcement. You can always edit it later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(release.ai_headline_options as string[]).map((headline: string, i: number) => (
                <button
                  key={i}
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase
                      .from('release_requests')
                      .update({ ai_selected_headline: headline })
                      .eq('id', release.id);
                    await loadRelease();
                  }}
                  className="w-full text-left p-4 rounded-md border border-rule bg-paper-light hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs text-ink-muted bg-paper-dark px-2 py-1 rounded-sm flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-display text-lg text-ink">{headline}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Current Draft */}
        {(release.client_edited_content || release.admin_refined_content || release.ai_draft_content) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Current Draft
                  {release.client_edited_content && (
                    <Badge variant="outline" className="ml-2 text-xs">Edited by you</Badge>
                  )}
                </CardTitle>
                {release.ai_selected_headline && (
                  <CardDescription>
                    Headline: {release.ai_selected_headline}
                  </CardDescription>
                )}
              </div>
              {canReview && !isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartEditing}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit Draft
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {release.ai_subhead && (
                <p className="text-lg text-gray-700 italic mb-4">{release.ai_subhead}</p>
              )}
              
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Edit your press release..."
                  />
                  <p className="text-xs text-gray-500">
                    Tip: Use **text** for bold and *text* for italics
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveEdits}
                      disabled={submitting}
                      className="bg-secondary hover:bg-secondary/90"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEditing}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="prose prose-sm max-w-none bg-gray-50 p-6 rounded-lg
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-strong:text-gray-900 prose-em:text-gray-600"
                  dangerouslySetInnerHTML={{ 
                    __html: formatDraftAsHtml(release.client_edited_content || release.admin_refined_content || release.ai_draft_content || '')
                  }}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Rewrite Comparison - When pending rewrite exists */}
        {release.pending_rewrite_content && (
          <Card className="border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <RefreshCw className="h-5 w-5" />
                Rewrite Ready for Review
              </CardTitle>
              <CardDescription>
                Compare the original draft with the improved version based on panel feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Original */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Original Draft
                  </h4>
                  <div 
                    className="prose prose-sm max-w-none bg-gray-100 p-4 rounded-lg text-sm max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ 
                      __html: formatDraftAsHtml(release.admin_refined_content || release.ai_draft_content || '')
                    }}
                  />
                </div>
                
                {/* Rewrite */}
                <div>
                  <h4 className="font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Improved Version
                  </h4>
                  <div 
                    className="prose prose-sm max-w-none bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-sm max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ 
                      __html: formatDraftAsHtml(release.pending_rewrite_content)
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleAcceptRewrite}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Accept Improved Version
                </Button>
                
                <Button
                  onClick={handleRejectRewrite}
                  disabled={submitting}
                  variant="outline"
                  className="text-gray-600"
                >
                  Keep Original
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Request Panel Review — shown when no review exists yet */}
        {release.ai_draft_content && (!release.panel_individual_feedback || (release.panel_individual_feedback as PanelFeedback[]).length === 0) && (
          <Card className="border-rule bg-paper-light">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-ink">
                <Users className="h-5 w-5 text-primary" />
                Journalist Panel Review
              </CardTitle>
              <CardDescription>
                Get your draft reviewed by 16 journalist personas before publishing. They'll score it and tell you exactly what to fix.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!requestingPanel ? (
                <Button
                  onClick={handleRequestPanelReview}
                  className="bg-primary hover:bg-primary-700 rounded-sm"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Request Journalist Review
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="font-semibold text-ink">Panel review in progress...</span>
                  </div>
                  <div className="w-full h-2 bg-paper-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${(panelProgress / 16) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {REVIEWER_NAMES.map((name, i) => (
                      <div
                        key={name}
                        className={`flex items-center gap-2 p-2 rounded-md border transition-all duration-500 ${
                          i < panelProgress
                            ? 'border-green-200 bg-green-50 opacity-100'
                            : i === panelProgress
                              ? 'border-primary/30 bg-primary/5 opacity-100 animate-pulse'
                              : 'border-rule bg-paper opacity-40'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-semibold flex-shrink-0 ${
                          i < panelProgress ? 'bg-green-100 text-green-700' : i === panelProgress ? 'bg-primary/10 text-primary' : 'bg-paper-dark text-ink-muted'
                        }`}>
                          {i < panelProgress ? '✓' : name.split(' ').map(w => w[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-medium text-ink truncate">{name}</div>
                          <div className="font-mono text-[9px] text-ink-muted">
                            {i < panelProgress ? 'Reviewed' : i === panelProgress ? 'Reviewing...' : 'Waiting'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-ink-muted font-mono">
                    {panelProgress} of 16 reviewers complete — takes about 30 seconds
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Panel Critique — Full Detail View */}
        {release.panel_individual_feedback && (release.panel_individual_feedback as PanelFeedback[]).length > 0 && (
          (() => {
            const panelFeedback = release.panel_individual_feedback as PanelFeedback[];
            const compellingCount = panelFeedback.filter(f => f.compelling).length;
            const totalCount = panelFeedback.length;
            const percentage = Math.round((compellingCount / totalCount) * 100);

            const suggestions = panelFeedback
              .filter(f => f.missing && f.missing.trim())
              .map(f => f.missing)
              .slice(0, 3);

            return (
              <Card className="border-rule bg-paper-light">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 font-display text-ink">
                        <Users className="h-5 w-5 text-primary" />
                        Journalist Panel Review
                      </CardTitle>
                      <CardDescription>
                        Your draft was reviewed by {totalCount} journalist personas
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono text-3xl font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-secondary' : 'text-primary'}`}>
                        {compellingCount}/{totalCount}
                      </div>
                      <div className="font-mono text-xs text-ink-muted">
                        {percentage >= 70 ? 'READY' : percentage >= 50 ? 'GOOD' : 'NEEDS WORK'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score bar */}
                  <div className="w-full h-2 bg-paper-dark rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-secondary' : 'bg-primary'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-ink-muted">
                    {percentage >= 70
                      ? 'Strong score — your release is ready for publication.'
                      : percentage >= 50
                        ? 'Good foundation. Addressing the feedback below will strengthen it.'
                        : 'The panel identified areas for improvement. Review the feedback below.'}
                  </p>

                  {/* Key Themes */}
                  {release.panel_synthesis && (
                    <div className="p-4 bg-paper border border-rule rounded-md">
                      <h4 className="font-semibold text-ink flex items-center gap-2 mb-2 text-sm">
                        <Sparkles className="h-4 w-4 text-secondary" />
                        Key Feedback Themes
                      </h4>
                      <div
                        className="text-sm text-ink-muted prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: formatDraftAsHtml(release.panel_synthesis)
                        }}
                      />
                    </div>
                  )}

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="p-4 bg-paper border border-rule rounded-md">
                      <h4 className="font-semibold text-ink flex items-center gap-2 mb-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-secondary" />
                        Top Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {suggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm text-ink-muted flex items-start gap-2">
                            <span className="text-primary font-bold">{i + 1}.</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Toggle Detail View */}
                  <button
                    onClick={() => setShowPanelDetail(!showPanelDetail)}
                    className="w-full flex items-center justify-between p-3 border border-rule rounded-md hover:bg-paper transition-colors text-sm"
                  >
                    <span className="font-semibold text-ink flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      {showPanelDetail ? 'Hide' : 'Show'} Individual Reviewer Feedback ({totalCount} reviewers)
                    </span>
                    <span className="text-ink-muted">{showPanelDetail ? '▲' : '▼'}</span>
                  </button>

                  {/* Individual Journalist Feedback — Expandable */}
                  {showPanelDetail && (
                    <div className="space-y-3">
                      {panelFeedback.map((fb, i) => (
                        <div key={i} className="border border-rule rounded-md overflow-hidden bg-paper">
                          <div className="flex items-center gap-3 p-3 border-b border-rule bg-paper-light">
                            <div className="w-9 h-9 rounded-full bg-paper-dark flex items-center justify-center font-mono text-xs font-semibold text-ink-muted flex-shrink-0">
                              {(fb.persona || 'R').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-ink">{fb.persona || `Reviewer ${i + 1}`}</div>
                              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">{fb.role || 'Journalist'}</div>
                            </div>
                            <span className={`font-mono text-[11px] font-semibold px-3 py-1 rounded-sm ${fb.compelling ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                              {fb.compelling ? 'PASS' : 'REVISE'}
                            </span>
                          </div>
                          <div className="p-3 space-y-2">
                            {fb.feedback && (
                              <div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted mb-1">Feedback</div>
                                <p className="text-sm text-ink leading-relaxed">{fb.feedback}</p>
                              </div>
                            )}
                            {fb.missing && (
                              <div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary mb-1">What&apos;s Missing</div>
                                <p className="text-sm text-ink-muted">{fb.missing}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rewrite Button */}
                  {canReview && (
                    <div className="pt-3 border-t border-rule">
                      {!requestingRewrite ? (
                        <div>
                          <Button
                            onClick={handleRequestRewrite}
                            className="bg-primary hover:bg-primary-700 rounded-sm"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Rewrite Based on Panel Feedback
                          </Button>
                          <p className="text-xs text-ink-muted mt-2">
                            We&apos;ll rewrite the draft incorporating the panel&apos;s suggestions.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 p-4 bg-paper border border-rule rounded-md">
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <span className="font-semibold text-ink">Rewriting your press release...</span>
                          </div>
                          <div className="w-full h-2 bg-paper-dark rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-1000"
                              style={{ width: `${((rewriteProgress + 1) / 7) * 100}%` }}
                            />
                          </div>
                          <div className="space-y-2">
                            {REWRITE_STEPS.map((step, i) => (
                              <div
                                key={step}
                                className={`flex items-center gap-2 text-sm transition-all duration-500 ${
                                  i < rewriteProgress ? 'text-green-600' : i === rewriteProgress ? 'text-ink animate-pulse' : 'text-ink-muted/40'
                                }`}
                              >
                                {i < rewriteProgress ? (
                                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                ) : i === rewriteProgress ? (
                                  <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-rule flex-shrink-0" />
                                )}
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {release.panel_reviewed_at && (
                    <p className="text-xs text-ink-muted font-mono">
                      Reviewed {format(new Date(release.panel_reviewed_at), 'PPp')}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })()
        )}

        {/* Client Review Section */}
        {canReview && (
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <AlertCircle className="h-5 w-5" />
                Your Review Needed
              </CardTitle>
              <CardDescription>
                Please review the draft above and either approve it or provide feedback for revisions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (optional if approving)
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share any changes you'd like us to make..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ThumbsUp className="h-4 w-4 mr-2" />
                  )}
                  Approve Release
                </Button>
                
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={submitting || !feedback.trim()}
                  variant="outline"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Send Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Previous Feedback */}
        {release.client_feedback && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                Your Previous Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{release.client_feedback}</p>
              {release.client_feedback_at && (
                <p className="text-xs text-gray-500 mt-2">
                  Submitted {format(new Date(release.client_feedback_at), 'PPp')}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Company</dt>
                <dd className="font-medium">{release.company_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Announcement Type</dt>
                <dd className="font-medium capitalize">{release.announcement_type.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Target Date</dt>
                <dd className="font-medium">{format(new Date(release.release_date), 'PP')}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Plan</dt>
                <dd className="font-medium capitalize">{release.plan}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-500">News Hook</dt>
                <dd className="font-medium">{release.news_hook}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-600">Submitted</span>
                <span className="text-gray-400">{format(new Date(release.created_at), 'PPp')}</span>
              </div>
              {release.ai_generated_at && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-600">Draft Generated</span>
                  <span className="text-gray-400">{format(new Date(release.ai_generated_at), 'PPp')}</span>
                </div>
              )}
              {release.sent_to_client_at && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-600">Sent for Review</span>
                  <span className="text-gray-400">{format(new Date(release.sent_to_client_at), 'PPp')}</span>
                </div>
              )}
              {release.published_at && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-gray-600 font-medium">Published</span>
                  <span className="text-gray-400">{format(new Date(release.published_at), 'PPp')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
