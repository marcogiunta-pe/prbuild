// lib/prompts/panel-critique.ts

export const PANEL_CRITIQUE_SYSTEM_PROMPT = `Act as a structured review panel evaluating the following press release.

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
* Output only the analysis. No rewriting unless asked.`;

export function buildPanelCritiqueUserPrompt(pressRelease: string): string {
  return `Please review and critique the following press release:

---

${pressRelease}

---

Provide your complete panel analysis as specified in your instructions.`;
}

// Industry-specific panel configurations
type Industry = 'healthcare' | 'technology' | 'finance' | 'retail' | 'general';

interface PanelConfig {
  journalists: string[];
  prWriters: string[];
  marketingExperts: string[];
  targetCustomers: string[];
}

const PANEL_CONFIGS: Record<Industry, PanelConfig> = {
  healthcare: {
    journalists: [
      'health policy journalist',
      'state government health reporter',
      'rural health correspondent',
      'investigative health journalist',
      'health innovation writer',
    ],
    prWriters: [
      'healthcare PR agency director',
      'hospital system corporate comms lead',
      'former health trade newsroom editor',
    ],
    marketingExperts: [
      'B2G healthcare marketing executive',
      'healthcare growth marketing director',
      'health tech positioning strategist',
    ],
    targetCustomers: [
      'Governor office health policy staffer',
      'State Medicaid director',
      'rural hospital CEO',
      'public health foundation executive',
      'health plan executive',
    ],
  },
  technology: {
    journalists: [
      'enterprise tech journalist',
      'startup/VC reporter',
      'cybersecurity correspondent',
      'AI/ML technology writer',
      'SaaS industry analyst',
    ],
    prWriters: [
      'tech PR agency founder',
      'Fortune 500 tech corporate comms director',
      'former TechCrunch editor',
    ],
    marketingExperts: [
      'B2B SaaS marketing executive',
      'developer marketing director',
      'enterprise positioning strategist',
    ],
    targetCustomers: [
      'Fortune 500 CTO',
      'Series B startup founder',
      'enterprise IT procurement director',
      'VC partner at top-tier firm',
      'mid-market CIO',
    ],
  },
  finance: {
    journalists: [
      'financial services reporter',
      'fintech correspondent',
      'banking industry analyst',
      'investment/markets journalist',
      'regulatory affairs writer',
    ],
    prWriters: [
      'financial PR agency MD',
      'bank corporate communications SVP',
      'former WSJ financial editor',
    ],
    marketingExperts: [
      'wealth management marketing director',
      'fintech growth executive',
      'institutional positioning strategist',
    ],
    targetCustomers: [
      'regional bank CEO',
      'hedge fund COO',
      'fintech startup founder',
      'pension fund investment director',
      'financial regulator policy analyst',
    ],
  },
  retail: {
    journalists: [
      'retail industry reporter',
      'consumer trends correspondent',
      'e-commerce analyst',
      'supply chain journalist',
      'CPG industry writer',
    ],
    prWriters: [
      'consumer PR agency VP',
      'retail brand corporate comms director',
      'former Retail Week editor',
    ],
    marketingExperts: [
      'DTC brand marketing executive',
      'retail growth director',
      'omnichannel positioning strategist',
    ],
    targetCustomers: [
      'national retail chain CMO',
      'DTC brand founder',
      'department store buyer',
      'e-commerce platform executive',
      'retail REIT investment manager',
    ],
  },
  general: {
    journalists: [
      'business news reporter',
      'industry trends correspondent',
      'investigative business journalist',
      'local business editor',
      'trade publication writer',
    ],
    prWriters: [
      'general PR agency director',
      'corporate communications VP',
      'former AP business editor',
    ],
    marketingExperts: [
      'B2B marketing executive',
      'growth marketing director',
      'brand positioning strategist',
    ],
    targetCustomers: [
      'mid-market company CEO',
      'private equity operating partner',
      'industry association executive',
      'chamber of commerce director',
      'business development VP',
    ],
  },
};

export function buildIndustryPanelPrompt(industry: Industry): string {
  const config = PANEL_CONFIGS[industry];

  return `Act as a structured review panel evaluating the following press release.

Panel composition:
* 5 journalists (${config.journalists.join(', ')})
* 3 professional press release writers (${config.prWriters.join(', ')})
* 3 senior marketing experts (${config.marketingExperts.join(', ')})
* 5 distinct target customers (${config.targetCustomers.join(', ')})

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
* Output only the analysis. No rewriting unless asked.`;
}

// Parser for panel critique response
export interface ParsedPanelCritique {
  individualFeedback: {
    persona: string;
    role: string;
    feedback: string;
  }[];
  synthesis: string;
  themes: string[];
  contrarianRecommendation: {
    raw: string;
    remove: string;
    sharpen: string;
    risk: string;
    ignore: string;
  };
}

export function parsePanelCritiqueResponse(response: string): ParsedPanelCritique {
  // Extract Step 1 - Individual Feedback
  const step1Match = response.match(/Step 1[:\s]*Individual Feedback([\s\S]*?)(?=Step 2|$)/i);
  const step1Text = step1Match ? step1Match[1] : '';
  
  // Parse individual personas - look for name patterns like "Sarah M." or "Michael T."
  const personaMatches = step1Text.match(/([A-Z][a-z]+\s[A-Z]\.)[^A-Z]*([\s\S]*?)(?=[A-Z][a-z]+\s[A-Z]\.|$)/g) || [];
  
  const individualFeedback = personaMatches.map(match => {
    const nameMatch = match.match(/^([A-Z][a-z]+\s[A-Z]\.)/);
    const name = nameMatch ? nameMatch[1] : 'Unknown';
    const feedback = match.replace(/^[A-Z][a-z]+\s[A-Z]\.\s*[-–—]?\s*/, '').trim();
    
    return {
      persona: name,
      role: extractRole(feedback),
      feedback: feedback,
    };
  });

  // Extract Step 2 - Synthesis
  const step2Match = response.match(/Step 2[:\s]*Synthesis([\s\S]*?)(?=Step 3|$)/i);
  const synthesis = step2Match ? step2Match[1].trim() : '';
  
  // Extract themes from synthesis
  const themeMatches = synthesis.match(/\d+\.\s*([^\n]+)/g) || [];
  const themes = themeMatches.map(t => t.replace(/^\d+\.\s*/, '').trim());

  // Extract Step 3 - Contrarian Recommendation
  const step3Match = response.match(/Step 3[:\s]*Contrarian Recommendation([\s\S]*?)$/i);
  const step3Text = step3Match ? step3Match[1] : '';

  const contrarianRecommendation = {
    raw: step3Text.trim(),
    remove: extractBullet(step3Text, 'remove'),
    sharpen: extractBullet(step3Text, 'sharpen'),
    risk: extractBullet(step3Text, 'risk'),
    ignore: extractBullet(step3Text, 'ignore'),
  };

  return {
    individualFeedback,
    synthesis,
    themes,
    contrarianRecommendation,
  };
}

function extractRole(text: string): string {
  // Try to extract role from the beginning of feedback
  const roleMatch = text.match(/^([^:]+):/);
  return roleMatch ? roleMatch[1].trim() : '';
}

function extractBullet(text: string, keyword: string): string {
  const patterns = [
    new RegExp(`\\*?\\s*(?:What to )?${keyword}[:\\s]*([^\\n*]+)`, 'i'),
    new RegExp(`${keyword}[:\\s]*([^\\n]+)`, 'i'),
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}
