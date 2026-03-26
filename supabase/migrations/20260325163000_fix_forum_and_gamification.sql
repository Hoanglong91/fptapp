-- FIX FORUM DISPLAY AND GAMIFICATION POINTS
-- 1. Profiles: Allow anyone to view display_name, avatar_url, rank, and points
-- This is necessary to show user info in comments and community chat
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

-- 2. Points History: Allow authenticated users to insert their own records
-- This is necessary for the frontend to record actions that award points
DROP POLICY IF EXISTS "Users can insert their own points history" ON public.points_history;
CREATE POLICY "Users can insert their own points history" ON public.points_history
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Ensure admins can still do everything on profiles (if not already covered)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 4. Discussions: Ensure everyone can see them (double check)
DROP POLICY IF EXISTS "Discussions are viewable by everyone" ON public.discussions;
CREATE POLICY "Discussions are viewable by everyone" ON public.discussions
FOR SELECT USING (true);
