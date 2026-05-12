const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
);

async function checkRLS() {
  console.log('🔍 Checking RLS policies...');
  
  const { data, error } = await supabase.rpc('exec_sql', { 
    sql: `
    SELECT 
        schemaname, 
        tablename, 
        policyname, 
        permissive, 
        roles, 
        cmd, 
        qual, 
        with_check 
    FROM pg_policies 
    WHERE tablename = 'feed_posts';
    `
  });

  if (error) {
    console.error('❌ Error fetching policies:', error.message);
    // If exec_sql fails, we assume we need to fix it anyway
  } else {
    console.log('Policies found:', JSON.stringify(data, null, 2));
  }
}

checkRLS();
