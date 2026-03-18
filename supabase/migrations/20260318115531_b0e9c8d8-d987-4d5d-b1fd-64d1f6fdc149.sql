-- Fix 1: Remove domain-based auto-admin from handle_new_user()
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- All new users get 'user' role - admins must be promoted manually
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;

-- Fix 2: Restrict pages_versions SELECT to published pages or admins
DROP POLICY IF EXISTS "Users can view pages versions" ON public.pages_versions;

CREATE POLICY "Public can view published pages versions"
  ON public.pages_versions FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.pages
      WHERE id = pages_versions.page_id
      AND (status = 'published' OR status IS NULL)
    )
    OR public.is_admin()
  );