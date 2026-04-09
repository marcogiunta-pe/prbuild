// lib/prompts/panel-critique.ts

export const PANEL_CRITIQUE_SYSTEM_PROMPT = `Act as a structured review panel evaluating the following press release.
Return your response as valid JSON only — no markdown fences, no extra text.

Panel composition:
* 5 journalists (Connie Loizos — TechCrunch, Erin Griffith — NYT, Tom Dotan — WSJ, Kia Kokalitcheva — Axios, Zoë Schiffer — Platformer)
* 3 press release / copy experts (Ed Zitron — PR critic, corporate comms VP, Harry Dry — Marketing Examples founder and legendary copywriter)
* 3 senior marketing experts (Kipp Bodnar — HubSpot CMO, Dave Gerhardt — Exit Five B2B marketing, April Dunford — positioning expert)
* 5 distinct target customers / industry voices (Jason Lemkin — SaaStr, Hiten Shah — FYI, Rand Fishkin — SparkToro, Dharmesh Shah — HubSpot CTO, mid-market CEO)

For each persona:
* Assign a realistic first name and only the first letter of the last name.
* Respond independently in the voice of that role.
* Be critical and specific. No politeness. No hedging.
* EVERY piece of feedback MUST include a concrete suggestion — what specifically to change, add, or remove. "This is weak" is useless without "Replace X with Y" or "Add a sentence about Z".

Return this exact JSON structure:
{
  "reviewers": [
    {
      "persona": "First L.",
      "role": "their role title",
      "compelling": true/false,
      "feedback": "Critical assessment — what works and what doesn't",
      "missing": "What is missing that would force action",
      "suggestion": "SPECIFIC rewrite instruction: e.g. 'Replace the headline with: [concrete headline]' or 'Add this sentence after paragraph 2: [exact sentence]' or 'Delete the third paragraph and replace with: [specific text]'",
      "verdict": "One sentence: how this fails or succeeds for their role"
    }
  ],
  "synthesis": "Top 3 recurring themes as a numbered list. Call out alignment and disagreement explicitly.",
  "contrarian": {
    "remove": "What to remove",
    "sharpen": "What to sharpen",
    "risk": "What risk to take that the current draft avoids",
    "ignore": "Who this revised release should deliberately ignore"
  }
}

Rules:
* No marketing buzzwords unless criticizing them.
* Short sentences. Clear thinking.
* Prioritize tension, urgency, and decision making.
* The "suggestion" field is the MOST IMPORTANT — it must be specific enough that someone could apply it without thinking. Include exact replacement text, not vague advice.
* "compelling" must be true only if you would genuinely run/use/act on this release as-is.`;

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
      'Christina Farr — CNBC health tech reporter',
      'Casey Ross — STAT News health technology journalist',
      'Tina Reed — Axios healthcare industry reporter',
      'Arthur Allen — Politico health IT correspondent',
      'Rebecca Pifer — Healthcare Dive hospital operations reporter',
    ],
    prWriters: [
      'healthcare PR agency director',
      'hospital system corporate comms lead',
      'Harry Dry — Marketing Examples founder, legendary copywriter (evaluate headline, hook, and every word choice)',
    ],
    marketingExperts: [
      'Kipp Bodnar — HubSpot CMO (evaluate whether this would move pipeline and drive action)',
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
      'Connie Loizos — TechCrunch VC and startups reporter',
      'Erin Griffith — New York Times startup culture reporter',
      'Tom Dotan — Wall Street Journal enterprise tech reporter',
      'Zoë Schiffer — Platformer tech industry journalist',
      'Kia Kokalitcheva — Axios venture capital reporter',
    ],
    prWriters: [
      'Ed Zitron — PR critic and agency founder',
      'Fortune 500 tech corporate comms director',
      'Harry Dry — Marketing Examples founder, legendary copywriter (evaluate headline, hook, and every word choice)',
    ],
    marketingExperts: [
      'Kipp Bodnar — HubSpot CMO (evaluate whether this would move pipeline and drive action)',
      'Dave Gerhardt — Exit Five founder, B2B marketing expert',
      'April Dunford — positioning expert and Obviously Awesome author',
    ],
    targetCustomers: [
      'Jason Lemkin — SaaStr founder and SaaS investor',
      'Series B startup founder',
      'enterprise IT procurement director',
      'VC partner at top-tier firm',
      'Dharmesh Shah — HubSpot CTO and founder',
    ],
  },
  finance: {
    journalists: [
      'Ryan Browne — CNBC fintech reporter',
      'Penny Crosman — American Banker technology reporter',
      'Sujata Rao — Reuters financial markets reporter',
      'Mary Ann Azevedo — TechCrunch fintech reporter',
      'Tanaya Macheel — Fortune fintech correspondent',
    ],
    prWriters: [
      'financial PR agency MD',
      'bank corporate communications SVP',
      'Harry Dry — Marketing Examples founder, legendary copywriter (evaluate headline, hook, and every word choice)',
    ],
    marketingExperts: [
      'Kipp Bodnar — HubSpot CMO (evaluate whether this would move pipeline and drive action)',
      'fintech growth executive',
      'April Dunford — positioning expert and Obviously Awesome author',
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
      'Melissa Repko — CNBC retail industry reporter',
      'Suzanne Kapner — Wall Street Journal retail reporter',
      'Leticia Miranda — NBC News retail and e-commerce reporter',
      'Daphne Howland — Retail Dive strategy reporter',
      'Adrianne Pasquarelli — Ad Age retail marketing reporter',
    ],
    prWriters: [
      'consumer PR agency VP',
      'retail brand corporate comms director',
      'Harry Dry — Marketing Examples founder, legendary copywriter (evaluate headline, hook, and every word choice)',
    ],
    marketingExperts: [
      'Kipp Bodnar — HubSpot CMO (evaluate whether this would move pipeline and drive action)',
      'DTC brand marketing executive',
      'April Dunford — positioning expert and Obviously Awesome author',
    ],
    targetCustomers: [
      'national retail chain CMO',
      'DTC brand founder',
      'department store buyer',
      'e-commerce platform executive',
      'Rand Fishkin — SparkToro founder, audience research expert',
    ],
  },
  general: {
    journalists: [
      'Connie Loizos — TechCrunch VC and startups reporter',
      'Erin Griffith — New York Times startup culture reporter',
      'Tom Dotan — Wall Street Journal enterprise tech reporter',
      'Kia Kokalitcheva — Axios venture capital reporter',
      'Zoë Schiffer — Platformer tech industry journalist',
    ],
    prWriters: [
      'Ed Zitron — PR critic and agency founder',
      'corporate communications VP',
      'Harry Dry — Marketing Examples founder, legendary copywriter (evaluate headline, hook, and every word choice)',
    ],
    marketingExperts: [
      'Kipp Bodnar — HubSpot CMO (evaluate whether this would move pipeline and drive action)',
      'Dave Gerhardt — Exit Five founder, B2B marketing expert',
      'April Dunford — positioning expert and Obviously Awesome author',
    ],
    targetCustomers: [
      'Jason Lemkin — SaaStr founder and SaaS investor',
      'Hiten Shah — FYI founder, product and growth expert',
      'Rand Fishkin — SparkToro founder, audience research expert',
      'Dharmesh Shah — HubSpot CTO and founder',
      'mid-market company CEO',
    ],
  },
};

export function buildIndustryPanelPrompt(industry: Industry): string {
  const config = PANEL_CONFIGS[industry];

  return `Act as a structured review panel evaluating the following press release.
Return your response as valid JSON only — no markdown fences, no extra text.

Panel composition:
* 5 journalists (${config.journalists.join(', ')})
* 3 professional press release writers (${config.prWriters.join(', ')})
* 3 senior marketing experts (${config.marketingExperts.join(', ')})
* 5 distinct target customers (${config.targetCustomers.join(', ')})

For each persona:
* Assign a realistic first name and only the first letter of the last name.
* Respond independently in the voice of that role.
* Be critical and specific. No politeness. No hedging.
* EVERY piece of feedback MUST include a concrete suggestion — what specifically to change, add, or remove.

Return this exact JSON structure:
{
  "reviewers": [
    {
      "persona": "First L.",
      "role": "their role title",
      "compelling": true/false,
      "feedback": "Critical assessment — what works and what doesn't",
      "missing": "What is missing that would force action",
      "suggestion": "SPECIFIC rewrite instruction: e.g. 'Replace the headline with: [concrete headline]' or 'Add this sentence after paragraph 2: [exact sentence]' or 'Delete the third paragraph and replace with: [specific text]'",
      "verdict": "One sentence: how this fails or succeeds for their role"
    }
  ],
  "synthesis": "Top 3 recurring themes as a numbered list. Call out alignment and disagreement explicitly.",
  "contrarian": {
    "remove": "What to remove",
    "sharpen": "What to sharpen",
    "risk": "What risk to take that the current draft avoids",
    "ignore": "Who this revised release should deliberately ignore"
  }
}

Rules:
* No marketing buzzwords unless criticizing them.
* Short sentences. Clear thinking.
* Prioritize tension, urgency, and decision making.
* The "suggestion" field is the MOST IMPORTANT — it must be specific enough that someone could apply it without thinking. Include exact replacement text, not vague advice.
* "compelling" must be true only if you would genuinely run/use/act on this release as-is.`;
}

// Parser for panel critique response
export interface ParsedPanelCritique {
  individualFeedback: {
    persona: string;
    role: string;
    feedback: string;
    compelling: boolean;
    missing: string;
    suggestion: string;
    verdict: string;
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
  // Strategy 1: direct JSON parse with markdown-fence stripping
  const tryParseJson = (text: string): any | null => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const stripFences = (text: string): string =>
    text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

  // Strategy 2: extract the largest JSON object substring
  const extractJsonSubstring = (text: string): string | null => {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
    return text.slice(firstBrace, lastBrace + 1);
  };

  let json: any = tryParseJson(stripFences(response));
  if (!json || !json.reviewers) {
    const sub = extractJsonSubstring(response);
    if (sub) json = tryParseJson(sub);
  }

  // Strategy 3: maybe the reviewers are at the top level under a different key
  if (json && !json.reviewers) {
    if (Array.isArray(json.panel)) json.reviewers = json.panel;
    else if (Array.isArray(json.individualFeedback)) json.reviewers = json.individualFeedback;
    else if (Array.isArray(json.feedback)) json.reviewers = json.feedback;
  }

  try {
    if (json && json.reviewers && Array.isArray(json.reviewers)) {
      const individualFeedback = json.reviewers.map((r: any) => ({
        persona: r.persona || 'Unknown',
        role: r.role || '',
        feedback: r.feedback || '',
        compelling: typeof r.compelling === 'boolean' ? r.compelling : false,
        missing: r.missing || '',
        suggestion: r.suggestion || '',
        verdict: r.verdict || '',
      }));

      const synthesis = json.synthesis || '';
      const themeMatches = synthesis.match(/\d+\.\s*([^\n]+)/g) || [];
      const themes = themeMatches.map((t: string) => t.replace(/^\d+\.\s*/, '').trim());

      const c = json.contrarian || {};
      return {
        individualFeedback,
        synthesis,
        themes,
        contrarianRecommendation: {
          raw: JSON.stringify(c),
          remove: c.remove || '',
          sharpen: c.sharpen || '',
          risk: c.risk || '',
          ignore: c.ignore || '',
        },
      };
    }
  } catch {
    // Fall through to legacy text parsing
  }

  // Legacy text-based parsing (for older responses)
  const step1Match = response.match(/Step 1[:\s]*Individual Feedback([\s\S]*?)(?=Step 2|$)/i);
  const step1Text = step1Match ? step1Match[1] : '';

  const personaMatches = step1Text.match(/([A-Z][a-z]+\s[A-Z]\.)[^A-Z]*([\s\S]*?)(?=[A-Z][a-z]+\s[A-Z]\.|$)/g) || [];

  if (personaMatches.length === 0) {
    const snippet = response.slice(0, 800).replace(/\s+/g, ' ').trim();
    throw new Error(
      `parsePanelCritiqueResponse: could not extract reviewers from any of 3 strategies (direct JSON, JSON substring, legacy regex). ` +
      `Response length: ${response.length}. First 800 chars: ${snippet}`
    );
  }

  const individualFeedback = personaMatches.map(match => {
    const nameMatch = match.match(/^([A-Z][a-z]+\s[A-Z]\.)/);
    const name = nameMatch ? nameMatch[1] : 'Unknown';
    const feedbackText = match.replace(/^[A-Z][a-z]+\s[A-Z]\.\s*[-–—]?\s*/, '').trim();

    return {
      persona: name,
      role: extractRole(feedbackText),
      feedback: feedbackText,
      compelling: false,
      missing: '',
      suggestion: '',
      verdict: '',
    };
  });

  const step2Match = response.match(/Step 2[:\s]*Synthesis([\s\S]*?)(?=Step 3|$)/i);
  const synthesis = step2Match ? step2Match[1].trim() : '';
  const themeMatches = synthesis.match(/\d+\.\s*([^\n]+)/g) || [];
  const themes = themeMatches.map(t => t.replace(/^\d+\.\s*/, '').trim());

  const step3Match = response.match(/Step 3[:\s]*Contrarian Recommendation([\s\S]*?)$/i);
  const step3Text = step3Match ? step3Match[1] : '';

  return {
    individualFeedback,
    synthesis,
    themes,
    contrarianRecommendation: {
      raw: step3Text.trim(),
      remove: extractBullet(step3Text, 'remove'),
      sharpen: extractBullet(step3Text, 'sharpen'),
      risk: extractBullet(step3Text, 'risk'),
      ignore: extractBullet(step3Text, 'ignore'),
    },
  };
}

function extractRole(text: string): string {
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
