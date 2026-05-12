const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
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
