-- Add storage policies for the files bucket to allow admin uploads

-- Allow admins to upload files to the files bucket
CREATE POLICY "Admins can upload files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'files' AND 
  auth.uid() IS NOT NULL AND 
  public.is_admin()
);

-- Allow admins to update files in the files bucket
CREATE POLICY "Admins can update files"
ON storage.objects
FOR UPDATE
TO public
USING (
  bucket_id = 'files' AND 
  auth.uid() IS NOT NULL AND 
  public.is_admin()
);

-- Allow admins to delete files from the files bucket
CREATE POLICY "Admins can delete files"
ON storage.objects
FOR DELETE
TO public
USING (
  bucket_id = 'files' AND 
  auth.uid() IS NOT NULL AND 
  public.is_admin()
);

-- Allow everyone to view files in the files bucket (since bucket is public)
CREATE POLICY "Anyone can view files in bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'files');