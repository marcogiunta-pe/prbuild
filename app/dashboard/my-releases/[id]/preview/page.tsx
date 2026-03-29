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
} from 'lucide-react';
import { ReleaseRequest } from '@/types';

// Section labels the AI includes that should be stripped from display
const SECTION_LABELS = /^\s*(?:Headline(?:\s*Options?)?|Subhead|Dateline\s*\+?\s*Lead\s*(?:paragraph)?|Body(?:\s*paragraph\s*\d*)?|Quote(?:s)?|Boilerplate|Media\s*[Cc]ontact|Call\s*to\s*[Aa]ction|Visuals?\s*[Ss]uggestions?|Distribution\s*[Cc]hecklist)\s*$/i;

function cleanContent(raw: string): string {
  if (!raw) return '';
  return raw
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      // Remove section label lines
      if (SECTION_LABELS.test(trimmed)) return false;
      // Remove standalone (1), (2), (3) with optional **
      if (/^\s*\(?\d+\)?\s*\*{0,2}\s*$/.test(trimmed)) return false;
      // Remove lines that are just ** or - **
      if (/^\s*[-–]?\s*\*{2,}\s*$/.test(trimmed)) return false;
      // Remove numbered labels like "1." "2." "3." alone on a line
      if (/^\s*\d+\.\s*$/.test(trimmed)) return false;
      return true;
    })
    .join('\n')
    // Clean remaining inline artifacts
    .replace(/\(\d+\)\s*\*{0,2}\s*/g, '')
    .replace(/^\s*\*\*\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractHeadlineFromContent(content: string): string {
  if (!content) return '';
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Skip section labels
    if (SECTION_LABELS.test(line)) continue;
    // Skip artifacts like (1)** or standalone markers
    if (/^\s*\(?\d+\)?\s*\*{0,2}\s*$/.test(line)) continue;
    if (/^\s*[-–]?\s*\*{2,}\s*$/.test(line)) continue;
    // Skip very short lines
    if (line.length < 15) continue;

    // Found a real content line — extract text
    let headline = line
      .replace(/^\*\*(.+?)\*\*$/, '$1')  // **Headline**
      .replace(/^\*\*/, '').replace(/\*\*$/, '')
      .replace(/<[^>]+>/g, '')
      .trim();

    if (headline.length > 15) return headline;
  }

  // HTML fallback
  const h1Match = content.match(/<h1[^>]*>(.+?)<\/h1>/i);
  if (h1Match) return h1Match[1].replace(/<[^>]+>/g, '').trim();
  const strongMatch = content.match(/<strong>(.+?)<\/strong>/i);
  if (strongMatch && strongMatch[1].length > 15) return strongMatch[1].trim();

  return '';
}

function contentToHtml(content: string): string {
  if (!content) return '';
  // Already HTML
  if (/<(?:p|div|h[1-6]|ul|ol|li|br|table|blockquote)[\s>]/i.test(content)) {
    return content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/\(\d+\)\s*\*{0,2}/g, '');
  }
  // Clean section labels and artifacts first, then convert to HTML
  const cleaned = content
    .split('\n')
    .filter(line => !SECTION_LABELS.test(line.trim()))
    .filter(line => !/^\s*\(?\d+\)?\s*\*{0,2}\s*$/.test(line.trim()))
    .filter(line => !/^\s*[-–]?\s*\*{2,}\s*$/.test(line.trim()))
    .join('\n');

  let html = cleaned
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^\s*---+\s*$/gm, '<hr class="my-6 border-rule">')
    .replace(/^\s*\*\*\*+\s*$/gm, '<hr class="my-6 border-rule">')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n\n+/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>')
    .replace(/^\s*/, '<p class="mb-4">')
    .replace(/\s*$/, '</p>')
    .replace(/<p class="mb-4"><\/p>/g, '')
    .replace(/<p class="mb-4">\s*<\/p>/g, '')
    .replace(/<p class="mb-4">\s*<br>\s*<\/p>/g, '');
  return html;
}

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

  const renderedContent = contentToHtml(cleaned);

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
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Submitted for publication!</span>
                    </div>
                    <p className="text-sm text-ink-muted">Our team is reviewing your release and will distribute it to our journalist network within 24 hours.</p>
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
