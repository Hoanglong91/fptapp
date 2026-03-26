/**
 * Gamification utility functions for FPT Learn
 */

export type UserRank = 'Newbie' | 'Pro' | 'Master';

/**
 * Calculates the rank based on points
 * Rank Tiers:
 * - Newbie: < 100 points
 * - Pro: 100 - 499 points
 * - Master: >= 500 points
 */
export const calculateRank = (points: number): UserRank => {
  if (points < 100) return 'Newbie';
  if (points < 500) return 'Pro';
  return 'Master';
};

/**
 * Calculates the percentage progress to the next rank
 */
export const getRankProgress = (points: number): number => {
  if (points < 100) return (points / 100) * 100;
  if (points < 500) return ((points - 100) / 400) * 100;
  return 100;
};
