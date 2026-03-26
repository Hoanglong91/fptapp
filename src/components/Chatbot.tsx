import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Send, Sparkles, Zap, Brain } from 'lucide-react';
import ChatHeader from './chatbot/ChatHeader';
import ChatMessage, { Message } from './chatbot/ChatMessage';
import QuickReplies from './chatbot/QuickReplies';
import { askGemini } from '@/services/geminiService';
import { useLanguage } from '@/context/LanguageContext';

// ═══════════════════════════════════════════════════════════════
//  PORTAL DATABASE — Câu hỏi đã được train tay (offline, instant)
// ═══════════════════════════════════════════════════════════════
const PORTAL_DATABASE: Record<string, { keywords: string[]; answer: string }> = {
  // --- CHÀO HỎI ---
  greeting: {
    keywords: ['xin chào', 'hello', 'hi', 'chào', 'hey', 'alo', 'bạn ơi', 'chào bạn'],
    answer: "Xin chào bạn! 👋 Mình là **FPT Assistant**, trợ lý AI của Portal. Bạn cần hỗ trợ gì nào? Hỏi về **môn học, GPA, rank, tài liệu** — mình đều hỗ trợ được hết! 🤝✨",
  },
  thanks: {
    keywords: ['cảm ơn', 'thanks', 'thank you', 'cám ơn', 'tks'],
    answer: "Không có gì bạn nhé! 😊 Chúc bạn học tốt và cày rank lên Master sớm nha! 🏆🔥",
  },

  // --- SOFTWARE ENGINEERING (SE) - 9 KỲ ---
  se_ky1: {
    keywords: ['se kỳ 1', 'se ky 1', 'kỳ 1 se', 'ky 1 se', 'se kì 1'],
    answer: "💻 **Ngành SE - Kỳ 1:** PRF192, CEA201, CSI104, SSL101c, **MAE101**. ✨",
  },
  se_ky2: {
    keywords: ['se kỳ 2', 'se ky 2', 'kỳ 2 se', 'ky 2 se', 'se kì 2'],
    answer: "💻 **Ngành SE - Kỳ 2:** PRO192, MAD101, OSG202, NWC204, **WED201c**. 🔥",
  },
  se_ky3: {
    keywords: ['se kỳ 3', 'se ky 3', 'kỳ 3 se', 'ky 3 se', 'se kì 3'],
    answer: "💻 **Ngành SE - Kỳ 3:** CSD201, LAB211, MAS291, DBI202, **JPD113**,PRJ301.",
  },
  se_ky4: {
    keywords: ['se kỳ 4', 'se ky 4', 'kỳ 4 se', 'ky 4 se', 'se kì 4'],
    answer: "💻 **Ngành SE - Kỳ 4:** PRJ301, SWE202c, IOT102, SSG104, JPD123. 🚀",
  },
  se_ky5: {
    keywords: ['se kỳ 5', 'se ky 5', 'kỳ 5 se', 'ky 5 se', 'se kì 5'],
    answer: "💻 **Ngành SE - Kỳ 5:** FER202, WDU203c, SWP391, SWR302, SWT301. 💼",
  },
  se_ky6: {
    keywords: ['se kỳ 6', 'se ky 6', 'kỳ 6 se', 'ky 6 se', 'se kì 6', 'ojt'],
    answer: "💼 **Ngành SE - Kỳ 6 (OJT):** OJT202 & ENW493c (Thực tập tại doanh nghiệp). Đây là kỳ thực tập thực tế tại công ty!",
  },
  se_ky7: {
    keywords: ['se kỳ 7', 'se ky 7', 'kỳ 7 se', 'ky 7 se', 'se kì 7'],
    answer: "💻 **Ngành SE - Kỳ 7:** SE_COM2, SE_COM3, SWD392, EXE101, PMG201c.",
  },
  se_ky8: {
    keywords: ['se kỳ 8', 'se ky 8', 'kỳ 8 se', 'ky 8 se', 'se kì 8'],
    answer: "💻 **Ngành SE - Kỳ 8:** ITE302c, EXE201, MLN111, MLN122, SE_COM4, PRM393.",
  },
  se_ky9: {
    keywords: ['se kỳ 9', 'se ky 9', 'kỳ 9 se', 'ky 9 se', 'se kì 9', 'capstone'],
    answer: "🎓 **Ngành SE - Kỳ 9:** SEP490 (Capstone Project), VNR202, MLN131, HCM202. Đây là kỳ cuối làm đồ án tốt nghiệp!",
  },
  se_general: {
    keywords: ['ngành se', 'software engineering', 'phần mềm', 'nganh se'],
    answer: "💻 **Ngành SE** gồm 9 học kỳ: từ cơ bản lập trình → OJT thực tập kỳ 6 → Đồ án tốt nghiệp  . Bạn muốn xem kỳ nào cụ thể? (vd: \"kỳ 3 se\") 🎯",
  },

  // --- MULTIMEDIA ---
  multi_ky1: {
    keywords: ['multimedia kỳ 1', 'multi ky 1', 'kỳ 1 multi', 'đa phương tiện kỳ 1'],
    answer: "🎨 **Multimedia - Kỳ 1:** Photoshop, Design Basics, Hình họa.",
  },
  multi_ky2: {
    keywords: ['multimedia kỳ 2', 'multi ky 2', 'kỳ 2 multi', 'đa phương tiện kỳ 2'],
    answer: "🎨 **Multimedia - Kỳ 2:** Illustrator (AI), Premiere Pro, After Effects.",
  },

  // --- GPA ---
  gpa: {
    keywords: ['gpa', 'điểm', 'tính điểm', 'điểm trung bình', 'tinh diem', 'pass môn'],
    answer: "👉 **Công thức Tính GPA chuẩn Portal:** Σ(Điểm môn × Số tín chỉ) / Tổng tín chỉ. Lưu ý: **GPA tích lũy >= 4.0** là đạt tiêu chuẩn Pass môn/Ra trường. 🔥🧮",
  },

  // --- RANK & GAMIFICATION ---
  rank: {
    keywords: ['rank', 'hạng', 'lên hạng', 'master', 'cày rank', 'điểm thưởng', 'xếp hạng', 'leaderboard'],
    answer: "🏆 **Lên hạng Master & Điểm thưởng:**\n- **Cày điểm:** Upload tài liệu (+20đ), Like/Download (+5đ), Comment hữu ích (+10đ).\n- **Hệ thống Rank:** Newbie → Pro → Master.\n- **Đặc quyền:** Dùng điểm tải Tài liệu VIP, Đề thi chuyên sâu! 😎💎",
  },

  // --- FORUM ---
  forum: {
    keywords: ['forum', 'thảo luận', 'hỏi bài', 'bình luận', 'comment', 'diễn đàn'],
    answer: "💬 **Hướng dẫn Mini Forum:** Bạn có thể **Bình luận & Thảo luận** trực tiếp dưới từng tệp tài liệu. Hãy đặt câu hỏi bài tập và Upvote câu trả lời hay nhất nhé! 🤝✨📖",
  },

  // --- TÀI LIỆU ---
  document: {
    keywords: ['tài liệu', 'tìm tài liệu', 'download', 'tải', 'học liệu', 'file'],
    answer: "📚 **Hướng dẫn tìm tài liệu:**\n- Nhấn vào **Chuyên ngành** → Chọn **Học kỳ** → Chọn **Môn học** → Tải file.\n- Mỗi lần tải/like bạn đều được **cộng điểm rank** nhé! 📖🚀",
  },

  // --- COMMUNITY CHAT ---
  community: {
    keywords: ['community', 'chat cộng đồng', 'chat chung', 'cộng đồng'],
    answer: "🗣️ **Community Chat** là nơi tất cả sinh viên trò chuyện chung. Bạn có thể đặt câu hỏi, chia sẻ kinh nghiệm, hoặc tìm bạn học nhóm tại đây! 💬🤝",
  },

  // --- PORTAL ---
  portal: {
    keywords: ['portal là gì', 'fpt learn', 'trang web này', 'web này là gì'],
    answer: "🌐 **FPT Learn Portal** là cổng học tập dành cho sinh viên FPT, giúp bạn:\n- 📚 Xem chương trình học theo kỳ\n- 📥 Tải tài liệu môn học\n- 🧮 Tính GPA\n- 🏆 Cày rank Leaderboard\n- 💬 Thảo luận tại Forum & Community Chat",
  },
};

/**
 * Tìm câu trả lời từ database đã train.
 * Trả về answer string nếu match, null nếu không.
 */
function findTrainedAnswer(userText: string): string | null {
  const low = userText.toLowerCase().normalize('NFC');

  // Ưu tiên match cụ thể trước (SE theo kỳ)
  for (const [key, entry] of Object.entries(PORTAL_DATABASE)) {
    if (key === 'se_general') continue; // check this last
    for (const kw of entry.keywords) {
      if (low.includes(kw)) return entry.answer;
    }
  }

  // Check SE general last (broad match)
  if (PORTAL_DATABASE.se_general) {
    for (const kw of PORTAL_DATABASE.se_general.keywords) {
      if (low.includes(kw)) return PORTAL_DATABASE.se_general.answer;
    }
  }

  // Check subject code pattern (e.g. PRO192, SWP391)
  const matchSubject = userText.match(/[A-Z]{3,4}\d{3}/i);
  if (matchSubject) {
    const subject = matchSubject[0].toUpperCase();
    return `📚 **Hướng dẫn môn ${subject}:**\n- Nhấn vào **Chuyên ngành** → Chọn **Học kỳ** → Nhấn vào môn **${subject}** để tải tài liệu.\n- Bạn có thể **Comment trực tiếp** dưới file để hỏi bài nhé! 🚀📖`;
  }

  return null;
}

export default function Chatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialGreetSet, setInitialGreetSet] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Update greeting when language changes
  useEffect(() => {
    setMessages(prev => prev.map((m, i) => i === 0 ? { ...m, content: t.chatbot.greeting } : m));
  }, [t]);

  /** Hiệu ứng gõ chữ từng từ */
  const typeWords = async (text: string, msgId: string) => {
    let current = "";
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      current += words[i] + (i === words.length - 1 ? "" : " ");
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: current } : m));
      await new Promise(r => setTimeout(r, 12));
    }
  };

  const handleSend = async (text: string) => {
    const userText = text || input;
    if (!userText.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();

    // BƯỚC 1: ƯƯ TIÊN KIỂM TRA DATA ĐƯỢC TRAIN TAY (OFFLINE) ĐỂ PHẢN HỒI SIÊU TỐC
    const trainedAnswer = findTrainedAnswer(userText);
    
    if (trainedAnswer) {
      // Phản hồi lập tức không cần chờ AI "suy nghĩ"
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: "" }]);
      await typeWords(trainedAnswer, assistantMsgId);
      setIsLoading(false);
      return;
    }

    // BƯỚC 2: NẾU NGOÀI VÙNG DỮ LIỆU TRAIN TAY -> NHỜ ĐẾN AI MẠCH LẠC (GEMINI/OLLAMA)
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: "🤔 Đang suy nghĩ với AI..." }]);

    try {
      const geminiResponse = await askGemini(userText);

      // Kiểm tra xem phản hồi của AI có phải là thông báo lỗi Quota/Invalid Key từ geminiService không
      const isQuotaError = geminiResponse?.includes('Hệ thống AI đang tạm hết hạn mức');
      const isInvalidKey = geminiResponse?.includes('API key không hợp lệ');
      const isOllamaError = geminiResponse?.includes('⚠️ Lỗi kết nối AI') || geminiResponse?.includes('Không thể mượn Gemini');

      if (geminiResponse && !isQuotaError && !isInvalidKey && !isOllamaError) {
        // AI (Gemini hoặc Ollama) trả lời THÀNH CÔNG
        const taggedResponse = geminiResponse;
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: "" } : m));
        await typeWords(taggedResponse, assistantMsgId);
      } else {
        // Cả 2 AI bị sập -> Trả về câu thông báo lỗi gốc để người dùng biết
        const fallback = geminiResponse || "😅 Xin lỗi bạn, mình chưa có thông tin về vấn đề này. Bạn thử hỏi về **môn học, GPA, rank, tài liệu** tại Portal nhé! 🤝";
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: "" } : m));
        await typeWords(fallback, assistantMsgId);
      }
    } catch {
      const errorMsg = "⚠️ Không thể kết nối AI lúc này. Bạn thử lại sau nhé!";
      setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: errorMsg } : m));
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-6 z-50 flex flex-col items-end print:hidden cursor-default">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] sm:w-[500px] h-[650px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10 backdrop-blur-xl"
          >
            <ChatHeader onClose={() => setIsOpen(false)} />

            {/* AI Powered badge */}
            <div className="flex items-center justify-center gap-2 py-1.5 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-blue-500/10 border-b border-white/5">
              <Brain className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] text-purple-300/80 font-medium tracking-wide">
                {t.chatbot.poweredBy}
              </span>
              <Zap className="w-3 h-3 text-orange-400" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-black/40 to-[#121212] text-gray-200">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-[#111111] border-t border-white/10 p-4">
              <QuickReplies onSelect={handleSend} replies={[
                "Kỳ 3 SE có môn gì?", "Cày rank Master sao b?", "Portal là gì?", "Tìm tài liệu PRO192?"
              ]} />
              <div className="mt-4 flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(""); }
                  }}
                  placeholder={t.chatbot.placeholder}
                  className="flex-1 min-h-[44px] max-h-[120px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none text-gray-100 placeholder:text-gray-600 shadow-inner"
                />
                <button
                  onClick={() => handleSend("")}
                  disabled={isLoading}
                  className="bg-orange-500 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center min-w-[50px]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-orange-500 text-white shadow-xl flex items-center justify-center border-2 border-white/20 group relative overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
        {isOpen ? <span className="text-xl font-bold">✕</span> : <Sparkles className="w-8 h-8" />}
      </motion.button>
    </div>
  );
}
