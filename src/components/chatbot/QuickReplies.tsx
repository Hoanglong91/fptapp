import { motion } from 'framer-motion';

interface QuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
}

export default function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  return (
    <div className="px-4 pb-3">
      <p className="text-xs text-muted-foreground mb-2">Gợi ý câu hỏi:</p>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(reply)}
            className="px-3 py-1.5 text-xs bg-accent hover:bg-accent/80 text-accent-foreground rounded-full transition-all duration-200 hover:shadow-sm"
          >
            {reply}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
