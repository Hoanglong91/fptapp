-- Allow all authenticated users to view learning streaks
-- This fixes the issue where others' streaks show as 0 on their profiles

DROP POLICY IF EXISTS "Users can view their own streak" ON public.learning_streaks;
CREATE POLICY "Public learning streaks are viewable by everyone" 
ON public.learning_streaks 
FOR SELECT 
USING (true);

-- Also ensure admins have full access just in case
DROP POLICY IF EXISTS "Admins can manage all streaks" ON public.learning_streaks;
CREATE POLICY "Admins can manage all streaks" ON public.learning_streaks
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
