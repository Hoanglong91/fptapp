import { motion } from 'framer-motion';
import { BookOpen, FileText, Youtube, Briefcase, Star, ExternalLink, Bookmark, Play, GraduationCap } from 'lucide-react';
import { CourseResource } from '@/data/courseData';

interface ResourceCardProps {
  resource: CourseResource;
  isBookmarked: boolean;
  onBookmark: (e: React.MouseEvent) => void;
  onClick: () => void;
  index: number;
}

export default function ResourceCard({ resource, isBookmarked, onBookmark, onClick, index }: ResourceCardProps) {
  const getTypeStyles = () => {
    switch (resource.type) {
      case 'documents':
        return {
          bg: 'bg-blue-500/10',
          icon: 'text-blue-500',
          border: 'hover:border-blue-500/50',
          glow: 'group-hover:shadow-blue-500/20'
        };
      case 'research':
        return {
          bg: 'bg-purple-500/10',
          icon: 'text-purple-500',
          border: 'hover:border-purple-500/50',
          glow: 'group-hover:shadow-purple-500/20'
        };
      case 'videos':
        return {
          bg: 'bg-red-500/10',
          icon: 'text-red-500',
          border: 'hover:border-red-500/50',
          glow: 'group-hover:shadow-red-500/20'
        };
      case 'internship':
        return {
          bg: 'bg-warning/10',
          icon: 'text-warning',
          border: 'hover:border-warning/50',
          glow: 'group-hover:shadow-warning/20'
        };
      default:
        return {
          bg: 'bg-muted',
          icon: 'text-muted-foreground',
          border: 'hover:border-primary/50',
          glow: ''
        };
    }
  };

  const styles = getTypeStyles();

  const getIcon = () => {
    switch (resource.type) {
      case 'documents':
        return <FileText className={`w-5 h-5 ${styles.icon}`} />;
      case 'research':
        return <BookOpen className={`w-5 h-5 ${styles.icon}`} />;
      case 'videos':
        return <Play className={`w-5 h-5 ${styles.icon}`} />;
      case 'internship':
        return <Briefcase className={`w-5 h-5 ${styles.icon}`} />;
      default:
        return <GraduationCap className={`w-5 h-5 ${styles.icon}`} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`group relative bg-card rounded-xl border border-border p-5 cursor-pointer transition-all duration-300 ${styles.border} ${styles.glow} hover:shadow-lg hover:-translate-y-1`}
    >
      {/* Type Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={onBookmark}
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            isBookmarked 
              ? 'text-primary bg-primary/10 scale-110' 
              : 'text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Icon & Source */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl ${styles.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.bg} ${styles.icon}`}>
            {resource.source}
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {resource.title}
      </h4>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="truncate max-w-[60%]">
          {resource.channel && `📺 ${resource.channel}`}
          {!resource.channel && resource.type === 'documents' && '📄 Tài liệu'}
          {!resource.channel && resource.type === 'research' && '📚 Nghiên cứu'}
          {!resource.channel && resource.type === 'internship' && '💼 Thực tập'}
        </span>
        <div className="flex items-center gap-2">
          {resource.rating && (
            <div className="flex items-center gap-1 text-warning">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-medium">{resource.rating}</span>
            </div>
          )}
          {resource.views && (
            <span className="text-xs">{resource.views}</span>
          )}
          {resource.citations && (
            <span className="text-xs">{resource.citations} citations</span>
          )}
        </div>
      </div>

      {/* Hover Action */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
        <ExternalLink className="w-4 h-4" />
        <span>Mở tài liệu</span>
        <motion.span 
          className="ml-auto"
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
}
