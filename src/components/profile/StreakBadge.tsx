import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar } from 'lucide-react';

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
  totalVisits: number;
  compact?: boolean;
}

export default function StreakBadge({ 
  currentStreak, 
  longestStreak, 
  totalVisits,
  compact = false 
}: StreakBadgeProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 
                   px-3 py-1.5 rounded-full border border-orange-500/20"
      >
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="font-bold text-orange-600 dark:text-orange-400">
          {currentStreak}
        </span>
        <span className="text-xs text-muted-foreground hidden sm:inline">ngày</span>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Current Streak */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 
                   rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg"
      >
        <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-2xl" />
        <Flame className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
        <p className="text-3xl sm:text-4xl font-bold">{currentStreak}</p>
        <p className="text-xs sm:text-sm opacity-90">Chuỗi hiện tại</p>
      </motion.div>

      {/* Longest Streak */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-amber-500 
                   rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg"
      >
        <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-2xl" />
        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
        <p className="text-3xl sm:text-4xl font-bold">{longestStreak}</p>
        <p className="text-xs sm:text-sm opacity-90">Kỷ lục cá nhân</p>
      </motion.div>

      {/* Total Visits */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 
                   rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg"
      >
        <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-2xl" />
        <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
        <p className="text-3xl sm:text-4xl font-bold">{totalVisits}</p>
        <p className="text-xs sm:text-sm opacity-90">Tổng số ngày</p>
      </motion.div>
    </div>
  );
}
