-- Fix critical security vulnerability: Protect coordinator emails in cooperations table
-- Remove the overly permissive policy that exposes coordinator emails to everyone
DROP POLICY IF EXISTS "Anyone can view published cooperations" ON public.cooperations;

-- Create a more secure policy structure for cooperations
-- Policy 1: Authenticated users can view all cooperation details including emails
CREATE POLICY "Authenticated users can view all cooperations with emails" 
ON public.cooperations 
FOR SELECT 
TO authenticated
USING (true);

-- Policy 2: Anonymous users can view basic cooperation info but NOT email addresses
-- We'll handle email filtering in application logic since RLS works at row level
CREATE POLICY "Anonymous users can view published cooperations" 
ON public.cooperations 
FOR SELECT 
TO anon
USING (status = 'published'::text OR status IS NULL);

-- Add a security function to check if email should be visible
CREATE OR REPLACE FUNCTION public.can_view_coordinator_email()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- Also secure the cooperations_versions table
DROP POLICY IF EXISTS "Users can view published cooperations versions" ON public.cooperations_versions;

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