-- Ensure all users have profiles, roles, and streaks
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id, email, raw_user_meta_data FROM auth.users
    LOOP
        -- Insert profile if missing
        INSERT INTO public.profiles (user_id, display_name)
        VALUES (
            user_record.id, 
            COALESCE(user_record.raw_user_meta_data->>'full_name', split_part(user_record.email, '@', 1))
        )
        ON CONFLICT (user_id) DO NOTHING;

        -- Insert role if missing
        INSERT INTO public.user_roles (user_id, role)
        VALUES (user_record.id, 'student')
        ON CONFLICT (user_id) DO NOTHING;

        -- Insert steak if missing
        INSERT INTO public.learning_streaks (user_id)
        VALUES (user_record.id)
        ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
END $$;

-- Fix the trigger function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Create role (default student)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');

  -- Create learning streak
  INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, total_visits)
  VALUES (NEW.id, 0, 0, 0);
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error or just return NEW to allow user creation even if profile fails
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Re-create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure RLS allows admins to see everything
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can view all visit logs" ON public.visit_logs;
CREATE POLICY "Admins can view all visit logs" ON public.visit_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);
