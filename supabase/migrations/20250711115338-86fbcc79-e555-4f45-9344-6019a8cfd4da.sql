-- Phase 1: Critical Security Fixes - Fixed

-- 1. Fix Privilege Escalation: Prevent users from updating their own role
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create separate policies for different update scenarios
CREATE POLICY "Users can update own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id AND NOT public.is_admin())
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 2. Add trigger to prevent role self-modification
CREATE OR REPLACE FUNCTION public.prevent_role_self_modification()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow admins to change any role
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;
  
  -- Prevent non-admins from changing their own role
  IF NEW.role != OLD.role AND NEW.id = auth.uid() THEN
    RAISE EXCEPTION 'Users cannot modify their own role';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER prevent_role_self_modification_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_modification();

-- 3. Add missing RLS policies for version tables
-- News versions
ALTER TABLE public.news_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert news versions" ON public.news_versions;
DROP POLICY IF EXISTS "Users can view news versions for published news or their own co" ON public.news_versions;

CREATE POLICY "Admins can manage news versions" 
ON public.news_versions 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Users can view appropriate news versions" 
ON public.news_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.news 
    WHERE news.id = news_versions.news_id 
    AND (news.published = true OR news.author_id = auth.uid() OR public.is_admin())
  )
);

-- Events versions
ALTER TABLE public.events_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert events versions" ON public.events_versions;
DROP POLICY IF EXISTS "Users can view events versions" ON public.events_versions;

CREATE POLICY "Admins can manage events versions" 
ON public.events_versions 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Users can view published events versions" 
ON public.events_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = events_versions.event_id 
    AND (events.status = 'published' OR public.is_admin())
  )
);

-- Formations versions
ALTER TABLE public.formations_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage formations versions" 
ON public.formations_versions 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Users can view published formations versions" 
ON public.formations_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.formations 
    WHERE formations.id = formations_versions.formation_id 
    AND (formations.status = 'published' OR public.is_admin())
  )
);

-- Cooperations versions  
ALTER TABLE public.cooperations_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cooperations versions" 
ON public.cooperations_versions 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Users can view published cooperations versions" 
ON public.cooperations_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.cooperations 
    WHERE cooperations.id = cooperations_versions.cooperation_id 
    AND (cooperations.status = 'published' OR public.is_admin())
  )
);

-- Pages versions
ALTER TABLE public.pages_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage pages versions" 
ON public.pages_versions 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Users can view pages versions" 
ON public.pages_versions 
FOR SELECT 
USING (true);