// lib/prompts/index.ts
import { createClient } from '@/lib/supabase/server';
import { PR_GENERATION_SYSTEM_PROMPT, buildPRGenerationUserPrompt } from './pr-generation';
import { PANEL_CRITIQUE_SYSTEM_PROMPT, buildPanelCritiqueUserPrompt } from './panel-critique';

interface PromptConfig {
  prompt_key: string;
  system_prompt: string;
  user_prompt_template: string;
}

// Cache for prompts to avoid repeated DB calls
let promptCache: Record<string, PromptConfig> = {};
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute cache

export async function getPromptConfig(promptKey: string): Promise<PromptConfig | null> {
  // Check cache first
  const now = Date.now();
  if (promptCache[promptKey] && now - cacheTimestamp < CACHE_TTL) {
    return promptCache[promptKey];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('prompt_configs')
      .select('prompt_key, system_prompt, user_prompt_template')
      .eq('prompt_key', promptKey)
      .eq('is_active', true)
      .single();

    if (data) {
      promptCache[promptKey] = data;
      cacheTimestamp = now;
      return data;
    }
  } catch (error) {
    console.error('Error fetching prompt config:', error);
  }

  return null;
}

// Get PR Generation prompts - falls back to defaults if DB not available
export async function getPRGenerationPrompts(data: {
  companyName: string;
  companyWebsite: string;
  announcementType: string;
  newsHook: string;
  dateline: string;
  releaseDate: string;
  coreFacts: string[];
  quoteSources?: Array<{ name: string; title: string; quote?: string }>;
  boilerplate?: string;
  companyFacts?: string;
  mediaContact: {
    name: string;
    title?: string;
    phone?: string;
    email: string;
    website?: string;
  };
  visuals?: string;
  desiredCTA: string;
  supportingContext?: string;
}): Promise<{ systemPrompt: string; userPrompt: string }> {
  const config = await getPromptConfig('pr_generation');

  if (config) {
    // Use database prompt with template substitution
    let userPrompt = config.user_prompt_template;
    
    // Replace all template variables
    userPrompt = userPrompt.replace(/\{\{companyName\}\}/g, data.companyName);
    userPrompt = userPrompt.replace(/\{\{companyWebsite\}\}/g, data.companyWebsite);
    userPrompt = userPrompt.replace(/\{\{announcementType\}\}/g, data.announcementType);
    userPrompt = userPrompt.replace(/\{\{newsHook\}\}/g, data.newsHook);
    userPrompt = userPrompt.replace(/\{\{dateline\}\}/g, data.dateline);
    userPrompt = userPrompt.replace(/\{\{releaseDate\}\}/g, data.releaseDate);
    userPrompt = userPrompt.replace(/\{\{coreFacts\}\}/g, data.coreFacts.map((f, i) => `${i + 1}. ${f}`).join('\n'));
    
    const quotesFormatted = data.quoteSources?.length
      ? data.quoteSources.map(q => `- ${q.name}, ${q.title}${q.quote ? `: "${q.quote}"` : ' (please create suggested quote)'}`).join('\n')
      : 'No quotes provided - please create 1-2 suggested quotes and label them as such.';
    userPrompt = userPrompt.replace(/\{\{quoteSources\}\}/g, quotesFormatted);
    
    userPrompt = userPrompt.replace(/\{\{boilerplate\}\}/g, data.boilerplate || data.companyFacts || 'Please create a 50-75 word boilerplate based on the company information provided.');
    userPrompt = userPrompt.replace(/\{\{mediaContactName\}\}/g, data.mediaContact.name);
    userPrompt = userPrompt.replace(/\{\{mediaContactTitle\}\}/g, data.mediaContact.title ? `Title: ${data.mediaContact.title}` : '');
    userPrompt = userPrompt.replace(/\{\{mediaContactPhone\}\}/g, data.mediaContact.phone || 'Not provided');
    userPrompt = userPrompt.replace(/\{\{mediaContactEmail\}\}/g, data.mediaContact.email);
    userPrompt = userPrompt.replace(/\{\{mediaContactWebsite\}\}/g, data.mediaContact.website || data.companyWebsite);
    userPrompt = userPrompt.replace(/\{\{visuals\}\}/g, data.visuals || 'None specified - please suggest appropriate visuals.');
    userPrompt = userPrompt.replace(/\{\{desiredCTA\}\}/g, data.desiredCTA);
    
    if (data.supportingContext) {
      userPrompt = userPrompt.replace(/\{\{supportingContext\}\}/g, `
**Supporting Context / Reference Material:**
The following content provides additional context about this announcement. Use it to inform your writing, extract relevant details, and ensure accuracy:

---
${data.supportingContext}
---`);
    } else {
      userPrompt = userPrompt.replace(/\{\{supportingContext\}\}/g, '');
    }

    return {
      systemPrompt: config.system_prompt,
      userPrompt,
    };
  }

  // Fall back to hardcoded defaults
  return {
    systemPrompt: PR_GENERATION_SYSTEM_PROMPT,
    userPrompt: buildPRGenerationUserPrompt(data),
  };
}

// Get Panel Critique prompts - falls back to defaults if DB not available
export async function getPanelCritiquePrompts(pressRelease: string): Promise<{ systemPrompt: string; userPrompt: string }> {
  const config = await getPromptConfig('panel_critique');

  if (config) {
    let userPrompt = config.user_prompt_template;
    userPrompt = userPrompt.replace(/\{\{pressRelease\}\}/g, pressRelease);

    return {
      systemPrompt: config.system_prompt,
      userPrompt,
    };
  }

  // Fall back to hardcoded defaults
  return {
    systemPrompt: PANEL_CRITIQUE_SYSTEM_PROMPT,
    userPrompt: buildPanelCritiqueUserPrompt(pressRelease),
  };
}

// Get Rewrite prompts - falls back to defaults if DB not available
export async function getRewritePrompts(data: {
  originalDraft: string;
  panelSynthesis: string;
  keyIssues: string;
}): Promise<{ systemPrompt: string; userPrompt: string }> {
  const config = await getPromptConfig('rewrite_from_feedback');

  if (config) {
    let userPrompt = config.user_prompt_template;
    userPrompt = userPrompt.replace(/\{\{originalDraft\}\}/g, data.originalDraft);
    userPrompt = userPrompt.replace(/\{\{panelSynthesis\}\}/g, data.panelSynthesis);
    userPrompt = userPrompt.replace(/\{\{keyIssues\}\}/g, data.keyIssues);

    return {
      systemPrompt: config.system_prompt,
      userPrompt,
    };
  }

  // Fall back to inline default
  return {
    systemPrompt: `You are a professional press release editor. Your task is to rewrite the press release based on the panel feedback provided.

Rules:
- Address the specific concerns raised by the panel
- Maintain the core message and facts
- Improve clarity and impact
- Keep the journalistic tone
- Stay within 300-500 words
- Format the output as clean HTML with proper paragraph tags`,
    userPrompt: `Original Press Release:
${data.originalDraft}

Panel Feedback Summary:
${data.panelSynthesis}

Key Issues to Address:
${data.keyIssues}

Please rewrite the press release addressing the feedback while maintaining the core message. Output as clean HTML.`,
  };
}

// Clear cache (useful after prompt updates)
export function clearPromptCache() {
  promptCache = {};
  cacheTimestamp = 0;
}
