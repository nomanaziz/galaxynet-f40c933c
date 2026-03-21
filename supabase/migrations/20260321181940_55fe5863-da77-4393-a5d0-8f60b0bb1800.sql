ALTER TABLE public.payment_methods
  ADD COLUMN name_bn text,
  ADD COLUMN instructions_bn text,
  ADD COLUMN button_text text DEFAULT 'বিস্তারিত জানুন',
  ADD COLUMN button_text_bn text,
  ADD COLUMN button_url text,
  ADD COLUMN bg_color text DEFAULT '#3B82F6',
  ADD COLUMN screenshot_url text;