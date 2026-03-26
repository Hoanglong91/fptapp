-- Public Roles for Ranking
-- 1. Ensure all profiles have a role (default student)
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'student'
FROM public.profiles
WHERE user_id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT DO NOTHING;

-- 2. Grant Public Read Access to user_roles
-- This is necessary for the Leaderboard inner join to work for everyone
DROP POLICY IF EXISTS "Public can view all roles" ON public.user_roles;
CREATE POLICY "Public can view all roles" ON public.user_roles
FOR SELECT TO authenticated
USING (true);
