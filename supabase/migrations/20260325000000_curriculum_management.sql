-- Create curriculum_resources table
CREATE TABLE IF NOT EXISTS public.curriculum_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  major TEXT NOT NULL,
  semester INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('documents', 'research', 'videos', 'internship')),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT,
  rating FLOAT DEFAULT 4.5,
  views TEXT,
  channel TEXT,
  citations INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.curriculum_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow anyone to read curriculum resources
CREATE POLICY "Anyone can view curriculum resources"
ON public.curriculum_resources FOR SELECT
USING (true);

-- Allow only admins to manage curriculum resources
CREATE POLICY "Admins can insert curriculum resources"
ON public.curriculum_resources FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can update curriculum resources"
ON public.curriculum_resources FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete curriculum resources"
ON public.curriculum_resources FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Trigger for updated_at
DO $$
BEGIN
  CREATE TRIGGER update_curriculum_resources_updated_at
  BEFORE UPDATE ON public.curriculum_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION
  WHEN undefined_function THEN
    -- handle_updated_at might not exist in some environments, but it should from base migrations
    NULL;
END $$;
```
