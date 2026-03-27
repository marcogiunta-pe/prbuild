# Design System — PRBuild

## Product Context
- **What this is:** AI-powered press release writing service with human quality control
- **Who it's for:** Startups and small businesses that need professional press releases
- **Space/industry:** PR services, AI writing tools — competitors include PRWeb, Newswire, BrandPush, Copy.ai, Jasper
- **Project type:** Marketing site + SaaS web app (landing pages, client dashboard, admin dashboard, journalist showcase)

## Aesthetic Direction
- **Direction:** Editorial / Publication
- **Decoration level:** Intentional — hairline rules, column dividers, subtle paper-grain texture. No blobs, no gradients, no floating shapes. Decoration comes from typographic hierarchy and spatial rhythm.
- **Mood:** A modern newsroom's digital design system — warm paper, dark ink, editorial red accents, taut asymmetric layouts that feel urgent, credible, and pre-publication. The product IS publishing — the design signals that.
- **Reference sites:** Financial Times, The Economist, The Atlantic (aesthetic DNA); Jasper, Copy.ai, PRWeb, Newswire, BrandPush (competitive landscape — deliberately departed from)

## Typography
- **Display/Hero:** Instrument Serif — modern editorial authority, tight letterspacing. Used for hero headlines, section headers, page titles. Never lightweight — always regular or italic.
- **Body:** DM Sans — geometric warmth, excellent readability at all sizes. Used for body text, UI labels, buttons, navigation.
- **Pull Quotes/Taglines:** Cormorant Garamond Italic — classical accent, used very sparingly for testimonials, editorial pull quotes, and taglines only.
- **Data/Tables:** JetBrains Mono — review counts, timestamps, pricing figures, status badges, panel scores. Signals precision. Not decorative — only for data.
- **Code:** JetBrains Mono
- **Loading:** Google Fonts CDN
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  ```
- **Scale:**
  - Hero: clamp(48px, 5.5vw, 80px)
  - H2: 36px
  - H3: 28px
  - H4: 20px
  - Body: 16px
  - Small/UI: 14px
  - Caption/Label: 13px
  - Mono metadata: 12px
  - Micro label: 10-11px (uppercase, tracked)

## Color

### Light Mode
- **Approach:** Restrained — editorial red is the only strong color. Used sparingly and with authority.
- **Background (--bg):** `#F5F0E8` — warm paper, not app gray
- **Surface (--surface):** `#FFFDF8` — printed stock, cards, panels
- **Surface 2 (--surface-2):** `#E8E0D2` — kraft, secondary backgrounds, sidebar active states
- **Text Primary (--text-primary):** `#141414` — pressroom black
- **Text Muted (--text-muted):** `#6B6660` — column gray, secondary text
- **Ink Soft (--ink-soft):** `#2A2A2A` — softer black for body text
- **Accent (--accent):** `#C23B22` — editorial red, CTAs, active states, badges
- **Accent Dark (--accent-dark):** `#8E2F1D` — hover states on accent
- **Secondary (--secondary):** `#B5873A` — aged brass, used sparingly for premium moments (pricing labels, featured badges)
- **Rule (--rule):** `#CCC0AD` — hairline dividers, borders, table rules
- **Semantic:** success `#2E7D32`, warning `#E65100`, error `#C23B22` (same as accent), info `#6B6660` (same as muted)

### Dark Mode
- **Background:** `#1A1917`
- **Surface:** `#242320`
- **Surface 2:** `#2E2D29`
- **Text Primary:** `#EDE8DF`
- **Text Muted:** `#9B9590`
- **Accent:** `#E05A45` (slightly brighter for contrast)
- **Accent Dark:** `#C23B22`
- **Secondary:** `#D4A34E`
- **Rule:** `#3D3A34`

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)

## Layout
- **Approach:** Creative-editorial — asymmetric grids, sections that break out of centered boxes
- **Grid:** Hero is 60/40 asymmetric split. Content sections use 1200px max-width but can bleed to edges for emphasis.
- **Max content width:** 1200px
- **Dashboard:** Newsroom desk feel — sidebar + data table, not glassy card farm. Lists, annotations, statuses, queues.
- **Journalist showcase:** Masthead grid — personas as publication contributors with initials, name, beat, bio. Not feature icons.
- **Border radius:** Hierarchical — sm: 3px (buttons, badges), md: 6px (cards, inputs), lg: 10px (modals, large panels), full: 9999px (avatars)

### UI Language
- **Buttons:** Dark ink or editorial red, nearly rectangular (3px radius), compact, assertive
- **Borders:** Hairline rules in `--rule`, used often. Prefer `border-bottom` dividers over box shadows
- **Cards:** Rare. Prefer panels, columns, strips, and ruled sections. When cards are necessary, use 1px border in `--rule`, not shadow
- **Tables:** Mono font for data columns, hairline row separators, uppercase tracked column headers
- **Status badges:** Mono font, 2px radius, subtle background tint

## Motion
- **Approach:** Minimal-functional — restrained and purposeful
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150-250ms) medium(250-400ms) long(400-700ms)
- **Patterns:** Slide-ins like sheets entering an editor's desk. Highlight sweeps on review comments. Fade-up for scroll-triggered sections (0.4s ease-out). No bouncy microinteractions, no confetti, no pulse-glow.
- **Reduced motion:** Always respect `prefers-reduced-motion: reduce`

## Anti-Patterns (never use)
- Purple/violet gradients
- 3-column feature grid with icons in colored circles
- Centered everything with uniform spacing
- Uniform bubbly border-radius on all elements
- Gradient buttons
- Generic stock-photo hero sections
- Decorative blobs, floating shapes, or AI sparkle effects
- Generic shadcn default card farms
- System fonts as primary typography

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-26 | Initial design system created | Created by /design-consultation. Three-model consensus (Claude + Codex + Claude subagent): editorial/publication aesthetic because PRBuild produces content for journalists — the design should signal publishing authority, not generic SaaS. |
| 2026-03-26 | Instrument Serif over Playfair Display | Both proposed by different models. Instrument Serif chosen for modern freshness vs. Playfair's increasing overuse in editorial web design. |
| 2026-03-26 | Warm paper backgrounds over white/gray | All three models converged on this. Warm paper (#F5F0E8) gives tangible, physical quality — like holding a newspaper. No competitor in the space does this. |
| 2026-03-26 | Editorial red (#C23B22) over navy/teal | Current navy (#1E3A5F) + teal (#0B7A6F) reads "healthcare fintech." Editorial red signals urgency and credibility — the language of newsrooms. |
| 2026-03-26 | Journalist personas as masthead, not feature icons | Transforms a feature list into a cast of characters. Makes the AI feel like a team you hired, not software. |
