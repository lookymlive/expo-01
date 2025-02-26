-- Create the videos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view videos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own videos
CREATE POLICY "Users can update own videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'videos'
  AND owner = auth.uid()
);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete own videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'videos'
  AND owner = auth.uid()
);