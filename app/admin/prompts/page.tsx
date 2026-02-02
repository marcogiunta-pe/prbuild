'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Loader2, 
  FileText, 
  Users, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  History,
  Wand2
} from 'lucide-react';

interface PromptConfig {
  id: string;
  prompt_key: string;
  prompt_name: string;
  prompt_description: string;
  system_prompt: string;
  user_prompt_template: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

const DEFAULT_PROMPTS = {
  pr_generation: {
    prompt_key: 'pr_generation',
    prompt_name: 'Press Release Generation',
    prompt_description: 'System prompt for AI-generated press release drafts',
    system_prompt: `You are a professional journalist and press release writer. I will give you the facts of an announcement; your job is to produce a newsworthy press release in a journalistic style using the structure and rules below. Think step by step.

Required output format and content (produce all items listed):
1) Three headline options (concise, attention-grabbing — 8–12 words each).
2) Single-line subhead (optional — one sentence expanding the headline).
3) Dateline: CITY, STATE/COUNTRY — Month Day, Year.
4) Lead paragraph (1 concise paragraph answering who, what, where, when, why, how).
5) Body (2–3 short paragraphs) expanding the "what" and "why," including one or two key statistics or details from the provided facts. Keep sentences short and every sentence meaningful.
6) Quotes: include 1–2 attributed quotes (name — title). Use provided quotes verbatim if given; otherwise create realistic, relevant quotes and mark them as "Suggested quote" if asked to review later.
7) Boilerplate: one paragraph (50–75 words) about the company.
8) Media contact block: name, title, phone, email, website.
9) Call to Action (1 clear, specific next step and link or contact).
10) Visuals suggestions: list up to three suggested multimedia elements (file type, short caption, credit/credit line).
11) Distribution checklist (3–4 bullets) to avoid common distribution mistakes (length, targeting, newsworthiness, contact info).

Style and hard rules:
- Write entirely in third person. Do not use the words you, we, our, us, I outside of quoted text.
- Journalistic tone: objective, clear, concise. No marketing fluff.
- Keep the entire press release between ~300–450 words; hard cap 600 words.
- Use plain English: short paragraphs (1–3 sentences each).
- Use proper dateline format and place it at the start of the lead paragraph.
- Flag any invented or suggested content clearly (e.g., "Suggested quote").
- Deliver press release text only (followed by the visuals list and distribution checklist). Do not include unrelated commentary.

Quality checks before finishing:
- Confirm headline accurately reflects main news hook.
- Ensure the lead answers who/what/when/where/why/how.
- Verify contact info is present and complete.
- Check for and remove any first-person or direct-address language outside quotes.

Output structure:
- Headline options (3)
- Subhead (1)
- Dateline + Lead paragraph
- Body paragraph 1
- Body paragraph 2
- Quote(s)
- Boilerplate
- Media contact
- Call to Action
- Visuals suggestions
- Distribution checklist`,
    user_prompt_template: `Please produce a press release based on the following announcement details:

**Company / Organization Name:**
{{companyName}}

**Company Website:**
{{companyWebsite}}

**Announcement Type:**
{{announcementType}}

**Key News Hook (one-sentence summary of why this is newsworthy):**
{{newsHook}}

**Dateline:**
{{dateline}} — {{releaseDate}}

**Core Facts (ranked by importance):**
{{coreFacts}}

**Quote Sources:**
{{quoteSources}}

**Boilerplate Copy / Company Facts:**
{{boilerplate}}

**Media Contact:**
Name: {{mediaContactName}}
{{mediaContactTitle}}
Phone: {{mediaContactPhone}}
Email: {{mediaContactEmail}}
Website: {{mediaContactWebsite}}

**Visuals Available:**
{{visuals}}

**Desired Call to Action:**
{{desiredCTA}}

{{supportingContext}}

Now produce the complete press release and all supporting items as specified in your instructions.`,
  },
  panel_critique: {
    prompt_key: 'panel_critique',
    prompt_name: 'Panel Critique (Focus Group)',
    prompt_description: 'System prompt for the AI journalist panel review',
    system_prompt: `Act as a structured review panel evaluating the following press release.

Panel composition:
* 5 journalists (health policy, state government, rural health, investigative health, health innovation)
* 3 professional press release writers (agency, corporate comms, former newsroom editor)
* 3 senior marketing experts (B2G, healthcare growth, positioning)
* 5 distinct target customers (Governor office policy staffer, State Medicaid director, rural hospital CEO, public health foundation executive, health plan executive)

For each persona:
* Assign a realistic first name and only the first letter of the last name.
* Respond independently in the voice of that role.
* Be critical and specific. No politeness. No hedging.

Step 1: Individual Feedback

Provide concise feedback from each persona answering:
* Would this be compelling to you. Why or why not.
* What is missing that would force action.
* One sentence on how this fails or succeeds for your role.

Step 2: Synthesis

Identify the top 3 recurring themes or conflicts across all responses.
* Call out alignment and disagreement explicitly.
* Avoid generic summaries.

Step 3: Contrarian Recommendation

Provide a recommended action plan that intentionally goes against the current press release consensus, including:
* What to remove.
* What to sharpen.
* What risk to take that the current draft avoids.
* Who this revised release should deliberately ignore.

Rules:
* No marketing buzzwords unless criticizing them.
* Short sentences. Clear thinking.
* Prioritize tension, urgency, and decision making.
* Output only the analysis. No rewriting unless asked.`,
    user_prompt_template: `Please review and critique the following press release:

---

{{pressRelease}}

---

Provide your complete panel analysis as specified in your instructions.`,
  },
  rewrite_from_feedback: {
    prompt_key: 'rewrite_from_feedback',
    prompt_name: 'Rewrite from Panel Feedback',
    prompt_description: 'System prompt for rewriting drafts based on panel critique',
    system_prompt: `You are a professional press release editor. Your task is to rewrite the press release based on the panel feedback provided.

Rules:
- Address the specific concerns raised by the panel
- Maintain the core message and facts
- Improve clarity and impact
- Keep the journalistic tone
- Stay within 300-500 words
- Format the output as clean HTML with proper paragraph tags`,
    user_prompt_template: `Original Press Release:
{{originalDraft}}

Panel Feedback Summary:
{{panelSynthesis}}

Key Issues to Address:
{{keyIssues}}

Please rewrite the press release addressing the feedback while maintaining the core message. Output as clean HTML.`,
  },
};

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pr_generation');
  const [editedPrompts, setEditedPrompts] = useState<Record<string, Partial<PromptConfig>>>({});

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('prompt_configs')
        .select('*')
        .eq('is_active', true)
        .order('prompt_key');

      if (error) {
        console.error('Error loading prompts:', error);
        // Table might not exist - use defaults in memory
        useInMemoryDefaults();
        return;
      }

      if (data && data.length > 0) {
        setPrompts(data);
      } else {
        // Initialize with defaults if no prompts exist
        await initializeDefaults();
      }
    } catch (err) {
      console.error('Failed to load prompts:', err);
      useInMemoryDefaults();
    }
    
    setLoading(false);
  };

  const useInMemoryDefaults = () => {
    // Use defaults without database - for when table doesn't exist
    const defaultPrompts = Object.entries(DEFAULT_PROMPTS).map(([key, p]) => ({
      id: key,
      ...p,
      is_active: true,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    setPrompts(defaultPrompts as PromptConfig[]);
    setLoading(false);
  };

  const initializeDefaults = async () => {
    const supabase = createClient();
    const promptsToInsert = Object.values(DEFAULT_PROMPTS).map(p => ({
      ...p,
      is_active: true,
      version: 1,
    }));

    try {
      const { data, error } = await supabase
        .from('prompt_configs')
        .insert(promptsToInsert)
        .select();

      if (data) {
        setPrompts(data);
      } else if (error) {
        console.error('Error initializing prompts:', error);
        useInMemoryDefaults();
      }
    } catch (err) {
      console.error('Failed to initialize prompts:', err);
      useInMemoryDefaults();
    }
  };

  const handleChange = (promptKey: string, field: keyof PromptConfig, value: string) => {
    setEditedPrompts(prev => ({
      ...prev,
      [promptKey]: {
        ...prev[promptKey],
        [field]: value,
      },
    }));
  };

  const savePrompt = async (promptKey: string) => {
    const prompt = prompts.find(p => p.prompt_key === promptKey);
    const edits = editedPrompts[promptKey];
    
    if (!prompt || !edits) return;

    setSaving(promptKey);
    const supabase = createClient();

    const { error } = await supabase
      .from('prompt_configs')
      .update({
        ...edits,
        version: prompt.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', prompt.id);

    if (!error) {
      setSuccess(promptKey);
      setTimeout(() => setSuccess(null), 3000);
      setEditedPrompts(prev => {
        const { [promptKey]: _, ...rest } = prev;
        return rest;
      });
      await loadPrompts();
    }

    setSaving(null);
  };

  const resetToDefault = async (promptKey: string) => {
    if (!confirm('Reset this prompt to the default? Your changes will be lost.')) return;
    
    const defaultPrompt = DEFAULT_PROMPTS[promptKey as keyof typeof DEFAULT_PROMPTS];
    if (!defaultPrompt) return;

    const prompt = prompts.find(p => p.prompt_key === promptKey);
    if (!prompt) return;

    setSaving(promptKey);
    const supabase = createClient();

    const { error } = await supabase
      .from('prompt_configs')
      .update({
        system_prompt: defaultPrompt.system_prompt,
        user_prompt_template: defaultPrompt.user_prompt_template,
        version: prompt.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', prompt.id);

    if (!error) {
      setEditedPrompts(prev => {
        const { [promptKey]: _, ...rest } = prev;
        return rest;
      });
      await loadPrompts();
    }

    setSaving(null);
  };

  const getCurrentValue = (prompt: PromptConfig, field: keyof PromptConfig): string => {
    const edited = editedPrompts[prompt.prompt_key];
    if (edited && field in edited) {
      return edited[field] as string;
    }
    return prompt[field] as string;
  };

  const hasChanges = (promptKey: string): boolean => {
    return !!editedPrompts[promptKey] && Object.keys(editedPrompts[promptKey]).length > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activePrompt = prompts.find(p => p.prompt_key === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Prompts</h1>
        <p className="text-gray-600 mt-1">
          Customize the AI prompts that drive press release generation and panel reviews
        </p>
      </div>

      {/* Warning Banner */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Edit with care</p>
            <p className="text-sm text-yellow-700">
              Changes to prompts affect all future generations. Test thoroughly after making changes.
              You can always reset to defaults if needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prompt Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Prompt to Edit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prompts.map(prompt => {
              const isActive = activeTab === prompt.prompt_key;
              return (
                <button
                  key={prompt.prompt_key}
                  onClick={() => setActiveTab(prompt.prompt_key)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {prompt.prompt_key === 'pr_generation' && (
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-gray-100'}`}>
                        <FileText className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
                      </div>
                    )}
                    {prompt.prompt_key === 'panel_critique' && (
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-gray-100'}`}>
                        <Users className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
                      </div>
                    )}
                    {prompt.prompt_key === 'rewrite_from_feedback' && (
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-gray-100'}`}>
                        <Wand2 className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
                      </div>
                    )}
                    <div>
                      <p className={`font-semibold ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                        {prompt.prompt_name}
                      </p>
                      <p className="text-xs text-gray-500">v{prompt.version}</p>
                    </div>
                    {hasChanges(prompt.prompt_key) && (
                      <span className="ml-auto w-3 h-3 bg-orange-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {prompt.prompt_description}
                  </p>
                </button>
              );
            })}
          </div>
          
          {prompts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Wand2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No prompts found</p>
              <p className="text-sm mt-1">Run the SQL migration to create the prompt_configs table</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Prompt Editor */}
      {activePrompt && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{activePrompt.prompt_name}</CardTitle>
                  <CardDescription>{activePrompt.prompt_description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <History className="h-3 w-3 mr-1" />
                    v{activePrompt.version}
                  </Badge>
                  {success === activePrompt.prompt_key && (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Saved
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Name */}
              <div className="space-y-2">
                <Label>Prompt Name</Label>
                <Input
                  value={getCurrentValue(activePrompt, 'prompt_name')}
                  onChange={(e) => handleChange(activePrompt.prompt_key, 'prompt_name', e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={getCurrentValue(activePrompt, 'prompt_description')}
                  onChange={(e) => handleChange(activePrompt.prompt_key, 'prompt_description', e.target.value)}
                />
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>System Prompt</Label>
                  <span className="text-xs text-gray-500">
                    This sets the AI's role and behavior
                  </span>
                </div>
                <Textarea
                  value={getCurrentValue(activePrompt, 'system_prompt')}
                  onChange={(e) => handleChange(activePrompt.prompt_key, 'system_prompt', e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              {/* User Prompt Template */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>User Prompt Template</Label>
                  <span className="text-xs text-gray-500">
                    Use {'{{variable}}'} for dynamic content
                  </span>
                </div>
                <Textarea
                  value={getCurrentValue(activePrompt, 'user_prompt_template')}
                  onChange={(e) => handleChange(activePrompt.prompt_key, 'user_prompt_template', e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Available variables: {activePrompt.prompt_key === 'pr_generation' 
                    ? 'companyName, companyWebsite, announcementType, newsHook, dateline, releaseDate, coreFacts, quoteSources, boilerplate, mediaContactName, mediaContactTitle, mediaContactPhone, mediaContactEmail, mediaContactWebsite, visuals, desiredCTA, supportingContext'
                    : activePrompt.prompt_key === 'panel_critique'
                    ? 'pressRelease'
                    : 'originalDraft, panelSynthesis, keyIssues'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => resetToDefault(activePrompt.prompt_key)}
                  disabled={saving === activePrompt.prompt_key}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
                <Button
                  onClick={() => savePrompt(activePrompt.prompt_key)}
                  disabled={!hasChanges(activePrompt.prompt_key) || saving === activePrompt.prompt_key}
                >
                  {saving === activePrompt.prompt_key ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <p className="text-xs text-gray-500 text-right">
            Last updated: {new Date(activePrompt.updated_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
