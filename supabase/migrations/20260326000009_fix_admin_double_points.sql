-- Fix Admin Double Points
-- The points were doubled because both a direct UPDATE and an INSERT (trigger) occurred.
-- This confirms the trigger is working perfectly!

UPDATE public.profiles
SET points = 9999,
    updated_at = now()
WHERE user_id IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
);
