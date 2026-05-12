const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
);

async function checkSchema() {
  console.log('🔍 Checking if media_storage_paths exists in feed_posts...');
  
  const { error } = await supabase
    .from('feed_posts')
    .select('media_storage_paths')
    .limit(1);

  if (error) {
    console.error('❌ Column media_storage_paths missing or error:', error.message);
  } else {
    console.log('✅ Column media_storage_paths exists!');
  }

  console.log('\n🔍 Checking if media_urls exists in feed_posts...');
  const { error: error2 } = await supabase
    .from('feed_posts')
    .select('media_urls')
    .limit(1);

  if (error2) {
    console.error('❌ Column media_urls missing or error:', error2.message);
  } else {
    console.log('✅ Column media_urls exists!');
  }
}

checkSchema();
