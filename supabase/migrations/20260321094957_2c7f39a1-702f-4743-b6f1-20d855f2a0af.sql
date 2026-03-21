
-- Menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  label_bn TEXT,
  url TEXT NOT NULL,
  parent_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible menu items" ON public.menu_items FOR SELECT USING (visible = true);
CREATE POLICY "Admins can view all menu items" ON public.menu_items FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert menu items" ON public.menu_items FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update menu items" ON public.menu_items FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete menu items" ON public.menu_items FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Seed default menu items
INSERT INTO public.menu_items (label, label_bn, url, sort_order) VALUES
  ('Home', 'হোম', '/', 1),
  ('Packages', 'প্যাকেজ', '/packages', 2),
  ('Services', 'সেবা', '/services', 3),
  ('Coverage', 'কভারেজ', '/coverage', 4),
  ('About', 'আমাদের সম্পর্কে', '/about', 5),
  ('Contact', 'যোগাযোগ', '/contact', 6);

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Anyone can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin(auth.uid()));
