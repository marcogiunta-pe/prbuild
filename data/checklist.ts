export interface ChecklistItem {
  title: string;
  description: string;
  recommendation: string;
}

export interface ChecklistCategory {
  title: string;
  icon: string;
  slug: string;
  items: ChecklistItem[];
}

export const checklistCategories: ChecklistCategory[] = [
  {
    title: 'Before You Write',
    icon: '📋',
    slug: 'before-you-write',
    items: [
      {
        title: 'Is there an actual news hook?',
        description: 'Journalists need a reason to cover you today, not next month. Tie your release to a launch, milestone, trend, or timely event.',
        recommendation: 'Tie your announcement to a specific event, trend, or date. Ask: "Why would a journalist write about this today?" If you can\'t answer, hold the release until you can.',
      },
      {
        title: 'Is the timing right?',
        description: 'Avoid Fridays, holidays, and major news days. Tuesday through Thursday mornings get the highest open rates from journalists.',
        recommendation: 'Send on Tuesday–Thursday between 9–10 AM in the journalist\'s timezone. Check for competing news events and avoid earnings season or major industry conferences.',
      },
      {
        title: 'Do you know who you\'re pitching?',
        description: 'A spray-and-pray approach gets you blocklisted. Research which journalists cover your beat and what they\'ve written recently.',
        recommendation: 'Build a targeted list of 15–25 journalists who cover your beat. Read their last 3 articles and reference one in your pitch. Quality over quantity always wins.',
      },
      {
        title: 'Is the angle specific to one audience?',
        description: 'A release that tries to appeal to everyone appeals to no one. Pick one audience and write directly to them.',
        recommendation: 'Choose one primary audience (e.g., "startup founders in fintech") and write every sentence for them. Create separate releases for separate audiences if needed.',
      },
      {
        title: 'Do you have supporting data?',
        description: 'Journalists need numbers to make a story credible. Prepare specific metrics, growth figures, or third-party validation before you start writing.',
        recommendation: 'Include at least 2–3 specific numbers: revenue growth, user count, market size, or third-party research. Vague claims like "significant growth" get ignored.',
      },
      {
        title: 'Is this actually newsworthy?',
        description: 'Ask yourself: would you read this story if it wasn\'t about your company? If the answer is no, rethink the angle.',
        recommendation: 'Apply the "So what?" test: tell a friend your news and see if they ask a follow-up question. If they don\'t, the angle isn\'t strong enough. Find the human impact.',
      },
    ],
  },
  {
    title: 'Your Content',
    icon: '✍️',
    slug: 'your-content',
    items: [
      {
        title: 'Does your headline state the news?',
        description: 'The headline should tell the full story in under 100 characters. No cleverness, no buzzwords\u2014just the news.',
        recommendation: 'Write your headline as a newspaper editor would: "[Company] [Does X] to [Achieve Y]." Keep it under 100 characters and lead with the most important fact.',
      },
      {
        title: 'Does the lead paragraph answer the 5 Ws?',
        description: 'Who, what, when, where, and why\u2014all in the first paragraph. Many journalists read only this far.',
        recommendation: 'Open with: "[Company] today announced [what] in [where], [why it matters]." Get all five Ws in the first 2–3 sentences. This paragraph may be the only thing read.',
      },
      {
        title: 'Is there a human-sounding quote?',
        description: 'Quotes should add perspective or emotion, not restate facts. "We\'re excited to announce" is not a quote\u2014it\'s filler.',
        recommendation: 'Write quotes that add opinion or vision, not facts. Good: "This changes how small businesses compete." Bad: "We\'re excited to launch this product." Make it sound like a real person talking.',
      },
      {
        title: 'Are your claims backed by numbers?',
        description: 'Replace vague language ("significant growth") with specifics ("47% increase in Q3"). Data makes stories publishable.',
        recommendation: 'Replace every vague claim with a specific number. "Fast growth" becomes "47% revenue increase in Q3." "Many customers" becomes "2,400 active users." Numbers are what journalists quote.',
      },
      {
        title: 'Is it under 500 words?',
        description: 'The ideal press release is 400\u2013500 words. Anything longer and you\'re asking journalists to do editing work for you.',
        recommendation: 'Cut ruthlessly to 400–500 words. Move background info to the boilerplate. If it\'s over 500 words, you\'re including information journalists will delete anyway.',
      },
      {
        title: 'Does it follow AP style?',
        description: 'Journalists write in AP style. If your release doesn\'t, it signals you don\'t understand their world.',
        recommendation: 'Use AP style basics: no Oxford comma, spell out numbers under 10, use "percent" not "%", abbreviate states. Get the AP Stylebook or use a free AP style checker.',
      },
      {
        title: 'Is the boilerplate current?',
        description: 'Your company description should be 3\u20134 sentences with up-to-date metrics. Outdated boilerplates scream "we don\'t do this often."',
        recommendation: 'Update your boilerplate to 3–4 sentences with current metrics (founding year, team size, revenue if public, customers served). Review it quarterly.',
      },
      {
        title: 'Is the structure scannable?',
        description: 'Short paragraphs, clear subheadings, and bullet points where appropriate. Journalists skim\u2014make it easy.',
        recommendation: 'Use 2–3 sentence paragraphs max. Add one subheading per section. Use bullet points for lists of features or stats. White space is your friend.',
      },
    ],
  },
  {
    title: 'Red Flags That Get You Deleted',
    icon: '🚩',
    slug: 'red-flags',
    items: [
      {
        title: 'Does it sound like it was written by AI?',
        description: 'Generic phrasing, perfect grammar with zero personality, and buzzword soup are instant tells. Journalists can spot AI copy in seconds.',
        recommendation: 'Read it out loud. If it sounds like a robot, rewrite it. Add specific details only a human would know. Break one grammar rule on purpose. Personality beats perfection.',
      },
      {
        title: 'Is it loaded with buzzwords?',
        description: '"Revolutionary," "cutting-edge," "best-in-class"\u2014these words mean nothing. Every company uses them. Replace with specifics.',
        recommendation: 'Search for and delete: "revolutionary," "cutting-edge," "innovative," "best-in-class," "world-class," "synergy." Replace each with a specific fact or number.',
      },
      {
        title: 'Does it start with "excited to announce"?',
        description: 'This is the #1 most-used (and most-ignored) opening in press releases. Lead with the news, not your emotions.',
        recommendation: 'Delete your first sentence and start with the second one. 90% of the time, your actual news is in sentence two. Lead with the fact, not the feeling.',
      },
      {
        title: 'Is there no actual news?',
        description: 'A partnership, a minor update, or a self-congratulatory milestone isn\'t news. If a journalist can\'t write a story from it, it\'s not ready.',
        recommendation: 'Ask: "Could a journalist write a 300-word story from this?" If not, bundle it with other updates or wait until you have something more substantial.',
      },
      {
        title: 'Is it a wall of text?',
        description: 'No subheadings, no breaks, no formatting\u2014just a dense block of corporate speak. This gets deleted before the second paragraph.',
        recommendation: 'Add a subheading every 2–3 paragraphs. Use bullet points for any list of 3+ items. Keep paragraphs to 2–3 sentences. Make it skimmable in 10 seconds.',
      },
    ],
  },
  {
    title: 'Distribution & Follow-up',
    icon: '📨',
    slug: 'distribution',
    items: [
      {
        title: 'Is the subject line specific and short?',
        description: 'Your email subject line is your first (and often only) impression. Keep it under 60 characters and state the news directly.',
        recommendation: 'Write the subject line last. Keep it under 60 characters. Format: "[Company]: [The News]." No "Press Release:" prefix — journalists know what it is.',
      },
      {
        title: 'Is the outreach personalized?',
        description: 'Reference the journalist\'s recent work. One sentence of personalization is worth more than a perfectly crafted release.',
        recommendation: 'Add one sentence referencing the journalist\'s recent article: "Loved your piece on [topic] — this connects because [reason]." Personalization is the #1 predictor of opens.',
      },
      {
        title: 'Are you sending at the right time?',
        description: 'Emails sent between 9\u201310am in the journalist\'s timezone on Tuesday\u2013Thursday get the highest open rates.',
        recommendation: 'Schedule for 9:15 AM in the journalist\'s timezone, Tuesday–Thursday. Avoid Mondays (inbox overload) and Fridays (weekend mode). Check their timezone before sending.',
      },
      {
        title: 'Is your contact info included and accurate?',
        description: 'Include a name, email, and phone number. Respond within 2 hours. Journalists work on deadline\u2014if you\'re slow, you\'re out.',
        recommendation: 'Include a real person\'s name, direct email, and mobile number. Set a phone alert for responses. Commit to responding within 1 hour during business hours.',
      },
    ],
  },
];

export const TOTAL_ITEMS = checklistCategories.reduce(
  (sum, cat) => sum + cat.items.length,
  0
);
