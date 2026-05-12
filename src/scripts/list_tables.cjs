
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://esdeyoadcgyjppfeqaky.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PZXB0cABIeJ8dmHMNX8rhw_oWrmzQnm';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function listTables() {
  console.log('Listing some tables...');
  // PostgREST doesn't easily list tables, but we can try to select from a non-existent one and see the error?
  // Or try to select from information_schema.tables (might be blocked)
  const { data, error } = await supabase.from('non_existent_table_test').select('*');
  console.log('Error from non-existent table (for hints):', error);
}

listTables();
