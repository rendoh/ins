INSERT INTO storage.buckets
  (id, name, file_size_limit, allowed_mime_types, public)
VALUES
  ('posts', 'posts', 1048576, ARRAY['image/jpeg', 'image/png'], TRUE);

CREATE POLICY "Users can upload post" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'posts');
