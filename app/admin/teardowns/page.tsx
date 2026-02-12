'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TeardownSend } from '@/types';

export default function TeardownsPage() {
  const [teardowns, setTeardowns] = useState<TeardownSend[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  // Form state
  const [subject, setSubject] = useState('');
  const [prCompany, setPrCompany] = useState('');
  const [prHeadline, setPrHeadline] = useState('');
  const [teardownContent, setTeardownContent] = useState('');

  useEffect(() => {
    fetchTeardowns();
  }, []);

  async function fetchTeardowns() {
    try {
      const res = await fetch('/api/admin/teardowns');
      if (res.ok) {
        const data = await res.json();
        setTeardowns(data.teardowns || []);
      }
    } catch (err) {
      console.error('Failed to fetch teardowns:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!subject || !prCompany || !prHeadline || !teardownContent) return;

    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/admin/teardowns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, prCompany, prHeadline, teardownContent }),
      });

      const data = await res.json();

      if (res.ok) {
        setSendResult({
          success: true,
          message: `Sent to ${data.sentCount}/${data.totalLeads} subscribers.`,
        });
        setSubject('');
        setPrCompany('');
        setPrHeadline('');
        setTeardownContent('');
        fetchTeardowns();
      } else {
        setSendResult({ success: false, message: data.error || 'Failed to send' });
      }
    } catch (err) {
      setSendResult({ success: false, message: 'Network error' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Weekly PR Teardowns</h1>
        <p className="text-slate-400 mt-1">
          Compose and send the weekly PR teardown newsletter to all subscribed leads.
        </p>
      </div>

      {/* Compose form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Compose Teardown</h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Weekly PR Teardown: [Company]'s launch release"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                PR Company
              </label>
              <input
                type="text"
                value={prCompany}
                onChange={(e) => setPrCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                PR Headline
              </label>
              <input
                type="text"
                value={prHeadline}
                onChange={(e) => setPrHeadline(e.target.value)}
                placeholder="Acme Corp Launches Revolutionary AI Platform"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Teardown Content (HTML)
            </label>
            <textarea
              value={teardownContent}
              onChange={(e) => setTeardownContent(e.target.value)}
              placeholder="<h3>What worked</h3><p>...</p><h3>What didn't</h3><p>...</p><h3>Our verdict</h3><p>...</p>"
              rows={10}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-sm"
              required
            />
          </div>

          {sendResult && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                sendResult.success
                  ? 'bg-green-900/30 text-green-400 border border-green-800'
                  : 'bg-red-900/30 text-red-400 border border-red-800'
              }`}
            >
              {sendResult.success ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              {sendResult.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={sending}
            className="bg-secondary hover:bg-secondary/90"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Teardown to All Subscribers
          </Button>
        </form>
      </div>

      {/* Past sends */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Past Sends</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : teardowns.length === 0 ? (
          <p className="text-slate-500">No teardowns sent yet.</p>
        ) : (
          <div className="space-y-3">
            {teardowns.map((td) => (
              <div
                key={td.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{td.subject}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {td.pr_company} &mdash; {td.pr_headline}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-500 flex-shrink-0">
                    <p>{td.recipient_count} recipients</p>
                    <p>{new Date(td.sent_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
