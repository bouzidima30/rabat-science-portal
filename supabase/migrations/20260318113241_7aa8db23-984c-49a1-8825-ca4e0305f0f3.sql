-- Fix cooperations: restrict public SELECT to published only, add admin full access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cooperations;

CREATE POLICY "Public can view published cooperations"
  ON public.cooperations FOR SELECT
  TO public
  USING (status = 'published' OR status IS NULL);

CREATE POLICY "Admins can manage all cooperations"
  ON public.cooperations FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Add UPDATE/DELETE for admins on cooperations (currently missing)
-- The ALL policy above covers it

-- Fix formations: restrict public SELECT to published only
DROP POLICY IF EXISTS "Enable read access for all users" ON public.formations;

CREATE POLICY "Public can view published formations"
  ON public.formations FOR SELECT
  TO public
  USING (status = 'published' OR status IS NULL);

-- Fix pages: restrict public SELECT to published only
DROP POLICY IF EXISTS "Anyone can view pages" ON public.pages;

CREATE POLICY "Public can view published pages"
  ON public.pages FOR SELECT
  TO public
  USING (status = 'published' OR status IS NULL);