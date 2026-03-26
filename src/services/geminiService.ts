import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const SYSTEM_PROMPT = `Bạn là "FPT Assistant", trợ lý AI thân thiện của Cổng Học tập FPT (FPT Learn Portal).

NGUYÊN TẮC:
- Trả lời bằng tiếng Việt, ngắn gọn, thân thiện, dùng emoji phù hợp.
- Bạn hỗ trợ sinh viên FPT về: chương trình học, GPA, môn học, thực tập OJT, đồ án capstone, tài liệu, và các vấn đề liên quan đến portal.
- Nếu không biết chính xác, hãy nói rõ và gợi ý sinh viên hỏi phòng đào tạo.
- Không bịa ra thông tin sai. Tránh trả lời về chính trị, tôn giáo, hoặc nội dung nhạy cảm.
- Trả lời ngắn gọn (tối đa 3-4 câu) trừ khi người dùng yêu cầu chi tiết.
- Dùng markdown để format (bold, bullet points) cho dễ đọc.

BỐI CẢNH:
- Portal có tính năng: Xem chương trình học theo kỳ, Download tài liệu, Tính GPA, Bảng xếp hạng (Leaderboard), Mini Forum thảo luận, Community Chat.
- Hệ thống Rank: Newbie → Pro → Master, cày điểm bằng upload tài liệu, comment, like.
- GPA >= 4.0 (thang 10) là đạt yêu cầu.`;

// Danh sách model thử theo thứ tự — nếu model đầu bị quota thì thử model tiếp theo
const MODELS_TO_TRY = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash-lite',
];

const USE_OLLAMA = import.meta.env.VITE_USE_OLLAMA === 'true';
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;

/**
 * Gọi Gemini hoặc Ollama API để trả lời câu hỏi thông minh.
 * Hệ thống tự động fallback: Ưu tiên Gemini, nếu hết Quota hoặc lỗi mạng -> Tự động xoay sang dùng Ollama.
 */
export async function askGemini(question: string): Promise<string | null> {
  // Cờ lỗi để xem có nên chạy các AI tiếp theo hay không
  let fallbackToNext = false;

  // 1️⃣ CHẾ ĐỘ GEMINI (Ưu tiên số 1)
  if (genAI && !USE_OLLAMA) {
    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`[AI Router] Thử Gemini: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\n---\nCâu hỏi của sinh viên: ${question}` }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        });

        const text = result.response.text();
        if (text) {
          console.log(`[AI Router] ✅ Gemini (${modelName}) trả lời thành công!`);
          return text;
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.warn(`[AI Router] Gemini ${modelName} thất bại:`, err.message);

        // Lỗi Quota / Lỗi Key -> Chuyển sang AI dự phòng
        if (
          err.message?.includes('429') || 
          err.message?.includes('RESOURCE_EXHAUSTED') || 
          err.message?.includes('RATE_LIMIT') || 
          err.message?.includes('404') || 
          err.message?.includes('API_KEY_INVALID') || 
          err.message?.includes('401')
        ) {
          console.log(`[AI Router] Hết Quota hoặc Key Gemini bị lỗi. Chuyển sang cỗ máy AI tiếp theo...`);
          fallbackToNext = true;
          break; // Thoát vòng lặp Gemini
        }
      }
    }
  } else if (!genAI && !USE_OLLAMA) {
    console.warn('[AI Router] Chưa có Gemini API Key. Thử dùng Groq hoặc Ollama...');
    fallbackToNext = true;
  }

  // 2️⃣ CHẾ ĐỘ GROQ (Llama 3 Cloud - Miễn phí và Chạy Online được)
  if ((fallbackToNext || (!genAI && !USE_OLLAMA)) && GROQ_API_KEY) {
    try {
      console.log(`[AI Router] Đang gọi Groq API (Llama-3 Cloud)...`);
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192', // Model tối ưu và siêu nhanh
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: question }
          ],
          temperature: 0.7,
          max_tokens: 500,
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[AI Router] ✅ Groq (Llama-3) trả lời thành công!`);
        return data.choices[0].message.content;
      } else {
        console.error(`[AI Router] Lỗi Groq API: ${response.status}`);
        fallbackToNext = true;
      }
    } catch (error) {
      console.error('[AI Router] Không thể kết nối Groq:', error);
      fallbackToNext = true;
    }
  } else if (!GROQ_API_KEY && fallbackToNext) {
      console.warn('[AI Router] Chưa có Groq API Key. Thử dùng Ollama Local...');
  }

  // 3️⃣ CHẾ ĐỘ OLLAMA (Local chạy trên Laptop/PC - Không chạy trực tiếp trên Vercel)
  if (USE_OLLAMA || fallbackToNext) {
    try {
      console.log(`[AI Router] Đang mượn sức mạnh model: ${OLLAMA_MODEL} trên máy ảo Local...`);
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: `${SYSTEM_PROMPT}\n\n---\nCâu hỏi của sinh viên: ${question}`,
          stream: false
        })
      });

      if (!response.ok) {
        console.error('[AI Router] Lỗi gọi Ollama:', response.status);
        return `⚠️ Không thể mượn Gemini/Groq (Hết hạn mức) và cũng không thể gọi Ollama Local. Hãy chắc chắn bạn đã chạy lệnh \`ollama run ${OLLAMA_MODEL}\` trên máy tính nhé!`;
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('[AI Router] Không thể kết nối Ollama:', error);
      return '⏳ Web bị mất tương tác với AI do hết hạn mức Gemini và chưa cấu hình Groq Llama 3! Trên Vercel, ứng dụng sẽ không gọi được Local Ollama ở máy bạn đâu nhé! Hãy bổ sung API Key (Gemini/Groq)!';
    }
  }

  // 4️⃣ Dự phòng cuối cùng (nếu code lọt xuống đây)
  return '⏳ Hệ thống AI đang tạm hết hạn mức miễn phí. Bạn hãy cấu hình thêm API Key của Groq hoặc Gemini để tiếp tục nhé! Hoặc hỏi mình về **môn học, GPA, rank** — những dữ liệu cứng này không cần AI! 🤝';
}
