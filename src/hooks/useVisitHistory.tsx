import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface VisitLog {
  id: string;
  visit_date: string;
  created_at: string;
}

export function useVisitHistory() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<VisitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitHistory = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('visit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('visit_date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching visit history:', error);
      } else {
        setVisits(data || []);
      }
    } catch (error) {
      console.error('Error fetching visit history:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVisitHistory();
  }, [fetchVisitHistory]);

  return { visits, loading, refetch: fetchVisitHistory };
}
