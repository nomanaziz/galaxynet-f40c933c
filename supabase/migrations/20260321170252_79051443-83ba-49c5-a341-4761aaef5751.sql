
-- Create services table
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  title_bn text,
  description text,
  description_bn text,
  icon_name text NOT NULL DEFAULT 'wifi',
  badge text,
  badge_bn text,
  link text DEFAULT '/contact',
  features jsonb DEFAULT '[]'::jsonb,
  visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public can view visible services
CREATE POLICY "Public can view visible services"
ON public.services FOR SELECT
USING (visible = true);

-- Admins can view all services
CREATE POLICY "Admins can view all services"
ON public.services FOR SELECT TO authenticated
USING (is_admin(auth.uid()));

-- Admins can insert services
CREATE POLICY "Admins can insert services"
ON public.services FOR INSERT TO authenticated
WITH CHECK (is_admin(auth.uid()));

-- Admins can update services
CREATE POLICY "Admins can update services"
ON public.services FOR UPDATE TO authenticated
USING (is_admin(auth.uid()));

-- Admins can delete services
CREATE POLICY "Admins can delete services"
ON public.services FOR DELETE TO authenticated
USING (is_admin(auth.uid()));

-- Seed existing 5 services
INSERT INTO public.services (title, title_bn, description, description_bn, icon_name, badge, badge_bn, link, features, sort_order) VALUES
('Broadband Internet', 'ব্রডব্যান্ড ইন্টারনেট', 'High-speed fiber optic broadband for homes with unlimited data and BDIX.', 'বাড়ির জন্য আনলিমিটেড ডেটা ও BDIX সহ উচ্চ গতির ফাইবার অপটিক।', 'wifi', 'Most Popular', 'সবচেয়ে জনপ্রিয়', '/packages', '[{"en":"Up to 200 Mbps","bn":"২০০ Mbps পর্যন্ত"},{"en":"BDIX + FTP","bn":"BDIX + FTP"},{"en":"Unlimited Data","bn":"আনলিমিটেড ডেটা"},{"en":"Free Router","bn":"ফ্রি রাউটার"}]'::jsonb, 0),
('Corporate Internet', 'কর্পোরেট ইন্টারনেট', 'Dedicated bandwidth for businesses with guaranteed uptime SLA.', 'ব্যবসার জন্য গ্যারান্টিড আপটাইম SLA সহ ডেডিকেটেড ব্যান্ডউইথ।', 'building-2', NULL, NULL, '/packages', '[{"en":"Dedicated Line","bn":"ডেডিকেটেড লাইন"},{"en":"99.99% SLA","bn":"99.99% SLA"},{"en":"Static IP","bn":"স্ট্যাটিক IP"},{"en":"24/7 Support","bn":"২৪/৭ সাপোর্ট"}]'::jsonb, 1),
('Dedicated Bandwidth', 'ডেডিকেটেড ব্যান্ডউইথ', 'Enterprise-grade solutions for ISPs and large organizations.', 'ISP ও বড় প্রতিষ্ঠানের জন্য এন্টারপ্রাইজ-গ্রেড সমাধান।', 'server', 'Enterprise', 'এন্টারপ্রাইজ', '/contact', '[{"en":"1:1 Bandwidth","bn":"১:১ ব্যান্ডউইথ"},{"en":"Redundant Links","bn":"রিডান্ড্যান্ট লিংক"},{"en":"Custom SLA","bn":"কাস্টম SLA"}]'::jsonb, 2),
('CCTV Solution', 'সিসিটিভি সমাধান', 'Complete surveillance solutions with remote monitoring.', 'রিমোট মনিটরিং সহ সম্পূর্ণ নজরদারি সমাধান।', 'camera', NULL, NULL, '/contact', '[{"en":"IP Cameras","bn":"IP ক্যামেরা"},{"en":"NVR Setup","bn":"NVR সেটআপ"},{"en":"Remote Access","bn":"রিমোট অ্যাক্সেস"},{"en":"Cloud Storage","bn":"ক্লাউড স্টোরেজ"}]'::jsonb, 3),
('Network Setup', 'নেটওয়ার্ক সেটআপ', 'Professional network infrastructure for offices and enterprises.', 'অফিস ও এন্টারপ্রাইজের জন্য পেশাদার নেটওয়ার্ক ইনফ্রাস্ট্রাকচার।', 'network', NULL, NULL, '/contact', '[{"en":"Structured Cabling","bn":"স্ট্রাকচার্ড ক্যাবলিং"},{"en":"WiFi Setup","bn":"ওয়াইফাই সেটআপ"},{"en":"Firewall","bn":"ফায়ারওয়াল"}]'::jsonb, 4);
