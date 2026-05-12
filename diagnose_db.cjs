const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
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
