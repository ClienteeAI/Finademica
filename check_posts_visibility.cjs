const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
);

async function checkPosts() {
  console.log('🔍 Checking recent posts in feed_posts table...');
  
  const { data, error } = await supabase
    .from('feed_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ Error fetching posts:', error.message);
  } else {
    console.log(`✅ Found ${data.length} posts in database.`);
    if (data.length > 0) {
      console.log('Latest post data:', JSON.stringify(data[0], null, 2));
    }
  }

  console.log('\n🔍 Checking v_feed_posts view...');
  const { data: viewData, error: viewError } = await supabase
    .from('v_feed_posts')
    .select('*')
    .limit(5);

  if (viewError) {
    console.error('❌ Error fetching from v_feed_posts:', viewError.message);
  } else {
    console.log(`✅ Found ${viewData.length} posts in view.`);
  }
}

checkPosts();
