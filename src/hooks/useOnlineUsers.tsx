import { usePresence } from '@/context/PresenceContext';

export function useOnlineUsers() {
  const { onlineCount, onlineUserIds, loading } = usePresence();
  return { onlineCount, onlineUserIds, loading };
}
