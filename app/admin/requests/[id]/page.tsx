'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Loader2, 
  Wand2, 
  Users, 
  Send, 
  CheckCircle,
  FileText,
  Globe,
  AlertCircle,
  Edit3,
  Save,
  MessageSquare
} from 'lucide-react';
import { ReleaseRequest, ReleaseStatus, PanelFeedback } from '@/types';
import { format } from 'date-fns';

const statusConfig: Record<ReleaseStatus, { label: string; color: string; nextAction?: string }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-500', nextAction: 'Generate Draft' },
  draft_generated: { label: 'Draft Generated', color: 'bg-purple-500', nextAction: 'Run Panel Critique' },
  panel_reviewed: { label: 'Panel Reviewed', color: 'bg-purple-500', nextAction: 'Send to Client' },
  admin_approved: { label: 'Admin Approved', color: 'bg-indigo-500', nextAction: 'Send to Client' },
  awaiting_client: { label: 'Awaiting Client', color: 'bg-yellow-500' },
  client_feedback: { label: 'Client Feedback', color: 'bg-orange-500', nextAction: 'Review Feedback' },
  client_approved: { label: 'Client Approved', color: 'bg-green-500', nextAction: 'Final Review' },
  final_pending: { label: 'Final Pending', color: 'bg-blue-500', nextAction: 'Approve Final' },
  final_approved: { label: 'Final Approved', color: 'bg-green-500', nextAction: 'Quality Review' },
  quality_review: { label: 'Quality Review', color: 'bg-blue-500', nextAction: 'Publish' },
  quality_approved: { label: 'Quality Approved', color: 'bg-green-500', nextAction: 'Publish' },
  published: { label: 'Published', color: 'bg-secondary' },
  needs_revision: { label: 'Needs Revision', color: 'bg-red-500', nextAction: 'Revise Draft' },
  rejected: { label: 'Rejected', color: 'bg-red-700' },
};

export default function AdminRequestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [release, setRelease] = useState<ReleaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [selectedHeadline, setSelectedHeadline] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
      setEditedContent(data.admin_refined_content || data.ai_draft_content || '');
      setSelectedHeadline(data.ai_selected_headline || '');
      setAdminNotes(data.admin_notes || '');
    }
    setLoading(false);
  };

  const handleGenerateDraft = async () => {
    setActionLoading('generate');
    try {
      const response = await fetch('/api/ai/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseRequestId: params.id }),
      });
      
      if (response.ok) {
        await loadRelease();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate draft');
      }
    } catch (err) {
      alert('Failed to generate draft');
    }
    setActionLoading(null);
  };

  const handleRunPanelCritique = async () => {
    setActionLoading('panel');
    try {
      const response = await fetch('/api/ai/panel-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseRequestId: params.id }),
      });
      
      if (response.ok) {
        await loadRelease();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to run panel critique');
      }
    } catch (err) {
      alert('Failed to run panel critique');
    }
    setActionLoading(null);
  };

  const handleSaveChanges = async () => {
    if (!release) return;
    setActionLoading('save');
    
    const supabase = createClient();
    const { error } = await supabase
      .from('release_requests')
      .update({
        admin_refined_content: editedContent,
        ai_selected_headline: selectedHeadline,
        admin_notes: adminNotes,
      })
      .eq('id', release.id);

    if (!error) {
      await loadRelease();
      setIsEditing(false);
    }
    setActionLoading(null);
  };

  const handleSendToClient = async () => {
    if (!release) return;
    setActionLoading('send');
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('release_requests')
      .update({
        status: 'awaiting_client',
        sent_to_client_at: new Date().toISOString(),
        admin_reviewed_by: user?.id,
        admin_reviewed_at: new Date().toISOString(),
      })
      .eq('id', release.id);

    if (!error) {
      // Send email notification to client
      try {
        const notifRes = await fetch('/api/notifications/draft-ready', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ releaseId: release.id }),
        });
        const notifData = await notifRes.json().catch(() => ({}));
        if (!notifRes.ok) {
          alert(`Status updated, but the notification email failed to send: ${notifData.error || notifRes.statusText}. Check RESEND_API_KEY in Vercel.`);
        }
      } catch (emailErr) {
        console.error('Failed to send email notification:', emailErr);
        alert('Status updated, but the notification email could not be sent. Check the console and RESEND_API_KEY.');
      }
      
      await loadRelease();
    }
    setActionLoading(null);
  };

  const handleUpdateStatus = async (newStatus: ReleaseStatus) => {
    if (!release) return;
    setActionLoading(newStatus);
    
    const supabase = createClient();
    const updates: any = { status: newStatus };
    
    if (newStatus === 'published') {
      updates.published_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('release_requests')
      .update(updates)
      .eq('id', release.id);

    if (!error) {
      await loadRelease();
    }
    setActionLoading(null);
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
      <div className="text-center py-16 text-white">
        <h2 className="text-xl font-semibold">Request not found</h2>
        <Link href="/admin/requests" className="text-secondary hover:underline mt-2 inline-block">
          Back to Requests
        </Link>
      </div>
    );
  }

  const status = statusConfig[release.status as ReleaseStatus] || statusConfig.submitted;
  const panelFeedback = release.panel_individual_feedback as PanelFeedback[] | null;

  return (
    <div className="text-white max-w-6xl">
      <Link 
        href="/admin/requests"
        className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Requests
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">
              {release.ai_selected_headline || release.news_hook || 'Press Release Request'}
            </h1>
            <Badge className={`${status.color} text-white`}>{status.label}</Badge>
          </div>
          <p className="text-slate-400">
            {release.company_name} • {release.announcement_type.replace('_', ' ')} • {release.plan} plan
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {release.status === 'submitted' && (
            <Button 
              onClick={handleGenerateDraft}
              disabled={actionLoading === 'generate'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {actionLoading === 'generate' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Generate Draft
            </Button>
          )}
          
          {release.status === 'draft_generated' && (
            <Button 
              onClick={handleRunPanelCritique}
              disabled={actionLoading === 'panel'}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {actionLoading === 'panel' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              Run Panel Critique
            </Button>
          )}
          
          {['panel_reviewed', 'admin_approved'].includes(release.status) && (
            <Button 
              onClick={handleSendToClient}
              disabled={actionLoading === 'send'}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {actionLoading === 'send' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send to Client
            </Button>
          )}
          
          {['client_approved', 'final_approved', 'quality_approved'].includes(release.status) && (
            <Button 
              onClick={() => handleUpdateStatus('published')}
              disabled={actionLoading === 'published'}
              className="bg-secondary hover:bg-secondary/90"
            >
              {actionLoading === 'published' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Client Feedback Alert */}
          {release.client_feedback && (
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Client Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white">{release.client_feedback}</p>
                {release.client_feedback_at && (
                  <p className="text-sm text-orange-400 mt-2">
                    Received {format(new Date(release.client_feedback_at), 'PPp')}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Draft */}
          {(release.ai_draft_content || release.admin_refined_content) && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Press Release Draft
                  </CardTitle>
                  {release.ai_generated_at && (
                    <CardDescription className="text-slate-400">
                      Generated {format(new Date(release.ai_generated_at), 'PPp')}
                    </CardDescription>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-slate-700 border-slate-600 text-white"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent>
                {/* Headline Selection */}
                {release.ai_headline_options && release.ai_headline_options.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-slate-300 mb-2 block">Select Headline</Label>
                    <div className="space-y-2">
                      {release.ai_headline_options.map((headline, i) => (
                        <label 
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedHeadline === headline 
                              ? 'bg-secondary/20 border border-secondary' 
                              : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="headline"
                            value={headline}
                            checked={selectedHeadline === headline}
                            onChange={(e) => setSelectedHeadline(e.target.value)}
                            className="text-secondary"
                          />
                          <span className="text-white">{headline}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {release.ai_subhead && (
                  <p className="text-lg text-slate-300 italic mb-4">{release.ai_subhead}</p>
                )}

                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[400px] bg-slate-700 border-slate-600 text-white"
                    />
                    <div>
                      <Label className="text-slate-300">Admin Notes</Label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Internal notes about this release..."
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={handleSaveChanges}
                      disabled={actionLoading === 'save'}
                      className="bg-secondary hover:bg-secondary/90"
                    >
                      {actionLoading === 'save' ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-slate-300 bg-slate-700/50 p-4 rounded-lg">
                    {release.admin_refined_content || release.ai_draft_content}
                  </pre>
                )}
              </CardContent>
            </Card>
          )}

          {/* Panel Critique */}
          {panelFeedback && panelFeedback.length > 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Panel Critique ({panelFeedback.length} reviewers)
                </CardTitle>
                {release.panel_reviewed_at && (
                  <CardDescription className="text-slate-400">
                    Reviewed {format(new Date(release.panel_reviewed_at), 'PPp')}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {/* Synthesis */}
                {release.panel_synthesis && (
                  <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <h4 className="font-medium text-indigo-400 mb-2">Key Themes</h4>
                    <p className="text-slate-300">{release.panel_synthesis}</p>
                  </div>
                )}

                {/* Individual Feedback */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {panelFeedback.map((feedback, i) => (
                    <div key={i} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-white">{feedback.persona}</span>
                          {feedback.role && (
                            <span className="text-slate-400 ml-2">({feedback.role})</span>
                          )}
                        </div>
                        <Badge className={feedback.compelling ? 'bg-green-500' : 'bg-red-500'}>
                          {feedback.compelling ? 'Compelling' : 'Not Compelling'}
                        </Badge>
                      </div>
                      <p className="text-slate-300">{feedback.feedback}</p>
                      {feedback.missing && (
                        <p className="text-sm text-yellow-400 mt-2">Missing: {feedback.missing}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Contrarian Recommendation */}
                {release.panel_contrarian_recommendation && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="font-medium text-red-400 mb-2">Contrarian Recommendation</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {release.panel_contrarian_recommendation.remove && (
                        <div>
                          <span className="text-red-400">Remove:</span>
                          <p className="text-slate-300">{release.panel_contrarian_recommendation.remove}</p>
                        </div>
                      )}
                      {release.panel_contrarian_recommendation.sharpen && (
                        <div>
                          <span className="text-yellow-400">Sharpen:</span>
                          <p className="text-slate-300">{release.panel_contrarian_recommendation.sharpen}</p>
                        </div>
                      )}
                      {release.panel_contrarian_recommendation.risk && (
                        <div>
                          <span className="text-orange-400">Risk to Take:</span>
                          <p className="text-slate-300">{release.panel_contrarian_recommendation.risk}</p>
                        </div>
                      )}
                      {release.panel_contrarian_recommendation.ignore && (
                        <div>
                          <span className="text-slate-400">Ignore:</span>
                          <p className="text-slate-300">{release.panel_contrarian_recommendation.ignore}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Request Details */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-400">Company</dt>
                  <dd className="text-white font-medium">{release.company_name}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Website</dt>
                  <dd>
                    <a href={release.company_website} target="_blank" rel="noopener" className="text-secondary hover:underline">
                      {release.company_website}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Announcement</dt>
                  <dd className="text-white capitalize">{release.announcement_type.replace('_', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Target Date</dt>
                  <dd className="text-white">{format(new Date(release.release_date), 'PP')}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Dateline</dt>
                  <dd className="text-white">{release.dateline_city}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Industry</dt>
                  <dd className="text-white capitalize">{release.industry || 'General'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Core Facts */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Core Facts</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
                {release.core_facts?.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* News Hook */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">News Hook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">{release.news_hook}</p>
            </CardContent>
          </Card>

          {/* Media Contact */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Media Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-slate-400">Name</dt>
                  <dd className="text-white">{release.media_contact_name}</dd>
                </div>
                {release.media_contact_title && (
                  <div>
                    <dt className="text-slate-400">Title</dt>
                    <dd className="text-white">{release.media_contact_title}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-slate-400">Email</dt>
                  <dd className="text-white">{release.media_contact_email}</dd>
                </div>
                {release.media_contact_phone && (
                  <div>
                    <dt className="text-slate-400">Phone</dt>
                    <dd className="text-white">{release.media_contact_phone}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-slate-700 border-slate-600 text-white justify-start"
                onClick={() => handleUpdateStatus('needs_revision')}
              >
                <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                Mark Needs Revision
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-slate-700 border-slate-600 text-white justify-start"
                onClick={() => handleUpdateStatus('rejected')}
              >
                <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                Reject Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
