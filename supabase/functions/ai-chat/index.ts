import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

const systemPrompt = `Bạn là FPT Learning Assistant - trợ lý học tập thông minh của sinh viên FPT University. 

Vai trò của bạn:
- Giúp sinh viên tìm tài liệu học tập phù hợp
- Giải đáp thắc mắc về các môn học, chương trình đào tạo
- Chia sẻ tips học tập hiệu quả và chuẩn bị thực tập
- Hướng dẫn sử dụng website FPT Learn
- Tính toán và tư vấn cải thiện GPA

Các ngành đào tạo tại FPT:
1. Software Engineering (SE) - Kỹ thuật phần mềm
2. Multimedia (MM) - Truyền thông đa phương tiện  
3. Chinese Language (CN) - Ngôn ngữ Trung Quốc
4. Marketing (MK) - Marketing

Thông tin chương trình:
- 9 học kỳ, trong đó kỳ 6 là kỳ thực tập (OJT)
- Mỗi môn có tài liệu, video bài giảng và bài nghiên cứu liên quan
- Sinh viên có thể bookmark tài liệu yêu thích

Phong cách trả lời:
- Thân thiện, nhiệt tình như một người bạn học
- Sử dụng emoji phù hợp để tạo không khí thoải mái
- Trả lời ngắn gọn, đúng trọng tâm
- Nếu không biết, hãy thừa nhận và gợi ý nguồn khác
- Ưu tiên trả lời bằng tiếng Việt`;

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
