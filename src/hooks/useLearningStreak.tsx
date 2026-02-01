import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  totalVisits: number;
  lastVisitDate: string | null;
}

export function useLearningStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<LearningStreak>({
    currentStreak: 0,
    longestStreak: 0,
    totalVisits: 0,
    lastVisitDate: null,
  });
  const [loading, setLoading] = useState(true);

  const recordVisit = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      // Try to insert today's visit (will fail if already exists due to UNIQUE constraint)
      const { error: visitError } = await supabase
        .from('visit_logs')
        .insert({ user_id: user.id, visit_date: today });

      // If we successfully logged a new visit, update the streak
      if (!visitError) {
        // Get current streak data
        const { data: streakData } = await supabase
          .from('learning_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (streakData) {
          const lastVisit = streakData.last_visit_date;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newStreak = 1;
          if (lastVisit === yesterdayStr) {
            // Continuing streak
            newStreak = (streakData.current_streak || 0) + 1;
          } else if (lastVisit === today) {
            // Already visited today
            newStreak = streakData.current_streak || 1;
          }

          const newLongest = Math.max(newStreak, streakData.longest_streak || 0);
          const newTotalVisits = (streakData.total_visits || 0) + 1;

          await supabase
            .from('learning_streaks')
            .update({
              current_streak: newStreak,
              longest_streak: newLongest,
              last_visit_date: today,
              total_visits: newTotalVisits,
            })
            .eq('user_id', user.id);

          setStreak({
            currentStreak: newStreak,
            longestStreak: newLongest,
            totalVisits: newTotalVisits,
            lastVisitDate: today,
          });
        }
      }
    } catch (error) {
      console.error('Error recording visit:', error);
    }
  }, [user]);

  const fetchStreak = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No streak record exists, create one
        await supabase
          .from('learning_streaks')
          .insert({ user_id: user.id });
      } else if (data) {
        // Check if streak should be reset (missed a day)
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let currentStreak = data.current_streak || 0;
        if (data.last_visit_date && data.last_visit_date !== today && data.last_visit_date !== yesterdayStr) {
          // Streak is broken
          currentStreak = 0;
          await supabase
            .from('learning_streaks')
            .update({ current_streak: 0 })
            .eq('user_id', user.id);
        }

        setStreak({
          currentStreak,
          longestStreak: data.longest_streak || 0,
          totalVisits: data.total_visits || 0,
          lastVisitDate: data.last_visit_date,
        });
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  useEffect(() => {
    if (user) {
      recordVisit();
    }
  }, [user, recordVisit]);

  return { streak, loading, recordVisit, refetch: fetchStreak };
}
