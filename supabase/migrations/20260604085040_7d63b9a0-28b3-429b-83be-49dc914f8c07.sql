
CREATE TABLE public.admin_ip_whitelist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_ip_whitelist TO authenticated;
GRANT ALL ON public.admin_ip_whitelist TO service_role;

ALTER TABLE public.admin_ip_whitelist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view IP whitelist"
  ON public.admin_ip_whitelist FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert IP whitelist"
  ON public.admin_ip_whitelist FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update IP whitelist"
  ON public.admin_ip_whitelist FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete IP whitelist"
  ON public.admin_ip_whitelist FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.update_admin_ip_whitelist_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_admin_ip_whitelist_updated_at
  BEFORE UPDATE ON public.admin_ip_whitelist
  FOR EACH ROW EXECUTE FUNCTION public.update_admin_ip_whitelist_updated_at();
