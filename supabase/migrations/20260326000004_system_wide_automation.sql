-- System-wide Automatic Updates & Data Repair
-- This script ensures the entire system (past, present, future) 
-- is fully synchronized without manual intervention.

-- 1. Ensure all users have profiles and streak records
INSERT INTO public.profiles (user_id, display_name, points, rank)
SELECT id, split_part(email, '@', 1), 0, 'Newbie'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, total_visits)
SELECT user_id, 0, 0, 0
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- 2. Global Point Recalculation (One-time repair for all historical activity)
-- Points: 5 per daily visit, 10 per discussion/comment
DO $$
DECLARE
    r RECORD;
    v_points INTEGER;
    d_points INTEGER;
    total INTEGER;
    new_rank TEXT;
BEGIN
    FOR r IN SELECT user_id FROM public.profiles LOOP
        -- Calculate visit points (5 pts per unique day)
        SELECT COUNT(DISTINCT visit_date) * 5 INTO v_points
        FROM public.visit_logs WHERE user_id = r.user_id;
        
        -- Calculate discussion points (10 pts per comment)
        SELECT COUNT(*) * 10 INTO d_points
        FROM public.discussions WHERE user_id = r.user_id;
        
        total := COALESCE(v_points, 0) + COALESCE(d_points, 0);
        
        -- Determine rank
        IF total < 500 THEN new_rank := 'Newbie';
        ELSIF total < 2000 THEN new_rank := 'Pro';
        ELSE new_rank := 'Master';
        END IF;

        -- Update the profile
        UPDATE public.profiles 
        SET points = total, 
            rank = new_rank,
            updated_at = now()
        WHERE user_id = r.user_id;
    END LOOP;
END $$;

-- 3. Automatic Point Trigger for Discussions (Real-time automation for all future activity)
CREATE OR REPLACE FUNCTION public.handle_discussion_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Award 10 points for a new discussion/comment
    INSERT INTO public.points_history (user_id, points, action, related_entity_id, description)
    VALUES (NEW.user_id, 10, 'comment', NEW.id::text, 'Tham gia thảo luận');
    
    -- The handle_points_update trigger (already exists) will automatically 
    -- update the profile points and rank.
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_discussion_created ON public.discussions;
CREATE TRIGGER on_discussion_created
AFTER INSERT ON public.discussions
FOR EACH ROW
EXECUTE FUNCTION public.handle_discussion_points();

-- 4. Automatic Repair for Names (Ensuring no more "Học viên FPT" fallback)
UPDATE public.profiles
SET display_name = COALESCE(display_name, (SELECT split_part(email, '@', 1) FROM auth.users WHERE auth.users.id = public.profiles.user_id))
WHERE display_name IS NULL OR display_name = '' OR display_name = 'Sinh viên FPT';

-- 5. Documentation
COMMENT ON TABLE public.profiles IS 'User profiles with fully automated points and ranking system. Last global sync: 2026-03-26.';
