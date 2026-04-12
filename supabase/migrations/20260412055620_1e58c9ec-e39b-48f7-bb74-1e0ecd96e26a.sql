
-- Create ftp_servers table
CREATE TABLE public.ftp_servers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'ftp',
  logo_url TEXT,
  link TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ftp_page_settings table
CREATE TABLE public.ftp_page_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ftp_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ftp_page_settings ENABLE ROW LEVEL SECURITY;

-- Public read for ftp_servers (visible only)
CREATE POLICY "Public can view visible ftp servers" ON public.ftp_servers FOR SELECT USING (visible = true);
CREATE POLICY "Admins can view all ftp servers" ON public.ftp_servers FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert ftp servers" ON public.ftp_servers FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update ftp servers" ON public.ftp_servers FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete ftp servers" ON public.ftp_servers FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Public read for ftp_page_settings
CREATE POLICY "Public can view ftp page settings" ON public.ftp_page_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert ftp page settings" ON public.ftp_page_settings FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update ftp page settings" ON public.ftp_page_settings FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete ftp page settings" ON public.ftp_page_settings FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Seed default settings
INSERT INTO public.ftp_page_settings (key, value) VALUES
  ('notice_text', 'Galaxy Net FTP/OTT Server - শুধুমাত্র Galaxy Net ব্যবহারকারীদের জন্য'),
  ('helpline', '09612-345678');
