'use client';

import { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ROICalculator() {
  const [releasesPerMonth, setReleasesPerMonth] = useState(2);
  const [currentService, setCurrentService] = useState<'prweb' | 'prnewswire' | 'agency' | 'none'>('prweb');
  
  const currentCosts = {
    prweb: { perRelease: 400, name: 'PRWeb' },
    prnewswire: { perRelease: 800, name: 'PR Newswire' },
    agency: { perRelease: 1500, name: 'PR Agency' },
    none: { perRelease: 0, name: 'Writing yourself' },
  };
  
  const prbuildCost = releasesPerMonth <= 1 ? 9 : releasesPerMonth <= 3 ? 29 : 79;
  const currentMonthlyCost = currentCosts[currentService].perRelease * releasesPerMonth;
  const savings = Math.max(0, currentMonthlyCost - prbuildCost);
  const annualSavings = savings * 12;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">PR Savings Calculator</h3>
          <p className="text-sm text-gray-500">See how much you could save with PRBuild</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Releases per month */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many press releases do you need per month?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setReleasesPerMonth(num)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  releasesPerMonth === num
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        {/* Current service */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you currently use?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(currentCosts).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setCurrentService(key as typeof currentService)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  currentService === key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {value.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Your current cost</span>
            <span className="font-semibold text-gray-900">
              ${currentMonthlyCost.toLocaleString()}/month
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">PRBuild cost</span>
            <span className="font-semibold text-primary">
              ${prbuildCost}/month
            </span>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-semibold">Monthly savings</span>
              <span className="font-bold text-green-600 text-xl">
                ${savings.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Annual savings</span>
              <span className="font-semibold text-green-600">
                ${annualSavings.toLocaleString()}/year
              </span>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <Link href="/signup" className="block">
          <Button className="w-full bg-secondary hover:bg-secondary/90">
            Start Saving Today — First Release Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        
        <p className="text-xs text-gray-500 text-center">
          Plus, PRBuild includes writing—others don't.
        </p>
      </div>
    </div>
  );
}

export default ROICalculator;
