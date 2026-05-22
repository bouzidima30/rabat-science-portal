
-- Tighten storage policies: only admins should be able to modify files in the 'files', 'news-images', and 'news-documents' buckets.
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update news documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete news documents" ON storage.objects;

-- Ensure admin policies exist for news buckets (upload/update/delete).
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can upload news images') THEN
    CREATE POLICY "Admins can upload news images" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'news-images' AND public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can update news images') THEN
    CREATE POLICY "Admins can update news images" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'news-images' AND public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can delete news images') THEN
    CREATE POLICY "Admins can delete news images" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'news-images' AND public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can upload news documents') THEN
    CREATE POLICY "Admins can upload news documents" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'news-documents' AND public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can update news documents') THEN
    CREATE POLICY "Admins can update news documents" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'news-documents' AND public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Admins can delete news documents') THEN
    CREATE POLICY "Admins can delete news documents" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'news-documents' AND public.is_admin());
  END IF;
END $$;

-- Tighten public.files table policies: only admins should manage rows.
DROP POLICY IF EXISTS "Authenticated users can upload files" ON public.files;

CREATE POLICY "Admins can upload files"
ON public.files
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());
