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

async function checkProfileExists() {
  console.log(`🔍 Checking user_profiles for ID: ${USER_ID}`);
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', USER_ID)
    .maybeSingle();

  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('Profile Data:', JSON.stringify(data, null, 2));
  }
}

checkProfileExists();
