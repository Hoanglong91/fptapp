import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Briefcase, Star, ExternalLink, Heart, Play, GraduationCap, MessageSquare } from 'lucide-react';
import { CourseResource } from '@/data/courseData';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

interface ResourceCardProps {
  resource: CourseResource;
  isBookmarked: boolean;
  onBookmark: (e: React.MouseEvent) => void;
  onClick: () => void;
  index: number;
}

export default function ResourceCard({ resource, isBookmarked, onBookmark, onClick, index }: ResourceCardProps) {
  const [commentCount, setCommentCount] = useState<number>(0);
  const { t } = useLanguage();

  useEffect(() => {
    // Unique ID used in the database is often a string combination of the title/course if the ID isn't globally unique.
    // Based on how app works, resourceId is string. Let's cast it directly.
    const resourceIdStr = resource.id.toString();

    const fetchCommentCount = async () => {
      const { count, error } = await (supabase as any)
        .from('discussions')
        .select('*', { count: 'exact', head: true })
        // Need to match exactly what is saved, wait! How was resource_id stored during addComment?
        .eq('resource_id', resourceIdStr);
      
      if (!error && count !== null) {
        setCommentCount(count);
      }
    };

    fetchCommentCount();

    // Listen to real-time changes
    const channel = supabase.channel(`public:discussions:resource:${resourceIdStr}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'discussions', 
        filter: `resource_id=eq.${resourceIdStr}` 
      }, () => {
        fetchCommentCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [resource.id]);
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
        return <FileText className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.icon}`} />;
      case 'research':
        return <BookOpen className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.icon}`} />;
      case 'videos':
        return <Play className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.icon}`} />;
      case 'internship':
        return <Briefcase className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.icon}`} />;
      default:
        return <GraduationCap className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.icon}`} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className={`group relative bg-card rounded-lg sm:rounded-xl border border-border p-3 sm:p-4 md:p-5 cursor-pointer transition-all duration-300 ${styles.border} ${styles.glow} hover:shadow-lg hover:-translate-y-1`}
    >
      {/* Favorite Badge */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onBookmark}
          className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-all duration-200 ${
            isBookmarked 
              ? 'text-pink-500 bg-pink-500/10 scale-110' 
              : 'text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Icon & Source */}
      <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4 mb-2.5 sm:mb-3 md:mb-4">
        <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl ${styles.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${styles.bg} ${styles.icon}`}>
            {resource.source}
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-card-foreground text-sm sm:text-base mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors pr-6">
        {resource.title}
      </h4>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
        <span className="truncate max-w-[55%] sm:max-w-[60%]">
          {resource.channel && `📺 ${resource.channel}`}
          {!resource.channel && resource.type === 'documents' && `📄 ${t.resource.document}`}
          {!resource.channel && resource.type === 'research' && `📚 ${t.resource.research}`}
          {!resource.channel && resource.type === 'internship' && `💼 ${t.resource.internship}`}
        </span>
        <div className="flex items-center gap-3 sm:gap-4">
          {resource.rating ? (
            <div className="flex items-center gap-1 sm:gap-1.5 text-warning" title="Đánh giá chất lượng">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span className="text-xs sm:text-sm font-medium">{resource.rating}</span>
            </div>
          ) : null}
          
          <div className="flex items-center gap-1 sm:gap-1.5 opacity-80 hover:opacity-100 transition-opacity" title="Số lượt Thảo luận trong tài liệu">
             <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
             <span className="text-xs sm:text-sm font-medium">{commentCount}</span>
          </div>

          {resource.citations ? (
            <span className="text-xs sm:text-sm hidden sm:inline opacity-70">{resource.citations} {t.resource.citations}</span>
          ) : null}
        </div>
      </div>

      {/* Hover Action */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border/50 text-primary font-medium text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>{t.resource.openDoc}</span>
        <motion.span 
          className="ml-auto"
          animate={{ x: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
}
