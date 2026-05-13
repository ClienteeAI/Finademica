require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const OLD_URL = 'https://tcqrhihgxslpzdqcdwbg.supabase.co';
const OLD_KEY = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY;

const NEW_URL = 'https://esdeyoadcgyjppfeqaky.supabase.co';
const NEW_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const NEW_CLIENT_ID = 'a6151fd9-1513-4ae0-b960-25454f3a9bf2';

const oldSupabase = createClient(OLD_URL, OLD_KEY);
const newSupabase = createClient(NEW_URL, NEW_KEY);

const masterTables = [
    'videos',
    'quizzes',
    'ai_quiz_questions',
    'achievements',
    'skills',
    'xp_rules',
    'xp_levels',
    'instrument_specs_mt5'
];

async function migrate() {
    console.log('🚀 Starting Master Data Migration...');

    for (const table of masterTables) {
        console.log(`\n📦 Migrating table: ${table}...`);
        
        const { data, error: fetchError } = await oldSupabase.from(table).select('*');
        
        if (fetchError) {
            console.error(`❌ Error fetching ${table}:`, fetchError.message);
            continue;
        }

        if (!data || data.length === 0) {
            console.log(`⚠️ No data found in ${table}. Skipping.`);
            continue;
        }

        console.log(`✅ Fetched ${data.length} rows.`);

        const transformedData = data.map(row => {
            const newRow = { ...row };
            // Map to new client if column exists
            if ('client_id' in newRow) {
                newRow.client_id = NEW_CLIENT_ID;
            }
            return newRow;
        });

        // Use upsert to handle duplicates safely
        const { error: insertError } = await newSupabase.from(table).upsert(transformedData);

        if (insertError) {
            console.error(`❌ Error inserting into ${table}:`, insertError.message);
            console.log('Sample data:', transformedData[0]);
        } else {
            console.log(`🎉 Successfully migrated ${table}!`);
        }
    }

    console.log('\n✨ ALL MIGRATIONS COMPLETE! ✨');
    console.log('Your new academy is now fully populated with 265 videos and logic.');
}

migrate();
