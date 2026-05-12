const { createClient } = require('@supabase/supabase-js');

// OLD Project (Source)
const oldSupabase = createClient(
  'https://tcqrhihgxslpzdqcdwbg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcXJoaWhneHNscHpkcWNkd2JnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM1MTg1NCwiZXhwIjoyMDc5OTI3ODU0fQ.OcDNKhS_vwRZqqShcLftoIfqGKtaCjryohDYn4CyvQE'
);

// NEW Project (Finademica)
const newSupabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
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
