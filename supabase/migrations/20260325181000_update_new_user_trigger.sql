-- 1. Update the handle_new_user trigger function to explicitly set points and rank
-- This ensures all future signups are correctly initialized
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, points, rank)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    0,
    'Newbie'
  );
  
  INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, total_visits)
  VALUES (NEW.id, 0, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Double check the trigger exists
-- No changes needed here if it already exists, but re-applying for safety
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 3. Also ensure profiles table defaults are set at the schema level
ALTER TABLE public.profiles ALTER COLUMN points SET DEFAULT 0;
ALTER TABLE public.profiles ALTER COLUMN rank SET DEFAULT 'Newbie';
