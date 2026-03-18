ALTER TABLE public.file_manager ADD COLUMN category text DEFAULT 'emploi_temps';

-- Update existing records to have the default category
UPDATE public.file_manager SET category = 'emploi_temps' WHERE category IS NULL;