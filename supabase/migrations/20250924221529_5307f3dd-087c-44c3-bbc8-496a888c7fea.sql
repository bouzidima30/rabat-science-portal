-- Secure cooperations emails from public scraping while preserving public access to non-sensitive fields
-- 1) Remove anonymous direct SELECT on base table
DROP POLICY IF EXISTS "Anonymous users can view published cooperations" ON public.cooperations;

-- 2) Create a SECURITY DEFINER RPC that returns sanitized cooperations rows
CREATE OR REPLACE FUNCTION public.get_public_cooperations(
  p_type TEXT DEFAULT NULL,
  p_id UUID DEFAULT NULL,
  p_limit INT DEFAULT 100,
  p_offset INT DEFAULT 0,
  p_order_desc BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
  id UUID,
  annee_debut INTEGER,
  annee_fin INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  reviewer_id UUID,
  reviewed_at TIMESTAMPTZ,
  titre TEXT,
  type_cooperation TEXT,
  domaine_recherche TEXT,
  pays TEXT[],
  appel_offre TEXT,
  coordinateur TEXT,
  email_coordinateur TEXT,
  description TEXT,
  partenaires TEXT[],
  image_url TEXT,
  status TEXT,
  review_notes TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT 
    c.id,
    c.annee_debut,
    c.annee_fin,
    c.created_at,
    c.updated_at,
    c.reviewer_id,
    c.reviewed_at,
    c.titre,
    c.type_cooperation,
    c.domaine_recherche,
    c.pays,
    c.appel_offre,
    c.coordinateur,
    CASE WHEN public.can_view_coordinator_email() THEN c.email_coordinateur ELSE NULL END AS email_coordinateur,
    c.description,
    c.partenaires,
    c.image_url,
    c.status,
    c.review_notes
  FROM public.cooperations c
  WHERE (c.status = 'published' OR c.status IS NULL)
    AND (p_type IS NULL OR c.type_cooperation = p_type)
    AND (p_id IS NULL OR c.id = p_id)
  ORDER BY c.created_at DESC NULLS LAST
  LIMIT COALESCE(p_limit, 100) OFFSET COALESCE(p_offset, 0);
$$;

-- 3) Allow both anon and authenticated callers to execute the RPC
GRANT EXECUTE ON FUNCTION public.get_public_cooperations(TEXT, UUID, INT, INT, BOOLEAN) TO anon, authenticated;