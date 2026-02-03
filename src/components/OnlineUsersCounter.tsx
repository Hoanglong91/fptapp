import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OnlineUsersCounterProps {
  compact?: boolean;
}

export default function OnlineUsersCounter({ compact = false }: OnlineUsersCounterProps) {
  const { onlineCount, loading } = useOnlineUsers();

  if (loading) {
    return null;
  }

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
              {onlineCount}
            </span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{onlineCount} người đang trực tuyến</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20"
    >
      <div className="relative">
        <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
          {onlineCount}
        </span>
        <span className="text-xs text-muted-foreground">đang trực tuyến</span>
      </div>
    </motion.div>
  );
}
