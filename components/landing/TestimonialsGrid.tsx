'use client';

import { Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  { quote: "Spent $400 on PRWeb for our Series A announcement. Two clicks, zero replies. PRBuild cost us $19 and a TechCrunch reporter DM'd us the same week.", name: "Sarah Kim", title: "Head of Marketing", company: "TechFlow", initials: "SK", industry: "SaaS", score: 9 },
  { quote: "First press release ever for our company. PRBuild got us mentioned in VentureBeat, SaaS Weekly, and a fintech newsletter — all from one release.", name: "Alex Chen", title: "Founder & CEO", company: "DataSync", initials: "AC", industry: "Startup", score: 8 },
  { quote: "The journalist feedback told us our lead buried the news. We moved one sentence and our pickup rate doubled on the next release.", name: "Maria Santos", title: "Marketing Director", company: "GreenTech Solutions", initials: "MS", industry: "E-commerce", score: 9 },
  { quote: "We needed to announce a $2M grant on a shoestring budget. PRBuild handled the writing and three local papers picked it up.", name: "James Wilson", title: "Executive Director", company: "Community First Foundation", initials: "JW", industry: "Nonprofit", score: 8 },
  { quote: "Filled out the form on Monday, had a polished release by Tuesday, and a healthcare trade journal replied by Thursday. Used to take us 3 weeks to do worse.", name: "Emily Zhang", title: "Founder", company: "MedStack", initials: "EZ", industry: "Healthcare", score: 9 },
];

export function TestimonialsGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {testimonials.map((t) => (
        <Card key={t.initials} className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-gray-200 bg-white">
          <CardContent className="pt-6">
            <Quote className="h-8 w-8 text-primary/20 mb-3" />
            <p className="text-gray-700 mb-4 line-clamp-4">&quot;{t.quote}&quot;</p>
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.min(t.score, 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
              ))}
              <span className="text-sm text-gray-500 ml-1">{t.score}/10</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm">{t.initials}</span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 truncate">{t.name}</div>
                <div className="text-sm text-gray-600 truncate">{t.title}, {t.company}</div>
              </div>
            </div>
            <span className="inline-block mt-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{t.industry}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
