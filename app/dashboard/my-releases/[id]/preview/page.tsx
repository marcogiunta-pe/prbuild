'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Copy,
  Check,
  Printer,
  Mail,
  Send,
  Code,
  FileText,
  CheckCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { ReleaseRequest, deriveNewsroomScore } from '@/types';
import type { PanelFeedback } from '@/types';
import { isSectionLabel, cleanContent, extractHeadlineFromContent, contentToHtml } from '@/lib/release-formatting';

function contentToMarkdown(content: string, headline: string, release: ReleaseRequest): string {
  let text = content
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/^\s*\(\d+\)\s*$/gm, '')
    .replace(/^\s*\(\d+\)\s*/gm, '')
    .trim();

  return `# ${headline}\n\n${release.ai_subhead ? `*${release.ai_subhead}*\n\n` : ''}${text}\n\n---\n\n**Media Contact:**\n${release.media_contact_name || ''}${release.media_contact_title ? ', ' + release.media_contact_title : ''}\nEmail: ${release.media_contact_email || ''}\n${release.media_contact_phone ? 'Phone: ' + release.media_contact_phone + '\n' : ''}${release.company_website ? 'Website: ' + release.company_website : ''}`;
}

function contentToWebHtml(content: string, headline: string, release: ReleaseRequest): string {
  const body = contentToHtml(cleanContent(content));
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${headline}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #141414; line-height: 1.7; }
  h1 { font-size: 32px; line-height: 1.2; margin-bottom: 8px; }
  .subhead { font-style: italic; color: #6B6660; font-size: 18px; margin-bottom: 24px; }
  .dateline { font-weight: bold; }
  hr { border: none; border-top: 1px solid #CCC0AD; margin: 32px 0; }
  .contact { font-size: 14px; color: #6B6660; }
  .contact strong { color: #141414; }
  .end-mark { text-align: center; color: #6B6660; margin-top: 32px; }
</style>
</head>
<body>
<h1>${headline}</h1>
${release.ai_subhead ? `<p class="subhead">${release.ai_subhead}</p>` : ''}
${body}
<hr>
<div class="contact">
<strong>Media Contact:</strong><br>
${release.media_contact_name || ''}${release.media_contact_title ? ', ' + release.media_contact_title : ''}<br>
Email: <a href="mailto:${release.media_contact_email}">${release.media_contact_email || ''}</a><br>
${release.media_contact_phone ? 'Phone: ' + release.media_contact_phone + '<br>' : ''}
${release.company_website ? 'Website: <a href="' + release.company_website + '">' + release.company_website + '</a>' : ''}
</div>
<p class="end-mark">###</p>
</body>
</html>`;
}

export default function ReleasePreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [release, setRelease] = useState<ReleaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [sigName, setSigName] = useState('');
  const [sigEmail, setSigEmail] = useState('');
  const [sigPhone, setSigPhone] = useState('');
  const [sigAgreed, setSigAgreed] = useState(false);
  const [generatingPitches, setGeneratingPitches] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState<string | null>(null);
  const [generatingAnnouncement, setGeneratingAnnouncement] = useState(false);
  const [copiedAnnouncement, setCopiedAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('release_requests')
        .select('*')
        .eq('id', params.id)
        .single();
      if (data) setRelease(data as ReleaseRequest);
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-paper">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!release) {
    return (
      <div className="text-center py-20 bg-paper min-h-screen">
        <p className="text-ink-muted">Release not found.</p>
        <Link href="/dashboard/my-releases" className="text-primary hover:underline mt-2 inline-block">Back to releases</Link>
      </div>
    );
  }

  const rawContent = release.client_edited_content || release.admin_refined_content || release.ai_draft_content || '';
  const cleaned = cleanContent(rawContent);

  // Extract headline: prefer ai_selected_headline, then try to extract from content, then fall back to news_hook
  const headline = release.ai_selected_headline
    || extractHeadlineFromContent(rawContent)
    || release.news_hook
    || 'Press Release';
  const subhead = release.ai_subhead || '';

  const renderedContent = contentToHtml(cleaned, headline);

  const copyAs = async (format: 'text' | 'markdown' | 'html') => {
    let text = '';
    if (format === 'text') {
      text = cleaned.replace(/<[^>]+>/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      text = `${headline}\n${subhead ? subhead + '\n' : ''}\n${text}\n\n---\nMedia Contact:\n${release.media_contact_name || ''}${release.media_contact_title ? ', ' + release.media_contact_title : ''}\nEmail: ${release.media_contact_email || ''}\n${release.media_contact_phone ? 'Phone: ' + release.media_contact_phone : ''}\n${release.company_website ? 'Website: ' + release.company_website : ''}`;
    } else if (format === 'markdown') {
      text = contentToMarkdown(rawContent, headline, release);
    } else {
      text = contentToWebHtml(rawContent, headline, release);
    }
    await navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handlePrint = () => window.print();

  const handleEmail = () => {
    const plainText = cleaned.replace(/<[^>]+>/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
    const subject = encodeURIComponent(headline);
    const body = encodeURIComponent(`${headline}\n\n${plainText}\n\n---\nMedia Contact: ${release.media_contact_name || ''}\nEmail: ${release.media_contact_email || ''}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handlePublishToMedia = async () => {
    if (!sigAgreed || !sigName || !sigEmail || !sigPhone) return;
    setPublishing(true);
    const supabase = createClient();
    await supabase
      .from('release_requests')
      .update({
        status: 'client_approved',
        final_content: cleaned,
        final_approved_at: new Date().toISOString(),
        admin_notes: `[${new Date().toISOString()}] Publication authorized by: ${sigName} (${sigEmail}, ${sigPhone}). Digital signature on file.`,
      })
      .eq('id', release.id);
    setPublishing(false);
    setShowDisclaimer(false);
    router.push(`/dashboard/my-releases/${release.id}`);
  };

  const handleGeneratePitches = async () => {
    if (!release) return;
    setGeneratingPitches(true);
    try {
      const res = await fetch('/api/ai/generate-pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseRequestId: release.id }),
      });
      const data = await res.json();
      if (data.success && data.pitches) {
        setRelease({ ...release, pitch_emails: data.pitches });
      }
    } catch (err) {
      console.error('Failed to generate pitches:', err);
    } finally {
      setGeneratingPitches(false);
    }
  };

  const copyPitchText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedPitch(key);
    setTimeout(() => setCopiedPitch(null), 2000);
  };

  const handleGenerateAnnouncement = async () => {
    if (!release) return;
    setGeneratingAnnouncement(true);
    try {
      const res = await fetch('/api/ai/generate-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releaseRequestId: release.id }),
      });
      const data = await res.json();
      if (data.success) {
        setRelease({
          ...release,
          announcement_content: {
            clientEmail: data.clientEmail,
            linkedInPost: data.linkedInPost,
          },
        });
      }
    } catch (err) {
      console.error('Failed to generate announcement:', err);
    } finally {
      setGeneratingAnnouncement(false);
    }
  };

  const copyAnnouncementText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedAnnouncement(key);
    setTimeout(() => setCopiedAnnouncement(null), 2000);
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-content { max-width: 100% !important; padding: 0 !important; }
        }
      `}</style>

      <div className="min-h-screen bg-paper">
        {/* Action bar */}
        <div className="no-print sticky top-0 z-50 bg-ink text-paper-light">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href={`/dashboard/my-releases/${params.id}`}
              className="flex items-center gap-2 text-sm text-paper-light/60 hover:text-paper-light transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to release
            </Link>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyAs('text')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-paper-light/70 hover:text-paper-light border border-paper-light/20 rounded-sm hover:bg-paper-light/10 transition-colors"
              >
                {copiedFormat === 'text' ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedFormat === 'text' ? 'Copied' : 'Plain Text'}
              </button>
              <button
                onClick={() => copyAs('markdown')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-paper-light/70 hover:text-paper-light border border-paper-light/20 rounded-sm hover:bg-paper-light/10 transition-colors"
              >
                {copiedFormat === 'markdown' ? <Check className="h-3.5 w-3.5 text-green-400" /> : <FileText className="h-3.5 w-3.5" />}
                {copiedFormat === 'markdown' ? 'Copied' : 'Markdown'}
              </button>
              <button
                onClick={() => copyAs('html')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-paper-light/70 hover:text-paper-light border border-paper-light/20 rounded-sm hover:bg-paper-light/10 transition-colors"
              >
                {copiedFormat === 'html' ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Code className="h-3.5 w-3.5" />}
                {copiedFormat === 'html' ? 'Copied' : 'HTML'}
              </button>
              <div className="w-px h-5 bg-paper-light/20 mx-1" />
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-paper-light/70 hover:text-paper-light border border-paper-light/20 rounded-sm hover:bg-paper-light/10 transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
              <button
                onClick={handleEmail}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-paper-light/70 hover:text-paper-light border border-paper-light/20 rounded-sm hover:bg-paper-light/10 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>
            </div>
          </div>
        </div>

        {/* Press release document */}
        <div className="print-content max-w-3xl mx-auto px-6 py-12">
          {/* Approved badge */}
          <div className="no-print flex items-center gap-2 mb-8">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Approved &amp; Ready for Publication</span>
          </div>

          {/* Header */}
          <div className="mb-10 pb-8 border-b border-rule">
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-muted mb-4">
              Press Release &bull; {release.company_name}
            </div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink mb-4">
              {headline}
            </h1>
            {subhead && (
              <p className="text-xl text-ink-muted italic font-accent leading-relaxed">
                {subhead}
              </p>
            )}
          </div>

          {/* Body */}
          <article
            className="prose prose-lg max-w-none mb-10
              prose-headings:font-display prose-headings:text-ink prose-headings:font-normal
              prose-p:text-ink-soft prose-p:leading-relaxed prose-p:text-base
              prose-strong:text-ink prose-em:text-ink-muted
              prose-a:text-primary prose-a:underline
              prose-hr:border-rule"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />

          {/* Media Contact */}
          <div className="border-t border-rule pt-8 mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-muted mb-3">
              Media Contact
            </div>
            <div className="text-sm text-ink space-y-1">
              <p className="font-semibold">{release.media_contact_name}{release.media_contact_title ? `, ${release.media_contact_title}` : ''}</p>
              <p className="text-ink-muted">Email: <a href={`mailto:${release.media_contact_email}`} className="text-primary hover:underline">{release.media_contact_email}</a></p>
              {release.media_contact_phone && <p className="text-ink-muted">Phone: {release.media_contact_phone}</p>}
              {release.company_website && <p className="text-ink-muted">Website: <a href={release.company_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{release.company_website}</a></p>}
            </div>
          </div>

          {/* End mark */}
          <div className="border-t border-rule pt-6 text-center">
            <p className="font-mono text-xs text-ink-muted">###</p>
          </div>

          {/* Newsroom Score */}
          {release.panel_individual_feedback && (release.panel_individual_feedback as any[]).length > 0 && (
            <div className="no-print mt-12 border border-rule rounded-md overflow-hidden">
              <div className="p-6 border-b border-rule bg-paper-light">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-display text-xl text-ink">Newsroom Score</h3>
                      <p className="text-sm text-ink-muted mt-0.5">
                        Reviewed by {(release.panel_individual_feedback as any[]).length} journalist personas before any real reporter sees it.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-3xl font-bold text-ink">
                      {deriveNewsroomScore(release.panel_individual_feedback as PanelFeedback[]).score.toFixed(1)}
                      <span className="text-base font-normal text-ink-muted">/10</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-paper-light space-y-4">
                {/* Top fixes from synthesis */}
                {release.panel_synthesis && (
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-muted mb-3">Top fixes</div>
                    <div className="space-y-2">
                      {release.panel_synthesis
                        .split(/\n/)
                        .map((line: string) => line.replace(/^\s*[-–•*]\s*/, '').replace(/^\d+[.)]\s*/, '').replace(/\*\*/g, '').trim())
                        .filter((line: string) => line.length > 10)
                        .slice(0, 3)
                        .map((fix: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="font-mono text-sm text-primary font-medium mt-0.5">{i + 1}.</span>
                            <p className="text-sm text-ink leading-relaxed">{fix}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Journalist Pitch Emails */}
          <div className="no-print mt-12 border border-rule rounded-md overflow-hidden">
            <div className="p-6 border-b border-rule bg-paper-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-display text-xl text-ink">Journalist Pitch Emails</h3>
                    <p className="text-sm text-ink-muted mt-0.5">
                      Personalized pitch emails ready to send to journalists. Copy any email and send it directly.
                    </p>
                  </div>
                </div>
                {release.pitch_emails && release.pitch_emails.length > 0 && (
                  <button
                    onClick={handleGeneratePitches}
                    disabled={generatingPitches}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink border border-rule rounded-sm hover:bg-paper transition-colors disabled:opacity-50"
                  >
                    {generatingPitches ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Regenerate
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 bg-paper-light">
              {!release.pitch_emails || release.pitch_emails.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-10 w-10 text-ink-muted/40 mx-auto mb-3" />
                  <h4 className="font-display text-lg text-ink mb-2">Ready to pitch journalists?</h4>
                  <p className="text-sm text-ink-muted mb-1 max-w-md mx-auto">
                    We&apos;ll generate 5 personalized emails for reporters who cover your industry.
                    Each pitch references the journalist&apos;s beat and explains why your news matters to their readers.
                  </p>
                  <p className="text-xs text-ink-muted mb-5">
                    Emails appear here — copy them and send directly from your inbox.
                  </p>
                  <Button
                    onClick={handleGeneratePitches}
                    disabled={generatingPitches}
                    className="bg-primary hover:bg-primary-700 rounded-sm"
                  >
                    {generatingPitches ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Mail className="h-4 w-4 mr-2" /> Generate 5 Pitch Emails</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {release.pitch_emails.map((pitch, index) => {
                    const subjectKey = `subject-${index}`;
                    const bodyKey = `body-${index}`;
                    const mailtoHref = `mailto:?subject=${encodeURIComponent(pitch.subject)}&body=${encodeURIComponent(pitch.body)}`;
                    return (
                      <div key={index} className="border border-rule rounded-sm bg-paper">
                        <div className="px-4 py-3 border-b border-rule flex items-center justify-between">
                          <div>
                            <span className="font-display text-sm text-ink font-semibold">{pitch.reporterName}</span>
                            <span className="text-ink-muted text-sm"> &mdash; </span>
                            <span className="text-sm text-ink-muted">{pitch.outlet}</span>
                          </div>
                          <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-muted bg-paper-light border border-rule px-2 py-0.5 rounded-sm">
                            {pitch.beat}
                          </span>
                        </div>

                        <div className="px-4 py-3 space-y-3">
                          {/* Subject line */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-muted">Subject</span>
                              <button
                                onClick={() => copyPitchText(pitch.subject, subjectKey)}
                                className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition-colors"
                              >
                                {copiedPitch === subjectKey ? (
                                  <><Check className="h-3 w-3 text-green-600" /> Copied</>
                                ) : (
                                  <><Copy className="h-3 w-3" /> Copy</>
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-ink font-semibold">{pitch.subject}</p>
                          </div>

                          {/* Body */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-muted">Body</span>
                              <button
                                onClick={() => copyPitchText(pitch.body, bodyKey)}
                                className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition-colors"
                              >
                                {copiedPitch === bodyKey ? (
                                  <><Check className="h-3 w-3 text-green-600" /> Copied</>
                                ) : (
                                  <><Copy className="h-3 w-3" /> Copy</>
                                )}
                              </button>
                            </div>
                            <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{pitch.body}</p>
                          </div>

                          {/* Send via Email */}
                          <div className="pt-2 border-t border-rule">
                            <a
                              href={mailtoHref}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary-700 border border-primary/30 rounded-sm hover:bg-primary/5 transition-colors"
                            >
                              <Send className="h-3 w-3" />
                              Send via Email
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Client / Stakeholder Announcement Email + LinkedIn Post */}
          <div className="no-print mt-12 border border-rule rounded-md overflow-hidden">
            <div className="p-6 border-b border-rule bg-paper-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Send className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-display text-xl text-ink">Share the News</h3>
                    <p className="text-sm text-ink-muted mt-0.5">
                      A ready-to-send email for clients &amp; stakeholders, plus a LinkedIn post for your followers.
                    </p>
                  </div>
                </div>
                {release.announcement_content && (
                  <button
                    onClick={handleGenerateAnnouncement}
                    disabled={generatingAnnouncement}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink border border-rule rounded-sm hover:bg-paper transition-colors disabled:opacity-50"
                  >
                    {generatingAnnouncement ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Regenerate
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 bg-paper-light">
              {!release.announcement_content ? (
                <div className="text-center py-8">
                  <Send className="h-10 w-10 text-ink-muted/40 mx-auto mb-3" />
                  <h4 className="font-display text-lg text-ink mb-2">Spread the word beyond the press</h4>
                  <p className="text-sm text-ink-muted mb-1 max-w-md mx-auto">
                    We&apos;ll generate a stakeholder announcement email and a LinkedIn post so you can share your news with clients, partners, and followers.
                  </p>
                  <p className="text-xs text-ink-muted mb-5">
                    Copy them and send directly — no editing needed.
                  </p>
                  <Button
                    onClick={handleGenerateAnnouncement}
                    disabled={generatingAnnouncement}
                    className="bg-primary hover:bg-primary-700 rounded-sm"
                  >
                    {generatingAnnouncement ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Send className="h-4 w-4 mr-2" /> Generate Announcements</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Client / Stakeholder Email */}
                  {release.announcement_content.clientEmail && (
                    <div className="border border-rule rounded-sm bg-paper">
                      <div className="px-4 py-3 border-b border-rule flex items-center justify-between">
                        <div>
                          <span className="font-display text-sm text-ink font-semibold">Stakeholder Announcement Email</span>
                          <span className="text-ink-muted text-sm"> &mdash; </span>
                          <span className="text-sm text-ink-muted">Clients, partners &amp; investors</span>
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-muted bg-paper-light border border-rule px-2 py-0.5 rounded-sm">
                          email
                        </span>
                      </div>
                      <div className="px-4 py-3 space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-muted">Subject</span>
                            <button
                              onClick={() => copyAnnouncementText(release.announcement_content!.clientEmail!.subject, 'email-subject')}
                              className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition-colors"
                            >
                              {copiedAnnouncement === 'email-subject' ? (
                                <><Check className="h-3 w-3 text-green-600" /> Copied</>
                              ) : (
                                <><Copy className="h-3 w-3" /> Copy</>
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-ink font-semibold">{release.announcement_content.clientEmail.subject}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-muted">Body</span>
                            <button
                              onClick={() => copyAnnouncementText(release.announcement_content!.clientEmail!.body, 'email-body')}
                              className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition-colors"
                            >
                              {copiedAnnouncement === 'email-body' ? (
                                <><Check className="h-3 w-3 text-green-600" /> Copied</>
                              ) : (
                                <><Copy className="h-3 w-3" /> Copy</>
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{release.announcement_content.clientEmail.body}</p>
                        </div>
                        <div className="pt-2 border-t border-rule">
                          <a
                            href={`mailto:?subject=${encodeURIComponent(release.announcement_content.clientEmail.subject)}&body=${encodeURIComponent(release.announcement_content.clientEmail.body)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary-700 border border-primary/30 rounded-sm hover:bg-primary/5 transition-colors"
                          >
                            <Mail className="h-3 w-3" />
                            Send via Email
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Post */}
                  {release.announcement_content.linkedInPost && (
                    <div className="border border-rule rounded-sm bg-paper">
                      <div className="px-4 py-3 border-b border-rule flex items-center justify-between">
                        <div>
                          <span className="font-display text-sm text-ink font-semibold">LinkedIn Post</span>
                          <span className="text-ink-muted text-sm"> &mdash; </span>
                          <span className="text-sm text-ink-muted">Share with your followers</span>
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-muted bg-paper-light border border-rule px-2 py-0.5 rounded-sm">
                          linkedin
                        </span>
                      </div>
                      <div className="px-4 py-3 space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-muted">Post</span>
                            <button
                              onClick={() => copyAnnouncementText(release.announcement_content!.linkedInPost!, 'linkedin')}
                              className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition-colors"
                            >
                              {copiedAnnouncement === 'linkedin' ? (
                                <><Check className="h-3 w-3 text-green-600" /> Copied</>
                              ) : (
                                <><Copy className="h-3 w-3" /> Copy</>
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{release.announcement_content.linkedInPost}</p>
                        </div>
                        <div className="pt-2 border-t border-rule flex gap-2">
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(release.company_website || '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary-700 border border-primary/30 rounded-sm hover:bg-primary/5 transition-colors"
                          >
                            <Send className="h-3 w-3" />
                            Open LinkedIn
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Publish CTA */}
          <div className="no-print mt-12 border border-rule rounded-md overflow-hidden">
            <div className="bg-ink p-8 text-center">
              <h3 className="font-display text-3xl text-paper-light mb-3">Publish to the Media</h3>
              <p className="text-paper-light/70 mb-0 max-w-xl mx-auto">
                Get your story in front of the people who matter.
              </p>
            </div>
            <div className="p-8 bg-paper-light">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="font-display text-3xl text-primary mb-1">1,000+</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">Journalists</div>
                  <p className="text-sm text-ink-muted">Your release is emailed directly to opted-in journalists covering {release.industry || 'your industry'} — real inboxes, real people.</p>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl text-secondary mb-1">50+</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">Partner Sites</div>
                  <p className="text-sm text-ink-muted">Published on PRBuild Showcase and distributed to our network of industry news sites and syndication partners.</p>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl text-ink mb-1">24hr</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">Social & Digest</div>
                  <p className="text-sm text-ink-muted">Featured in our weekly industry newsletter and shared across social media channels reaching thousands of professionals.</p>
                </div>
              </div>

              <div className="border-t border-rule pt-6 text-center">
                {release.status === 'published' ? (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Your release has been published and distributed!</span>
                  </div>
                ) : release.status === 'client_approved' ? (
                  <div>
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-3">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Submitted for publication!</span>
                    </div>
                    <p className="text-sm text-ink-muted mb-4">Our team is reviewing your release and will distribute it to our journalist network within 24 hours.</p>
                    <Button
                      onClick={() => setShowDisclaimer(true)}
                      variant="outline"
                      className="border-rule text-ink-muted hover:text-ink rounded-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" /> View Publication Authorization
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={() => setShowDisclaimer(true)}
                      className="bg-primary hover:bg-primary-700 rounded-sm text-lg px-10 py-3"
                      size="lg"
                    >
                      <Send className="h-5 w-5 mr-2" /> Publish to Media
                    </Button>
                    <p className="text-xs text-ink-muted mt-3">
                      You&apos;ll be asked to review and sign a publication authorization before distribution.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publication Authorization Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 backdrop-blur-sm no-print">
          <div className="bg-paper-light border border-rule rounded-md max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-rule">
              <h3 className="font-display text-xl text-ink">Publication Authorization</h3>
              <p className="text-sm text-ink-muted mt-1">Please review and sign before distribution.</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Disclaimer text */}
              <div className="bg-paper border border-rule rounded-md p-4 text-xs text-ink-muted leading-relaxed max-h-48 overflow-y-auto">
                <p className="font-semibold text-ink mb-2">Publication Agreement &amp; Indemnification</p>
                <p className="mb-2">By authorizing this press release for publication, I represent and warrant that:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>All information contained in this press release is true, accurate, and not misleading.</li>
                  <li>I have obtained all necessary permissions, consents, and authorizations from all parties mentioned, quoted, or referenced in this press release.</li>
                  <li>The publication of this material does not infringe upon any copyright, trademark, trade secret, right of privacy, right of publicity, or any other right of any third party.</li>
                  <li>I have the authority to authorize distribution of this content on behalf of the company or organization named in the release.</li>
                </ol>
                <p className="mt-2 font-semibold text-ink">Indemnification:</p>
                <p>I agree to indemnify, defend, and hold harmless PRBuild.ai, its owners, officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from or related to: (a) the content of this press release; (b) any breach of the warranties above; (c) any claim by a third party related to the publication or distribution of this material. This indemnification obligation survives the publication and any subsequent removal of the press release.</p>
              </div>

              {/* Signature fields */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={sigName}
                  onChange={(e) => setSigName(e.target.value)}
                  placeholder="Your full legal name (serves as digital signature)"
                  className="w-full px-3 py-2 border border-rule rounded-sm bg-paper text-ink text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Email Address *</label>
                <input
                  type="email"
                  value={sigEmail}
                  onChange={(e) => setSigEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-rule rounded-sm bg-paper text-ink text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={sigPhone}
                  onChange={(e) => setSigPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-rule rounded-sm bg-paper text-ink text-sm"
                />
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-3 p-3 border border-rule rounded-sm bg-paper cursor-pointer">
                <input
                  type="checkbox"
                  checked={sigAgreed}
                  onChange={(e) => setSigAgreed(e.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                <span className="text-sm text-ink leading-relaxed">
                  I have read and agree to the Publication Agreement &amp; Indemnification terms above. I confirm that all content is accurate, I have all necessary permissions, and I accept full responsibility for this press release.
                </span>
              </label>
            </div>

            <div className="p-6 border-t border-rule flex gap-3">
              <Button
                onClick={handlePublishToMedia}
                disabled={publishing || !sigAgreed || !sigName || !sigEmail || !sigPhone}
                className="bg-primary hover:bg-primary-700 rounded-sm flex-1"
              >
                {publishing ? (
                  <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" /> Submitting...</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Authorize &amp; Publish</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDisclaimer(false)}
                className="rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
