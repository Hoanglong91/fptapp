import { motion } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import FavoritesList from '@/components/profile/FavoritesList';
import Chatbot from '@/components/Chatbot';
import CommunityChat from '@/components/CommunityChat';

export default function FavoritesPage() {
  const navigate = useNavigate();

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                Môn học yêu thích
              </h1>
              <p className="text-sm text-muted-foreground">
                Danh sách các môn học bạn đã đánh dấu yêu thích
              </p>
            </div>
          </div>
        </motion.div>

        {/* Favorites List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl sm:rounded-2xl border border-border/50 p-4 sm:p-6"
        >
          <FavoritesList />
        </motion.div>
      </main>

      <CommunityChat />
      <Chatbot />
    </div>
  );
}
