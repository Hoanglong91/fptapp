import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BookOpen, Trash2, ExternalLink, FolderHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

const majorNames: Record<string, string> = {
  'software-engineering': 'Kỹ thuật Phần mềm',
  'artificial-intelligence': 'Trí tuệ Nhân tạo',
  'information-security': 'An toàn Thông tin',
  'information-systems': 'Hệ thống Thông tin',
};

export default function FavoritesList() {
  const { favorites, loading, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 sm:py-12"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <FolderHeart className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
          Chưa có môn học yêu thích
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Hãy nhấn vào biểu tượng trái tim ở các môn học để thêm vào danh sách yêu thích của bạn.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/majors')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Khám phá môn học
        </Button>
      </motion.div>
    );
  }

  // Group by major
  const groupedFavorites = favorites.reduce((acc, fav) => {
    if (!acc[fav.major]) {
      acc[fav.major] = [];
    }
    acc[fav.major].push(fav);
    return acc;
  }, {} as Record<string, typeof favorites>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {favorites.length} môn học yêu thích
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {Object.entries(groupedFavorites).map(([major, items]) => (
          <motion.div
            key={major}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {majorNames[major] || major}
            </h4>
            
            <div className="grid gap-2">
              {items.map((favorite) => (
                <motion.div
                  key={favorite.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="group flex items-center gap-3 p-3 sm:p-4 bg-card rounded-lg sm:rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-sm"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm sm:text-base text-foreground truncate">
                      {favorite.course_name}
                    </h5>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Kỳ {favorite.semester_id}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => navigate(`/semesters/${major}?semester=${favorite.semester_id}`)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFavorite(favorite.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
