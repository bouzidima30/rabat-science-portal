-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.can_view_coordinator_email()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;