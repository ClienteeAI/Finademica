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

async function checkProfiles() {
  console.log('🔍 Checking profiles table columns...');
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('❌ Error fetching profiles:', error.message);
  } else {
    console.log('Profiles columns:', Object.keys(data[0] || {}).join(', '));
  }

  console.log('\n🔍 Checking user_profiles table columns...');
  const { data: data2, error: error2 } = await supabase.from('user_profiles').select('*').limit(1);
  if (error2) {
    console.error('❌ Error fetching user_profiles:', error2.message);
  } else {
    console.log('User_profiles columns:', Object.keys(data2[0] || {}).join(', '));
  }
}

checkProfiles();
