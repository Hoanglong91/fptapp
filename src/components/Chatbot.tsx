import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ChatHeader from './chatbot/ChatHeader';
import ChatMessage, { Message } from './chatbot/ChatMessage';
import ChatInput from './chatbot/ChatInput';
import QuickReplies from './chatbot/QuickReplies';

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "👋 Xin chào! Mình là **FPT Learning Assistant** - trợ lý học tập AI của bạn.\n\nMình có thể giúp bạn:\n\n• 📚 Tìm tài liệu học tập theo ngành và kỳ\n• 📊 Hướng dẫn cải thiện GPA\n• 💼 Tips chuẩn bị thực tập\n• 🎯 Giải đáp thắc mắc về chương trình học\n\nBạn muốn hỏi gì nào?"
  }
];

const quickReplies = [
  "Làm sao để cải thiện GPA?",
  "Tìm tài liệu học lập trình",
  "Chuẩn bị thực tập như thế nào?",
  "So sánh các ngành học FPT"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get conversation history (excluding the initial greeting)
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [{ role: 'user', content: text }],
          conversationHistory
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || "Xin lỗi, mình gặp sự cố. Bạn thử lại nhé!"
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "😅 Xin lỗi, mình đang gặp trục trặc kỹ thuật. Bạn thử lại sau nhé!"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const showQuickReplies = messages.length < 3;

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-primary to-warning text-primary-foreground shadow-lg hover:shadow-glow z-50 flex items-center justify-center group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
            <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-success rounded-full border-2 border-background animate-pulse" />
            
            {/* Tooltip - hidden on mobile */}
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-card text-card-foreground text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
              Hỏi AI Assistant 💬
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-4 sm:inset-auto sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 
                       sm:w-[360px] md:w-[400px] sm:h-[500px] md:h-[600px] 
                       bg-card rounded-xl sm:rounded-2xl shadow-lifted border border-border z-50 flex flex-col overflow-hidden"
          >
            <ChatHeader onClose={() => setIsOpen(false)} />

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/30 to-background">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary/50 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">Đang suy nghĩ...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && !isLoading && (
              <QuickReplies replies={quickReplies} onSelect={handleSend} />
            )}

            {/* Input */}
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
