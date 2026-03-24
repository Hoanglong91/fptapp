-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role text DEFAULT 'student';

-- Create index for roles
CREATE INDEX idx_profiles_role ON public.profiles(role);
