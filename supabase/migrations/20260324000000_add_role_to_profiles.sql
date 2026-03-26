-- 1. Create App Role Enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'student');

-- 2. Create User Roles Table
CREATE TABLE public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role DEFAULT 'student' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- 3. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. RPC to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text AS $$
DECLARE
  _role text;
BEGIN
  SELECT role::text INTO _role FROM public.user_roles WHERE user_id = _user_id;
  RETURN COALESCE(_role, 'student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE  SECURITY DEFINER;

-- 6. Trigger to create student role on profile creation (optional but recommended)
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example: Triggering on auth.users (requires superuser or specific setup)
-- CREATE TRIGGER on_auth_user_created_role
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_role();

-- RLS Policies for user_roles
-- Admins can read all roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update roles
CREATE POLICY "Admins can update roles" ON public.user_roles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Users can view their own role
CREATE POLICY "Users can view own role" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- 7. Add Admin policies for profiles table
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

