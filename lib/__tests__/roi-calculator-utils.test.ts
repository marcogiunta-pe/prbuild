import {
  getPrbuildCost,
  getCurrentMonthlyCost,
  getMonthlySavings,
  getAnnualSavings,
  isBigWin,
} from '../roi-calculator-utils';

describe('roi-calculator-utils', () => {
  describe('getPrbuildCost', () => {
    it('returns 9 for 1 release per month', () => {
      expect(getPrbuildCost(1)).toBe(9);
    });
    it('returns 29 for 2 or 3 releases', () => {
      expect(getPrbuildCost(2)).toBe(29);
      expect(getPrbuildCost(3)).toBe(29);
    });
    it('returns 79 for 5 or 10 releases', () => {
      expect(getPrbuildCost(5)).toBe(79);
      expect(getPrbuildCost(10)).toBe(79);
    });
  });

  describe('getCurrentMonthlyCost', () => {
    it('computes prweb cost correctly', () => {
      expect(getCurrentMonthlyCost('prweb', 2)).toBe(800);
      expect(getCurrentMonthlyCost('prweb', 1)).toBe(400);
    });
    it('returns 0 for none', () => {
      expect(getCurrentMonthlyCost('none', 5)).toBe(0);
    });
  });

  describe('getMonthlySavings', () => {
    it('returns 0 when current cost is less than PRBuild', () => {
      expect(getMonthlySavings('none', 2)).toBe(0);
    });
    it('returns positive savings when current cost exceeds PRBuild', () => {
      expect(getMonthlySavings('prweb', 2)).toBe(800 - 29);
      expect(getMonthlySavings('prweb', 1)).toBe(400 - 9);
    });
  });

  describe('getAnnualSavings', () => {
    it('is 12x monthly savings', () => {
      const monthly = getMonthlySavings('prweb', 2);
      expect(getAnnualSavings('prweb', 2)).toBe(monthly * 12);
    });
  });

  describe('isBigWin', () => {
    it('returns true when annual savings >= 5000', () => {
      expect(isBigWin(5000)).toBe(true);
      expect(isBigWin(6000)).toBe(true);
    });
    it('returns false when annual savings < 5000', () => {
      expect(isBigWin(4999)).toBe(false);
      expect(isBigWin(0)).toBe(false);
    });
    it('respects custom threshold', () => {
      expect(isBigWin(3000, 2000)).toBe(true);
      expect(isBigWin(1000, 2000)).toBe(false);
    });
  });
});
