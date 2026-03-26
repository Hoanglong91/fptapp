-- Phase 1 & 2: Points, Ranks, and Discussions

-- 1. Add Points and Rank columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Newbie', -- 'Newbie', 'Pro', 'Master'
ADD COLUMN IF NOT EXISTS total_points_earned INTEGER DEFAULT 0;

-- 2. Points History Table
CREATE TABLE IF NOT EXISTS public.points_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL, -- 'upload', 'download', 'like', 'comment', 'unlock_vip'
  points integer NOT NULL,
  related_entity_id text, -- ID of file, comment, etc.
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Discussion/Questions System
CREATE TABLE IF NOT EXISTS public.discussions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_id text, -- ID of the file being discussed
  course_id text, -- ID of the course
  title text, -- For questions
  content text NOT NULL,
  parent_id uuid REFERENCES public.discussions(id) ON DELETE CASCADE, -- For replies
  upvotes integer DEFAULT 0,
  is_solved boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Upvotes Table
CREATE TABLE IF NOT EXISTS public.upvotes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  discussion_id uuid REFERENCES public.discussions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, discussion_id)
);

-- 5. Enable RLS
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Points History: View own only
CREATE POLICY "Users can view own points history" ON public.points_history
FOR SELECT USING (auth.uid() = user_id);

-- Discussions: View all, delete own
CREATE POLICY "Anyone can view discussions" ON public.discussions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create discussions" ON public.discussions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can edit/delete own discussions" ON public.discussions 
FOR ALL USING (auth.uid() = user_id);

-- Upvotes: View all, delete own
CREATE POLICY "Anyone can view upvotes" ON public.upvotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can upvote" ON public.upvotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their upvote" ON public.upvotes FOR DELETE USING (auth.uid() = user_id);

-- 7. Trigger Function to Update Rank on Points Change
CREATE OR REPLACE FUNCTION public.handle_points_update()
RETURNS trigger AS $$
DECLARE
    current_points integer;
    new_rank text;
BEGIN
    -- Update profile points
    UPDATE public.profiles 
    SET points = points + NEW.points,
        total_points_earned = points + NEW.points -- Simplified for example
    WHERE user_id = NEW.user_id
    RETURNING points INTO current_points;

    -- Determine new rank
    IF current_points < 500 THEN
        new_rank := 'Newbie';
    ELSIF current_points < 2000 THEN
        new_rank := 'Pro';
    ELSE
        new_rank := 'Master';
    END IF;

    -- Update rank if changed
    UPDATE public.profiles SET rank = new_rank WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_points_change
AFTER INSERT ON public.points_history
FOR EACH ROW EXECUTE PROCEDURE public.handle_points_update();
