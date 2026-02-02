// lib/prompts/pr-generation.ts

export const PR_GENERATION_SYSTEM_PROMPT = `You are a professional journalist and press release writer. I will give you the facts of an announcement; your job is to produce a newsworthy press release in a journalistic style using the structure and rules below. Think step by step.

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
- Distribution checklist`;

interface PRGenerationInput {
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
}

export function buildPRGenerationUserPrompt(data: PRGenerationInput): string {
  const factsFormatted = data.coreFacts
    .map((fact, i) => `${i + 1}. ${fact}`)
    .join('\n');

  const quotesFormatted = data.quoteSources?.length
    ? data.quoteSources
        .map(
          (q) =>
            `- ${q.name}, ${q.title}${q.quote ? `: "${q.quote}"` : ' (please create suggested quote)'}`
        )
        .join('\n')
    : 'No quotes provided - please create 1-2 suggested quotes and label them as such.';

  return `Please produce a press release based on the following announcement details:

**Company / Organization Name:**
${data.companyName}

**Company Website:**
${data.companyWebsite}

**Announcement Type:**
${data.announcementType}

**Key News Hook (one-sentence summary of why this is newsworthy):**
${data.newsHook}

**Dateline:**
${data.dateline} — ${data.releaseDate}

**Core Facts (ranked by importance):**
${factsFormatted}

**Quote Sources:**
${quotesFormatted}

**Boilerplate Copy / Company Facts:**
${data.boilerplate || data.companyFacts || 'Please create a 50-75 word boilerplate based on the company information provided.'}

**Media Contact:**
Name: ${data.mediaContact.name}
${data.mediaContact.title ? `Title: ${data.mediaContact.title}` : ''}
Phone: ${data.mediaContact.phone || 'Not provided'}
Email: ${data.mediaContact.email}
Website: ${data.mediaContact.website || data.companyWebsite}

**Visuals Available:**
${data.visuals || 'None specified - please suggest appropriate visuals.'}

**Desired Call to Action:**
${data.desiredCTA}
${data.supportingContext ? `
**Supporting Context / Reference Material:**
The following content provides additional context about this announcement. Use it to inform your writing, extract relevant details, and ensure accuracy:

---
${data.supportingContext}
---
` : ''}
Now produce the complete press release and all supporting items as specified in your instructions.`;
}

// Parser for AI response
export interface ParsedPRDraft {
  headlines: string[];
  subhead: string;
  fullContent: string;
  dateline: string;
  leadParagraph: string;
  bodyParagraphs: string[];
  quotes: string[];
  boilerplate: string;
  mediaContact: string;
  callToAction: string;
  visuals: { suggestion: string }[];
  checklist: string[];
}

export function parsePRDraftResponse(response: string): ParsedPRDraft {
  // Extract headlines (looking for numbered list at the start)
  const headlineMatch = response.match(/(?:Headline[s]?.*?:?\s*)?(?:1[.\)\]]\s*)(.+?)(?:\n2[.\)\]]\s*)(.+?)(?:\n3[.\)\]]\s*)(.+?)(?=\n\n|\nSubhead)/is);
  const headlines = headlineMatch 
    ? [headlineMatch[1].trim(), headlineMatch[2].trim(), headlineMatch[3].trim()]
    : [];

  // Extract subhead
  const subheadMatch = response.match(/Subhead[:\s]*([^\n]+)/i);
  const subhead = subheadMatch ? subheadMatch[1].trim() : '';

  // Extract main content (everything between subhead and visuals/checklist)
  const contentStart = response.indexOf('Dateline') !== -1 
    ? response.indexOf('Dateline') 
    : response.search(/[A-Z]{2,}[,\s]+[A-Z]/);
  const contentEnd = response.search(/Visuals?\s*suggestions?/i);
  const fullContent = contentEnd > contentStart 
    ? response.slice(contentStart, contentEnd).trim()
    : response.slice(contentStart).trim();

  // Extract visuals suggestions
  const visualsMatch = response.match(/Visuals?\s*suggestions?:?([\s\S]*?)(?=Distribution|checklist|$)/i);
  const visualsText = visualsMatch ? visualsMatch[1] : '';
  const visuals = visualsText
    .split(/[\n•\-\d+\.]/)
    .filter(v => v.trim().length > 10)
    .map(v => ({ suggestion: v.trim() }));

  // Extract distribution checklist
  const checklistMatch = response.match(/Distribution\s*checklist:?([\s\S]*?)$/i);
  const checklistText = checklistMatch ? checklistMatch[1] : '';
  const checklist = checklistText
    .split(/[\n•\-✓☐]/)
    .filter(c => c.trim().length > 5)
    .map(c => c.trim());

  return {
    headlines,
    subhead,
    fullContent,
    dateline: '',
    leadParagraph: '',
    bodyParagraphs: [],
    quotes: [],
    boilerplate: '',
    mediaContact: '',
    callToAction: '',
    visuals,
    checklist,
  };
}
