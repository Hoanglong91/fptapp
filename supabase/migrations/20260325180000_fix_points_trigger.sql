-- 1. Ensure points and rank columns exist and have defaults
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Newbie';

-- 2. Initialize existing NULL values (Crucial for the math to work)
UPDATE public.profiles SET points = 0 WHERE points IS NULL;
UPDATE public.profiles SET rank = 'Newbie' WHERE rank IS NULL;

-- 3. Robust Trigger Function with search_path and error handling
CREATE OR REPLACE FUNCTION public.update_profile_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Update points and rank in a single pass for efficiency and atomicity
    UPDATE public.profiles
    SET 
        points = COALESCE(points, 0) + NEW.points_added,
        rank = CASE 
            WHEN (COALESCE(points, 0) + NEW.points_added) < 100 THEN 'Newbie'
            WHEN (COALESCE(points, 0) + NEW.points_added) >= 100 AND (COALESCE(points, 0) + NEW.points_added) < 500 THEN 'Pro'
            ELSE 'Master'
        END
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Re-create the trigger
DROP TRIGGER IF EXISTS tr_update_points ON public.points_history;
CREATE TRIGGER tr_update_points
AFTER INSERT ON public.points_history
FOR EACH ROW EXECUTE FUNCTION public.update_profile_points();

-- 5. Fix RLS on points_history (Ensuring users can read as well, for frontend checks)
DROP POLICY IF EXISTS "Users can view own points history" ON public.points_history;
CREATE POLICY "Users can view own points history" ON public.points_history
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own points history" ON public.points_history;
CREATE POLICY "Users can insert their own points history" ON public.points_history
FOR INSERT WITH CHECK (auth.uid() = user_id);
