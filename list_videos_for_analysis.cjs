require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not defined');
    process.exit(1);
}
const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
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
