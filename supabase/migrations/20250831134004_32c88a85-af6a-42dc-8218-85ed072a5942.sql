-- Enable leaked password protection to address security warning
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;