'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  ThumbsUp, 
  Loader2, 
  CheckCircle, 
  Clock, 
  Sparkles,
  MessageSquare,
  TrendingUp,
  Send,
  Bell,
  X
} from 'lucide-react';
import { FeatureRequest, FeatureRequestStatus } from '@/types';

const statusConfig: Record<FeatureRequestStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700', icon: MessageSquare },
  planned: { label: 'Planned', color: 'bg-purple-100 text-purple-700', icon: TrendingUp },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Sparkles },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-700', icon: X },
};

const allStatuses: FeatureRequestStatus[] = ['pending', 'under_review', 'planned', 'in_progress', 'completed', 'declined'];

export default function AdminFeedbackPage() {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingResponse, setEditingResponse] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [filter, setFilter] = useState<FeatureRequestStatus | 'all'>('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('feature_requests')
      .select(`
        *,
        submitter:profiles!feature_requests_submitted_by_fkey(email, full_name)
      `)
      .order('vote_count', { ascending: false });

    setRequests(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: FeatureRequestStatus) => {
    setUpdating(id);
    const supabase = createClient();
    
    const updateData: any = { status: newStatus };
    if (newStatus === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('feature_requests')
      .update(updateData)
      .eq('id', id);

    if (!error) {
      // If completed, notify voters
      if (newStatus === 'completed') {
        await notifyVoters(id);
      }
      await loadRequests();
    }
    setUpdating(null);
  };

  const notifyVoters = async (featureId: string) => {
    // In a real app, you'd send emails to all voters
    // For now, we'll just log it
    console.log('Notifying voters for feature:', featureId);
    
    const supabase = createClient();
    const feature = requests.find(r => r.id === featureId);
    
    // Get all voters
    const { data: votes } = await supabase
      .from('feature_votes')
      .select('user_id')
      .eq('feature_request_id', featureId);

    if (votes && feature) {
      // Get voter emails
      const { data: profiles } = await supabase
        .from('profiles')
        .select('email')
        .in('id', votes.map(v => v.user_id));

      // Here you would send emails to each voter
      // For now, just show an alert
      alert(`Feature "${feature.title}" marked as completed! ${profiles?.length || 0} users would be notified.`);
    }
  };

  const saveResponse = async (id: string) => {
    setUpdating(id);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('feature_requests')
      .update({ admin_response: responseText })
      .eq('id', id);

    if (!error) {
      setEditingResponse(null);
      setResponseText('');
      await loadRequests();
    }
    setUpdating(null);
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feature Requests</h1>
        <p className="text-gray-600 mt-1">
          Manage user feedback and feature requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {allStatuses.map(status => {
          const count = requests.filter(r => r.status === status).length;
          const config = statusConfig[status];
          return (
            <Card 
              key={status} 
              className={`cursor-pointer transition-all ${filter === status ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setFilter(filter === status ? 'all' : status)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{count}</p>
                <Badge className={`${config.color} mt-1`} variant="secondary">
                  {config.label}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No feature requests {filter !== 'all' ? `with status "${statusConfig[filter].label}"` : 'yet'}
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map(request => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;
            
            return (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Vote Count */}
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-3 min-w-[60px]">
                      <ThumbsUp className="h-5 w-5 text-gray-600" />
                      <span className="text-xl font-bold">{request.vote_count}</span>
                      <span className="text-xs text-gray-500">votes</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            by {(request.submitter as any)?.full_name || (request.submitter as any)?.email || 'Anonymous'} • {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {/* Status Dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            value={request.status}
                            onChange={(e) => updateStatus(request.id, e.target.value as FeatureRequestStatus)}
                            disabled={updating === request.id}
                            className="text-sm border rounded px-2 py-1"
                          >
                            {allStatuses.map(s => (
                              <option key={s} value={s}>{statusConfig[s].label}</option>
                            ))}
                          </select>
                          {updating === request.id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mt-2 text-sm">{request.description}</p>
                      
                      {/* Admin Response */}
                      {editingResponse === request.id ? (
                        <div className="mt-3 space-y-2">
                          <Textarea
                            placeholder="Write a response to users..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => saveResponse(request.id)}
                              disabled={updating === request.id}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Save Response
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setEditingResponse(null);
                                setResponseText('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : request.admin_response ? (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-medium text-blue-800 mb-1">Your response:</p>
                              <p className="text-sm text-blue-700">{request.admin_response}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setEditingResponse(request.id);
                                setResponseText(request.admin_response || '');
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="mt-3"
                          onClick={() => {
                            setEditingResponse(request.id);
                            setResponseText('');
                          }}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Add Response
                        </Button>
                      )}
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
