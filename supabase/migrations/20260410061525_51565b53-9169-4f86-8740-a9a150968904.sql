
-- Add 'supervisor' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'supervisor';

-- Create staff_permissions table
CREATE TABLE public.staff_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  permission text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, permission)
);

-- Enable RLS
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;

-- Admins/super_admins can do everything
CREATE POLICY "Admins can view all permissions"
  ON public.staff_permissions FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert permissions"
  ON public.staff_permissions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update permissions"
  ON public.staff_permissions FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete permissions"
  ON public.staff_permissions FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Users can view their own permissions
CREATE POLICY "Users can view own permissions"
  ON public.staff_permissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
