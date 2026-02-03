'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "PRWeb: $400. Result: 2 clicks, zero coverage. PRBuild: $19. Result: TechCrunch DM'd us.",
    name: "Sarah Kim",
    title: "Head of Marketing, TechFlow",
    company: "Series A Startup",
    initials: "SK",
  },
  {
    quote: "We went from zero press coverage to getting mentioned in 3 industry publications in our first month.",
    name: "Alex Chen",
    title: "Founder & CEO",
    company: "DataSync",
    initials: "AC",
  },
  {
    quote: "The journalist feedback feature alone is worth it. We learned more about PR in one release than a year of guessing.",
    name: "Maria Santos",
    title: "Marketing Director",
    company: "GreenTech Solutions",
    initials: "MS",
  },
  {
    quote: "As a nonprofit, every dollar matters. PRBuild let us announce our grant without breaking the bank.",
    name: "James Wilson",
    title: "Executive Director",
    company: "Community First Foundation",
    initials: "JW",
  },
  {
    quote: "I used to spend hours writing press releases. Now I spend 5 minutes filling out a form and get something 10x better.",
    name: "Emily Zhang",
    title: "Founder",
    company: "CloudApp",
    initials: "EZ",
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const testimonial = testimonials[current];

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="text-center px-12">
        <Quote className="h-12 w-12 text-primary/20 mx-auto mb-6" />
        <blockquote className="text-xl md:text-2xl font-medium text-gray-900 mb-6 min-h-[80px]">
          "{testimonial.quote}"
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold">{testimonial.initials}</span>
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900">{testimonial.name}</div>
            <div className="text-sm text-gray-600">{testimonial.title}, {testimonial.company}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrent(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === current ? 'bg-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialsCarousel;
