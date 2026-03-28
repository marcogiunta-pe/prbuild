'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Persona data                                                       */
/* ------------------------------------------------------------------ */
const PERSONAS = [
  { initials: 'MR', name: 'Maya Reeves', beat: 'Tech / Startups', color: '#C23B22' },
  { initials: 'DK', name: 'David Kim', beat: 'Enterprise / SaaS', color: '#2E7D8C' },
  { initials: 'SP', name: 'Sarah Park', beat: 'Healthcare', color: '#B5873A' },
  { initials: 'JT', name: 'James Torres', beat: 'Finance / FinTech', color: '#5B4A8A' },
  { initials: 'LC', name: 'Lisa Chen', beat: 'Consumer Tech', color: '#3A7D44' },
  { initials: 'RW', name: 'Robert Walsh', beat: 'Manufacturing', color: '#8B4513' },
  { initials: 'AN', name: 'Anika Nair', beat: 'Sustainability', color: '#6B4C8A' },
  { initials: 'MG', name: 'Marcus Grant', beat: 'Retail / E-com', color: '#C2672E' },
  { initials: 'EF', name: 'Elena Franco', beat: 'Biotech / Pharma', color: '#2E5A88' },
  { initials: 'TH', name: 'Tom Hayes', beat: 'Cybersecurity', color: '#7A3B2E' },
  { initials: 'PL', name: 'Priya Lakshmi', beat: 'Education / EdTech', color: '#4A7C59' },
  { initials: 'CB', name: 'Chris Blake', beat: 'Real Estate', color: '#8A6B3A' },
  { initials: 'NJ', name: 'Nina Johansson', beat: 'Climate / Energy', color: '#3B5E8A' },
  { initials: 'OM', name: 'Oscar Mendez', beat: 'Media / Entertainment', color: '#8A3B5E' },
  { initials: 'KR', name: 'Karen Russell', beat: 'Supply Chain / Logistics', color: '#5E8A3B' },
  { initials: 'WZ', name: 'Wei Zhang', beat: 'Semiconductors / Hardware', color: '#3B8A7A' },
];

const COMPARE_ROWS = [
  { label: 'Distribution', wire: 'Blasted to junk sites', pr: 'Direct to journalist inboxes', wireX: false, prCheck: false },
  { label: 'Targeting', wire: 'None \u2014 everyone gets everything', pr: 'By beat & sector', wireX: true, prCheck: true },
  { label: 'Pre-publish review', wire: 'None', pr: '16-persona panel', wireX: true, prCheck: true },
  { label: 'Writing quality', wire: "You're on your own", pr: 'Professionally written', wireX: false, prCheck: false },
  { label: 'Analytics', wire: 'Pickup count (maybe)', pr: 'Real-time open/read tracking', wireX: true, prCheck: true },
  { label: 'Category newsletter', wire: 'No', pr: 'Weekly digest by sector', wireX: true, prCheck: true },
  { label: 'SEO-optimized page', wire: 'No', pr: 'PRBuild Showcase', wireX: true, prCheck: true },
  { label: 'Cost', wire: '$400+ per release', pr: 'First release free', wireX: false, prCheck: false, prBrass: true },
];

/* ------------------------------------------------------------------ */
/*  Slide wrapper                                                      */
/* ------------------------------------------------------------------ */
function Slide({
  active,
  variant = 'light',
  children,
}: {
  active: boolean;
  variant?: 'light' | 'dark' | 'accent';
  children: React.ReactNode;
}) {
  const base =
    'absolute inset-0 flex flex-col justify-center items-center px-6 sm:px-10 lg:px-24 overflow-hidden transition-all duration-500';
  const visibility = active
    ? 'opacity-100 pointer-events-auto translate-y-0 z-[2]'
    : 'opacity-0 pointer-events-none translate-y-3';
  const bg =
    variant === 'dark'
      ? 'bg-ink text-paper'
      : variant === 'accent'
        ? 'bg-primary text-white'
        : 'bg-paper text-ink';

  return <div className={`${base} ${visibility} ${bg}`}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/*  Reusable tiny components                                           */
/* ------------------------------------------------------------------ */
function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`font-mono text-[0.7rem] tracking-[0.18em] uppercase mb-2 ${className}`}
    >
      {children}
    </div>
  );
}

function Tagline({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-accent italic text-[clamp(1.2rem,2vw,1.6rem)] mt-3 ${className}`}>
      {children}
    </p>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-ink/[0.04] border border-ink/[0.08] rounded-lg p-5 ${className}`}>
      {children}
    </div>
  );
}

function DraftLine({ width = 'w-full' }: { width?: string }) {
  return <div className={`h-2 bg-paper rounded ${width} mb-1.5`} />;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function HowItWorksSlides() {
  const TOTAL_SLIDES = 14;
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  const goTo = useCallback(
    (n: number) => {
      if (n >= 0 && n < TOTAL_SLIDES) setCurrent(n);
    },
    [],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* keyboard */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  /* click to advance */
  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) return;
    const x = e.clientX / window.innerWidth;
    if (x > 0.5) next();
    else prev();
  }

  /* swipe */
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      diff < 0 ? next() : prev();
    }
  }

  const progress = ((current + 1) / TOTAL_SLIDES) * 100;

  return (
    <div
      className="w-full h-screen relative overflow-hidden bg-ink select-none"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ============================================================ */}
      {/*  SLIDE 0 — Title                                             */}
      {/* ============================================================ */}
      <Slide active={current === 0} variant="dark">
        <div className="max-w-[1100px] w-full text-center">
          <SectionLabel className="text-ink-muted">The press release platform</SectionLabel>
          <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.1]">PRBuild</h1>
          <Tagline className="text-paper/50 text-[clamp(1.3rem,2.2vw,1.7rem)]">
            Professional press releases, reviewed by 16 journalist personas,
            <br className="hidden sm:block" />
            delivered to real inboxes.
          </Tagline>
          <div className="mt-12 flex justify-center gap-8 sm:gap-12">
            {[
              { value: '847', label: 'Releases published' },
              { value: '23%', label: 'Pickup rate' },
              { value: '16', label: 'Reviewer personas' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <span className="font-mono font-bold text-secondary text-[1.8rem] leading-none block">
                  {s.value}
                </span>
                <div className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-paper/35 mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 1 — What you need                                     */}
      {/* ============================================================ */}
      <Slide active={current === 1}>
        <div className="max-w-[1100px] w-full">
          <SectionLabel className="text-ink-muted">Your goals</SectionLabel>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
            What you need from a press release
          </h2>
          <p className="text-ink-muted max-w-[600px] mt-2 text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed">
            Every founder, marketer, and comms lead shares the same core objectives.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-7">
            {[
              {
                icon: '\u2709',
                title: 'Get media coverage',
                desc: 'You need journalists to write about your company. Not vanity placements \u2014 real articles in publications your customers read.',
              },
              {
                icon: '\uD83D\uDCE3',
                title: 'Announce news professionally',
                desc: 'Product launch, funding round, partnership \u2014 you need a polished, AP-style release that makes your news credible.',
              },
              {
                icon: '\uD83C\uDFC6',
                title: 'Build credibility & trust',
                desc: 'A well-written release signals legitimacy. Investors, partners, and customers Google you \u2014 what do they find?',
              },
              {
                icon: '\uD83D\uDCC8',
                title: 'Reach the right journalists',
                desc: 'Not a spray-and-pray blast. Your release should land in front of reporters who cover your exact beat and sector.',
              },
            ].map((c) => (
              <Card key={c.title}>
                <span className="text-[1.8rem] block mb-3">{c.icon}</span>
                <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.8rem)] leading-[1.1] mb-2">{c.title}</h3>
                <p className="text-ink-muted text-[0.95rem] leading-relaxed">{c.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 2 — Pains                                             */}
      {/* ============================================================ */}
      <Slide active={current === 2}>
        <div className="max-w-[1100px] w-full">
          <SectionLabel className="text-primary">The problem</SectionLabel>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
            Why press releases are{' '}
            <em className="italic text-primary">so painful</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            {[
              {
                title: 'DIY writing sounds robotic',
                desc: 'You spend hours writing a release that reads like a corporate Mad Lib. No journalist wants to touch it.',
              },
              {
                title: 'Wire services are expensive and useless',
                desc: 'You pay $400+ to blast your release to thousands of junk sites. Zero real journalists see it. Zero coverage.',
              },
              {
                title: 'No feedback before you publish',
                desc: 'You hit "send" and pray. No one tells you the headline is weak, the lede buries the news, or the quote sounds fake.',
              },
              {
                title: 'No idea if anyone reads it',
                desc: 'After publishing, silence. Did a journalist see it? You will never know. It is a black hole.',
              },
            ].map((c, i) => (
              <div
                key={c.title}
                className="border-l-[3px] border-primary bg-primary/[0.04] rounded-lg p-5"
              >
                <div className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-primary mb-1.5">
                  Pain {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.8rem)] leading-[1.1] mb-2">{c.title}</h3>
                <p className="text-ink-muted text-[0.95rem] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 max-w-[520px]">
            <div className="border-l-[3px] border-primary bg-primary/[0.04] rounded-lg p-5">
              <div className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-primary mb-1.5">
                Pain 05
              </div>
              <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.8rem)] leading-[1.1] mb-2">
                Agencies cost thousands per month
              </h3>
              <p className="text-ink-muted text-[0.95rem] leading-relaxed">
                A real PR agency costs $3,000&ndash;$10,000/mo. For an early-stage company, that is not
                an option.
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 3 — Gains                                             */}
      {/* ============================================================ */}
      <Slide active={current === 3}>
        <div className="max-w-[1100px] w-full">
          <SectionLabel className="text-secondary">What you want</SectionLabel>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
            What would{' '}
            <em className="italic text-secondary">delight</em> you?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            {[
              {
                title: 'Journalists actually read it',
                desc: 'Your release lands in a journalist\u2019s inbox \u2014 someone who covers your exact industry \u2014 and they find it worth opening.',
              },
              {
                title: 'Professional quality, accessible cost',
                desc: 'AP-style prose, tight headlines, real structure \u2014 without hiring an agency or spending weeks learning press release conventions.',
              },
              {
                title: 'Expert feedback before publishing',
                desc: 'Imagine 16 different journalist perspectives telling you what works and what doesn\u2019t \u2014 before you go live. Every time.',
              },
              {
                title: 'Know exactly who is reading',
                desc: 'Real-time analytics. See when a journalist opens your release, how long they read, and whether they clicked through.',
              },
            ].map((c, i) => (
              <div
                key={c.title}
                className="border-l-[3px] border-secondary bg-secondary/[0.06] rounded-lg p-5"
              >
                <div className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1.5">
                  Gain {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.8rem)] leading-[1.1] mb-2">{c.title}</h3>
                <p className="text-ink-muted text-[0.95rem] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 4 — Transition                                        */}
      {/* ============================================================ */}
      <Slide active={current === 4} variant="dark">
        <div className="max-w-[1100px] w-full text-center">
          <SectionLabel className="text-secondary">The solution</SectionLabel>
          <h1 className="font-display text-[clamp(2.6rem,5.5vw,4.4rem)] leading-[1.1]">
            Here&rsquo;s how <span className="text-primary">PRBuild</span>
            <br />
            solves this.
          </h1>
          <Tagline className="text-paper/50">Four steps. One platform. Real results.</Tagline>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 5 — Step 1: Tell us your news                         */}
      {/* ============================================================ */}
      <Slide active={current === 5}>
        <div className="max-w-[1100px] w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1">
              <SectionLabel className="text-ink-muted">Step 1 of 4</SectionLabel>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
                Tell us your news
              </h2>
              <p className="text-ink-muted mt-2 max-w-[420px] text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed">
                Five minutes. Answer a few questions about what you are announcing. No writing skill
                required &mdash; just the facts.
              </p>
              <div className="mt-5">
                <Card className="inline-flex items-center gap-2 !p-2.5 !px-4">
                  <span className="font-mono text-[0.7rem] text-secondary">{'\u23F1'}</span>
                  <span className="font-mono text-[0.75rem] text-ink-muted">
                    Average completion: <strong className="text-ink">4 min 32 sec</strong>
                  </span>
                </Card>
              </div>
            </div>
            <div className="lg:w-[42%] w-full">
              <div className="bg-white rounded-lg shadow-[0_8px_40px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-5">
                <div className="flex gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                {[
                  { label: 'Company Name', value: 'Acme Robotics' },
                  { label: "What's the news?", value: 'Series A funding round' },
                  { label: 'Key details', value: '$12M led by Sequoia. Expanding to 3 new markets. Hiring 40 engineers...', tall: true },
                  { label: 'Industry', value: 'Technology / Robotics' },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1 mb-3">
                    <label className="font-body text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                      {f.label}
                    </label>
                    <div
                      className={`bg-paper border border-[#ddd] rounded-md px-3 font-body text-[0.9rem] text-ink flex items-${f.tall ? 'start pt-2' : 'center'} ${f.tall ? 'h-16' : 'h-9'}`}
                    >
                      {f.value}
                    </div>
                  </div>
                ))}
                <div className="inline-flex items-center justify-center px-5 py-2 bg-primary text-white rounded-md font-body font-semibold text-[0.85rem] mt-1">
                  Continue &rarr;
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 6 — Step 2: We write it                               */}
      {/* ============================================================ */}
      <Slide active={current === 6}>
        <div className="max-w-[1100px] w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1">
              <SectionLabel className="text-ink-muted">Step 2 of 4</SectionLabel>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
                We write a professional release
              </h2>
              <p className="text-ink-muted mt-2 max-w-[420px] text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed">
                Our editorial engine crafts a full AP-style press release with three headline options.
                You choose the angle that fits.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                {[
                  '3 headline options',
                  'AP-style formatting',
                  'Boilerplate & contact block',
                  'Unlimited revisions',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-secondary">{'\u2713'}</span>
                    <span className="text-[0.9rem]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-[42%] w-full">
              <div className="bg-white rounded-lg shadow-[0_8px_40px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-5">
                <div className="flex gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="font-mono text-[0.6rem] text-ink-muted uppercase tracking-[0.12em] mb-3">
                  Choose a headline
                </div>
                {[
                  { text: 'Acme Robotics Raises $12M Series A to Expand Autonomous Delivery Fleet', selected: true },
                  { text: 'Sequoia Backs Acme Robotics in $12M Round as Demand for Delivery Bots Surges', selected: false },
                  { text: 'Acme Robotics Secures $12M to Bring Autonomous Delivery to Three New Markets', selected: false },
                ].map((h) => (
                  <div key={h.text} className="flex items-center gap-3 py-2.5 border-b border-ink/[0.06] last:border-b-0">
                    <div
                      className={`w-[18px] h-[18px] rounded-full flex-shrink-0 ${
                        h.selected
                          ? 'border-2 border-primary bg-primary shadow-[inset_0_0_0_3px_#fff]'
                          : 'border-2 border-[#ccc]'
                      }`}
                    />
                    <div className="font-display text-[1rem]">{h.text}</div>
                  </div>
                ))}
                <div className="mt-4 border-t border-[#eee] pt-3">
                  <div className="font-mono text-[0.55rem] text-ink-muted uppercase tracking-[0.1em] mb-2">
                    Draft preview
                  </div>
                  <DraftLine width="w-[85%]" />
                  <DraftLine />
                  <DraftLine width="w-[60%]" />
                  <DraftLine width="w-[85%]" />
                  <DraftLine />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 7 — Step 3: 16 Personas                               */}
      {/* ============================================================ */}
      <Slide active={current === 7}>
        <div className="max-w-[1100px] w-full">
          <SectionLabel className="text-ink-muted">Step 3 of 4 &mdash; The Secret Weapon</SectionLabel>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
            16 journalist personas review your release
          </h2>
          <p className="text-ink-muted max-w-[650px] mt-2 text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed">
            Before you publish, your release goes through a panel of 16 simulated journalist
            reviewers &mdash; each with a unique beat, publication style, and set of standards. They
            catch what you would miss.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            {PERSONAS.map((p) => (
              <div
                key={p.initials}
                className="flex items-center gap-2.5 bg-ink/[0.03] border border-ink/[0.07] rounded-lg py-2 px-2.5"
              >
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-mono font-bold text-[0.7rem] text-white flex-shrink-0"
                  style={{ background: p.color }}
                >
                  {p.initials}
                </div>
                <div className="flex flex-col">
                  <span className="font-body font-semibold text-[0.75rem] leading-tight">{p.name}</span>
                  <span className="font-mono text-[0.6rem] text-ink-muted uppercase tracking-[0.08em]">
                    {p.beat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 8 — Step 3b: Panel feedback                           */}
      {/* ============================================================ */}
      <Slide active={current === 8}>
        <div className="max-w-[1100px] w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1">
              <SectionLabel className="text-ink-muted">Step 3 continued</SectionLabel>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
                What the panel catches
              </h2>
              <p className="text-ink-muted mt-2 max-w-[420px] text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed">
                Each persona scores the release PASS or REVISE and leaves specific, actionable
                feedback. Then the panel synthesizes a final recommendation.
              </p>
              <div className="mt-5 space-y-3">
                {[
                  {
                    initials: 'MR',
                    color: '#C23B22',
                    name: 'Maya Reeves',
                    beat: 'Tech / Startups',
                    score: 'pass' as const,
                    comment:
                      '\u201CStrong lede. The funding amount is front-loaded, which is good. I\u2019d cut the CEO quote by half \u2014 it reads like marketing copy, not a real person talking.\u201D',
                  },
                  {
                    initials: 'JT',
                    color: '#5B4A8A',
                    name: 'James Torres',
                    beat: 'Finance / FinTech',
                    score: 'revise' as const,
                    comment:
                      '\u201CMissing key financial context. What\u2019s the total raised to date? What\u2019s the valuation? Without those, this feels like it\u2019s hiding something.\u201D',
                  },
                  {
                    initials: 'LC',
                    color: '#3A7D44',
                    name: 'Lisa Chen',
                    beat: 'Consumer Tech',
                    score: 'pass' as const,
                    comment:
                      '\u201CClean structure. The \u2018three new markets\u2019 angle is compelling but needs specifics \u2014 which markets? Name them.\u201D',
                  },
                ].map((fb) => (
                  <div
                    key={fb.initials}
                    className="bg-white rounded-lg border border-ink/[0.08] p-4"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[0.6rem] text-white"
                        style={{ background: fb.color }}
                      >
                        {fb.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-[0.8rem]">{fb.name}</div>
                        <div className="font-mono text-[0.6rem] text-ink-muted uppercase tracking-[0.08em]">
                          {fb.beat}
                        </div>
                      </div>
                      <div
                        className={`ml-auto font-mono font-bold text-[0.7rem] px-2.5 py-0.5 rounded ${
                          fb.score === 'pass'
                            ? 'bg-[rgba(40,200,64,0.12)] text-[#1a8a2a]'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {fb.score.toUpperCase()}
                      </div>
                    </div>
                    <p className="font-accent italic text-[0.95rem] text-ink leading-relaxed">
                      {fb.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-[42%] w-full pt-0 lg:pt-14">
              <div className="bg-paper border-2 border-secondary rounded-lg p-5">
                <div className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-secondary mb-1.5">
                  Panel Synthesis
                </div>
                <div className="flex gap-4 my-2.5">
                  <div className="text-center">
                    <div className="font-mono font-bold text-[1.4rem] text-[#1a8a2a]">13</div>
                    <div className="font-mono text-[0.55rem] text-ink-muted uppercase tracking-[0.1em]">
                      Pass
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-bold text-[1.4rem] text-primary">3</div>
                    <div className="font-mono text-[0.55rem] text-ink-muted uppercase tracking-[0.1em]">
                      Revise
                    </div>
                  </div>
                </div>
                <p className="font-body text-[0.9rem] text-ink">
                  <strong>Recommendation:</strong> Publish with minor revisions. Add total funding
                  history, name the three expansion markets, and trim the CEO quote to two sentences.
                </p>
              </div>
              <div className="mt-4 p-3.5 bg-secondary/[0.08] rounded-lg">
                <div className="font-mono text-[0.6rem] text-secondary uppercase tracking-[0.12em] mb-1">
                  The difference
                </div>
                <p className="text-[0.85rem] text-ink-muted">
                  Releases that go through the panel have a{' '}
                  <strong className="text-ink">2.4x higher pickup rate</strong> than those published
                  without review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 9 — Step 4: Dashboard                                 */}
      {/* ============================================================ */}
      <Slide active={current === 9}>
        <div className="max-w-[1100px] w-full">
          <SectionLabel className="text-ink-muted">Step 4 of 4</SectionLabel>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
            Review, approve, publish
          </h2>
          <p className="text-ink-muted max-w-[600px] mt-2 text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed">
            Your dashboard shows the full draft plus every piece of feedback. Approve it, request
            changes, or ask for a full rewrite. Unlimited revisions until you are happy.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 mt-5 max-w-[750px] w-full">
            <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="font-display text-[1.05rem]">
                    Acme Robotics Raises $12M Series A...
                  </div>
                  <div className="font-mono text-[0.6rem] text-ink-muted mt-0.5">
                    Draft v2 &middot; Updated 2 hours ago
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded bg-secondary/[0.12] text-secondary">
                  &#9679; In Review
                </div>
              </div>
              <DraftLine width="w-[85%]" />
              <DraftLine />
              <DraftLine width="w-[60%]" />
              <DraftLine />
              <DraftLine width="w-[85%]" />
              <DraftLine width="w-[60%]" />
              <DraftLine />
              <DraftLine width="w-[85%]" />
              <div className="flex gap-2.5 mt-5">
                <div className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md font-body font-semibold text-[0.78rem]">
                  Approve &amp; Publish
                </div>
                <div className="inline-flex items-center justify-center px-4 py-2 bg-transparent text-ink-muted border border-[#ddd] rounded-md font-body font-semibold text-[0.78rem]">
                  Request Changes
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Panel Score', value: '13/16', sub: 'PASS votes' },
                { label: 'Revisions', value: 'Unlimited', sub: 'until you\u2019re happy' },
                { label: 'Timeline', value: '24 hrs', sub: 'typical turnaround' },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4"
                >
                  <div className="font-mono text-[0.6rem] text-secondary uppercase tracking-[0.1em] mb-1.5">
                    {card.label}
                  </div>
                  <div className="font-mono font-bold text-[1.6rem] text-ink leading-none">
                    {card.value}
                  </div>
                  <div className="font-mono text-[0.6rem] text-ink-muted">{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 10 — Distribution hero                                */}
      {/* ============================================================ */}
      <Slide active={current === 10} variant="accent">
        <div className="max-w-[1100px] w-full text-center">
          <SectionLabel className="text-white/50">Distribution</SectionLabel>
          <h1 className="font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-[1.1] text-white max-w-[900px] mx-auto">
            Your release goes to journalists who actually want it.
          </h1>
          <p className="font-accent italic text-[clamp(1.1rem,1.8vw,1.4rem)] text-white/65 mt-5 max-w-[600px] mx-auto">
            Not a wire. Not a blast. Targeted delivery to opted-in reporters, by beat and sector.
          </p>
          <div className="mt-12 w-20 h-0.5 bg-white/30 mx-auto" />
          <div className="mt-4 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-white/40">
            This is what makes PRBuild different
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 11 — Four distribution channels                       */}
      {/* ============================================================ */}
      <Slide active={current === 11} variant="accent">
        <div className="max-w-[1100px] w-full">
          <SectionLabel className="text-white/50">Four Distribution Channels</SectionLabel>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-white mb-1">
            Every release. Four paths to coverage.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            {[
              {
                icon: '\u2709',
                title: 'Direct Journalist Email',
                desc: 'Your release lands in the real inbox of opted-in journalists who cover your beat. Not a press list \u2014 reporters who asked to receive releases in your category.',
                stat: '23%',
                statLabel: 'Average pickup rate',
              },
              {
                icon: '\uD83D\uDCF0',
                title: 'Category Newsletter',
                desc: 'Weekly industry digest curated by sector. Journalists subscribe to the beats they cover. Your release appears alongside relevant news.',
                stat: '12',
                statLabel: 'Industry categories',
              },
              {
                icon: '\uD83C\uDF10',
                title: 'PRBuild Showcase',
                desc: 'A public, SEO-optimized gallery of your release. Shareable URL. Indexed by Google. A permanent link for investors, partners, and customers.',
                stat: 'SEO',
                statLabel: 'Optimized & indexed',
              },
              {
                icon: '\uD83D\uDCCA',
                title: 'Analytics Dashboard',
                desc: 'Real-time tracking. See when a journalist opens your release, how long they read, which links they click.',
                stat: 'Live',
                statLabel: 'Real-time tracking',
              },
            ].map((ch) => (
              <div
                key={ch.title}
                className="bg-white/[0.12] border border-white/[0.18] rounded-xl p-6 backdrop-blur-sm"
              >
                <span className="text-[2rem] block mb-2.5">{ch.icon}</span>
                <h3 className="font-display text-white text-[1.15rem] leading-[1.1] mb-1.5">
                  {ch.title}
                </h3>
                <p className="text-white/70 text-[0.88rem] leading-relaxed mb-3">{ch.desc}</p>
                <div className="font-mono font-bold text-[1.6rem] text-white leading-none">
                  {ch.stat}
                </div>
                <div className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-white/50 mt-0.5">
                  {ch.statLabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 12 — Comparison table                                 */}
      {/* ============================================================ */}
      <Slide active={current === 12} variant="dark">
        <div className="max-w-[1100px] w-full text-center">
          <SectionLabel className="text-secondary">The Comparison</SectionLabel>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
            PRBuild vs. Wire Services
          </h2>
          <div className="overflow-x-auto mt-8">
            <table className="w-full max-w-[900px] mx-auto border-collapse text-left">
              <thead>
                <tr>
                  <th className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-secondary pb-4 px-4" />
                  <th className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-secondary pb-4 px-4">
                    Wire Services
                  </th>
                  <th className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-secondary pb-4 px-4">
                    PRBuild
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-paper/10">
                    <td className="text-paper/50 font-medium py-2.5 px-4 text-[0.92rem]">
                      {row.label}
                    </td>
                    <td className="text-paper/35 py-2.5 px-4 text-[0.92rem]">
                      {row.wireX && <span className="text-primary mr-1">{'\u2717'}</span>}
                      {row.wire}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-[0.92rem] font-semibold ${
                        row.prBrass ? 'text-secondary' : 'text-paper'
                      }`}
                    >
                      {row.prCheck && <span className="text-[#28C840] mr-1">{'\u2713'}</span>}
                      {row.pr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Slide>

      {/* ============================================================ */}
      {/*  SLIDE 13 — CTA                                              */}
      {/* ============================================================ */}
      <Slide active={current === 13} variant="dark">
        <div className="max-w-[1100px] w-full text-center">
          <SectionLabel className="text-secondary">Get Started</SectionLabel>
          <h1 className="font-display text-[clamp(2.6rem,5.5vw,4rem)] leading-[1.1] mb-2.5">
            Your first release is free.
          </h1>
          <p className="font-accent italic text-[clamp(1.2rem,2vw,1.5rem)] text-paper/50 max-w-[500px] mx-auto">
            No credit card. No catch.
            <br />
            Just tell us your news.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-white rounded-lg font-body font-bold text-[1.1rem] mt-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(194,59,34,0.35)]"
          >
            Get Your Free Release &rarr;
          </Link>
          <div className="font-mono text-[0.75rem] tracking-[0.1em] text-paper/30 mt-5">
            prbuild.ai
          </div>
          <div className="mt-12 flex justify-center gap-6 sm:gap-12 flex-wrap">
            {['Professional writing', '16-persona review', '4-channel distribution', 'Real-time analytics'].map(
              (item) => (
                <div key={item} className="text-center">
                  <div className="font-mono font-semibold text-[0.75rem] text-paper/50">{item}</div>
                </div>
              ),
            )}
          </div>
        </div>
      </Slide>

      {/* Progress bar */}
      <div
        className="fixed bottom-0 left-0 h-[3px] bg-primary transition-all duration-400 z-[100]"
        style={{ width: `${progress}%` }}
      />

      {/* Slide counter */}
      <div className="fixed bottom-4 right-4 z-[100] font-mono text-[0.65rem] tracking-[0.1em] text-paper/30 select-none pointer-events-none">
        {current + 1} / {TOTAL_SLIDES}
      </div>

      {/* Navigation hint on first slide */}
      {current === 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] font-mono text-[0.65rem] tracking-[0.12em] uppercase text-paper/25 animate-pulse pointer-events-none">
          Click or press arrow keys to navigate
        </div>
      )}
    </div>
  );
}
