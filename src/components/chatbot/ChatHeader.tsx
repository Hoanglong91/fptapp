import { Bot, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize?: () => void;
}

export default function ChatHeader({ onClose, onMinimize }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary via-primary to-warning rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">FPT Assistant</h3>
          <p className="text-xs text-white/80 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Powered by AI
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {onMinimize && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMinimize}
            className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
