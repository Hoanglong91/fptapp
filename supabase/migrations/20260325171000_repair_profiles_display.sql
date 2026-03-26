-- 1. Ensure all profiles have a display_name (Fix for "Học viên FPT")
UPDATE public.profiles
SET display_name = COALESCE(display_name, split_part((SELECT email FROM auth.users WHERE auth.users.id = public.profiles.user_id), '@', 1), 'User')
WHERE display_name IS NULL OR display_name = '';

-- 2. Verify RLS for profiles again (Ensuring PUBLIC access to names)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

-- 3. Ensure admins can view everything clearly
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 4. Fix discussions mapping by ensuring correct references
-- No schema change needed, just ensuring data consistency
