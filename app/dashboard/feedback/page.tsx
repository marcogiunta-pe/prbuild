'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  ThumbsUp, 
  Send, 
  Loader2, 
  CheckCircle, 
  Clock, 
  Sparkles,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { FeatureRequest, FeatureRequestStatus } from '@/types';

const statusConfig: Record<FeatureRequestStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending Review', color: 'bg-gray-100 text-gray-700', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700', icon: MessageSquare },
  planned: { label: 'Planned', color: 'bg-purple-100 text-purple-700', icon: TrendingUp },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Sparkles },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-700', icon: Clock },
};

export default function FeedbackPage() {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [filter, setFilter] = useState<'all' | 'top' | 'completed'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
    
    // Get feature requests with vote info
    const { data: featuresData } = await supabase
      .from('feature_requests')
      .select(`
        *,
        submitter:profiles!feature_requests_submitted_by_fkey(email, full_name)
      `)
      .order('vote_count', { ascending: false });

    if (featuresData && user) {
      // Check which ones user voted for
      const { data: votes } = await supabase
        .from('feature_votes')
        .select('feature_request_id')
        .eq('user_id', user.id);

      const votedIds = new Set(votes?.map(v => v.feature_request_id) || []);
      
      setRequests(featuresData.map(f => ({
        ...f,
        user_voted: votedIds.has(f.id)
      })));
    } else {
      setRequests(featuresData || []);
    }
    
    setLoading(false);
  };

  const submitRequest = async () => {
    if (!newTitle.trim() || !newDescription.trim() || !userId) return;
    
    setSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('feature_requests')
      .insert({
        title: newTitle.trim(),
        description: newDescription.trim(),
        submitted_by: userId,
        status: 'pending',
        vote_count: 1, // Auto-vote for your own idea
      });

    if (!error) {
      // Auto-vote for your own submission
      await supabase
        .from('feature_votes')
        .insert({
          feature_request_id: (await supabase.from('feature_requests').select('id').eq('title', newTitle.trim()).single()).data?.id,
          user_id: userId,
        });
      
      setNewTitle('');
      setNewDescription('');
      setShowForm(false);
      await loadData();
    }
    
    setSubmitting(false);
  };

  const toggleVote = async (featureId: string, currentlyVoted: boolean) => {
    if (!userId) return;
    
    setVoting(featureId);
    const supabase = createClient();
    
    if (currentlyVoted) {
      // Remove vote
      await supabase
        .from('feature_votes')
        .delete()
        .eq('feature_request_id', featureId)
        .eq('user_id', userId);
      
      await supabase
        .from('feature_requests')
        .update({ vote_count: requests.find(r => r.id === featureId)!.vote_count - 1 })
        .eq('id', featureId);
    } else {
      // Add vote
      await supabase
        .from('feature_votes')
        .insert({ feature_request_id: featureId, user_id: userId });
      
      await supabase
        .from('feature_requests')
        .update({ vote_count: requests.find(r => r.id === featureId)!.vote_count + 1 })
        .eq('id', featureId);
    }
    
    await loadData();
    setVoting(null);
  };

  const filteredRequests = requests.filter(r => {
    if (filter === 'completed') return r.status === 'completed';
    if (filter === 'top') return r.vote_count >= 3;
    return r.status !== 'completed' && r.status !== 'declined';
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Feedback</h1>
          <p className="text-gray-600 mt-1">
            Suggest features, vote on ideas, and track what we're building
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Lightbulb className="h-4 w-4 mr-2" />
          Suggest Feature
        </Button>
      </div>

      {/* Submit Form */}
      {showForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Share Your Idea</CardTitle>
            <CardDescription>
              What would make PRBuild better for you?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Feature title (e.g., 'Add PDF export')"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={100}
              />
            </div>
            <div>
              <Textarea
                placeholder="Describe your idea in detail. Why would this be helpful?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={submitRequest} 
                disabled={!newTitle.trim() || !newDescription.trim() || submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Submit Idea
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Ideas
        </Button>
        <Button 
          variant={filter === 'top' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('top')}
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          Top Voted
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('completed')}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Completed
        </Button>
      </div>

      {/* Feature Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              {filter === 'completed' 
                ? 'No completed features yet. Stay tuned!'
                : filter === 'top'
                ? 'No highly-voted features yet. Vote on ideas you like!'
                : 'No feature requests yet. Be the first to suggest something!'}
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map(request => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;
            
            return (
              <Card key={request.id} className={request.status === 'completed' ? 'border-green-200 bg-green-50/50' : ''}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Vote Button */}
                    <div className="flex flex-col items-center">
                      <Button
                        variant={request.user_voted ? 'default' : 'outline'}
                        size="sm"
                        className="h-12 w-12 flex-col"
                        onClick={() => toggleVote(request.id, request.user_voted || false)}
                        disabled={voting === request.id}
                      >
                        {voting === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ThumbsUp className={`h-4 w-4 ${request.user_voted ? 'fill-current' : ''}`} />
                            <span className="text-xs mt-1">{request.vote_count}</span>
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900">{request.title}</h3>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-1 text-sm">{request.description}</p>
                      
                      {/* Admin Response */}
                      {request.admin_response && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs font-medium text-blue-800 mb-1">Response from PRBuild team:</p>
                          <p className="text-sm text-blue-700">{request.admin_response}</p>
                        </div>
                      )}
                      
                      {/* Completion Notice */}
                      {request.status === 'completed' && request.completed_at && (
                        <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
                          <p className="text-sm text-green-800 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            This feature has been implemented!
                          </p>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-2">
                        Suggested by {(request.submitter as any)?.full_name || (request.submitter as any)?.email || 'Anonymous'} • {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
