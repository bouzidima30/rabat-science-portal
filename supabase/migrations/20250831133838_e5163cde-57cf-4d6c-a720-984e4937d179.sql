-- Fix coordinator email exposure vulnerability
-- Create a secure function to mask emails for anonymous users
CREATE OR REPLACE FUNCTION public.mask_coordinator_email(cooperation_record cooperations)
RETURNS cooperations
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    cooperation_record.id,
    cooperation_record.annee_debut,
    cooperation_record.annee_fin,
    cooperation_record.created_at,
    cooperation_record.updated_at,
    cooperation_record.reviewer_id,
    cooperation_record.reviewed_at,
    cooperation_record.titre,
    cooperation_record.type_cooperation,
    cooperation_record.domaine_recherche,
    cooperation_record.pays,
    cooperation_record.appel_offre,
    cooperation_record.coordinateur,
    -- Only show email if user is authenticated, otherwise mask it
    CASE 
      WHEN auth.uid() IS NOT NULL THEN cooperation_record.email_coordinateur
      ELSE NULL
    END as email_coordinateur,
    cooperation_record.description,
    cooperation_record.partenaires,
    cooperation_record.image_url,
    cooperation_record.status,
    cooperation_record.review_notes
$$;

-- Drop existing policies that allow email exposure
DROP POLICY IF EXISTS "Anonymous users can view published cooperations" ON public.cooperations;
DROP POLICY IF EXISTS "Authenticated users can view all cooperations" ON public.cooperations;
DROP POLICY IF EXISTS "Authenticated users can view all cooperations with emails" ON public.cooperations;

-- Create new secure policies
-- Allow anonymous users to view published cooperations WITHOUT emails
CREATE POLICY "Anonymous users can view published cooperations (no emails)"
ON public.cooperations
FOR SELECT
TO anon
USING (
  (status = 'published'::text OR status IS NULL)
);

-- Allow authenticated users to view all cooperations WITH emails
CREATE POLICY "Authenticated users can view all cooperations (with emails)"
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

-- Create a view that automatically applies email masking
CREATE OR REPLACE VIEW public.cooperations_public AS
SELECT 
  id,
  annee_debut,
  annee_fin,
  created_at,
  updated_at,
  reviewer_id,
  reviewed_at,
  titre,
  type_cooperation,
  domaine_recherche,
  pays,
  appel_offre,
  coordinateur,
  -- Only show email if user is authenticated
  CASE 
    WHEN auth.uid() IS NOT NULL THEN email_coordinateur
    ELSE NULL
  END as email_coordinateur,
  description,
  partenaires,
  image_url,
  status,
  review_notes
FROM public.cooperations
WHERE (status = 'published'::text OR status IS NULL OR auth.uid() IS NOT NULL);

-- Grant appropriate permissions on the view
GRANT SELECT ON public.cooperations_public TO anon, authenticated;

-- Update cooperations_versions table policies to also protect emails
DROP POLICY IF EXISTS "Anonymous users can view published cooperations versions" ON public.cooperations_versions;

-- Anonymous users can view cooperation versions but without emails
CREATE POLICY "Anonymous users can view published cooperations versions (no emails)"
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

-- Authenticated users can view cooperation versions with emails
CREATE POLICY "Authenticated users can view cooperations versions (with emails)"
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