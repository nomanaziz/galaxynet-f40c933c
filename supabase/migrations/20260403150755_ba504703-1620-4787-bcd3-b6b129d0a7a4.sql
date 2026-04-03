
CREATE TABLE public.festival_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  greeting_en TEXT,
  greeting_bn TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  hero_image_url TEXT,
  gradient_from TEXT DEFAULT '#0c2340',
  gradient_to TEXT DEFAULT '#0e7490',
  accent_color TEXT,
  decoration_type TEXT NOT NULL DEFAULT 'none',
  animation_type TEXT NOT NULL DEFAULT 'none',
  is_ramadan BOOLEAN NOT NULL DEFAULT false,
  sehri_time TEXT,
  iftar_time TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  banner_text_en TEXT,
  banner_text_bn TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.festival_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view enabled festivals"
  ON public.festival_themes FOR SELECT
  TO public
  USING (enabled = true);

CREATE POLICY "Admins can view all festivals"
  ON public.festival_themes FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert festivals"
  ON public.festival_themes FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update festivals"
  ON public.festival_themes FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete festivals"
  ON public.festival_themes FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));
