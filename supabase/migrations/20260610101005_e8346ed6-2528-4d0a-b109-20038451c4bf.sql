
-- Fix 1: pages_versions draft exposure
DROP POLICY IF EXISTS "Public can view published page versions" ON public.pages_versions;
DROP POLICY IF EXISTS "Anyone can view page versions of published pages" ON public.pages_versions;
DROP POLICY IF EXISTS "Public can view versions of published pages" ON public.pages_versions;
DROP POLICY IF EXISTS "Public can view published page versions only" ON public.pages_versions;

CREATE POLICY "Public can view published page versions only"
ON public.pages_versions
FOR SELECT
USING (
  (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = pages_versions.page_id
        AND (p.status = 'published' OR p.status IS NULL)
    )
  )
  OR public.is_admin()
);

-- Fix 2: news storage buckets - restrict to admins
DROP POLICY IF EXISTS "Authenticated users can upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload news documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload news documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update news images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update news documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete news images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete news documents" ON storage.objects;

CREATE POLICY "Admins can upload news images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'news-images' AND public.is_admin());

CREATE POLICY "Admins can upload news documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'news-documents' AND public.is_admin());

CREATE POLICY "Admins can update news images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'news-images' AND public.is_admin())
WITH CHECK (bucket_id = 'news-images' AND public.is_admin());

CREATE POLICY "Admins can update news documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'news-documents' AND public.is_admin())
WITH CHECK (bucket_id = 'news-documents' AND public.is_admin());

CREATE POLICY "Admins can delete news images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'news-images' AND public.is_admin());

CREATE POLICY "Admins can delete news documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'news-documents' AND public.is_admin());
