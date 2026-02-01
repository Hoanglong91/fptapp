import { motion } from 'framer-motion';
import { Briefcase, BookOpen, Calendar, TrendingUp } from 'lucide-react';

interface SemesterCardProps {
  semester: {
    id: number;
    name: string;
    type: string;
    description?: string;
  };
  index: number;
  onClick: () => void;
}

export default function SemesterCard({ semester, index, onClick }: SemesterCardProps) {
  const isInternship = semester.type === 'internship';
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 100 }}
      className={`relative flex items-center ${isEven ? 'md:justify-start' : 'md:justify-end'} py-2 md:py-6`}
    >
      {/* Timeline Dot */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.06 + 0.2 }}
        className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-background shadow-lg ${
          isInternship ? 'bg-warning' : 'bg-primary'
        }`} />
      </motion.div>

      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full md:w-[calc(50%-2rem)] lg:w-[calc(50%-3rem)] cursor-pointer ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}
      >
        <div className={`relative overflow-hidden p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
          isInternship 
            ? 'bg-gradient-to-br from-warning/5 via-warning/10 to-primary/5 border-warning/30 hover:border-warning hover:shadow-[0_8px_30px_-12px_rgba(251,191,36,0.4)]'
            : 'bg-card border-border hover:border-primary hover:shadow-[0_8px_30px_-12px_rgba(251,113,79,0.3)]'
        }`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-secondary rounded-full blur-2xl" />
          </div>

          <div className="relative flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* Semester Number */}
            <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-lg sm:text-xl md:text-2xl shadow-lg shrink-0 ${
              isInternship
                ? 'bg-gradient-to-br from-warning to-warning/80 text-warning-foreground'
                : 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
            }`}>
              {semester.id}
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                <span className="text-[6px] sm:text-[8px] text-success-foreground font-bold">✓</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold mb-0.5 sm:mb-1 truncate">{semester.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                {isInternship ? (
                  <>
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning shrink-0" />
                    <span className="truncate">Kỳ thực tập</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">{semester.description || 'Học kỳ chính quy'}</span>
                  </>
                )}
              </p>
            </div>

            {/* Arrow or Icon */}
            <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
              isInternship ? 'bg-warning/20 text-warning' : 'bg-primary/10 text-primary'
            }`}>
              {isInternship ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
          </div>

          {/* Hover Effect - Gradient Line */}
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 ${
              isInternship ? 'bg-gradient-to-r from-warning via-primary to-warning' : 'bg-gradient-to-r from-primary via-secondary to-primary'
            }`}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
