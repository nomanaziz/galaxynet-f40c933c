
-- Departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible departments" ON public.departments FOR SELECT USING (visible = true);
CREATE POLICY "Admins can view all departments" ON public.departments FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert departments" ON public.departments FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update departments" ON public.departments FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete departments" ON public.departments FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Designations table
CREATE TABLE public.designations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.designations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view designations" ON public.designations FOR SELECT USING (true);
CREATE POLICY "Admins can insert designations" ON public.designations FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update designations" ON public.designations FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete designations" ON public.designations FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  designation_id UUID REFERENCES public.designations(id) ON DELETE SET NULL,
  phone TEXT,
  email TEXT,
  photo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  show_on_about BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible employees" ON public.employees FOR SELECT USING (visible = true);
CREATE POLICY "Admins can view all employees" ON public.employees FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update employees" ON public.employees FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete employees" ON public.employees FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Seed departments
INSERT INTO public.departments (name, name_bn, sort_order) VALUES
  ('Management', 'ম্যানেজমেন্ট', 1),
  ('NOC', 'এনওসি', 2),
  ('CRM', 'সিআরএম', 3),
  ('Transmission', 'ট্রান্সমিশন', 4),
  ('Accounts', 'একাউন্টস', 5),
  ('Sales & Marketing', 'সেলস অ্যান্ড মার্কেটিং', 6);

-- Seed designations
INSERT INTO public.designations (name, name_bn, sort_order) VALUES
  ('CEO', 'সিইও', 1),
  ('Managing Director', 'ব্যবস্থাপনা পরিচালক', 2),
  ('General Manager', 'জেনারেল ম্যানেজার', 3),
  ('Manager', 'ম্যানেজার', 4),
  ('Senior Engineer', 'সিনিয়র ইঞ্জিনিয়ার', 5),
  ('Engineer', 'ইঞ্জিনিয়ার', 6),
  ('Executive', 'এক্সিকিউটিভ', 7),
  ('Officer', 'অফিসার', 8);
