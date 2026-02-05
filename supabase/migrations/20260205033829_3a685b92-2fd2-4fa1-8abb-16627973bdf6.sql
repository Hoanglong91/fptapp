-- Add major column to chat_messages table
-- NULL = general chat for all majors
-- 'se', 'mm', 'cn', 'mk' = specific major chat
ALTER TABLE public.chat_messages 
ADD COLUMN major text DEFAULT NULL;

-- Create index for better query performance
CREATE INDEX idx_chat_messages_major ON public.chat_messages(major);