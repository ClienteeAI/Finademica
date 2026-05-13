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
