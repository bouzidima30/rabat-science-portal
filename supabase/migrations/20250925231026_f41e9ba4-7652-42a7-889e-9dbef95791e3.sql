-- Fix the security definer view issue by dropping it and using the RPC instead
DROP VIEW IF EXISTS public.public_cooperations;

-- The get_public_cooperations RPC function already handles email protection properly
-- and is the recommended approach for this use case