import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export type UserRank = 'Newbie' | 'Pro' | 'Master';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  points: number;
  rank: UserRank;
  role?: string | null;
}

export function useGamification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [points, setPoints] = useState<number>(0);
  const [rank, setRank] = useState<UserRank>('Newbie');
  const [loading, setLoading] = useState(true);

  const fetchGamificationData = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching gamification data for user:', user.id);
      
      // Try to get profile by user_id first
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('points, rank')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Supabase error fetching profile points:', error);
        throw error;
      }
      
      if (data) {
        console.log('Gamification data found:', data);
        setPoints(data.points || 0);
        setRank((data.rank as UserRank) || 'Newbie');
      } else {
        console.warn('No profile record found for user_id:', user.id);
        // Maybe check by ID as fallback? Or just set defaults
        setPoints(0);
        setRank('Newbie');
      }
    } catch (err) {
      console.error('Error fetching gamification data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (action: 'upload' | 'download' | 'like' | 'comment') => {
    if (!user) return;

    let pointsToAdd = 0;
    let actionLabel = '';

    switch (action) {
      case 'upload': pointsToAdd = 20; actionLabel = 'Upload tài liệu'; break;
      case 'download': pointsToAdd = 5; actionLabel = 'Tải tài liệu'; break;
      case 'like': pointsToAdd = 5; actionLabel = 'Yêu thích'; break;
      case 'comment': pointsToAdd = 10; actionLabel = 'Bình luận'; break;
    }

    try {
      // Logic handled by Supabase Trigger tr_update_points on points_history table
      const { error } = await (supabase as any)
        .from('points_history')
        .insert({
          user_id: user.id,
          action,
          points_added: pointsToAdd
        });

      if (error) throw error;

      toast({
        title: `+${pointsToAdd} Điểm!`,
        description: `Bạn nhận được điểm từ hành động: ${actionLabel}`,
      });

      // Refetch to update UI
      await fetchGamificationData();
    } catch (err) {
      console.error('Error adding points:', err);
    }
  };

  useEffect(() => {
    fetchGamificationData();
    
    // Subscribe to profile changes
    const channel = supabase
      .channel('profile_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `user_id=eq.${user?.id}` },
        () => fetchGamificationData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { points, rank, loading, addPoints, refresh: fetchGamificationData };
}
