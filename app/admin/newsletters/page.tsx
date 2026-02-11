'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle,
  Users,
  FileText,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

interface NewsletterSend {
  id: string;
  subject: string;
  category: string | null;
  release_ids: string[] | null;
  recipient_count: number | null;
  open_count: number;
  click_count: number;
  sent_at: string;
}

export default function AdminNewslettersPage() {
  const [newsletters, setNewsletters] = useState<NewsletterSend[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [newNewsletter, setNewNewsletter] = useState({
    subject: '',
    category: '',
    content: '',
  });

  useEffect(() => {
    loadNewsletters();
  }, []);

  const loadNewsletters = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('newsletter_sends')
      .select('id, subject, category, release_ids, recipient_count, open_count, click_count, sent_at')
      .order('sent_at', { ascending: false })
      .limit(100);

    if (data) {
      setNewsletters(data);
    }
    setLoading(false);
  };

  const handleSendNewsletter = async () => {
    if (!newNewsletter.subject) return;
    
    setSending(true);
    
    // In a real implementation, this would:
    // 1. Fetch journalists matching the category
    // 2. Send emails via Resend
    // 3. Log the send in the database
    
    const supabase = createClient();
    
    // For now, just log it
    const { error } = await supabase
      .from('newsletter_sends')
      .insert({
        subject: newNewsletter.subject,
        category: newNewsletter.category || null,
        recipient_count: 0,
        sent_at: new Date().toISOString(),
      });

    if (!error) {
      await loadNewsletters();
      setNewNewsletter({ subject: '', category: '', content: '' });
      setShowComposeForm(false);
    }
    setSending(false);
  };

  const totalSent = newsletters.length;
  const totalRecipients = newsletters.reduce((sum, n) => sum + (n.recipient_count || 0), 0);
  const totalOpens = newsletters.reduce((sum, n) => sum + n.open_count, 0);
  const totalClicks = newsletters.reduce((sum, n) => sum + n.click_count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Newsletter Management</h1>
          <p className="text-slate-400 mt-1">Send press release digests to journalists</p>
        </div>
        <Button 
          onClick={() => setShowComposeForm(true)}
          className="bg-secondary hover:bg-secondary/90"
        >
          <Mail className="h-4 w-4 mr-2" />
          Compose Newsletter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Send className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalSent}</p>
                <p className="text-xs text-slate-400">Newsletters Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalRecipients}</p>
                <p className="text-xs text-slate-400">Total Recipients</p>
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
                <p className="text-2xl font-bold text-white">{totalOpens}</p>
                <p className="text-xs text-slate-400">Total Opens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalClicks}</p>
                <p className="text-xs text-slate-400">Total Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compose Form */}
      {showComposeForm && (
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Compose Newsletter</CardTitle>
            <CardDescription className="text-slate-400">
              Create and send a newsletter to subscribed journalists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Subject Line *</Label>
                <Input
                  value={newNewsletter.subject}
                  onChange={(e) => setNewNewsletter({ ...newNewsletter, subject: e.target.value })}
                  placeholder="Weekly Tech Press Release Digest"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Category Filter (optional)</Label>
                <select
                  value={newNewsletter.category}
                  onChange={(e) => setNewNewsletter({ ...newNewsletter, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="">All Categories</option>
                  <option value="Technology & Software">Technology & Software</option>
                  <option value="Healthcare & Medical">Healthcare & Medical</option>
                  <option value="Finance & Fintech">Finance & Fintech</option>
                  <option value="Retail & Consumer">Retail & Consumer</option>
                </select>
              </div>
              <div>
                <Label className="text-slate-300">Additional Message (optional)</Label>
                <Textarea
                  value={newNewsletter.content}
                  onChange={(e) => setNewNewsletter({ ...newNewsletter, content: e.target.value })}
                  placeholder="Add a personal note to this newsletter..."
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSendNewsletter}
                  disabled={sending || !newNewsletter.subject}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Newsletter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowComposeForm(false)}
                  className="bg-slate-700 border-slate-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Newsletter History */}
      <h2 className="text-lg font-semibold mb-4">Newsletter History</h2>
      {newsletters.length > 0 ? (
        <div className="space-y-3">
          {newsletters.map((newsletter) => (
            <Card key={newsletter.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{newsletter.subject}</span>
                      {newsletter.category && (
                        <Badge className="bg-slate-700 text-slate-300">{newsletter.category}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-400">
                      Sent {format(new Date(newsletter.sent_at), 'PPp')}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-white font-medium">{newsletter.recipient_count || 0}</p>
                      <p className="text-slate-400 text-xs">Recipients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">{newsletter.open_count}</p>
                      <p className="text-slate-400 text-xs">Opens</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">{newsletter.click_count}</p>
                      <p className="text-slate-400 text-xs">Clicks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No newsletters sent yet</h3>
            <p className="text-slate-400">Your newsletter history will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
