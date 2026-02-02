import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Favorite {
  id: string;
  course_id: string;
  course_name: string;
  semester_id: number;
  major: string;
  created_at: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Check if a course is favorited
  const isFavorite = useCallback(
    (courseId: string, major: string) => {
      return favorites.some((f) => f.course_id === courseId && f.major === major);
    },
    [favorites]
  );

  // Toggle favorite
  const toggleFavorite = async (
    courseId: string,
    courseName: string,
    semesterId: number,
    major: string
  ) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
      return;
    }

    const existing = favorites.find((f) => f.course_id === courseId && f.major === major);

    try {
      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;

        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        // Add favorite
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            course_id: courseId,
            course_name: courseName,
            semester_id: semesterId,
            major: major,
          })
          .select()
          .single();

        if (error) throw error;

        setFavorites((prev) => [data, ...prev]);
        toast.success('Đã thêm vào danh sách yêu thích');
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // Remove favorite by id
  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Có lỗi xảy ra khi xóa');
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    refetch: fetchFavorites,
  };
}
