import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PresenceContextType {
  onlineCount: number;
  onlineUserIds: string[];
  loading: boolean;
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setOnlineCount(0);
      setOnlineUserIds([]);
      return;
    }

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    const updatePresence = () => {
      const state = channel.presenceState();
      const ids = Object.keys(state);
      setOnlineUserIds(ids);
      setOnlineCount(ids.length);
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        updatePresence();
        setLoading(false);
      })
      .on('presence', { event: 'join' }, () => {
        updatePresence();
      })
      .on('presence', { event: 'leave' }, () => {
        updatePresence();
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  return (
    <PresenceContext.Provider value={{ onlineCount, onlineUserIds, loading }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (context === undefined) {
    throw new Error('usePresence must be used within a PresenceProvider');
  }
  return context;
};
