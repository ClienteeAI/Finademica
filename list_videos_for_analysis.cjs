const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
);

async function listVideos() {
  const { data: videos, error } = await supabase
    .from('videos')
    .select('id, title, category, module, difficulty, duration_seconds')
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching videos:', error);
    return;
  }

  console.log('VIDEO_LIST_START');
  console.log(JSON.stringify(videos, null, 2));
  console.log('VIDEO_LIST_END');
}

listVideos();
