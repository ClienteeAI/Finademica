const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
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
