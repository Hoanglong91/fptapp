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
        .maybeSingle();

      if (!data) {
        // No streak record exists, create one
        const { data: newStreak, error: insertError } = await supabase
          .from('learning_streaks')
          .insert({ user_id: user.id })
          .select()
          .single();
        
        if (newStreak) {
          setStreak({
            currentStreak: 0,
            longestStreak: 0,
            totalVisits: 0,
            lastVisitDate: null,
          });
        }
        return;
      }

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
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const recordVisit = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      // 1. Check if already visited today
      const { data: existingVisit } = await supabase
        .from('visit_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('visit_date', today)
        .maybeSingle();

      if (existingVisit) {
        // Even if visited, we should fetch latest streak to be sure UI is in sync
        await fetchStreak();
        return;
      }

      // 2. Log new visit
      const { error: visitError } = await supabase
        .from('visit_logs')
        .insert({ user_id: user.id, visit_date: today });

      if (visitError) throw visitError;

      // 3. Update streak data (upsert logic)
      const { data: streakData } = await supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (!streakData) {
        // Create first streak record
        await supabase
          .from('learning_streaks')
          .insert({
            user_id: user.id,
            current_streak: 1,
            longest_streak: 1,
            total_visits: 1,
            last_visit_date: today
          });
      } else {
        // Update existing streak
        let newStreak = 1;
        if (streakData.last_visit_date === yesterdayStr) {
          newStreak = (streakData.current_streak || 0) + 1;
        } else if (streakData.last_visit_date === today) {
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
      }

      // 4. Force refresh the UI
      await fetchStreak();
    } catch (error) {
      console.error('Error recording visit:', error);
    }
  }, [user, fetchStreak]);

  useEffect(() => {
    if (user) {
      recordVisit();
    }
  }, [user, recordVisit]);

  return { streak, loading, recordVisit, refetch: fetchStreak };
}
