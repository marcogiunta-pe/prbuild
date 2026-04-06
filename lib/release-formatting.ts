/**
 * Shared label-stripping and content formatting for press release display.
 * Used by both the detail page and preview page.
 */

// Section labels the AI includes that should be stripped from display
export const LABEL_WORDS = [
  'headline', 'headline options', 'headline option 1', 'headline option 2', 'headline option 3',
  'subhead', 'subheadline', 'dateline', 'dateline + lead paragraph', 'dateline + lead',
  'lead paragraph', 'lead', 'body paragraph', 'body paragraphs', 'body paragraph 1',
  'body paragraph 2', 'body paragraph 3', 'body', 'quote', 'quotes', 'quote(s)', 'quote(s):',
  'suggested quote', 'suggested quotes', 'boilerplate', 'about', 'about the company',
  'media contact', 'media contact:', 'contact information', 'contact info', 'contact',
  'call to action', 'call-to-action', 'cta', 'next steps',
  'visuals suggestions', 'visuals', 'visual suggestions', 'suggested visuals',
  'distribution checklist', 'distribution', 'distribution notes',
  'end', '###', '# # #', '- # # # -',
];

export function isSectionLabel(line: string): boolean {
  const cleaned = line
    .replace(/\*{1,2}/g, '')
    .replace(/^#+\s*/, '')
    .replace(/^[-–•]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/:+\s*$/, '')
    .trim()
    .toLowerCase();
  return LABEL_WORDS.includes(cleaned) || LABEL_WORDS.includes(cleaned + ':');
}

export function cleanContent(raw: string): string {
  if (!raw) return '';
  return raw
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      if (isSectionLabel(trimmed)) return false;
      if (/^\s*\(?\d+\)?\s*\*{0,2}\s*$/.test(trimmed)) return false;
      if (/^\s*[-–]?\s*\*{2,}\s*$/.test(trimmed)) return false;
      if (/^\s*\d+\.\s*$/.test(trimmed)) return false;
      return true;
    })
    .join('\n')
    .replace(/\(\d+\)\s*\*{0,2}\s*/g, '')
    .replace(/^\s*\*\*\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function extractHeadlineFromContent(content: string): string {
  if (!content) return '';
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (isSectionLabel(line)) continue;
    if (/^\s*\(?\d+\)?\s*\*{0,2}\s*$/.test(line)) continue;
    if (/^\s*[-–]?\s*\*{2,}\s*$/.test(line)) continue;
    if (line.length < 15) continue;

    let headline = line
      .replace(/^\*\*(.+?)\*\*$/, '$1')
      .replace(/^\*\*/, '').replace(/\*\*$/, '')
      .replace(/<[^>]+>/g, '')
      .trim();

    // Skip lines that look like datelines or full paragraphs (too long for a headline)
    if (headline.length > 200) continue;
    // Skip lines starting with a dateline pattern (CITY — Date —)
    if (/^[A-Z]{2,}[\s,]+[A-Z][a-z]+/.test(headline) && headline.includes('—')) continue;

    if (headline.length > 15) return headline;
  }

  const h1Match = content.match(/<h1[^>]*>(.+?)<\/h1>/i);
  if (h1Match) return h1Match[1].replace(/<[^>]+>/g, '').trim();
  const strongMatch = content.match(/<strong>(.+?)<\/strong>/i);
  if (strongMatch && strongMatch[1].length > 15) return strongMatch[1].trim();

  return '';
}

export function contentToHtml(content: string): string {
  if (!content) return '';

  // Pre-filter: remove section label lines
  content = content.split('\n').filter(line => {
    const t = line.trim();
    if (isSectionLabel(t)) return false;
    if (/^\s*\(?\d+\)?\s*\*{0,2}\s*$/.test(t)) return false;
    if (/^\s*[-–]?\s*\*{2,}\s*$/.test(t)) return false;
    return true;
  }).join('\n');

  // Already HTML
  if (/<(?:p|div|h[1-6]|ul|ol|li|br|table|blockquote)[\s>]/i.test(content)) {
    return content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/\(\d+\)\s*\*{0,2}\s*/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  // Plain text / markdown
  let html = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = html.split('\n');
  const processed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (/^\s*\(\d+\)\s*$/.test(line)) continue;
    line = line.replace(/^\s*\(\d+\)\s*/, '');

    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) {
      processed.push('<hr/>');
      continue;
    }

    line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    line = line.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    if (line.trim() === '') {
      processed.push('</p><p>');
    } else {
      processed.push(line);
    }
  }

  return '<p>' + processed.join('\n') + '</p>';
}
