
-- Create offer_type enum
CREATE TYPE public.offer_type AS ENUM ('offer', 'referral', 'coupon');

-- Create offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  description TEXT,
  description_bn TEXT,
  image_url TEXT,
  expiry_date DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  type offer_type NOT NULL DEFAULT 'offer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active offers" ON public.offers FOR SELECT USING (active = true);
CREATE POLICY "Admins can view all offers" ON public.offers FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert offers" ON public.offers FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update offers" ON public.offers FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete offers" ON public.offers FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  location TEXT,
  location_bn TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  text TEXT,
  text_bn TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible testimonials" ON public.testimonials FOR SELECT USING (visible = true);
CREATE POLICY "Admins can view all testimonials" ON public.testimonials FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Create partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible partners" ON public.partners FOR SELECT USING (visible = true);
CREATE POLICY "Admins can view all partners" ON public.partners FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert partners" ON public.partners FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update partners" ON public.partners FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete partners" ON public.partners FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Create homepage_features table
CREATE TABLE public.homepage_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name TEXT NOT NULL DEFAULT 'star',
  title TEXT NOT NULL,
  title_bn TEXT,
  description TEXT,
  description_bn TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.homepage_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible features" ON public.homepage_features FOR SELECT USING (visible = true);
CREATE POLICY "Admins can view all features" ON public.homepage_features FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert features" ON public.homepage_features FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update features" ON public.homepage_features FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete features" ON public.homepage_features FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Seed site_settings with hero/topbar/selfcare keys
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_banner_url', ''),
  ('hero_title_bn', 'আপনার এলাকায় সেরা ফাইবার ইন্টারনেট'),
  ('hero_title_en', 'Best Fiber Internet in Your Area'),
  ('hero_subtitle_bn', 'দ্রুত, নির্ভরযোগ্য এবং সাশ্রয়ী মূল্যে হাই-স্পিড ইন্টারনেট সেবা'),
  ('hero_subtitle_en', 'Fast, reliable and affordable high-speed internet service'),
  ('hero_cta_text_bn', 'কভারেজ চেক করুন'),
  ('hero_cta_text_en', 'Check Coverage'),
  ('hero_cta_url', '/coverage'),
  ('topbar_notice_bn', 'গ্যালাক্সি নেটে স্বাগতম! সেরা ইন্টারনেট সেবা পেতে যোগাযোগ করুন।'),
  ('topbar_notice_en', 'Welcome to Galaxy Net! Contact us for the best internet service.'),
  ('hotline', '09678-123456'),
  ('selfcare_url', 'http://portal.galaxynetbd.com/'),
  ('selfcare_enabled', 'true'),
  ('partner_section_title_bn', 'আমাদের পার্টনার'),
  ('partner_section_title_en', 'Our Partners')
ON CONFLICT (key) DO NOTHING;

-- Seed homepage features
INSERT INTO public.homepage_features (icon_name, title, title_bn, description, description_bn, sort_order) VALUES
  ('zap', '99.9% Uptime', '৯৯.৯% আপটাইম', 'Guaranteed network reliability', 'নিশ্চিত নেটওয়ার্ক নির্ভরযোগ্যতা', 1),
  ('headphones', '24/7 Support', '২৪/৭ সাপোর্ট', 'Round the clock customer service', 'সার্বক্ষণিক কাস্টমার সার্ভিস', 2),
  ('gauge', 'High Speed', 'হাই স্পিড', 'Up to 1 Gbps fiber connection', '১ Gbps পর্যন্ত ফাইবার কানেকশন', 3),
  ('shield', 'Secure Network', 'নিরাপদ নেটওয়ার্ক', 'Enterprise-grade security', 'এন্টারপ্রাইজ-গ্রেড সিকিউরিটি', 4),
  ('wifi', 'Free Router', 'ফ্রি রাউটার', 'Free Wi-Fi router with every plan', 'প্রতিটি প্ল্যানে ফ্রি রাউটার', 5),
  ('banknote', 'Affordable Price', 'সাশ্রয়ী মূল্য', 'Best value for your money', 'আপনার অর্থের সর্বোত্তম মূল্য', 6);
