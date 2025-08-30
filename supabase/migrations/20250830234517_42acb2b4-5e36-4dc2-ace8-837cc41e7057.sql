-- Fix security vulnerability: Restrict profiles table access
-- Remove the overly permissive policy that allows public access to all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new restricted policy that only allows users to see their own profile
-- and admins to see all profiles
CREATE POLICY "Users can view own profile, admins view all" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id OR public.is_admin()
);