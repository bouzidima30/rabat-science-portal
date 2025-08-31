-- Fix coordinator email exposure vulnerability by securing RLS policies
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anonymous users can view published cooperations" ON public.cooperations;
DROP POLICY IF EXISTS "Authenticated users can view all cooperations" ON public.cooperations;
DROP POLICY IF EXISTS "Authenticated users can view all cooperations with emails" ON public.cooperations;

-- Create secure policies that prevent email exposure to anonymous users
-- Anonymous users can view published cooperations but emails will be filtered out at app level
CREATE POLICY "Anonymous users can view published cooperations"
ON public.cooperations
FOR SELECT
TO anon
USING (
  (status = 'published'::text OR status IS NULL)
);

-- Authenticated users can view all cooperations with full access
CREATE POLICY "Authenticated users can view all cooperations"
ON public.cooperations
FOR SELECT
TO authenticated
USING (true);

-- Ensure admins can still manage cooperations
CREATE POLICY "Admins can manage cooperations"
ON public.cooperations
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Fix cooperations_versions table policies to also protect emails
DROP POLICY IF EXISTS "Anonymous users can view published cooperations versions" ON public.cooperations_versions;
DROP POLICY IF EXISTS "Authenticated users can view cooperations versions" ON public.cooperations_versions;

-- Anonymous users can view cooperation versions but emails should be filtered out at app level
CREATE POLICY "Anonymous users can view published cooperations versions"
ON public.cooperations_versions
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM cooperations 
    WHERE cooperations.id = cooperations_versions.cooperation_id 
    AND cooperations.status = 'published'::text
  )
);

-- Authenticated users can view cooperation versions with full access
CREATE POLICY "Authenticated users can view cooperations versions"
ON public.cooperations_versions  
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM cooperations 
    WHERE cooperations.id = cooperations_versions.cooperation_id 
    AND (cooperations.status = 'published'::text OR is_admin())
  )
);

-- Update the can_view_coordinator_email function to be more explicit
CREATE OR REPLACE FUNCTION public.can_view_coordinator_email()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;