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

async function diagnose() {
  const { data, error } = await supabase.from('user_profiles').select('*').limit(1);
  if (error) {
    console.error('Error fetching user_profiles:', error);
  } else {
    console.log('user_profiles exists. Sample data (to see columns):', JSON.stringify(data));
  }
  
  const { data: roles } = await supabase.from('user_roles').select('*').limit(1);
  console.log('user_roles exists:', !!roles);
}

diagnose();
