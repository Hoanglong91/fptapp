-- Robust Role System for Profiles & Leaderboard Fix
-- This eliminates complex joins and ensures the Leaderboard always works

-- 1. Add role column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- 2. Sync existing roles into profiles
UPDATE public.profiles p
SET role = r.role
FROM public.user_roles r
WHERE p.user_id = r.user_id;

-- 3. Update the handle_new_user trigger to sync role into profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile with role
  INSERT INTO public.profiles (user_id, display_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'student'
  );
  
  -- Create role (default student)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');

  -- Create learning streak
  INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, total_visits)
  VALUES (NEW.id, 0, 0, 0);
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
