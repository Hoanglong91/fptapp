-- 1. Add foreign key from discussions.user_id to profiles.user_id
-- This is necessary for Supabase to perform the join in the select() query
-- Since profiles.user_id is already UNIQUE, it can be used as a reference target.

ALTER TABLE public.discussions
DROP CONSTRAINT IF EXISTS fk_discussions_profiles;

ALTER TABLE public.discussions
ADD CONSTRAINT fk_discussions_profiles
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
ON DELETE CASCADE;

-- 2. Also do the same for chat_messages (optional but good for consistency)
ALTER TABLE public.chat_messages
DROP CONSTRAINT IF EXISTS fk_chat_messages_profiles;

ALTER TABLE public.chat_messages
ADD CONSTRAINT fk_chat_messages_profiles
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
ON DELETE CASCADE;

-- 3. Verify RLS (Ensuring SELECT is still public)
-- This is just to be safe
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Discussions are viewable by everyone" ON public.discussions;
CREATE POLICY "Discussions are viewable by everyone" ON public.discussions
FOR SELECT USING (true);
