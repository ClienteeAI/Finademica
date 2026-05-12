import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://esdeyoadcgyjppfeqaky.supabase.co', 'sb_publishable_PZXB0cABIeJ8dmHMNX8rhw_oWrmzQnm');

async function checkSchema() {
    try {
        console.log("Checking ai_quiz_questions table...");
        const { data: questions, error: aqErr } = await supabase.from('ai_quiz_questions').select('*').limit(1);
        if (aqErr) console.error("ai_quiz_questions error:", aqErr);
        else if (questions && questions.length > 0) console.log("ai_quiz_questions columns:", Object.keys(questions[0]));
        else console.log("ai_quiz_questions is empty, but I will try to inspect the structure via a dummy query if possible.");
        
        // Try to get columns by selecting from a system table if we had permissions, but let's just try to insert a dummy row to see what happens or use an invalid column.
        const { error: colErr } = await supabase.from('ai_quiz_questions').select('module,level').limit(1);
        if (colErr) console.log("Columns module/level do NOT exist.");
        else console.log("Columns module/level DO exist.");

    } catch (e) {
        console.error("Execution error:", e);
    }
}

checkSchema();
