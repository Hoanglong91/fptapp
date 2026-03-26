import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  student_id: string | null;
  major: string | null;
  points: number;
  rank: string;
  created_at: string;
  updated_at: string;
  role?: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // 2. Fetch Role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const userRole = (roleData as any)?.role || 'student';

      if (profileError && profileError.code === 'PGRST116') {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            display_name: user.email?.split('@')[0] || 'User',
            points: 0,
            rank: 'Newbie'
          })
          .select()
          .single();
        
        setProfile(newProfile ? { 
          ...newProfile, 
          role: userRole,
            points: (newProfile as any).points || 0,
            rank: (newProfile as any).rank || 'Newbie'
        } : null);
      } else if (profileData) {
        setProfile({ 
          ...profileData, 
          role: userRole,
          points: (profileData as any).points || 0,
          rank: (profileData as any).rank || 'Newbie'
        } as any);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data as any);
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error as Error };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, updateProfile, refetch: fetchProfile };
}
