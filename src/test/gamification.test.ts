import { describe, it, expect } from 'vitest';
import { calculateRank, getRankProgress } from '../utils/gamification';

describe('Gamification Logic', () => {
  describe('calculateRank', () => {
    it('should return "Newbie" for points less than 100', () => {
      expect(calculateRank(0)).toBe('Newbie');
      expect(calculateRank(50)).toBe('Newbie');
      expect(calculateRank(99)).toBe('Newbie');
    });

    it('should return "Pro" for points between 100 and 499', () => {
      expect(calculateRank(100)).toBe('Pro');
      expect(calculateRank(250)).toBe('Pro');
      expect(calculateRank(499)).toBe('Pro');
    });

    it('should return "Master" for points 500 or more', () => {
      expect(calculateRank(500)).toBe('Master');
      expect(calculateRank(1000)).toBe('Master');
      expect(calculateRank(9999)).toBe('Master');
    });
  });

  describe('getRankProgress', () => {
    it('should calculate progress correctly for Newbie', () => {
      expect(getRankProgress(0)).toBe(0);
      expect(getRankProgress(50)).toBe(50);
      expect(getRankProgress(99)).toBe(99);
    });

    it('should calculate progress correctly for Pro', () => {
      // Pro is 100 to 500 (range 400)
      expect(getRankProgress(100)).toBe(0);
      expect(getRankProgress(300)).toBe(50);
      expect(getRankProgress(500)).toBe(100);
    });

    it('should return 100 for Master', () => {
      expect(getRankProgress(500)).toBe(100);
      expect(getRankProgress(1000)).toBe(100);
    });
  });
});
