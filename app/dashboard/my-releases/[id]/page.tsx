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
  
  let html = content
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Remove ### markers
    .replace(/###/g, '')
    // Numbered list items with bold headers (1. **Title:**)
    .replace(/(\d+)\.\s*\*\*([^*]+):\*\*/g, '<div class="mt-3"><span class="font-semibold text-indigo-700">$1. $2:</span></div>')
    // Bullet points with bold headers (- **Title:**)
    .replace(/-\s*\*\*([^*]+):\*\*/g, '<div class="mt-2 ml-4"><span class="font-semibold">• $1:</span></div>')
    // Headers (** at start of line)
    .replace(/^\*\*([^*]+):\*\*$/gm, '<h3 class="text-base font-bold text-gray-900 mt-4 mb-2">$1</h3>')
    .replace(/^\*\*([^*]+)\*\*$/gm, '<h3 class="text-base font-bold text-gray-900 mt-4 mb-2">$1</h3>')
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
    label: 'Submitted', 
    color: 'bg-blue-100 text-blue-700',
    description: 'Your request has been received and is being processed.',
    emailNote: "We'll email you when your draft is ready for review."
  },
  draft_generated: { 
    label: 'Draft Generated', 
    color: 'bg-purple-100 text-purple-700',
    description: 'A draft has been generated. Our team is reviewing it.',
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
    
    const { error } = await supabase
      .from('release_requests')
      .update({
        status: 'client_approved',
      })
      .eq('id', release.id);

    if (!error) {
      alert("Thank you! Your release has been approved. We'll email you when it's published.");
      await loadRelease();
    }
    setSubmitting(false);
  };

  const handleRequestRewrite = async () => {
    if (!release) return;
    
    setRequestingRewrite(true);
    
    try {
      const response = await fetch('/api/ai/rewrite-from-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseRequestId: release.id }),
      });
      
      if (response.ok) {
        await loadRelease();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to request rewrite');
      }
    } catch (err) {
      alert('Failed to request rewrite');
    }
    
    setRequestingRewrite(false);
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
  const canReview = release.status === 'awaiting_client';

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

        {/* Panel Critique Summary - Shown to Client */}
        {release.panel_individual_feedback && (release.panel_individual_feedback as PanelFeedback[]).length > 0 && (
          (() => {
            const panelFeedback = release.panel_individual_feedback as PanelFeedback[];
            const compellingCount = panelFeedback.filter(f => f.compelling).length;
            const totalCount = panelFeedback.length;
            const percentage = Math.round((compellingCount / totalCount) * 100);
            
            // Get top missing items (suggestions)
            const suggestions = panelFeedback
              .filter(f => f.missing && f.missing.trim())
              .map(f => f.missing)
              .slice(0, 3);
            
            return (
              <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <Users className="h-5 w-5" />
                    Journalist Panel Review
                  </CardTitle>
                  <CardDescription>
                    Your draft was reviewed by our panel of 16 journalist personas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score */}
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-orange-600'}`}>
                      {compellingCount}/{totalCount}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">reviewers found this compelling</p>
                      <p className="text-sm text-gray-500">
                        {percentage >= 70 
                          ? 'Great score! Your release is ready for publication.' 
                          : percentage >= 50 
                            ? 'Good score. Minor improvements could help.' 
                            : 'Some improvements recommended before publishing.'}
                      </p>
                    </div>
                  </div>

                  {/* Key Themes */}
                  {release.panel_synthesis && (
                    <div className="p-3 bg-white/60 rounded-lg">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                        Key Feedback Themes
                      </h4>
                      <div 
                        className="text-sm text-gray-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: formatDraftAsHtml(release.panel_synthesis)
                        }}
                      />
                    </div>
                  )}

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="p-3 bg-white/60 rounded-lg">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Top Suggestions
                      </h4>
                      <ul className="space-y-1">
                        {suggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-indigo-400">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Rewrite Button - Only shows if not used yet */}
                  {canReview && percentage < 70 && !release.rewrite_used && (
                    <div className="pt-3 border-t border-indigo-200">
                      <Button
                        onClick={handleRequestRewrite}
                        disabled={requestingRewrite}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {requestingRewrite ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        {requestingRewrite ? 'Rewriting...' : 'Request Rewrite Based on Feedback'}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        We'll rewrite the draft incorporating the panel's suggestions.
                      </p>
                    </div>
                  )}

                  {release.panel_reviewed_at && (
                    <p className="text-xs text-gray-500">
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
