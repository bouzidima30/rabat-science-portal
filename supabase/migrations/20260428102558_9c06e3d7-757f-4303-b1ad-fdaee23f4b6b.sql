-- Create clubs table for Activités para-universitaires
CREATE TABLE public.clubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- Anyone can view clubs
CREATE POLICY "Anyone can view clubs"
ON public.clubs
FOR SELECT
USING (true);

-- Only admins can manage clubs
CREATE POLICY "Admins can manage clubs"
ON public.clubs
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.update_clubs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_clubs_updated_at
BEFORE UPDATE ON public.clubs
FOR EACH ROW
EXECUTE FUNCTION public.update_clubs_updated_at();

-- Storage bucket for club images
INSERT INTO storage.buckets (id, name, public)
VALUES ('club-images', 'club-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view club images
CREATE POLICY "Club images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'club-images');

-- Admins can upload club images
CREATE POLICY "Admins can upload club images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'club-images' AND public.is_admin());

-- Admins can update club images
CREATE POLICY "Admins can update club images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'club-images' AND public.is_admin());

-- Admins can delete club images
CREATE POLICY "Admins can delete club images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'club-images' AND public.is_admin());