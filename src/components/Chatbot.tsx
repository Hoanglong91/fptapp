import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "👋 Hi there! I'm your FPT Learning Assistant. I can help you with:\n\n• Finding study materials\n• Understanding website features\n• Study tips and recommendations\n• GPA calculation guidance\n\nHow can I help you today?"
  }
];

const quickReplies = [
  "How do I improve my GPA?",
  "Find resources for Programming",
  "Tips for internship prep",
  "How to use bookmarks?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call the AI edge function)
    setTimeout(() => {
      const responses: Record<string, string> = {
        'gpa': "📊 **GPA Improvement Tips:**\n\n1. **Prioritize high-credit subjects** - They impact your GPA more\n2. **Attend all classes** - Participation often counts\n3. **Start assignments early** - Avoid last-minute stress\n4. **Form study groups** - Learn from peers\n5. **Use the GPA Calculator** below to track progress!\n\nWould you like specific tips for any subject?",
        'programming': "💻 **Programming Resources:**\n\nI found great materials for you:\n\n• **Studocu:** Complete course notes\n• **YouTube:** Video tutorials from FPT Tech\n• **ResearchGate:** Academic papers\n\nGo to Semester View → Documents tab to access these. Need help with a specific topic?",
        'internship': "🎯 **Internship Preparation:**\n\n1. **Update your CV** - Highlight projects\n2. **Practice coding interviews** - LeetCode, HackerRank\n3. **Research companies** - Know their tech stack\n4. **Prepare questions** - Show genuine interest\n\nCheck Semester 6 for complete internship guides and templates!",
        'bookmark': "📚 **Using Bookmarks:**\n\n1. Browse any resource in a semester\n2. Click the 🔖 bookmark icon on the card\n3. Access saved items anytime\n\nBookmarks help you build your personal study library!"
      };

      let response = "I understand you're asking about that! Here at FPT Learn, we have resources to help. Could you be more specific about what you're looking for? I can help with:\n\n• Study materials\n• GPA calculation\n• Internship prep\n• Website features";

      const lowerText = messageText.toLowerCase();
      if (lowerText.includes('gpa') || lowerText.includes('improve')) {
        response = responses.gpa;
      } else if (lowerText.includes('programming') || lowerText.includes('resource') || lowerText.includes('find')) {
        response = responses.programming;
      } else if (lowerText.includes('internship') || lowerText.includes('prep')) {
        response = responses.internship;
      } else if (lowerText.includes('bookmark') || lowerText.includes('save')) {
        response = responses.bookmark;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-warning text-primary-foreground shadow-lg hover:shadow-glow z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-card rounded-2xl shadow-lifted border border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-warning">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">FPT Assistant</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    Online 24/7
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length < 3 && (
              <div className="px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(reply)}
                      className="whitespace-nowrap px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
