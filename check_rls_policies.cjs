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
