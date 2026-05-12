const { createClient } = require('@supabase/supabase-js');

const OLD_URL = 'https://tcqrhihgxslpzdqcdwbg.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcXJoaWhneHNscHpkcWNkd2JnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM1MTg1NCwiZXhwIjoyMDc5OTI3ODU0fQ.OcDNKhS_vwRZqqShcLftoIfqGKtaCjryohDYn4CyvQE';

const oldSupabase = createClient(OLD_URL, OLD_KEY);

async function inspect() {
    console.log('🔍 Inspecting Old Database Schema...');

    const tables = [
        'videos', 'quizzes', 'ai_quiz_questions', 'achievements', 'skills', 
        'xp_actions', 'xp_levels', 'xp_rules', 'instrument_specs_mt5', 'ebooks'
    ];

    for (const table of tables) {
        console.log(`\n--- ${table} ---`);
        const { data, error } = await oldSupabase.rpc('get_table_info', { table_name: table });
        
        // If RPC doesn't exist, we'll try a raw query if we can, but Supabase JS doesn't allow raw SQL easily.
        // Instead, let's just try to get ONE row and see the structure.
        const { data: rowData, error: rowError } = await oldSupabase.from(table).select('*').limit(1);
        if (rowData && rowData[0]) {
            console.log(Object.keys(rowData[0]));
        } else {
            console.log('Could not get structure or table empty.');
        }
    }
}

inspect();
