-- ========================================
-- SUPABASE STORAGE SETUP
-- ========================================
-- This script creates storage buckets for project images, certificate images, and PDFs
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create storage bucket for certificate images
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-images', 'certificate-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Create storage bucket for certificate PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- STORAGE POLICIES
-- ========================================

-- Allow public read access to project images
CREATE POLICY "Public read access for project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Allow authenticated users to upload project images
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update project images
CREATE POLICY "Authenticated users can update project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete project images
CREATE POLICY "Authenticated users can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- ========================================

-- Allow public read access to certificate images
CREATE POLICY "Public read access for certificate images"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-images');

-- Allow authenticated users to upload certificate images
CREATE POLICY "Authenticated users can upload certificate images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificate-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update certificate images
CREATE POLICY "Authenticated users can update certificate images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificate-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete certificate images
CREATE POLICY "Authenticated users can delete certificate images"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificate-images' AND auth.role() = 'authenticated');

-- ========================================

-- Allow public read access to certificates (PDFs)
CREATE POLICY "Public read access for certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

-- Allow authenticated users to upload certificates
CREATE POLICY "Authenticated users can upload certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update certificates
CREATE POLICY "Authenticated users can update certificates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificates' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete certificates
CREATE POLICY "Authenticated users can delete certificates"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificates' AND auth.role() = 'authenticated');

-- ========================================
-- VERIFY BUCKETS
-- ========================================

SELECT id, name, public, created_at
FROM storage.buckets
WHERE id IN ('project-images', 'certificate-images', 'certificates');

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Storage buckets created successfully!';
  RAISE NOTICE '📁 Buckets:';
  RAISE NOTICE '  - project-images (public)';
  RAISE NOTICE '  - certificate-images (public)';
  RAISE NOTICE '  - certificates (public)';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Policies:';
  RAISE NOTICE '  - Public: Read access for all buckets';
  RAISE NOTICE '  - Authenticated: Full CRUD access';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next steps:';
  RAISE NOTICE '1. Verify buckets in Supabase Dashboard > Storage';
  RAISE NOTICE '2. Test upload from Admin Dashboard';
  RAISE NOTICE '3. Check public URL access';
END $$;
