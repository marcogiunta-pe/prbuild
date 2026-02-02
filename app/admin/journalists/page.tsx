'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Mail, 
  CheckCircle, 
  Clock, 
  Trash2, 
  PlusCircle,
  Search,
  Loader2
} from 'lucide-react';
import { JournalistSubscriber } from '@/types';

export default function AdminJournalistsPage() {
  const [journalists, setJournalists] = useState<JournalistSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJournalist, setNewJournalist] = useState({
    email: '',
    name: '',
    outlet: '',
    beat: '',
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadJournalists();
  }, []);

  const loadJournalists = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('journalist_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setJournalists(data);
    }
    setLoading(false);
  };

  const handleAddJournalist = async () => {
    if (!newJournalist.email) return;
    
    setAdding(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('journalist_subscribers')
      .insert({
        email: newJournalist.email,
        name: newJournalist.name || null,
        outlet: newJournalist.outlet || null,
        beat: newJournalist.beat || null,
        categories: [],
        frequency: 'weekly',
        is_verified: true, // Admin-added journalists are pre-verified
      });

    if (!error) {
      await loadJournalists();
      setNewJournalist({ email: '', name: '', outlet: '', beat: '' });
      setShowAddForm(false);
    }
    setAdding(false);
  };

  const handleDeleteJournalist = async (id: string) => {
    if (!confirm('Are you sure you want to remove this journalist?')) return;
    
    const supabase = createClient();
    await supabase
      .from('journalist_subscribers')
      .delete()
      .eq('id', id);

    await loadJournalists();
  };

  const filteredJournalists = journalists.filter(j => 
    j.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.outlet?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifiedCount = journalists.filter(j => j.is_verified).length;
  const pendingCount = journalists.filter(j => !j.is_verified).length;

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
          <h1 className="text-2xl font-bold">Journalist Subscribers</h1>
          <p className="text-slate-400 mt-1">Manage journalists who receive your releases</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-secondary hover:bg-secondary/90"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Journalist
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{journalists.length}</p>
                <p className="text-xs text-slate-400">Total Subscribers</p>
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
                <p className="text-2xl font-bold text-white">{verifiedCount}</p>
                <p className="text-xs text-slate-400">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
                <p className="text-xs text-slate-400">Pending Verification</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Journalist Form */}
      {showAddForm && (
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Add New Journalist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Email *</Label>
                <Input
                  type="email"
                  value={newJournalist.email}
                  onChange={(e) => setNewJournalist({ ...newJournalist, email: e.target.value })}
                  placeholder="journalist@outlet.com"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Name</Label>
                <Input
                  value={newJournalist.name}
                  onChange={(e) => setNewJournalist({ ...newJournalist, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Outlet</Label>
                <Input
                  value={newJournalist.outlet}
                  onChange={(e) => setNewJournalist({ ...newJournalist, outlet: e.target.value })}
                  placeholder="TechCrunch"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Beat</Label>
                <Input
                  value={newJournalist.beat}
                  onChange={(e) => setNewJournalist({ ...newJournalist, beat: e.target.value })}
                  placeholder="Technology"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddJournalist}
                disabled={adding || !newJournalist.email}
                className="bg-secondary hover:bg-secondary/90"
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Journalist
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="bg-slate-700 border-slate-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email, name, or outlet..."
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* Journalists List */}
      {filteredJournalists.length > 0 ? (
        <div className="space-y-3">
          {filteredJournalists.map((journalist) => (
            <Card key={journalist.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{journalist.name || journalist.email}</span>
                        {journalist.is_verified ? (
                          <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-400">
                        {journalist.email}
                        {journalist.outlet && ` • ${journalist.outlet}`}
                        {journalist.beat && ` • ${journalist.beat}`}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Frequency: {journalist.frequency} • 
                        Categories: {journalist.categories?.length || 0}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteJournalist(journalist.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchQuery ? 'No journalists found' : 'No journalists yet'}
            </h3>
            <p className="text-slate-400">
              {searchQuery ? 'Try a different search term' : 'Add journalists to start distributing releases'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
