-- Security hardening: Add search_path protection to all database functions

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email LIKE '%@um5.ac.ma' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$;

-- Update get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Update is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Update is_content_owner function
CREATE OR REPLACE FUNCTION public.is_content_owner(content_author_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT auth.uid() = content_author_id OR public.is_admin();
$$;

-- Update log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(p_user_id uuid, p_action text, p_severity text DEFAULT 'info'::text, p_category text DEFAULT 'user_activity'::text, p_details text DEFAULT ''::text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id, action, severity, category, details, metadata
  ) VALUES (
    p_user_id, p_action, p_severity, p_category, p_details, p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Update prevent_role_self_modification function
CREATE OR REPLACE FUNCTION public.prevent_role_self_modification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Allow admins to change any role
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  
  -- Prevent non-admins from changing their own role
  IF NEW.role != OLD.role AND NEW.id = auth.uid() THEN
    RAISE EXCEPTION 'Users cannot modify their own role';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update all versioning trigger functions
CREATE OR REPLACE FUNCTION public.create_news_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only create version if content actually changed
  IF OLD.title != NEW.title OR OLD.content != NEW.content OR OLD.excerpt != NEW.excerpt 
     OR OLD.category != NEW.category OR OLD.image_url != NEW.image_url 
     OR OLD.document_url != NEW.document_url THEN
    
    INSERT INTO public.news_versions (
      news_id, version_number, title, content, excerpt, category, 
      image_url, document_url, document_name, status, author_id, created_by
    )
    SELECT 
      OLD.id,
      COALESCE((SELECT MAX(version_number) FROM public.news_versions WHERE news_id = OLD.id), 0) + 1,
      OLD.title, OLD.content, OLD.excerpt, OLD.category,
      OLD.image_url, OLD.document_url, OLD.document_name, 
      COALESCE(OLD.status, 'draft'), OLD.author_id, auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_page_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.create_formation_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.create_cooperation_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.create_event_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only create version if content actually changed
  IF OLD.titre != NEW.titre OR OLD.description != NEW.description 
     OR OLD.date_debut != NEW.date_debut OR OLD.date_fin != NEW.date_fin
     OR OLD.heure_debut != NEW.heure_debut OR OLD.heure_fin != NEW.heure_fin
     OR OLD.lieu != NEW.lieu OR OLD.image_url != NEW.image_url THEN
    
    INSERT INTO public.events_versions (
      event_id, version_number, titre, description, date_debut, date_fin,
      heure_debut, heure_fin, lieu, image_url, status, created_by
    )
    SELECT 
      OLD.id,
      COALESCE((SELECT MAX(version_number) FROM public.events_versions WHERE event_id = OLD.id), 0) + 1,
      OLD.titre, OLD.description, OLD.date_debut, OLD.date_fin,
      OLD.heure_debut, OLD.heure_fin, OLD.lieu, OLD.image_url,
      COALESCE(OLD.status, 'draft'), auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$;