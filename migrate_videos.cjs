require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// OLD Project (Source)
const oldSupabase = createClient(
  'https://tcqrhihgxslpzdqcdwbg.supabase.co',
  process.env.OLD_SUPABASE_SERVICE_ROLE_KEY
);

// NEW Project (Finademica)
const newSupabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FINADEMICA_CLIENT_ID = 'a6151fd9-1513-4ae0-b960-25454f3a9bf2';

async function migrateVideos() {
  console.log('Fetching videos from old project...');
  const { data: videos, error: vError } = await oldSupabase.from('videos').select('*');
  
  if (vError) {
    console.error('Error fetching videos:', vError);
    return;
  }

  console.log(`Found ${videos.length} videos. Linking to Finademica client...`);
  
  const clientVideos = videos.map(v => ({
    client_id: FINADEMICA_CLIENT_ID,
    video_id: v.id,
    is_active: true
    // Removed visibility_override as it seems missing in new DB
  }));

  const chunkSize = 50;
  for (let i = 0; i < clientVideos.length; i += chunkSize) {
    const chunk = clientVideos.slice(i, i + chunkSize);
    const { error: linkError } = await newSupabase.from('client_videos').upsert(chunk);
    if (linkError) {
      console.error(`Error linking chunk ${i}:`, linkError.message);
    }
  }
  
  console.log('Successfully linked all videos!');
}

migrateVideos();
