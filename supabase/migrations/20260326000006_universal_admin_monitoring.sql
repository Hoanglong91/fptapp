-- Universal Admin Access to Monitoring Tables
-- This ensures Admins can see ALL activity for the "Recent Activity" feed

-- 1. Visit Logs
DROP POLICY IF EXISTS "Admins can manage all visit logs" ON public.visit_logs;
CREATE POLICY "Admins can manage all visit logs" ON public.visit_logs
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 2. Discussions (View/Delete for Admin)
DROP POLICY IF EXISTS "Admins can manage all discussions" ON public.discussions;
CREATE POLICY "Admins can manage all discussions" ON public.discussions
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 3. Points History
DROP POLICY IF EXISTS "Admins can view all points history" ON public.points_history;
CREATE POLICY "Admins can view all points history" ON public.points_history
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
