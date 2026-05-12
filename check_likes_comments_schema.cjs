const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
);

async function checkCols() {
  console.log('🔍 Checking feed_post_likes for client_id...');
  const { error: lError } = await supabase.from('feed_post_likes').select('client_id').limit(1);
  if (lError) console.error('❌ Likes Error:', lError.message);
  else console.log('✅ client_id exists in feed_post_likes');

  console.log('\n🔍 Checking feed_post_comments for client_id...');
  const { error: cError } = await supabase.from('feed_post_comments').select('client_id').limit(1);
  if (cError) console.error('❌ Comments Error:', cError.message);
  else console.log('✅ client_id exists in feed_post_comments');
}

checkCols();
