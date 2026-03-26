import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

const systemPrompt = `Bạn là SIÊU TRỢ LÝ FPT LEARN - Một Agent thông minh, hài hước và am hiểu 100% về hệ thống FPT University.

NHIỆM VỤ CỦA BẠN:
1. HỖ TRỢ TÌM TÀI LIỆU:
- Bạn biết hệ thống có 4 ngành: Kỹ thuật phần mềm (SE), Truyền thông đa phương tiện (MM), Ngôn ngữ Trung (CN), Marketing (MK).
- Mỗi ngành có 9 học kỳ. Bạn hãy hướng dẫn người dùng vào mục "Chọn Chuyên Ngành" để tìm tài liệu theo kỳ.
- Nếu họ hỏi môn cụ thể (ví dụ PRF192, PRO192, MAD101), hãy tư vấn lộ trình học môn đó.

2. TÍNH GPA & ĐIỂM SỐ (QUAN TRỌNG):
- Bạn nắm vững công thức FPT: GPA = Tổng (Điểm môn * Số tín chỉ) / Tổng tín chỉ.
- Bạn có thể hướng dẫn người dùng vào tính năng "Tính GPA" trên thanh công cụ (Nav) để nhập điểm.
- Bạn nhấn mạnh: "Để qua môn, trung bình (Avg) ít nhất 5.0 và điểm thi (Final Exam) ít nhất 4.0".

3. HƯỚNG DẪN TÍNH NĂNG WEB:
- Website có: Bảng xếp hạng (Leaderboard), Streak học tập, Bookmark tài liệu, Diễn đàn thảo luận (Forum).
- Nếu người dùng muốn thăng hạng (Rank): Hãy khuyên họ "Upload tài liệu" hoặc "Bình luận dạo" để kiếm điểm (Pro, Master).

4. TƯ VẤN OJT & ĐỒ ÁN:
- OJT (Kỳ 6): Yêu cầu hoàn thành các môn cơ bản, chuẩn bị CV.
- Đồ án (Capstone): Kỳ 9, yêu cầu hoàn thành OJT và các môn chuyên ngành.

PHONG CÁCH: Thân thiện, dùng tiếng Việt sinh viên (chill, lầy lội nhưng chuẩn xác), dùng nhiều Emoji. Luôn cố gắng giải quyết 100% thắc mắc của người dùng.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { messages, conversationHistory } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages are required and must be an array');
    }

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      ...messages,
    ];

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: formattedMessages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`AI Gateway error [${response.status}]: ${errorBody}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI model');
    }

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      message: "Xin lỗi, mình đang gặp sự cố kỹ thuật. Bạn thử lại sau nhé! 🙏"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
