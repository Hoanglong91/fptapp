import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-gradient-to-br from-secondary to-primary/50 text-primary-foreground'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-primary text-primary-foreground rounded-br-sm'
          : 'bg-muted text-foreground rounded-bl-sm'
      }`}>
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:my-2 prose-strong:text-foreground max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
