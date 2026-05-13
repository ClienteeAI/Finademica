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
