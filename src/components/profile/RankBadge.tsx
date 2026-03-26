import { Trophy, Star, Shield, Zap } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { motion } from 'framer-motion';

export default function RankBadge({ compact = false }: { compact?: boolean }) {
  const { points, rank, loading } = useGamification();

  if (loading) return null;

  const getRankIcon = () => {
    switch (rank) {
      case 'Master': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'Pro': return <Star className="w-4 h-4 text-primary" />;
      default: return <Shield className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRankColor = () => {
    switch (rank) {
      case 'Master': return 'from-yellow-500/20 via-orange-500/20 to-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Pro': return 'from-primary/20 via-purple-500/20 to-primary/20 text-primary border-primary/30';
      default: return 'from-muted via-muted/50 to-muted text-muted-foreground border-border';
    }
  };

  const nextRankPoints = rank === 'Newbie' ? 100 : rank === 'Pro' ? 500 : 0;
  const progressPercent = nextRankPoints > 0 ? (points / nextRankPoints) * 100 : 100;

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-gradient-to-r ${getRankColor()} shadow-lg shadow-black/5`}>
        {getRankIcon()}
        <span className="text-[10px] font-black uppercase tracking-widest">{rank}</span>
        <span className="text-[10px] font-black opacity-60 ml-1">[{points}đ]</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-3xl border bg-gradient-to-br ${getRankColor()} relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Zap className="w-16 h-16" />
      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="p-3 bg-background/50 rounded-2xl shadow-inner border border-white/5">
          {getRankIcon()}
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
             Rank: <span className="text-foreground">{rank}</span>
          </h4>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-black italic tracking-tighter text-foreground">
               {points} <span className="text-[10px] uppercase font-bold not-italic tracking-widest opacity-60">Điểm</span>
            </span>
            {nextRankPoints > 0 && (
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 underline underline-offset-4 decoration-dotted">
                 {nextRankPoints - points}đ tới {rank === 'Newbie' ? 'PRO' : 'MASTER'}
              </span>
            )}
          </div>
          
          {nextRankPoints > 0 && (
            <div className="mt-3 h-1 w-full bg-background/20 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progressPercent}%` }}
                 className="h-full bg-current shadow-[0_0_10px_rgba(255,255,255,0.5)]"
               />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
