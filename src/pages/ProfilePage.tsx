import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Trophy, Star, Award, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Navbar from '@/components/layout/Navbar';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordForm from '@/components/profile/PasswordForm';
import StreakBadge from '@/components/profile/StreakBadge';
import VisitHistory from '@/components/profile/VisitHistory';
import OnlineUsersCounter from '@/components/OnlineUsersCounter';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useLearningStreak } from '@/hooks/useLearningStreak';
import Chatbot from '@/components/Chatbot';
import CommunityChat from '@/components/CommunityChat';
import { MessageSquareText } from 'lucide-react';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();
  const { user, role: currentUserRole } = useAuth();
  const { profile: myProfile, loading: myProfileLoading, updateProfile } = useProfile();
  const { streak: myStreak, loading: myStreakLoading } = useLearningStreak();
  
  const [targetProfile, setTargetProfile] = useState<any>(null);
  const [targetRole, setTargetRole] = useState<string>('student');
  const [targetStreak, setTargetStreak] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const isOwnProfile = !paramUserId || paramUserId === user?.id;

  useEffect(() => {
    const fetchTargetData = async () => {
      if (isOwnProfile) return;
      
      try {
        setViewLoading(true);
        // Fetch profile
        const { data: pData, error: pError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', paramUserId)
          .single();
        
        if (pError) throw pError;
        setTargetProfile(pData);

        // Fetch streak
        const { data: sData } = await supabase
          .from('learning_streaks')
          .select('current_streak, longest_streak, total_visits')
          .eq('user_id', paramUserId)
          .single();
        
        if (sData) {
          setTargetStreak({
            currentStreak: sData.current_streak,
            longestStreak: sData.longest_streak,
            totalVisits: sData.total_visits
          });
        }

        // Fetch role via RPC
        const { data: rData } = await supabase.rpc('get_user_role', { _user_id: paramUserId });
        setTargetRole(rData || 'student');

      } catch (err) {
        console.error('Error fetching target profile:', err);
      } finally {
        setViewLoading(false);
      }
    };

    fetchTargetData();
  }, [paramUserId, isOwnProfile]);

  const displayProfile = isOwnProfile ? myProfile : targetProfile;
  const displayRole = isOwnProfile ? currentUserRole : targetRole;
  const displayStreak = isOwnProfile ? myStreak : (targetStreak || { currentStreak: 0, longestStreak: 0, totalVisits: 0 });

  const userInitials = displayProfile?.display_name?.substring(0, 2).toUpperCase() || 
                       displayProfile?.student_id?.substring(0, 2).toUpperCase() || 'U';

  if (myProfileLoading || myStreakLoading || viewLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navbar />

      <main className="container py-4 sm:py-8 px-4 sm:px-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(isOwnProfile ? '/majors' : '/admin/users')}
            className="hover:bg-muted group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {isOwnProfile ? 'Quay lại trang chủ' : 'Quay lại danh sách'}
          </Button>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-10 p-4 sm:p-6 
                     bg-card rounded-xl sm:rounded-2xl border border-border/50 shadow-sm"
        >
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-warning text-2xl sm:text-3xl font-bold text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              {displayProfile?.display_name || (isOwnProfile ? 'Sinh viên FPT' : 'Người dùng FPT')}
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-1 text-muted-foreground">
              {isOwnProfile && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              )}
              {displayProfile?.student_id && (
                <span className="hidden sm:inline text-muted-foreground/50">•</span>
              )}
              {displayProfile?.student_id && (
                <span className="text-sm font-medium">{displayProfile.student_id}</span>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider border border-primary/20 shadow-sm">
                  {displayRole || 'student'}
                </span>
                
                {/* Rank Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  displayProfile?.rank === 'Master' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' :
                  displayProfile?.rank === 'Pro' ? 'border-primary/50 text-primary bg-primary/10' :
                  'border-muted text-muted-foreground bg-muted/10'
                }`}>
                  {displayProfile?.rank === 'Master' ? <Trophy className="w-3.5 h-3.5" /> :
                   displayProfile?.rank === 'Pro' ? <Star className="w-3.5 h-3.5" /> :
                   <Award className="w-3.5 h-3.5" />}
                  {displayProfile?.rank || 'Newbie'}
                </div>

                {/* Points Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[10px] font-black uppercase tracking-widest shadow-sm">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {displayProfile?.points || 0} POINTS
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {/* Streak Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              🔥 Chuỗi học tập {isOwnProfile ? 'của bạn' : ''}
            </h2>
            <StreakBadge
              currentStreak={displayStreak.currentStreak}
              longestStreak={displayStreak.longestStreak}
              totalVisits={displayStreak.totalVisits}
            />
          </motion.div>

          {/* Online Users Section - Only show on own profile to save space */}
          {isOwnProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                👥 Cộng đồng
              </h2>
              <div className="bg-card rounded-xl border border-border/50 p-4 flex-1 flex flex-col gap-4 shadow-sm">
                <OnlineUsersCounter />
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground">
                    Kết nối ngay với các cao thủ khác trong phòng chat chung và chuyên ngành!
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full sm:w-auto h-9 text-xs gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                    onClick={() => {
                      const chatToggle = document.querySelector('button.fixed.bottom-20') as HTMLButtonElement;
                      if (chatToggle) chatToggle.click();
                    }}
                  >
                    <MessageSquareText className="w-3.5 h-3.5" />
                    Mở Chat Cộng Đồng
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Visit History - Only for own profile */}
        {isOwnProfile && (
          <div className="mb-6 sm:mb-10">
            <VisitHistory />
          </div>
        )}

        {/* Forms - Only show if it's the current user's own profile */}
        {isOwnProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ProfileForm profile={displayProfile} onUpdate={updateProfile} />
            <PasswordForm />
          </div>
        )}

        {!isOwnProfile && (
          <div className="p-12 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground italic">Bạn đang xem hồ sơ công khai của sinh viên này.</p>
          </div>
        )}
      </main>

      <CommunityChat />
      <Chatbot />
    </div>
  );
}
