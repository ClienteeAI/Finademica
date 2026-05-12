const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
);

const USER_ID = 'cd57ac63-8972-4a1e-b250-9fc521e1d183';

async function deepScan() {
  console.log('🔍 Scanning user context...');
  const { data: user, error: uError } = await supabase
    .from('users')
    .select('id, client_id, is_admin')
    .eq('id', USER_ID)
    .single();

  if (uError) {
    console.error('❌ Error fetching user:', uError.message);
    return;
  }
  console.log('User Context:', JSON.stringify(user, null, 2));

  console.log('\n🔍 Scanning feed_posts for this user...');
  const { data: posts, error: pError } = await supabase
    .from('feed_posts')
    .select('id, client_id, status, content')
    .eq('user_id', USER_ID);

  if (pError) {
    console.error('❌ Error fetching posts:', pError.message);
  } else {
    console.log(`Found ${posts.length} posts.`);
    posts.forEach(p => {
      console.log(`- Post ID: ${p.id}, Status: ${p.status}, Client ID Match: ${p.client_id === user.client_id}`);
    });
  }

  console.log('\n🔍 Scanning user_gamification...');
  const { data: gam, error: gError } = await supabase
    .from('user_gamification')
    .select('xp, xp_total')
    .eq('user_id', USER_ID)
    .single();

  if (gError) {
    console.error('❌ Error fetching gamification:', gError.message);
  } else {
    console.log('Gamification Data:', JSON.stringify(gam, null, 2));
  }
}

deepScan();
