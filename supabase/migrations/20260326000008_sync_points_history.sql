-- Schema Synchronization for points_history
-- This fixes the "column points does not exist" error and ensures consistency with automation triggers

-- 1. Rename points_added to points (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'points_history' AND column_name = 'points_added') THEN
        ALTER TABLE public.points_history RENAME COLUMN points_added TO points;
    END IF;
END $$;

-- 2. Add missing columns used by automation suite
ALTER TABLE public.points_history ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.points_history ADD COLUMN IF NOT EXISTS related_entity_id TEXT;

-- 3. Update the trigger function to use the standardized 'points' column
CREATE OR REPLACE FUNCTION public.update_profile_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Update points and rank in a single pass
    UPDATE public.profiles
    SET 
        points = COALESCE(points, 0) + NEW.points,
        rank = CASE 
            -- Note: We exclude admins from automatic rank down/up if we want, 
            -- but the user explicitely wants Admin at 9999 and Master.
            WHEN (COALESCE(points, 0) + NEW.points) < 100 THEN 'Newbie'
            WHEN (COALESCE(points, 0) + NEW.points) >= 100 AND (COALESCE(points, 0) + NEW.points) < 500 THEN 'Pro'
            ELSE 'Master'
        END
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Re-run the Admin Master update with the correct schema
UPDATE public.profiles
SET points = 9999,
    rank = 'Master',
    updated_at = now()
WHERE user_id IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
);

-- 5. Record the crowning in history
INSERT INTO public.points_history (user_id, points, action, description)
SELECT user_id, 9999, 'admin_crown', 'Quyền năng tối thượng của Admin (Schema Sync)'
FROM public.user_roles 
WHERE role = 'admin'
ON CONFLICT DO NOTHING;
