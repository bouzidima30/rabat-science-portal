-- Create security definer functions to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_content_owner(content_author_id UUID)
RETURNS BOOLEAN AS $$
  SELECT auth.uid() = content_author_id OR public.is_admin();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Fix news table RLS policies
DROP POLICY IF EXISTS "Anyone can view published news" ON public.news;
DROP POLICY IF EXISTS "Authenticated users can manage news" ON public.news;

CREATE POLICY "Anyone can view published news" 
  ON public.news FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view their own drafts" 
  ON public.news FOR SELECT
  USING (auth.uid() IS NOT NULL AND (published = true OR author_id = auth.uid() OR public.is_admin()));

CREATE POLICY "Authors can insert news" 
  ON public.news FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own news" 
  ON public.news FOR UPDATE
  USING (public.is_content_owner(author_id));

CREATE POLICY "Admins can delete news" 
  ON public.news FOR DELETE
  USING (public.is_admin());

-- Fix events table RLS policies
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;

CREATE POLICY "Anyone can view published events" 
  ON public.events FOR SELECT
  USING (status = 'published' OR status IS NULL);

CREATE POLICY "Authenticated users can view all events" 
  ON public.events FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage events" 
  ON public.events FOR ALL
  USING (public.is_admin());

-- Fix cooperations table RLS policies
DROP POLICY IF EXISTS "Anyone can view cooperations" ON public.cooperations;
DROP POLICY IF EXISTS "Admins can manage cooperations" ON public.cooperations;

CREATE POLICY "Anyone can view published cooperations" 
  ON public.cooperations FOR SELECT
  USING (status = 'published' OR status IS NULL);

CREATE POLICY "Authenticated users can view all cooperations" 
  ON public.cooperations FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage cooperations" 
  ON public.cooperations FOR ALL
  USING (public.is_admin());

-- Fix formations table RLS policies
DROP POLICY IF EXISTS "Anyone can view formations" ON public.formations;
DROP POLICY IF EXISTS "Admins can manage formations" ON public.formations;

CREATE POLICY "Anyone can view published formations" 
  ON public.formations FOR SELECT
  USING (status = 'published' OR status IS NULL);

CREATE POLICY "Authenticated users can view all formations" 
  ON public.formations FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage formations" 
  ON public.formations FOR ALL
  USING (public.is_admin());

-- Fix file access policies
DROP POLICY IF EXISTS "Public can view files" ON public.files;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON public.files;
DROP POLICY IF EXISTS "Authenticated users can update files" ON public.files;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON public.files;

CREATE POLICY "Public can view files" 
  ON public.files FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload files" 
  ON public.files FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "File owners and admins can update files" 
  ON public.files FOR UPDATE
  USING (auth.uid() IS NOT NULL AND public.is_admin());

CREATE POLICY "File owners and admins can delete files" 
  ON public.files FOR DELETE
  USING (auth.uid() IS NOT NULL AND public.is_admin());

-- Add file quarantine table for security scanning
CREATE TABLE IF NOT EXISTS public.file_quarantine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE,
  quarantine_reason TEXT NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  released_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id),
  UNIQUE(file_id)
);

-- Enable RLS on quarantine table
ALTER TABLE public.file_quarantine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage quarantine" 
  ON public.file_quarantine FOR ALL
  USING (public.is_admin());

-- Add security log table enhancements
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info' CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info'));
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'user_activity' CHECK (category IN ('authentication', 'authorization', 'data_access', 'system', 'network', 'user_activity'));
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create function for enhanced security logging
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_action TEXT,
  p_severity TEXT DEFAULT 'info',
  p_category TEXT DEFAULT 'user_activity',
  p_details TEXT DEFAULT '',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;