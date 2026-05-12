const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
);

const PROFILE_ID = 'cd57ac63-8972-4a1e-b250-9fc521e1d183';

async function checkConnection() {
  console.log(`🔍 Checking users table for profile: ${PROFILE_ID}`);
  
  const { data, error } = await supabase
    .from('users')
    .select('id, auth_user_id, email, client_id')
    .eq('id', PROFILE_ID)
    .single();

  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('User Mapping:', JSON.stringify(data, null, 2));
    
    if (!data.auth_user_id) {
      console.warn('⚠️ Warning: This user has NO auth_user_id! The app cannot identify them.');
    }
  }
}

checkConnection();
