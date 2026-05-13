require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    'https://esdeyoadcgyjppfeqaky.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyRpc() {
    console.log('🚀 Applying complete_video RPC to database...');
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is missing');
        process.exit(1);
    }

    const sql = fs.readFileSync('src/scripts/create_complete_video_rpc.sql', 'utf8');

    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        // Fallback if exec_sql doesn't exist
        console.log('⚠️ exec_sql not found, trying manual query via REST (this might fail)...');
        console.error('Error:', error.message);
        console.log('\nAlternative: Please copy the content of src/scripts/create_complete_video_rpc.sql and paste it into the Supabase SQL Editor.');
    } else {
        console.log('✅ RPC applied successfully!');
    }
}

applyRpc();
