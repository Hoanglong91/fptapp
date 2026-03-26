-- Admin Master Crown & Ranking Exclusion
-- 1. Update all existing admins to Master rank with 9999 points
UPDATE public.profiles
SET points = 9999,
    rank = 'Master',
    updated_at = now()
WHERE user_id IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
);

-- 2. Log this as a special achievement in points history
INSERT INTO public.points_history (user_id, points, action, description)
SELECT user_id, 9999, 'admin_crown', 'Quyền năng tối thượng của Admin'
FROM public.user_roles 
WHERE role = 'admin'
ON CONFLICT DO NOTHING;

-- 3. Ensure future admins also get initialized correctly if needed
-- (Though they are usually set manually by other admins)
