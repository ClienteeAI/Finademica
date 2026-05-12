const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg'
);

async function listTables() {
  // Since we don't have exec_sql RPC, we'll try to fetch common table names to see which exist
  const commonTables = ['profiles', 'user_profiles', 'user_roles', 'roles', 'admins', 'app_metadata', 'settings', 'clients'];
  const results = {};
  
  for (const table of commonTables) {
    const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
    results[table] = !error || error.code !== 'PGRST204' && error.code !== '42P01';
  }
  
  console.log('Table Existence Check:', JSON.stringify(results, null, 2));
}

listTables();
