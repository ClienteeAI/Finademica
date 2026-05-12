const { createClient } = require('@supabase/supabase-js');

const OLD_URL = 'https://tcqrhihgxslpzdqcdwbg.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcXJoaWhneHNscHpkcWNkd2JnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM1MTg1NCwiZXhwIjoyMDc5OTI3ODU0fQ.OcDNKhS_vwRZqqShcLftoIfqGKtaCjryohDYn4CyvQE';

const oldSupabase = createClient(OLD_URL, OLD_KEY);

async function getFullTableList() {
    console.log('📡 Fetching absolute list of all tables from Old Database...');
    
    // Query the internal Postgres schema to get every table name
    const { data, error } = await oldSupabase.rpc('get_tables', {});
    
    // If RPC isn't set up, we use a different way: 
    // We try to query the REST API's list of endpoints which mirrors the tables
    const response = await fetch(`${OLD_URL}/rest/v1/`, {
        headers: { 'apikey': OLD_KEY }
    });
    const schema = await response.json();
    const tables = Object.keys(schema.definitions);
    
    console.log(`\n✅ FOUND ${tables.length} TABLES:`);
    console.log(JSON.stringify(tables, null, 2));
}

getFullTableList();
