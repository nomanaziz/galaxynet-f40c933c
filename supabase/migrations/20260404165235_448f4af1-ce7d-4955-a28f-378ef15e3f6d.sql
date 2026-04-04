-- Create a public storage bucket for offer images
INSERT INTO storage.buckets (id, name, public) VALUES ('offers', 'offers', true);

-- Allow public read access
CREATE POLICY "Public can view offer images"
ON storage.objects FOR SELECT
USING (bucket_id = 'offers');

-- Allow admins to upload
CREATE POLICY "Admins can upload offer images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'offers' AND (SELECT is_admin(auth.uid())));

-- Allow admins to delete
CREATE POLICY "Admins can delete offer images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'offers' AND (SELECT is_admin(auth.uid())));
