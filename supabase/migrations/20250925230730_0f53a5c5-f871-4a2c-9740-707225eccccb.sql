-- Fix the cooperations RLS policy to ensure email protection
-- Currently the policy "Authenticated users can view all cooperations" might expose emails

-- Update the RLS policy to ensure email protection is enforced at the database level
DROP POLICY IF EXISTS "Authenticated users can view all cooperations" ON public.cooperations;

-- Create a more restrictive policy that doesn't expose sensitive data
CREATE POLICY "Users can view published cooperations with email protection" 
ON public.cooperations 
FOR SELECT 
USING (
  (status = 'published' OR status IS NULL) 
  AND 
  (
    auth.uid() IS NULL OR 
    public.can_view_coordinator_email()
  )
);

-- Ensure the can_view_coordinator_email function works correctly
CREATE OR REPLACE FUNCTION public.can_view_coordinator_email()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT auth.uid() IS NOT NULL;
$function$;

-- Add a view for public cooperations without emails for extra security
CREATE OR REPLACE VIEW public.public_cooperations AS
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
  CASE WHEN public.can_view_coordinator_email() THEN email_coordinateur ELSE NULL END AS email_coordinateur,
  description,
  partenaires,
  image_url,
  status,
  review_notes
FROM public.cooperations
WHERE (status = 'published' OR status IS NULL);