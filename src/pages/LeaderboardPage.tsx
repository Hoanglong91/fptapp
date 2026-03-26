import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Zap, Award, Search, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/layout/Navbar';
import Chatbot from '@/components/Chatbot';
import CommunityChat from '@/components/CommunityChat';
import { useLanguage } from '@/context/LanguageContext';

interface LeaderboardUser {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  major: string | null;
  points: number;
  rank: string;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    fetchLeaderboard(true);

    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        () => fetchLeaderboard(false)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeaderboard = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select(`
          user_id, 
          display_name, 
          avatar_url, 
          major, 
          points, 
          rank
        `)
        .neq('role', 'admin')
        .order('points', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setUsers(data as any || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.display_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.major?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (rank: string, index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />;
    if (index === 1) return <Award className="w-6 h-6 text-slate-300 fill-slate-300/20" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-400 fill-orange-400/20" />;
    
    switch (rank) {
      case 'Master': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'Pro': return <Star className="w-4 h-4 text-primary" />;
      default: return <Shield className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container max-w-4xl pt-8 px-4">
        <header className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4"
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.leaderboard.community}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase mb-4"
          >
            {t.leaderboard.title} <span className="text-primary italic">{t.leaderboard.titleHighlight}</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.leaderboard.subtitle}
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.leaderboard.searchPlaceholder}
            className="pl-10 h-12 rounded-2xl bg-muted/30 border-border/50 focus:ring-primary/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Top 3 Podium (Desktop only for visual flair) */}
        {!searchQuery && filteredUsers.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-12 items-end px-4 hidden sm:flex">
            {/* Rank 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-3 bg-card/40 p-6 rounded-[2rem] border border-border/50 h-[220px] justify-center text-center relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-300" />
              <div className="relative">
                <Avatar className="w-16 h-16 border-4 border-slate-300 shadow-xl">
                  <AvatarImage src={filteredUsers[1].avatar_url || ''} />
                  <AvatarFallback className="bg-slate-300 text-slate-800 font-bold">#2</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-slate-300 text-slate-800 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border-4 border-card">2</div>
              </div>
              <div className="mt-2 text-center">
                <p className="font-black text-sm line-clamp-1">{filteredUsers[1].display_name || t.leaderboard.defaultName}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">{filteredUsers[1].major || 'FPTU'}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-primary">
                  <Zap className="w-3 h-3 fill-current" />
                  <span className="text-sm font-black">{filteredUsers[1].points}đ</span>
                </div>
              </div>
            </motion.div>

            {/* Rank 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 bg-primary/5 p-8 rounded-[2.5rem] border-2 border-primary/30 h-[280px] justify-center text-center relative overflow-hidden group shadow-2xl shadow-primary/10"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Avatar className="w-24 h-24 border-4 border-primary shadow-2xl">
                    <AvatarImage src={filteredUsers[0].avatar_url || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">#1</AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-black text-lg border-4 border-card">1</div>
                <Trophy className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-500 drop-shadow-lg" />
              </div>
              <div className="mt-2 text-center">
                <p className="font-black text-xl line-clamp-1">{filteredUsers[0].display_name || t.leaderboard.defaultName}</p>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{filteredUsers[0].major || 'FPTU'}</p>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-primary scale-110">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-lg font-black">{filteredUsers[0].points}đ</span>
                </div>
              </div>
            </motion.div>

            {/* Rank 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-3 bg-card/40 p-6 rounded-[2rem] border border-border/50 h-[190px] justify-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-400" />
              <div className="relative">
                <Avatar className="w-14 h-14 border-4 border-orange-400 shadow-xl">
                  <AvatarImage src={filteredUsers[2].avatar_url || ''} />
                  <AvatarFallback className="bg-orange-400 text-orange-950 font-bold">#3</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-orange-400 text-orange-950 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] border-4 border-card">3</div>
              </div>
              <div className="mt-2 text-center">
                <p className="font-black text-sm line-clamp-1">{filteredUsers[2].display_name || t.leaderboard.defaultName}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">{filteredUsers[2].major || 'FPTU'}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-primary">
                  <Zap className="w-3 h-3 fill-current" />
                  <span className="text-sm font-black">{filteredUsers[2].points}đ</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Complete List */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-md overflow-hidden rounded-[2rem]">
          <CardHeader className="border-b border-border/10 pb-4">
            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              {t.leaderboard.listTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest animate-pulse">{t.leaderboard.loading}</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-20 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">{t.leaderboard.noResults}</p>
              </div>
            ) : (
              <div className="divide-y divide-border/5">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.user_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-4 px-6 hover:bg-primary/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center font-black italic text-lg text-muted-foreground group-hover:text-primary transition-colors">
                        {index + 1}
                      </div>
                      <Avatar className="w-12 h-12 border-2 border-border/50 group-hover:border-primary/50 transition-all">
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback className="bg-muted text-xs font-bold uppercase">
                          {user.display_name?.substring(0, 2).toUpperCase() || 'FP'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                            {user.display_name || t.leaderboard.defaultName}
                          </span>
                          <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${
                            user.rank === 'Master' ? 'border-yellow-500/50 text-yellow-600 bg-yellow-500/10' :
                            user.rank === 'Pro' ? 'border-primary/50 text-primary bg-primary/10' :
                            'border-muted text-muted-foreground bg-muted/10'
                          }`}>
                            {getRankIcon(user.rank, index + 3)}
                            {user.rank}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-wide font-medium">
                          <GraduationCap className="w-3 h-3" />
                          {user.major || t.leaderboard.notUpdated}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-primary">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span className="font-black text-lg italic tracking-tighter">{user.points}</span>
                        <span className="text-[10px] font-black uppercase opacity-60 italic">đ</span>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                         {t.leaderboard.viewDetail}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <CommunityChat />
      <Chatbot />
    </div>
  );
}
