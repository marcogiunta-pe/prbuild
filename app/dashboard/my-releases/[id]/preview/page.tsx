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
  Download,
  CheckCircle,
} from 'lucide-react';
import { ReleaseRequest } from '@/types';
import { format } from 'date-fns';

export default function ReleasePreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [release, setRelease] = useState<ReleaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);

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

  const finalContent = release?.client_edited_content || release?.admin_refined_content || release?.ai_draft_content || '';
  const headline = release?.ai_selected_headline || release?.news_hook || 'Press Release';
  const subhead = release?.ai_subhead || '';

  const getPlainText = () => {
    // Strip HTML tags for plain text copy
    let text = finalContent
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .trim();

    return `${headline}\n${subhead ? subhead + '\n' : ''}\n${text}\n\nMedia Contact:\n${release?.media_contact_name || ''}${release?.media_contact_title ? ', ' + release.media_contact_title : ''}\nEmail: ${release?.media_contact_email || ''}\n${release?.media_contact_phone ? 'Phone: ' + release.media_contact_phone : ''}\n${release?.company_website ? 'Website: ' + release.company_website : ''}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  const handleEmail = () => {
    const subject = encodeURIComponent(headline);
    const body = encodeURIComponent(getPlainText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handlePublishToMedia = async () => {
    if (!release) return;
    setPublishing(true);
    const supabase = createClient();

    // Update status to client_approved (admin publishes to showcase)
    await supabase
      .from('release_requests')
      .update({
        status: 'client_approved',
        final_content: finalContent,
        final_approved_at: new Date().toISOString(),
      })
      .eq('id', release.id);

    setPublishing(false);
    router.push(`/dashboard/my-releases/${release.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-paper">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!release) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-muted">Release not found.</p>
        <Link href="/dashboard/my-releases" className="text-primary hover:underline mt-2 inline-block">Back to releases</Link>
      </div>
    );
  }

  // Render content — handle both HTML and markdown
  const isHtml = /<(?:p|div|h[1-6]|ul|ol|li|br|table|blockquote)[\s>]/i.test(finalContent);
  const renderedContent = isHtml
    ? finalContent.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
    : finalContent
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/^\s*\(\d+\)\s*/gm, '')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p style="margin-bottom:1em;">')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p style="margin-bottom:1em;">')
        .replace(/$/, '</p>');

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-content { max-width: 100% !important; padding: 0 !important; }
        }
      `}</style>

      <div className="min-h-screen bg-paper">
        {/* Action bar */}
        <div className="no-print sticky top-0 z-50 bg-ink text-paper-light border-b border-paper-light/10">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href={`/dashboard/my-releases/${params.id}`}
              className="flex items-center gap-2 text-sm text-paper-light/60 hover:text-paper-light transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to release
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-paper-light/70 hover:text-paper-light border border-paper-light/20 rounded-sm hover:bg-paper-light/10 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
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
              prose-a:text-primary prose-a:underline"
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

          {/* Footer */}
          <div className="border-t border-rule pt-6 text-center">
            <p className="font-mono text-xs text-ink-muted">###</p>
          </div>

          {/* Publish CTA */}
          <div className="no-print mt-12 p-8 bg-paper-light border border-rule rounded-md text-center">
            <h3 className="font-display text-2xl text-ink mb-2">Ready to share with the world?</h3>
            <p className="text-ink-muted mb-6 max-w-lg mx-auto">
              Publishing sends your press release to our journalist network and adds it to the PRBuild Showcase. Journalists who cover {release.industry || 'your industry'} will receive it directly.
            </p>
            <Button
              onClick={handlePublishToMedia}
              disabled={publishing || release.status === 'client_approved' || release.status === 'published'}
              className="bg-primary hover:bg-primary-700 rounded-sm text-lg px-8 py-3"
              size="lg"
            >
              {publishing ? (
                <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" /> Publishing...</>
              ) : release.status === 'client_approved' || release.status === 'published' ? (
                <><CheckCircle className="h-5 w-5 mr-2" /> Published</>
              ) : (
                <><Send className="h-5 w-5 mr-2" /> Publish to Media</>
              )}
            </Button>
            {(release.status === 'client_approved') && (
              <p className="text-sm text-green-600 mt-3 flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Your release is in the publication queue. Our team will publish it shortly.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
