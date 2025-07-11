-- Phase 1: Critical Security Fixes

-- 1. Fix Privilege Escalation: Prevent users from updating their own role
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (except role)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  (OLD.role = NEW.role OR public.is_admin())
);

-- 2. Add admin-only role management policy
CREATE POLICY "Admins can update any profile role" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin())
WITH CHECK (public.is_admin());

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

-- 4. Enhance security logging function
CREATE OR REPLACE FUNCTION public.log_security_event_enhanced(
  p_user_id uuid,
  p_action text,
  p_severity text DEFAULT 'info',
  p_category text DEFAULT 'user_activity', 
  p_details text DEFAULT '',
  p_metadata jsonb DEFAULT '{}',
  p_source_ip inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id, action, severity, category, details, metadata, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action, p_severity, p_category, p_details, p_metadata, p_source_ip, p_user_agent
  ) RETURNING id INTO log_id;
  
  -- Alert on critical security events
  IF p_severity IN ('critical', 'high') THEN
    -- Log to system (could be extended to send alerts)
    RAISE NOTICE 'SECURITY ALERT: % - % - %', p_severity, p_action, p_details;
  END IF;
  
  RETURN log_id;
END;
$$;