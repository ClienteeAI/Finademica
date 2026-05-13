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

const USER_ID = 'cd57ac63-8972-4a1e-b250-9fc521e1d183';

async function unlockInitialVideos() {
  console.log('Fetching first 10 videos...');
  const { data: videos, error: vError } = await supabase
    .from('videos')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(10);

  if (vError) {
    console.error('Error fetching videos:', vError);
    return;
  }

  console.log(`Unlocking ${videos.length} videos for user ${USER_ID}...`);
  
  const unlocks = videos.map(v => ({
    user_id: USER_ID,
    video_id: v.id,
    unlock_reason: 'initial_grant'
  }));

  const { error: unlockError } = await supabase.from('user_video_unlocks').upsert(unlocks);
  
  if (unlockError) {
    console.error('Error unlocking videos:', unlockError.message);
  } else {
    console.log('Successfully unlocked initial videos!');
  }
}

unlockInitialVideos();
