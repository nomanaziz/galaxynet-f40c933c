
-- Enums
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'staff');
CREATE TYPE public.order_status AS ENUM ('pending', 'contacted', 'completed');
CREATE TYPE public.notice_category AS ENUM ('maintenance', 'offer', 'alert');
CREATE TYPE public.package_category AS ENUM ('home', 'corporate');

-- Packages table
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  speed INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  category public.package_category NOT NULL DEFAULT 'home',
  features JSONB DEFAULT '[]'::jsonb,
  badges JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Coverage areas table
CREATE TABLE public.coverage_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  zone TEXT,
  district TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Connection orders table
CREATE TABLE public.connection_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  area TEXT,
  package_id UUID REFERENCES public.packages(id),
  preferred_date DATE,
  notes TEXT,
  status public.order_status NOT NULL DEFAULT 'pending',
  assigned_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pages table
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notices table
CREATE TABLE public.notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  category public.notice_category NOT NULL DEFAULT 'maintenance',
  content TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site settings (key-value)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payment methods
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  account_number TEXT,
  logo_url TEXT,
  instructions TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles (separate table per security requirements)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverage_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: check if user is any admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin', 'admin')
  )
$$;

-- ========== RLS POLICIES ==========

-- PACKAGES: public read (visible), admin write
CREATE POLICY "Public can view visible packages" ON public.packages FOR SELECT USING (visible = true);
CREATE POLICY "Admins can view all packages" ON public.packages FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert packages" ON public.packages FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update packages" ON public.packages FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete packages" ON public.packages FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- COVERAGE AREAS: public read, admin write
CREATE POLICY "Public can view coverage areas" ON public.coverage_areas FOR SELECT USING (true);
CREATE POLICY "Admins can insert coverage areas" ON public.coverage_areas FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update coverage areas" ON public.coverage_areas FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete coverage areas" ON public.coverage_areas FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- CONNECTION ORDERS: anyone can insert, admin can read/update/delete
CREATE POLICY "Anyone can submit orders" ON public.connection_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view orders" ON public.connection_orders FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update orders" ON public.connection_orders FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete orders" ON public.connection_orders FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- PAGES: public read (published), admin write
CREATE POLICY "Public can view published pages" ON public.pages FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all pages" ON public.pages FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert pages" ON public.pages FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update pages" ON public.pages FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete pages" ON public.pages FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- NOTICES: public read (published), admin write
CREATE POLICY "Public can view published notices" ON public.notices FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all notices" ON public.notices FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert notices" ON public.notices FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update notices" ON public.notices FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete notices" ON public.notices FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- SITE SETTINGS: public read, admin write
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete settings" ON public.site_settings FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- PAYMENT METHODS: public read (visible), admin write
CREATE POLICY "Public can view visible payment methods" ON public.payment_methods FOR SELECT USING (visible = true);
CREATE POLICY "Admins can view all payment methods" ON public.payment_methods FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert payment methods" ON public.payment_methods FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update payment methods" ON public.payment_methods FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete payment methods" ON public.payment_methods FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- USER ROLES: super_admin only
CREATE POLICY "Super admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
-- Allow authenticated users to check their own role
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== SEED DATA ==========

-- Seed packages
INSERT INTO public.packages (name, name_bn, speed, price, category, features, badges, featured, sort_order) VALUES
('Basic', 'বেসিক', 20, 500, 'home', '["Unlimited Data", "24/7 Support"]', '["BDIX"]', false, 1),
('Standard', 'স্ট্যান্ডার্ড', 50, 800, 'home', '["Unlimited Data", "24/7 Support", "FTP Access"]', '["BDIX", "FTP"]', true, 2),
('Premium', 'প্রিমিয়াম', 100, 1200, 'home', '["Unlimited Data", "Priority Support", "FTP Access", "Gaming Optimized"]', '["BDIX", "FTP", "Gaming"]', true, 3),
('Ultra', 'আল্ট্রা', 200, 2000, 'home', '["Unlimited Data", "Priority Support", "FTP Access", "Gaming Optimized", "Static IP"]', '["BDIX", "FTP", "Gaming", "Static IP"]', false, 4),
('Business Basic', 'বিজনেস বেসিক', 50, 2000, 'corporate', '["Dedicated Line", "SLA Guarantee", "24/7 Support"]', '["BDIX", "Dedicated"]', false, 5),
('Business Pro', 'বিজনেস প্রো', 100, 4000, 'corporate', '["Dedicated Line", "SLA Guarantee", "Priority Support", "Static IP"]', '["BDIX", "Dedicated", "Static IP"]', true, 6),
('Enterprise', 'এন্টারপ্রাইজ', 300, 8000, 'corporate', '["Dedicated Fiber", "99.9% SLA", "Priority Support", "Multiple Static IPs", "Custom Solutions"]', '["BDIX", "Dedicated", "Static IP", "Fiber"]', false, 7);

-- Seed coverage areas
INSERT INTO public.coverage_areas (name, name_bn, zone, district, available) VALUES
('Mirpur', 'মিরপুর', 'North', 'Dhaka', true),
('Dhanmondi', 'ধানমন্ডি', 'Central', 'Dhaka', true),
('Gulshan', 'গুলশান', 'North', 'Dhaka', true),
('Banani', 'বানানী', 'North', 'Dhaka', true),
('Uttara', 'উত্তরা', 'North', 'Dhaka', true),
('Mohammadpur', 'মোহাম্মদপুর', 'Central', 'Dhaka', true),
('Bashundhara', 'বসুন্ধরা', 'North', 'Dhaka', true),
('Motijheel', 'মতিঝিল', 'South', 'Dhaka', true),
('Khilgaon', 'খিলগাঁও', 'East', 'Dhaka', true),
('Tejgaon', 'তেজগাঁও', 'Central', 'Dhaka', true);

-- Seed default site settings
INSERT INTO public.site_settings (key, value) VALUES
('website_name', 'Galaxy Net'),
('tagline', 'Fast. Reliable. Affordable.'),
('phone', '+880 1XXX-XXXXXX'),
('email', 'info@galaxynet.com'),
('address', 'Dhaka, Bangladesh'),
('facebook', 'https://facebook.com/galaxynet'),
('maintenance_mode', 'false');
