# PRBuild

AI-powered press release creation and distribution service with human quality control.

## Features

- **Professional PR Writing**: AI-assisted drafts refined by humans
- **16-Persona Panel Review**: Journalists, PR writers, and target customers critique every release
- **Human Quality Gate**: Every release is reviewed before publication
- **Journalist Distribution**: Published to showcase and emailed to interested journalists
- **Category Newsletter**: Weekly digest to journalists who opt-in

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend
- **AI**: OpenAI GPT-4

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- OpenAI API key
- Resend account (for emails)

### 1. Clone and Install

```bash
cd releasepro
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_STARTER_PRICE_ID` - Stripe price ID for $9 plan
- `STRIPE_GROWTH_PRICE_ID` - Stripe price ID for $19 plan
- `STRIPE_PRO_PRICE_ID` - Stripe price ID for $39 plan
- `OPENAI_API_KEY` - OpenAI API key
- `RESEND_API_KEY` - Resend API key
- `NEXT_PUBLIC_APP_URL` - Your app URL (http://localhost:8765 for dev)

### 3. Set Up Supabase Database

1. Create a new Supabase project
2. Go to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL

### 4. Set Up Stripe

1. Create products and prices in Stripe Dashboard:
   - Starter: $9 one-time payment
   - Growth: $19 one-time payment
   - Pro: $39 one-time payment
2. Copy the price IDs to your `.env.local`
3. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Enable `checkout.session.completed` event

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:8765](http://localhost:8765)

## Project Structure

```
releasepro/
├── app/
│   ├── (marketing)/          # Public pages (landing, pricing)
│   ├── (auth)/               # Login, signup
│   ├── dashboard/            # Client dashboard
│   ├── admin/                # Admin dashboard
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── landing/              # Landing page sections
│   ├── dashboard/            # Dashboard components
│   └── admin/                # Admin components
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── prompts/              # AI prompts (PR generation, panel critique)
│   └── utils.ts              # Utility functions
├── types/                    # TypeScript types
└── supabase/
    └── schema.sql            # Database schema
```

## The Workflow

1. **Client submits request** → Pays via Stripe → Fills intake form
2. **AI generates draft** → Admin clicks "Generate Draft"
3. **AI panel critiques** → 16 personas provide feedback
4. **Admin reviews & refines** → Selects headline, edits content
5. **Send to client** → Client reviews and provides feedback
6. **Client approves** → Move to final formatting
7. **Quality review** → Internal quality check
8. **Publish** → Posted to showcase, distributed to journalists

## AI Prompts

### PR Generation Prompt
Located in `lib/prompts/pr-generation.ts`

Produces:
- 3 headline options
- Subhead
- Full press release (dateline, lead, body, quotes, boilerplate, contact)
- Visuals suggestions
- Distribution checklist

### Panel Critique Prompt
Located in `lib/prompts/panel-critique.ts`

16 personas:
- 5 journalists (industry-specific)
- 3 PR writers (agency, corporate, former editor)
- 3 marketing experts
- 5 target customers

Produces:
- Individual feedback from each persona
- Synthesis of top 3 themes
- Contrarian recommendation (remove, sharpen, risk, ignore)

Industry-specific panels available for:
- Healthcare
- Technology
- Finance
- Retail
- General

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app is a standard Next.js 14 application and can be deployed to any platform that supports Node.js.

## TODO / Coming Soon

- [ ] Client dashboard pages
- [ ] Admin dashboard pages
- [ ] Showcase public pages
- [ ] Journalist subscription flow
- [ ] Newsletter sending system
- [ ] Email templates (Resend)
- [ ] File upload for supporting materials
- [ ] Analytics dashboard

## License

Private - All rights reserved

## Support

For questions or issues, contact [your-email@example.com]
