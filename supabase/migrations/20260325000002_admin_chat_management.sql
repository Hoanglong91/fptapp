-- Admin Policies for Community Chat
-- 1. Allow admins to delete any message
CREATE POLICY "Admins can delete any message" 
ON public.chat_messages 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 2. Function to clear all messages (Admin only)
CREATE OR REPLACE FUNCTION public.clear_all_chat_messages(_major text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  -- Check if caller is admin
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    IF _major IS NULL THEN
      DELETE FROM public.chat_messages WHERE major IS NULL;
    ELSE
      DELETE FROM public.chat_messages WHERE major = _major;
    END IF;
  ELSE
    RAISE EXCEPTION 'Only admins can clear chat messages';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
