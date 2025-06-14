
-- Add status field to news for moderation workflow
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'published'));

-- Add reviewer information
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Create news_versions table for version history
CREATE TABLE IF NOT EXISTS public.news_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID REFERENCES public.news(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category news_category NOT NULL,
  image_url TEXT,
  document_url TEXT,
  document_name TEXT,
  status TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  change_summary TEXT,
  UNIQUE(news_id, version_number)
);

-- Add similar fields to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'published'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Create events_versions table
CREATE TABLE IF NOT EXISTS public.events_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  titre TEXT NOT NULL,
  description TEXT,
  date_debut DATE NOT NULL,
  date_fin DATE,
  heure_debut TIME,
  heure_fin TIME,
  lieu TEXT,
  image_url TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  change_summary TEXT,
  UNIQUE(event_id, version_number)
);

-- Enable RLS on version tables
ALTER TABLE public.news_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_versions ENABLE ROW LEVEL SECURITY;

-- RLS policies for news_versions
CREATE POLICY "Users can view news versions for published news or their own content"
  ON public.news_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.news 
      WHERE id = news_id AND (published = true OR author_id = auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert news versions"
  ON public.news_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for events_versions
CREATE POLICY "Users can view events versions"
  ON public.events_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert events versions"
  ON public.events_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create version when content is updated
CREATE OR REPLACE FUNCTION public.create_news_version()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for news versioning
DROP TRIGGER IF EXISTS news_versioning_trigger ON public.news;
CREATE TRIGGER news_versioning_trigger
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.create_news_version();

-- Function to create version when events are updated
CREATE OR REPLACE FUNCTION public.create_event_version()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for events versioning
DROP TRIGGER IF EXISTS events_versioning_trigger ON public.events;
CREATE TRIGGER events_versioning_trigger
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.create_event_version();
