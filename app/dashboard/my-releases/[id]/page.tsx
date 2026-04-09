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
  ArrowRight,
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
  Mail,
  Trash2
} from 'lucide-react';
import { ReleaseRequest, ReleaseStatus, PanelFeedback, deriveNewsroomScore } from '@/types';
import { isSectionLabel } from '@/lib/release-formatting';
import { format } from 'date-fns';

// Convert markdown-style text to HTML
function formatDraftAsHtml(content: string): string {
  if (!content) return '';

  // Pre-filter: remove section label lines and stray markers
  content = content.split('\n').filter(line => {
    const t = line.trim();
    if (isSectionLabel(t)) return false;
    if (/^\s*\(?\d+\)?\s*\*{0,2}\s*$/.test(t)) return false;
    if (/^\s*[-–]?\s*\*{2,}\s*$/.test(t)) return false;
    return true;
  }).join('\n');

  // If content contains HTML block-level tags, treat as HTML
  // Strip scripts/styles/event handlers but keep formatting tags
  if (/<(?:p|div|h[1-6]|ul|ol|li|br|table|blockquote)[\s>]/i.test(content)) {
    return content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      // Still clean up stray markdown artifacts inside HTML
      .replace(/\(\d+\)\s*\*{0,2}\s*/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  // Otherwise treat as markdown/plain text
  let html = content
    // Escape HTML entities in plain text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process line by line for better control
  const lines = html.split('\n');
  const processed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Strip lines that are ONLY a number label like (1), (2), (3) with nothing else
    if (/^\s*\(\d+\)\s*$/.test(line)) {
      continue;
    }

    // Strip (1), (2), (3) etc. prefixes (AI numbering artifacts)
    line = line.replace(/^\s*\(\d+\)\s*/, '');

    // Horizontal rules
    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) {
      processed.push('<hr class="my-4 border-rule" />');
      continue;
    }

    // ### headings
    if (/^###\s+(.+)$/.test(line)) {
      const match = line.match(/^###\s+(.+)$/);
      if (match) {
        let text = match[1].replace(/\*\*/g, '');
        processed.push(`<h4 class="text-sm font-bold text-ink mt-3 mb-1">${text}</h4>`);
        continue;
      }
    }

    // ## headings
    if (/^##\s+(.+)$/.test(line)) {
      const match = line.match(/^##\s+(.+)$/);
      if (match) {
        let text = match[1].replace(/\*\*/g, '');
        processed.push(`<h3 class="text-base font-bold text-ink mt-4 mb-2">${text}</h3>`);
        continue;
      }
    }

    // # headings
    if (/^#\s+(.+)$/.test(line)) {
      const match = line.match(/^#\s+(.+)$/);
      if (match) {
        let text = match[1].replace(/\*\*/g, '');
        processed.push(`<h2 class="text-lg font-bold text-ink mt-4 mb-2">${text}</h2>`);
        continue;
      }
    }

    // Numbered list items with bold headers: "1. **Title:**" or "1. **Title**"
    const numberedBold = line.match(/^(\d+)\.\s*\*\*([^*]+?)(?::)?\*\*\s*(.*)/);
    if (numberedBold) {
      const rest = numberedBold[3] || '';
      processed.push(`<h3 class="text-base font-bold text-ink mt-4 mb-1">${numberedBold[2].trim()}</h3>`);
      if (rest.trim()) {
        processed.push(`<p class="mb-3">${rest.trim()}</p>`);
      }
      continue;
    }

    // Standalone bold lines as section headers (** at start and end of line)
    if (/^\*\*([^*]+)\*\*\s*$/.test(line)) {
      const match = line.match(/^\*\*([^*]+)\*\*\s*$/);
      if (match) {
        processed.push(`<h3 class="text-base font-bold text-ink mt-4 mb-2">${match[1].replace(/:$/, '').trim()}</h3>`);
        continue;
      }
    }

    // Bullet points with bold headers: "- **Title:** text"
    const bulletBold = line.match(/^[-•]\s*\*\*([^*]+?)(?::)?\*\*\s*(.*)/);
    if (bulletBold) {
      const rest = bulletBold[2] || '';
      processed.push(`<div class="mt-2 ml-4"><span class="font-semibold">${bulletBold[1].trim()}:</span> ${rest.trim()}</div>`);
      continue;
    }

    // Plain bullet points
    if (/^[-•]\s+(.+)/.test(line)) {
      const match = line.match(/^[-•]\s+(.+)/);
      if (match) {
        processed.push(`<div class="mt-1 ml-4 flex gap-2"><span class="text-ink-muted">•</span><span>${match[1]}</span></div>`);
        continue;
      }
    }

    // Empty lines become paragraph breaks
    if (line.trim() === '') {
      processed.push('</p><p class="mb-3">');
      continue;
    }

    // Regular text line
    processed.push(line);
  }

  // Join and apply inline formatting
  html = processed.join('\n');

  // Bold text **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
  // Italic text *text*
  html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

  // Clean up any stray ** or * markers that didn't match pairs
  html = html.replace(/\*{2,}/g, '');
  html = html.replace(/(?<![<\w\/])\*(?![<\w])/g, '');

  // Wrap in paragraph tags
  html = '<p class="mb-3">' + html + '</p>';

  // Clean up: remove empty paragraphs and fix doubled tags
  html = html.replace(/<p class="mb-3">\s*<\/p>/g, '');
  html = html.replace(/<\/p>\s*<p class="mb-3">\s*<\/p>/g, '</p>');
  html = html.replace(/<p class="mb-3">\s*<(h[2-4])/g, '<$1');
  html = html.replace(/<\/(h[2-4])>\s*<\/p>/g, '</$1>');
  html = html.replace(/<p class="mb-3">\s*<hr/g, '<hr');
  html = html.replace(/\/>\s*<\/p>/g, '/>');
  html = html.replace(/<p class="mb-3">\s*<div/g, '<div');
  html = html.replace(/<\/div>\s*<\/p>/g, '</div>');

  // Convert remaining single newlines within paragraphs to spaces
  html = html.replace(/([^>])\n([^<])/g, '$1 $2');

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
    label: 'Approved — Awaiting Publication',
    color: 'bg-green-100 text-green-700',
    description: 'You have approved the release. Our team is reviewing it for publication.',
  },
  final_pending: {
    label: 'Final Review',
    color: 'bg-blue-100 text-blue-700',
    description: 'Final formatting and review in progress.',
  },
  final_approved: {
    label: 'Final Approved',
    color: 'bg-green-100 text-green-700',
    description: 'Final version approved. Preparing for publication.',
  },
  quality_review: {
    label: 'Quality Review',
    color: 'bg-blue-100 text-blue-700',
    description: 'Undergoing final quality review.',
  },
  quality_approved: {
    label: 'Quality Approved',
    color: 'bg-green-100 text-green-700',
    description: 'Quality review passed. Ready for publication.',
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

function PanelReviewAnimation({ reviewers, progress, comments }: {
  reviewers: { name: string; beat: string; comment: string }[];
  progress: number;
  comments: string[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div>
          <span className="font-semibold text-ink">Panel review in progress...</span>
          <p className="text-xs text-ink-muted">Each journalist is reading and scoring your release</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-paper-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000"
          style={{ width: `${(progress / 16) * 100}%` }}
        />
      </div>
      <p className="text-xs text-ink-muted font-mono text-center">
        {progress} of 16 reviewers complete
      </p>

      {/* Reviewer cards with live comments */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {reviewers.map((reviewer, i) => (
          <div
            key={reviewer.name}
            className={`flex items-start gap-3 p-3 rounded-md border transition-all duration-700 ${
              i < progress
                ? 'border-green-200 bg-green-50 opacity-100'
                : i === progress
                  ? 'border-primary/40 bg-primary/5 opacity-100'
                  : 'border-rule bg-paper opacity-30'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-[11px] font-semibold flex-shrink-0 mt-0.5 ${
              i < progress ? 'bg-green-100 text-green-700' : i === progress ? 'bg-primary/10 text-primary animate-pulse' : 'bg-paper-dark text-ink-muted'
            }`}>
              {i < progress ? '✓' : reviewer.name.split(' ').map(w => w[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">{reviewer.name}</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-primary">{reviewer.beat}</span>
              </div>
              {i < progress && (
                <p className="text-xs text-green-700 mt-1 animate-fade-up">
                  {comments[i] || reviewer.comment} <span className="font-mono">Done.</span>
                </p>
              )}
              {i === progress && (
                <p className="text-xs text-ink-muted mt-1 animate-pulse">
                  {reviewer.comment}
                </p>
              )}
              {i > progress && (
                <p className="text-xs text-ink-muted/40 mt-1">Waiting to review...</p>
              )}
            </div>
            {i < progress && (
              <span className="font-mono text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                DONE
              </span>
            )}
            {i === progress && (
              <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const [panelComments, setPanelComments] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [rewriteProgress, setRewriteProgress] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [draftVersion, setDraftVersion] = useState<'latest' | 'rewritten' | 'original'>('latest');
  const [applyingSuggestion, setApplyingSuggestion] = useState<number | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const [reviewerVotes, setReviewerVotes] = useState<Record<number, 'agree' | 'disagree'>>({});
  const [reviewerReplies, setReviewerReplies] = useState<Record<number, string>>({});
  const [showReplyFor, setShowReplyFor] = useState<number | null>(null);

  useEffect(() => {
    loadRelease();
    loadUserProfile();
  }, [params.id]);

  const loadUserProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile) setUserRole(profile.role);
    }
  };

  const handleDelete = async () => {
    if (!release) return;
    if (!confirm('Are you sure you want to delete this release? This cannot be undone.')) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('release_requests')
      .delete()
      .eq('id', release.id);

    if (!error) {
      router.push('/dashboard/my-releases');
    } else {
      alert('Failed to delete release.');
      setDeleting(false);
    }
  };

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

    // Client approves — goes to client_approved (admin must publish)
    const { error } = await supabase
      .from('release_requests')
      .update({
        status: 'client_approved',
        final_content: release.client_edited_content || release.admin_refined_content || release.ai_draft_content || '',
        final_approved_at: new Date().toISOString(),
      })
      .eq('id', release.id);

    if (!error) {
      router.push(`/dashboard/my-releases/${release.id}/preview`);
      return;
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

  const handleApplySuggestion = async (suggestion: string, persona: string, index: number) => {
    if (!release) return;
    setApplyingSuggestion(index);
    const userReply = reviewerReplies[index];
    const fullSuggestion = userReply
      ? `${suggestion}\n\nAdditional context from the author: ${userReply}`
      : suggestion;
    try {
      const res = await fetch('/api/ai/apply-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          releaseRequestId: release.id,
          suggestion: fullSuggestion,
          persona,
        }),
      });
      if (res.ok) {
        setAppliedSuggestions(prev => {
          const next = new Set(prev);
          next.add(index);
          return next;
        });
        await loadRelease();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to apply suggestion');
      }
    } catch {
      alert('Failed to apply suggestion');
    }
    setApplyingSuggestion(null);
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
    try {
      const res = await fetch('/api/releases/update-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseId: release.id, content: editedContent }),
      });
      if (res.ok) {
        await loadRelease();
        setIsEditing(false);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save changes');
      }
    } catch {
      alert('Failed to save changes');
    }
    setSubmitting(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const handleProcessRequest = async () => {
    if (!release) return;
    setProcessing(true);
    setPanelProgress(0);
    setPanelComments([]);

    // Animate reviewer progress — ~3.5s per reviewer
    let currentReviewer = 0;
    const interval = setInterval(() => {
      if (currentReviewer >= 16) { clearInterval(interval); return; }
      setPanelProgress(currentReviewer + 1);
      setPanelComments(prev => [...prev, REVIEWERS[currentReviewer]?.comment || '']);
      currentReviewer++;
    }, 3500);

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
      setPanelComments(REVIEWERS.map(r => r.comment));
      if (response.ok) {
        await new Promise(r => setTimeout(r, 1500));
        await loadRelease();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to process request');
      }
    } catch {
      clearInterval(interval);
      alert('Failed to process request');
    }
    setProcessing(false);
    setPanelProgress(0);
    setPanelComments([]);
  };

  const REVIEWERS = [
    // Journalists
    { name: 'Connie Loizos', beat: 'TechCrunch — VC & Startups', comment: 'Checking if this is a real story or a vanity announcement...' },
    { name: 'Erin Griffith', beat: 'NYT — Startup Culture', comment: 'Looking for the human angle behind the news...' },
    { name: 'Tom Dotan', beat: 'WSJ — Enterprise Tech', comment: 'Evaluating whether enterprise buyers would care...' },
    { name: 'Kia Kokalitcheva', beat: 'Axios — VC Deals', comment: 'Checking if numbers and deal terms hold up...' },
    { name: 'Zoë Schiffer', beat: 'Platformer — Tech Industry', comment: 'Reading for what this really means for the industry...' },
    // PR Professionals
    { name: 'Ed Zitron', beat: 'PR Critic & Founder', comment: 'Checking if this would survive my inbox filter...' },
    { name: 'Amanda Milligan', beat: 'Content & PR Strategy', comment: 'Verifying AP style, dateline, and boilerplate...' },
    { name: 'Molly McPherson', beat: 'Crisis Comms Expert', comment: 'Assessing tone and corporate messaging alignment...' },
    // Copywriters & Marketing
    { name: 'Harry Dry', beat: 'Marketing Examples — Copywriting', comment: 'Is the headline doing any work? Testing every word...' },
    { name: 'Kipp Bodnar', beat: 'HubSpot CMO', comment: 'Testing whether this would move pipeline...' },
    { name: 'Dave Gerhardt', beat: 'Exit Five — B2B Marketing', comment: 'Would I share this? Does anyone actually care?...' },
    // Target Customers & Buyers
    { name: 'Jason Lemkin', beat: 'SaaStr — SaaS Founder/Investor', comment: 'Reading as an investor — is this fundable news?...' },
    { name: 'Hiten Shah', beat: 'FYI — Product & Growth', comment: 'Evaluating product positioning and market fit...' },
    { name: 'April Dunford', beat: 'Positioning Expert', comment: 'Does this position the company or just describe it?...' },
    { name: 'Rand Fishkin', beat: 'SparkToro — Audience Research', comment: 'Who is this actually written for? Testing audience fit...' },
    { name: 'Dharmesh Shah', beat: 'HubSpot CTO & Founder', comment: 'Reading as a founder — would I signal boost this?...' },
  ];

  const handleRequestPanelReview = async () => {
    if (!release) return;
    setRequestingPanel(true);
    setPanelProgress(0);
    setPanelComments([]);

    // Animate reviewer progress — ~3.5s per reviewer = ~56s total
    let currentReviewer = 0;
    const interval = setInterval(() => {
      if (currentReviewer >= 16) { clearInterval(interval); return; }
      setPanelProgress(currentReviewer + 1);
      setPanelComments(prev => [...prev, REVIEWERS[currentReviewer]?.comment || '']);
      currentReviewer++;
    }, 3500);

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
      setPanelComments(REVIEWERS.map(r => r.comment));
      if (response.ok) {
        await new Promise(r => setTimeout(r, 1500));
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
    setPanelComments([]);
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
              {release.company_name} • {(release.announcement_type ?? '').replace('_', ' ')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${status.color} text-sm px-3 py-1`}>
              {status.label}
            </Badge>
            <Button
              size="sm"
              onClick={() => router.push(`/dashboard/my-releases/${release.id}/preview`)}
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 rounded-full font-headline"
            >
              <ArrowRight className="h-4 w-4 mr-1.5" />
              See Final Product
            </Button>
            {(release.status !== 'published' || userRole === 'admin') && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">{status.description}</p>
        {status.emailNote && (
          <p className="mt-1 text-sm text-indigo-600 flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            {status.emailNote}
          </p>
        )}

        {/* Published banner with showcase link */}
        {release.status === 'published' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Your press release is live!</p>
                <p className="text-sm text-green-600">Published on the PRBuild Showcase and distributed to journalists.</p>
              </div>
            </div>
            <Link href={`/showcase`} className="text-sm font-medium text-green-700 hover:text-green-800 underline flex items-center gap-1">
              View on Showcase <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

        {/* Process Request button — shown when status is submitted (pipeline didn't run) */}
        {release.status === 'submitted' && !processing && (
          <div className="mt-4 p-5 bg-surface-container-lowest rounded-xl flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">Ready to process your request?</p>
              <p className="text-sm text-ink-muted">We'll write your press release and have our journalist panel review it.</p>
            </div>
            <Button
              onClick={handleProcessRequest}
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 rounded-full font-headline"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Process Your Request
            </Button>
          </div>
        )}
        {processing && (
          <div className="mt-4">
            <PanelReviewAnimation
              reviewers={REVIEWERS}
              progress={panelProgress}
              comments={panelComments}
            />
          </div>
        )}

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
              {(Array.isArray(release.ai_headline_options) ? (release.ai_headline_options as string[]) : []).map((headline: string, i: number) => (
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
                  className="w-full text-left p-4 rounded-md bg-surface-container-lowest hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container px-2 py-1 rounded-full flex-shrink-0">
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
              <div className="flex items-center gap-2">
                {release.admin_refined_content && release.ai_draft_content && release.admin_refined_content !== release.ai_draft_content && (
                  <select
                    value={draftVersion}
                    onChange={(e) => setDraftVersion(e.target.value as 'latest' | 'rewritten' | 'original')}
                    className="font-label text-sm bg-surface-container-low rounded-md px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:bg-surface-container-lowest transition-colors"
                  >
                    <option value="latest">Latest Version</option>
                    <option value="rewritten">Rewritten Draft</option>
                    <option value="original">Original Draft</option>
                  </select>
                )}
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
              </div>
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
                    __html: formatDraftAsHtml(
                      draftVersion === 'original'
                        ? (release.ai_draft_content || '')
                        : draftVersion === 'rewritten'
                          ? (release.admin_refined_content || release.ai_draft_content || '')
                          : (release.client_edited_content || release.admin_refined_content || release.ai_draft_content || '')
                    )
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
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 rounded-full font-headline"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Request Journalist Review
                </Button>
              ) : (
                <PanelReviewAnimation
                  reviewers={REVIEWERS}
                  progress={panelProgress}
                  comments={panelComments}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Request New Review button — above the panel results */}
        {release.panel_individual_feedback && (release.panel_individual_feedback as PanelFeedback[]).length > 0 && canReview && !requestingPanel && (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRequestPanelReview}
              className="bg-surface-container-highest text-on-surface hover:bg-surface-container-high rounded-md font-headline"
            >
              <Users className="h-4 w-4 mr-2" />
              Request New Review
            </Button>
            <p className="text-xs text-ink-muted">
              Run the 16-journalist panel again after making changes.
            </p>
          </div>
        )}
        {release.panel_individual_feedback && (release.panel_individual_feedback as PanelFeedback[]).length > 0 && requestingPanel && (
          <PanelReviewAnimation
            reviewers={REVIEWERS}
            progress={panelProgress}
            comments={panelComments}
          />
        )}

        {/* Panel Critique — Full Detail View */}
        {release.panel_individual_feedback && (release.panel_individual_feedback as PanelFeedback[]).length > 0 && (
          (() => {
            const panelFeedback = release.panel_individual_feedback as PanelFeedback[];
            const { score: numScore, compellingCount, total: totalCount } = deriveNewsroomScore(panelFeedback);
            const percentage = Math.round((compellingCount / totalCount) * 100);
            const score = numScore.toFixed(1);

            // Stale score detection: the draft has been edited after the panel reviewed it.
            // Uses updated_at vs panel_reviewed_at with a 5-second buffer to ignore the
            // same-transaction write that marked the panel review complete.
            const panelTs = release.panel_reviewed_at ? new Date(release.panel_reviewed_at).getTime() : 0;
            const updatedTs = release.updated_at ? new Date(release.updated_at).getTime() : 0;
            const scoreOutdated = panelTs > 0 && updatedTs > panelTs + 5000;

            const suggestions = panelFeedback
              .filter(f => f.missing && f.missing.trim())
              .map(f => f.missing)
              .slice(0, 3);

            return (
              <Card className="border-rule bg-paper-light">
                {scoreOutdated && (
                  <div className="mx-6 mt-6 flex items-start gap-3 p-4 rounded-md bg-yellow-50 text-yellow-900">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-yellow-700" />
                    <div className="flex-1">
                      <p className="font-headline text-sm font-bold">Score may be outdated</p>
                      <p className="font-editorial text-sm text-yellow-900/80 mt-1">
                        The draft has been edited since this review ran. Click <span className="font-semibold">Request New Review</span> above to get a fresh score on the updated draft.
                      </p>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 font-display text-ink">
                        <Users className="h-5 w-5 text-primary" />
                        Newsroom Score
                      </CardTitle>
                      <CardDescription>
                        Reviewed by {totalCount} journalist personas
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono text-3xl font-bold ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-secondary' : 'text-primary'}`}>
                        {score}<span className="text-base font-normal text-ink-muted">/10</span>
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
                        ? 'Good foundation. Addressing the fixes below will strengthen it.'
                        : 'The panel identified areas for improvement. Review the fixes below.'}
                  </p>

                  {/* Key Themes */}
                  {release.panel_synthesis && (
                    <div className="p-4 bg-surface-container-low rounded-md">
                      <h4 className="font-semibold text-ink flex items-center gap-2 mb-2 text-sm">
                        <Sparkles className="h-4 w-4 text-secondary" />
                        Top Fixes
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
                    <div className="p-4 bg-surface-container-low rounded-md">
                      <h4 className="font-semibold text-ink flex items-center gap-2 mb-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-secondary" />
                        Additional Fixes
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
                    className="w-full flex items-center justify-between p-3 bg-surface-container-low rounded-md hover:bg-surface-container transition-colors text-sm"
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
                      {panelFeedback.map((fb, i) => {
                        const vote = reviewerVotes[i];
                        const suggestion = (fb as any).suggestion || fb.missing || '';
                        const cleanFeedback = (fb.feedback || '').replace(/^\s*\)?\*{0,2}\s*[-–]\s*/, '').replace(/\*\*[^(]*\(\s*$/, '').replace(/\*\*/g, '').trim();
                        const cleanMissing = (fb.missing || '').replace(/^\s*\)?\*{0,2}\s*[-–]\s*/, '').replace(/\*\*[^(]*\(\s*$/, '').replace(/\*\*/g, '').trim();

                        return (
                          <div key={i} className={`border rounded-md overflow-hidden bg-paper ${vote === 'agree' ? 'border-green-300' : vote === 'disagree' ? 'border-ink-muted/30' : 'border-rule'}`}>
                            <div className="flex items-center gap-3 p-3 border-b border-rule bg-paper-light">
                              <div className="w-9 h-9 rounded-full bg-paper-dark flex items-center justify-center font-mono text-xs font-semibold text-ink-muted flex-shrink-0">
                                {(fb.persona || 'R').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-ink">{fb.persona || `Reviewer ${i + 1}`}</div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">{fb.role || 'Journalist'}</div>
                              </div>
                              <span className={`font-label text-[11px] font-semibold px-3 py-1 rounded-full tracking-wider uppercase ${fb.compelling ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                {fb.compelling ? 'PASS' : 'REVISE'}
                              </span>
                            </div>
                            <div className="p-3 space-y-2">
                              {cleanFeedback && (
                                <div>
                                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted mb-1">Feedback</div>
                                  <p className="text-sm text-ink leading-relaxed">{cleanFeedback}</p>
                                </div>
                              )}
                              {cleanMissing && (
                                <div>
                                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary mb-1">What&apos;s Missing</div>
                                  <p className="text-sm text-ink-muted">{cleanMissing}</p>
                                </div>
                              )}

                              {/* Suggested Fix */}
                              {(fb as any).suggestion && (
                                <div className="mt-2 p-4 bg-primary/5 rounded-md">
                                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary mb-1">Suggested Fix</div>
                                  <p className="text-sm text-ink leading-relaxed">{(fb as any).suggestion}</p>
                                </div>
                              )}

                              {/* Agree / Disagree + Reply */}
                              {canReview && (
                                <div className="mt-3 pt-3 border-t border-rule space-y-2">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setReviewerVotes(prev => ({ ...prev, [i]: prev[i] === 'agree' ? undefined as any : 'agree' }))}
                                      className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-label uppercase tracking-wider rounded-full transition-colors ${
                                        vote === 'agree'
                                          ? 'bg-green-50 border-green-300 text-green-700'
                                          : 'border-rule text-ink-muted hover:text-ink hover:bg-paper-light'
                                      }`}
                                    >
                                      <ThumbsUp className="h-3 w-3" />
                                      Agree
                                    </button>
                                    <button
                                      onClick={() => setReviewerVotes(prev => ({ ...prev, [i]: prev[i] === 'disagree' ? undefined as any : 'disagree' }))}
                                      className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-label uppercase tracking-wider rounded-full transition-colors ${
                                        vote === 'disagree'
                                          ? 'bg-orange-50 border-orange-300 text-orange-700'
                                          : 'border-rule text-ink-muted hover:text-ink hover:bg-paper-light'
                                      }`}
                                    >
                                      <X className="h-3 w-3" />
                                      Disagree
                                    </button>
                                    <button
                                      onClick={() => setShowReplyFor(showReplyFor === i ? null : i)}
                                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-label uppercase tracking-wider rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                                    >
                                      <MessageSquare className="h-3 w-3" />
                                      Reply
                                    </button>

                                    {/* Apply button — shown when agreed or has a suggestion */}
                                    {vote === 'agree' && suggestion && (
                                      appliedSuggestions.has(i) ? (
                                        <span className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-label uppercase tracking-wider text-green-700 bg-green-50 rounded-full ml-auto">
                                          <CheckCircle className="h-3 w-3" /> Applied — review the updated draft above
                                        </span>
                                      ) : (
                                        <Button
                                          size="sm"
                                          onClick={() => handleApplySuggestion(suggestion, fb.persona, i)}
                                          disabled={applyingSuggestion !== null}
                                          className="bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 rounded-full font-headline text-xs h-7 px-3 ml-auto"
                                        >
                                          {applyingSuggestion === i ? (
                                            <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Applying...</>
                                          ) : (
                                            <><Sparkles className="h-3 w-3 mr-1" /> Apply This</>
                                          )}
                                        </Button>
                                      )
                                    )}
                                  </div>

                                  {/* Reply text field */}
                                  {showReplyFor === i && (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={reviewerReplies[i] || ''}
                                        onChange={(e) => setReviewerReplies(prev => ({ ...prev, [i]: e.target.value }))}
                                        placeholder="Add context or corrections for the rewrite (e.g. 'We actually do have third-party validation from DNV GL' or 'The safety record spans 15 years, not just recent')..."
                                        rows={2}
                                        className="text-sm"
                                      />
                                      {suggestion && (
                                        appliedSuggestions.has(i) ? (
                                          <span className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-label uppercase tracking-wider text-green-700 bg-green-50 rounded-full">
                                            <CheckCircle className="h-3 w-3" /> Applied — review the updated draft above
                                          </span>
                                        ) : (
                                          <Button
                                            size="sm"
                                            onClick={() => handleApplySuggestion(suggestion, fb.persona, i)}
                                            disabled={applyingSuggestion !== null}
                                            className="bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 rounded-full font-headline text-xs h-7 px-3"
                                          >
                                            {applyingSuggestion === i ? (
                                              <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Applying with your context...</>
                                            ) : (
                                              <><Sparkles className="h-3 w-3 mr-1" /> Apply with My Context</>
                                            )}
                                          </Button>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Rewrite with all agreed suggestions */}
                      {canReview && Object.values(reviewerVotes).some(v => v === 'agree') && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-green-800">
                                {Object.values(reviewerVotes).filter(v => v === 'agree').length} suggestion{Object.values(reviewerVotes).filter(v => v === 'agree').length !== 1 ? 's' : ''} accepted
                              </p>
                              <p className="text-xs text-green-600 mt-0.5">
                                Click &quot;Apply This&quot; on individual suggestions, or rewrite the entire draft below.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rewrite Button */}
                  {canReview && (
                    <div className="pt-3 border-t border-rule">
                      {!requestingRewrite ? (
                        <div>
                          <Button
                            onClick={handleRequestRewrite}
                            className="bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 rounded-full font-headline"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Rewrite Based on Panel Feedback
                          </Button>
                          <p className="text-xs text-ink-muted mt-2">
                            We&apos;ll rewrite the draft incorporating the panel&apos;s suggestions.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 p-4 bg-surface-container-low rounded-md">
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
                                  <div className="w-4 h-4 rounded-full bg-surface-container flex-shrink-0" />
                                )}
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {release.panel_reviewed_at && !requestingPanel && (
                    <p className="text-xs text-ink-muted font-mono">
                      Last reviewed {format(new Date(release.panel_reviewed_at), 'PPp')}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })()
        )}

        {/* Client Review Section */}
        {canReview && (
          <Card className="bg-surface-container-low border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-on-surface">
                <ArrowRight className="h-5 w-5 text-primary-container" />
                See the Final Product
              </CardTitle>
              <CardDescription className="font-editorial text-on-surface-variant">
                You&apos;ve seen the draft and the journalist panel feedback. View the final formatted press release, then approve it or send revision notes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push(`/dashboard/my-releases/${release.id}/preview`)}
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 rounded-full font-headline"
              >
                See Final Product
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
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
            <CardTitle>Your Original Request</CardTitle>
            <CardDescription>
              This is the information you submitted. Our writing team used these details to craft your press release.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Company</dt>
                <dd className="font-medium">{release.company_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Announcement Type</dt>
                <dd className="font-medium capitalize">{(release.announcement_type ?? '').replace('_', ' ')}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Target Date</dt>
                <dd className="font-medium">{(() => {
                  if (!release.release_date) return '—';
                  const d = new Date(release.release_date);
                  return isNaN(d.getTime()) ? '—' : format(d, 'PP');
                })()}</dd>
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
            <CardTitle>Progress Timeline</CardTitle>
            <CardDescription>
              Track every step of your press release from submission to publication.
            </CardDescription>
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
