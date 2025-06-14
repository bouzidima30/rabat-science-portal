
-- Add status and review fields to formations table
ALTER TABLE public.formations 
ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'published')),
ADD COLUMN reviewer_id uuid REFERENCES public.profiles(id),
ADD COLUMN reviewed_at timestamp with time zone,
ADD COLUMN review_notes text;

-- Add status and review fields to cooperations table  
ALTER TABLE public.cooperations
ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'published')),
ADD COLUMN reviewer_id uuid REFERENCES public.profiles(id),
ADD COLUMN reviewed_at timestamp with time zone,
ADD COLUMN review_notes text;

-- Add status and review fields to pages table
ALTER TABLE public.pages
ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'published')),
ADD COLUMN reviewer_id uuid REFERENCES public.profiles(id),
ADD COLUMN reviewed_at timestamp with time zone,
ADD COLUMN review_notes text;

-- Create formations_versions table
CREATE TABLE public.formations_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid NOT NULL REFERENCES public.formations(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  titre text NOT NULL,
  description text,
  type_formation text NOT NULL,
  departement text,
  image_url text,
  document_url text,
  document_name text,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  change_summary text
);

-- Create cooperations_versions table
CREATE TABLE public.cooperations_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperation_id uuid NOT NULL REFERENCES public.cooperations(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  titre text NOT NULL,
  description text,
  type_cooperation text NOT NULL,
  domaine_recherche text,
  pays text[],
  annee_debut integer,
  annee_fin integer,
  coordinateur text,
  email_coordinateur text,
  appel_offre text,
  partenaires text[],
  image_url text,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  change_summary text
);

-- Create pages_versions table
CREATE TABLE public.pages_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  titre text NOT NULL,
  contenu text NOT NULL,
  slug text NOT NULL,
  image_url text,
  fichiers text[],
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  change_summary text
);

-- Create version triggers for formations
CREATE OR REPLACE FUNCTION public.create_formation_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create version if content actually changed
  IF OLD.titre != NEW.titre OR OLD.description != NEW.description 
     OR OLD.type_formation != NEW.type_formation OR OLD.departement != NEW.departement
     OR OLD.image_url != NEW.image_url OR OLD.document_url != NEW.document_url THEN
    
    INSERT INTO public.formations_versions (
      formation_id, version_number, titre, description, type_formation,
      departement, image_url, document_url, document_name, status, created_by
    )
    SELECT 
      OLD.id,
      COALESCE((SELECT MAX(version_number) FROM public.formations_versions WHERE formation_id = OLD.id), 0) + 1,
      OLD.titre, OLD.description, OLD.type_formation, OLD.departement,
      OLD.image_url, OLD.document_url, OLD.document_name,
      COALESCE(OLD.status, 'draft'), auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create version triggers for cooperations
CREATE OR REPLACE FUNCTION public.create_cooperation_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create version if content actually changed
  IF OLD.titre != NEW.titre OR OLD.description != NEW.description 
     OR OLD.type_cooperation != NEW.type_cooperation OR OLD.domaine_recherche != NEW.domaine_recherche
     OR OLD.pays != NEW.pays OR OLD.coordinateur != NEW.coordinateur THEN
    
    INSERT INTO public.cooperations_versions (
      cooperation_id, version_number, titre, description, type_cooperation,
      domaine_recherche, pays, annee_debut, annee_fin, coordinateur,
      email_coordinateur, appel_offre, partenaires, image_url, status, created_by
    )
    SELECT 
      OLD.id,
      COALESCE((SELECT MAX(version_number) FROM public.cooperations_versions WHERE cooperation_id = OLD.id), 0) + 1,
      OLD.titre, OLD.description, OLD.type_cooperation, OLD.domaine_recherche,
      OLD.pays, OLD.annee_debut, OLD.annee_fin, OLD.coordinateur,
      OLD.email_coordinateur, OLD.appel_offre, OLD.partenaires, OLD.image_url,
      COALESCE(OLD.status, 'draft'), auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create version triggers for pages
CREATE OR REPLACE FUNCTION public.create_page_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create version if content actually changed
  IF OLD.titre != NEW.titre OR OLD.contenu != NEW.contenu 
     OR OLD.slug != NEW.slug OR OLD.image_url != NEW.image_url
     OR OLD.fichiers != NEW.fichiers THEN
    
    INSERT INTO public.pages_versions (
      page_id, version_number, titre, contenu, slug,
      image_url, fichiers, status, created_by
    )
    SELECT 
      OLD.id,
      COALESCE((SELECT MAX(version_number) FROM public.pages_versions WHERE page_id = OLD.id), 0) + 1,
      OLD.titre, OLD.contenu, OLD.slug, OLD.image_url, OLD.fichiers,
      COALESCE(OLD.status, 'draft'), auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the triggers
CREATE TRIGGER formations_version_trigger
  BEFORE UPDATE ON public.formations
  FOR EACH ROW EXECUTE FUNCTION public.create_formation_version();

CREATE TRIGGER cooperations_version_trigger
  BEFORE UPDATE ON public.cooperations
  FOR EACH ROW EXECUTE FUNCTION public.create_cooperation_version();

CREATE TRIGGER pages_version_trigger
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.create_page_version();
