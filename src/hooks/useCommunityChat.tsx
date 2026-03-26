import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

interface ChatMessage {
  id: string;
  user_id: string;
  display_name: string;
  content: string;
  created_at: string;
  major: string | null;
}

interface UseCommunityChatOptions {
  major?: string | null; // null = general chat, string = specific major
}

export function useCommunityChat(options: UseCommunityChatOptions = {}) {
  const { major = null } = options;
  const { user } = useAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      let query = supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      // Filter by major: null = general, string = specific major
      if (major === null) {
        query = query.is('major', null);
      } else {
        query = query.eq('major', major);
      }

      const { data, error } = await query.limit(100);

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [major]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user || !content.trim()) return { error: 'Invalid message' };

    const displayName = profile?.display_name || user.email?.split('@')[0] || 'Ẩn danh';

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          display_name: displayName,
          content: content.trim(),
          major: major,
        });

      if (error) {
        console.error('Error sending message:', error);
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { error: 'Failed to send message' };
    }
  }, [user, profile, major]);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);
      
      if (error) {
        console.error('Error deleting message:', error);
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { error: 'Failed to delete message' };
    }
  }, [user]);

  const clearAllMessages = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await (supabase as any).rpc('clear_all_chat_messages', { _major: major });
      if (error) {
        console.error('Error clearing chat:', error);
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error('Error clearing chat:', error);
      return { error: 'Failed to clear chat' };
    }
  }, [user, major]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channelName = major === null ? 'community-chat-general' : `community-chat-${major}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          // Only add message if it belongs to this chat (same major)
          if (newMessage.major === major) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const deletedId = payload.old.id;
          setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [major]);

  return { messages, loading, sendMessage, deleteMessage, clearAllMessages, refetch: fetchMessages };
}
