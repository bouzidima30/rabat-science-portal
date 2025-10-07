-- Create carousel_config table
CREATE TABLE public.carousel_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('news', 'youtube')),
  position integer NOT NULL,
  news_id uuid REFERENCES public.news(id) ON DELETE CASCADE,
  youtube_url text,
  youtube_title text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT carousel_type_check CHECK (
    (type = 'news' AND news_id IS NOT NULL AND youtube_url IS NULL) OR
    (type = 'youtube' AND youtube_url IS NOT NULL AND news_id IS NULL)
  )
);

-- Enable RLS
ALTER TABLE public.carousel_config ENABLE ROW LEVEL SECURITY;

-- Anyone can view carousel config
CREATE POLICY "Anyone can view carousel config"
ON public.carousel_config
FOR SELECT
USING (true);

-- Admins can manage carousel config
CREATE POLICY "Admins can manage carousel config"
ON public.carousel_config
FOR ALL
USING (is_admin());

-- Create index for better performance
CREATE INDEX idx_carousel_config_type_position ON public.carousel_config(type, position);