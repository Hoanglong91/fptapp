-- GAMIFICATION & COMMUNITY FORUM SCHEMA v2

-- 1. Extend profile with points and rank
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Newbie';

-- 2. Create point history log
CREATE TABLE IF NOT EXISTS public.points_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'upload', 'download', 'like', 'comment'
    points_added INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Discussion (Forum) table
CREATE TABLE IF NOT EXISTS public.discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL, -- Linked to the document/file ID
    content TEXT NOT NULL,
    is_best_answer BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Upvotes table for answers
CREATE TABLE IF NOT EXISTS public.discussion_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, discussion_id)
);

-- 5. FUNCTION: Update profile points based on history
CREATE OR REPLACE FUNCTION public.update_profile_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET points = COALESCE(points, 0) + NEW.points_added
    WHERE user_id = NEW.user_id;
    
    -- Auto Rank Logic
    UPDATE public.profiles
    SET rank = CASE 
        WHEN points < 100 THEN 'Newbie'
        WHEN points >= 100 AND points < 500 THEN 'Pro'
        ELSE 'Master'
    END
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. TRIGGER: Update points on new history entry
DROP TRIGGER IF EXISTS tr_update_points ON public.points_history;
CREATE TRIGGER tr_update_points
AFTER INSERT ON public.points_history
FOR EACH ROW EXECUTE FUNCTION public.update_profile_points();

-- 7. RLS Policies
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_upvotes ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view points/rank
-- CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

-- Discussions: Anyone can view, logged in users can create
CREATE POLICY "Discussions are viewable by everyone" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create discussions" ON public.discussions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update their own discussions" ON public.discussions FOR UPDATE USING (auth.uid() = user_id);

-- Upvotes: Anyone can view, logged in users can toggle
CREATE POLICY "Upvotes are viewable by everyone" ON public.discussion_upvotes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can toggle upvotes" ON public.discussion_upvotes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can remove their own upvotes" ON public.discussion_upvotes FOR DELETE USING (auth.uid() = user_id);

-- 8. Default Points Logic (Optional helper function)
CREATE OR REPLACE FUNCTION public.handle_resource_action(p_user_id UUID, p_action TEXT)
RETURNS VOID AS $$
DECLARE
    v_points INTEGER;
BEGIN
    CASE p_action
        WHEN 'upload' THEN v_points := 20;
        WHEN 'download' THEN v_points := 5;
        WHEN 'like' THEN v_points := 5;
        WHEN 'comment' THEN v_points := 10;
        ELSE v_points := 0;
    END CASE;
    
    INSERT INTO public.points_history (user_id, action, points_added)
    VALUES (p_user_id, p_action, v_points);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
