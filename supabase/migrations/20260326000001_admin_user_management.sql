-- Grant admins full control over profiles and user_roles
-- This allows Editing (Update) and Deleting (Delete)

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 2. User Roles Policies
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Note: ON DELETE CASCADE is already set on FKs to auth.users in the early migrations.
-- Deleting a profile/role via these policies will work for cleaning up site data.
