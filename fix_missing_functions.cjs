const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
);

const sql = `
-- Function to create a feed post
CREATE OR REPLACE FUNCTION public.create_feed_post(
  p_content text,
  p_media_storage_paths jsonb DEFAULT '[]'::jsonb,
  p_post_type text DEFAULT 'text'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_client_id uuid;
  v_post_id uuid;
BEGIN
  -- Get current user ID from the session
  v_user_id := (select id from public.users where auth_user_id = auth.uid());
  
  -- Get the client ID for this user
  v_client_id := (select client_id from public.users where auth_user_id = auth.uid());
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated or user profile missing';
  END IF;

  INSERT INTO public.feed_posts (
    user_id,
    client_id,
    content,
    post_type,
    media_storage_paths,
    status,
    is_official
  )
  VALUES (
    v_user_id,
    v_client_id,
    p_content,
    p_post_type,
    p_media_storage_paths,
    'published',
    false
  )
  RETURNING id INTO v_post_id;

  RETURN v_post_id;
END;
$$;

-- Function to increment user stats (points, xp, etc)
CREATE OR REPLACE FUNCTION public.increment_user_stats(
  p_user_id uuid,
  p_points integer,
  p_videos integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Update user_gamification table
  -- We assume xp is the primary points column
  UPDATE public.user_gamification
  SET 
    xp = xp + p_points,
    xp_total = xp_total + p_points,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- If no row exists, we might need to insert (though usually it should exist)
  IF NOT FOUND THEN
    INSERT INTO public.user_gamification (user_id, xp, xp_total, level, streak_days, trades_logged, videos_completed)
    VALUES (p_user_id, p_points, p_points, 1, 0, 0, 0);
  END IF;

  -- Return the new state
  SELECT jsonb_build_object(
    'success', true,
    'points_added', p_points,
    'videos_added', p_videos
  ) INTO v_result;

  RETURN v_result;
END;
$$;
`;

async function fix() {
  console.log('🛠️ Installing missing database functions...');
  const { data, error } = await supabase.rpc('exec_sql', { sql });
  if (error) {
    console.error('❌ Error installing functions:', error);
    process.exit(1);
  } else {
    console.log('✅ Functions successfully installed!');
  }
}

fix();
