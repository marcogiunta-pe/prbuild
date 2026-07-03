import { parsePRDraftResponse } from '@/lib/prompts/pr-generation';

describe('parsePRDraftResponse', () => {
  it('does not collapse to a single character when no Dateline/Visuals markers exist', () => {
    // Regression: previously contentStart was -1 and slice(-1) returned the last
    // character, which is truthy and sailed past the non-empty draft guard.
    const response = 'Some press release body text with no recognized section markers at all.';
    const parsed = parsePRDraftResponse(response);
    expect(parsed.fullContent.length).toBeGreaterThan(1);
    expect(parsed.fullContent).toContain('press release body');
  });

  it('extracts content between the dateline and the visuals section', () => {
    const response = [
      'Dateline: NEW YORK, NY — March 3, 2026. Lead paragraph here.',
      'Body paragraph one.',
      'Visuals suggestions: a photo of the product.',
    ].join('\n');
    const parsed = parsePRDraftResponse(response);
    expect(parsed.fullContent).toContain('Lead paragraph');
    expect(parsed.fullContent).not.toContain('Visuals suggestions');
  });
});
