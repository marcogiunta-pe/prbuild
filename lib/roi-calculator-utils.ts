/**
 * Pure logic for ROI calculator. Used by ROICalculator and tests.
 */
export const CURRENT_COSTS = {
  prweb: { perRelease: 400, name: 'PRWeb' },
  prnewswire: { perRelease: 800, name: 'PR Newswire' },
  agency: { perRelease: 1500, name: 'PR Agency' },
  none: { perRelease: 0, name: 'Writing yourself' },
} as const;

export type CurrentServiceKey = keyof typeof CURRENT_COSTS;

export function getPrbuildCost(releasesPerMonth: number): number {
  if (releasesPerMonth <= 1) return 9;
  if (releasesPerMonth <= 3) return 29;
  return 79;
}

export function getCurrentMonthlyCost(service: CurrentServiceKey, releasesPerMonth: number): number {
  return CURRENT_COSTS[service].perRelease * releasesPerMonth;
}

export function getMonthlySavings(service: CurrentServiceKey, releasesPerMonth: number): number {
  const current = getCurrentMonthlyCost(service, releasesPerMonth);
  const prbuild = getPrbuildCost(releasesPerMonth);
  return Math.max(0, current - prbuild);
}

export function getAnnualSavings(service: CurrentServiceKey, releasesPerMonth: number): number {
  return getMonthlySavings(service, releasesPerMonth) * 12;
}

export function isBigWin(annualSavings: number, threshold = 5000): boolean {
  return annualSavings >= threshold;
}
