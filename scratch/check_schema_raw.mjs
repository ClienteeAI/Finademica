import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const envMap = Object.fromEntries(env.split('\n').map(l => l.split('=')).filter(p => p.length === 2).map(p => [p[0].trim(), p[1].trim()]));

const supabase = createClient(envMap.SUPABASE_URL, envMap.SUPABASE_ANON_KEY);

async function checkSchema() {
    try {
        console.log("Checking ai_quiz_questions table...");
        const { data: questions, error: aqErr } = await supabase.from('ai_quiz_questions').select('*').limit(1);
        if (aqErr) console.error("ai_quiz_questions error:", aqErr);
        else console.log("ai_quiz_questions columns:", Object.keys(questions[0] || {}));
    } catch (e) {
        console.error("Execution error:", e);
    }
}

checkSchema();
