-- 1. Fix typo in public.has_role function (missing plpgsql)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles: Ensure they are truly public for SELECT
-- This fixes the "Học viên FPT" fallback by allowing everyone to fetch display_names
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

-- 3. Points History: Allow users to see their own history (missing in some versions)
DROP POLICY IF EXISTS "Users can view own points history" ON public.points_history;
CREATE POLICY "Users can view own points history" ON public.points_history
FOR SELECT USING (auth.uid() = user_id);

-- 4. Discussions: Ensure insertion is allowed for authenticated users
-- Double checking this to prevent "lỗi b" (bình luận)
DROP POLICY IF EXISTS "Authenticated users can create discussions" ON public.discussions;
CREATE POLICY "Authenticated users can create discussions" ON public.discussions 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Curriculum Resources: Ensure they are viewable by authenticated users
-- This fixes potential curriculum errors
DROP POLICY IF EXISTS "Curriculum is viewable by everyone" ON public.curriculum_resources;
CREATE POLICY "Curriculum is viewable by everyone" ON public.curriculum_resources
FOR SELECT USING (true);

-- 6. Ensure admins can manage curriculum
DROP POLICY IF EXISTS "Admins can manage curriculum" ON public.curriculum_resources;
CREATE POLICY "Admins can manage curriculum" ON public.curriculum_resources
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);
