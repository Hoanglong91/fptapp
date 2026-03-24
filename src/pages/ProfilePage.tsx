import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { streak, loading: streakLoading } = useLearningStreak();

  const userInitials = profile?.display_name?.substring(0, 2).toUpperCase() || 
                       user?.email?.substring(0, 2).toUpperCase() || 'U';

  if (profileLoading || streakLoading) {
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
            onClick={() => navigate('/majors')}
            className="hover:bg-muted group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
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
              {profile?.display_name || 'Sinh viên FPT'}
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              {profile?.student_id && (
                <span className="hidden sm:inline text-muted-foreground/50">•</span>
              )}
              {profile?.student_id && (
                <span className="text-sm font-medium">{profile.student_id}</span>
              )}
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider border border-primary/20 shadow-sm ml-auto sm:ml-0">
                {role || 'student'}
              </span>
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
              🔥 Chuỗi học tập của bạn
            </h2>
            <StreakBadge
              currentStreak={streak.currentStreak}
              longestStreak={streak.longestStreak}
              totalVisits={streak.totalVisits}
            />
          </motion.div>

          {/* Online Users Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              👥 Cộng đồng
            </h2>
            <OnlineUsersCounter />
          </motion.div>
        </div>

        {/* Visit History */}
        <div className="mb-6 sm:mb-10">
          <VisitHistory />
        </div>

        {/* Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ProfileForm profile={profile} onUpdate={updateProfile} />
          <PasswordForm />
        </div>
      </main>

      <Chatbot />
    </div>
  );
}
