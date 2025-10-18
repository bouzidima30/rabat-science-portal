-- Step 1: Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Migrate existing role data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::public.app_role
FROM public.profiles
WHERE role IS NOT NULL;

-- Step 4: Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Step 5: Update is_admin() to use the new has_role function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- Step 6: Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Step 7: Update ALL dependent RLS policies to use is_admin() function instead of direct role column access

-- Update file_manager policies
DROP POLICY IF EXISTS "Admins can manage files" ON public.file_manager;
CREATE POLICY "Admins can manage files"
ON public.file_manager FOR ALL
USING (public.is_admin());

-- Update pages policies
DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
CREATE POLICY "Admins can manage pages"
ON public.pages FOR ALL
USING (public.is_admin());

-- Update activity_logs policies
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.activity_logs;
CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs FOR SELECT
USING (public.is_admin());

-- Update storage policies for cooperation-images
DROP POLICY IF EXISTS "Admins can delete cooperation images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload cooperation images" ON storage.objects;

CREATE POLICY "Admins can delete cooperation images"
ON storage.objects FOR DELETE
USING (bucket_id = 'cooperation-images' AND public.is_admin());

CREATE POLICY "Admins can upload cooperation images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cooperation-images' AND public.is_admin());

-- Update storage policies for event-images
DROP POLICY IF EXISTS "Admins can delete event images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload event images" ON storage.objects;

CREATE POLICY "Admins can delete event images"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-images' AND public.is_admin());

CREATE POLICY "Admins can upload event images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-images' AND public.is_admin());

-- Update storage policies for file-manager
DROP POLICY IF EXISTS "Admins can delete file manager files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload file manager files" ON storage.objects;

CREATE POLICY "Admins can delete file manager files"
ON storage.objects FOR DELETE
USING (bucket_id = 'file-manager' AND public.is_admin());

CREATE POLICY "Admins can upload file manager files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'file-manager' AND public.is_admin());

-- Update storage policies for formation-documents
DROP POLICY IF EXISTS "Admins can delete formation documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload formation documents" ON storage.objects;

CREATE POLICY "Admins can delete formation documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'formation-documents' AND public.is_admin());

CREATE POLICY "Admins can upload formation documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'formation-documents' AND public.is_admin());

-- Update storage policies for formation-images
DROP POLICY IF EXISTS "Admins can delete formation images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload formation images" ON storage.objects;

CREATE POLICY "Admins can delete formation images"
ON storage.objects FOR DELETE
USING (bucket_id = 'formation-images' AND public.is_admin());

CREATE POLICY "Admins can upload formation images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'formation-images' AND public.is_admin());

-- Update storage policies for page-documents
DROP POLICY IF EXISTS "Admins can delete page documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload page documents" ON storage.objects;

CREATE POLICY "Admins can delete page documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'page-documents' AND public.is_admin());

CREATE POLICY "Admins can upload page documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'page-documents' AND public.is_admin());

-- Update storage policies for page-images
DROP POLICY IF EXISTS "Admins can delete page images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload page images" ON storage.objects;

CREATE POLICY "Admins can delete page images"
ON storage.objects FOR DELETE
USING (bucket_id = 'page-images' AND public.is_admin());

CREATE POLICY "Admins can upload page images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'page-images' AND public.is_admin());

-- Step 8: Update handle_new_user trigger to use user_roles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles (without role)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign role based on email domain
  IF NEW.email LIKE '%@um5.ac.ma' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 9: NOW drop the role column from profiles table (all dependencies fixed)
ALTER TABLE public.profiles DROP COLUMN role;

-- Step 10: Update get_current_user_role to use user_roles and add search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Step 11: Update prevent_role_self_modification to use user_roles and add search_path
CREATE OR REPLACE FUNCTION public.prevent_role_self_modification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow admins to change any role
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  
  -- Prevent non-admins from modifying roles
  RAISE EXCEPTION 'Only administrators can modify user roles';
END;
$$;

-- Create trigger for role modification prevention
DROP TRIGGER IF EXISTS prevent_role_self_modification_trigger ON public.user_roles;
CREATE TRIGGER prevent_role_self_modification_trigger
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_self_modification();

-- Step 12: Add missing search_path to get_public_cooperations
CREATE OR REPLACE FUNCTION public.get_public_cooperations(
  p_type text DEFAULT NULL,
  p_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0,
  p_order_desc boolean DEFAULT true
)
RETURNS TABLE(
  id uuid, annee_debut integer, annee_fin integer, created_at timestamp with time zone,
  updated_at timestamp with time zone, reviewer_id uuid, reviewed_at timestamp with time zone,
  titre text, type_cooperation text, domaine_recherche text, pays text[], appel_offre text,
  coordinateur text, email_coordinateur text, description text, partenaires text[],
  image_url text, status text, review_notes text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id, c.annee_debut, c.annee_fin, c.created_at, c.updated_at, c.reviewer_id,
    c.reviewed_at, c.titre, c.type_cooperation, c.domaine_recherche, c.pays,
    c.appel_offre, c.coordinateur,
    CASE WHEN public.can_view_coordinator_email() THEN c.email_coordinateur ELSE NULL END AS email_coordinateur,
    c.description, c.partenaires, c.image_url, c.status, c.review_notes
  FROM public.cooperations c
  WHERE (c.status = 'published' OR c.status IS NULL)
    AND (p_type IS NULL OR c.type_cooperation = p_type)
    AND (p_id IS NULL OR c.id = p_id)
  ORDER BY c.created_at DESC NULLS LAST
  LIMIT COALESCE(p_limit, 100) OFFSET COALESCE(p_offset, 0);
$$;