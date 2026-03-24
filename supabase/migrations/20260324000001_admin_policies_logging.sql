-- Add Admin policies for visit_logs and learning_streaks
-- 1. Admins can view all visit logs
CREATE POLICY "Admins can view all visit logs" ON public.visit_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 2. Admins can view all learning streaks
CREATE POLICY "Admins can view all learning streaks" ON public.learning_streaks
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 3. Ensure profiles are created for existing users if missing (Repair script)
INSERT INTO public.profiles (user_id, display_name)
SELECT id, split_part(email, '@', 1)
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT (user_id) DO NOTHING;

-- 4. Ensure learning streaks are created for existing users if missing
INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, total_visits)
SELECT id, 0, 0, 0
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.learning_streaks)
ON CONFLICT (user_id) DO NOTHING;
