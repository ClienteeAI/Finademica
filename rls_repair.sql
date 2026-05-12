-- ==========================================
-- EMERGENCY RLS REPAIR FOR VIDEO VISIBILITY
-- ==========================================

-- 1. Enable RLS on core tables (if not already)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_video_unlocks ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Access for Videos
DROP POLICY IF EXISTS "Allow public read access for videos" ON public.videos;
CREATE POLICY "Allow public read access for videos" 
ON public.videos FOR SELECT 
USING (true);

-- 3. Public Read Access for Client Video Links
DROP POLICY IF EXISTS "Allow public read access for client_videos" ON public.client_videos;
CREATE POLICY "Allow public read access for client_videos" 
ON public.client_videos FOR SELECT 
USING (true);

-- 4. User Read Access for their own Unlocks
DROP POLICY IF EXISTS "Allow users to read their own unlocks" ON public.user_video_unlocks;
CREATE POLICY "Allow users to read their own unlocks" 
ON public.user_video_unlocks FOR SELECT 
TO authenticated
USING (auth.uid() = user_id OR user_id::text = auth.uid()::text);

-- 5. Admin bypass for user_video_unlocks (for safety)
DROP POLICY IF EXISTS "Allow service_role to manage unlocks" ON public.user_video_unlocks;
CREATE POLICY "Allow service_role to manage unlocks" 
ON public.user_video_unlocks FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);
