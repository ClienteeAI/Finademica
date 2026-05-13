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
