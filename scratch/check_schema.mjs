import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkSchema() {
    try {
        console.log("Checking quizzes table...");
        const { data: quizzes, error: qErr } = await supabase.from('quizzes').select('*').limit(1);
        if (qErr) console.error("quizzes error:", qErr);
        else console.log("quizzes columns:", Object.keys(quizzes[0] || {}));

        console.log("\nChecking ai_quiz_questions table...");
        const { data: questions, error: aqErr } = await supabase.from('ai_quiz_questions').select('*').limit(1);
        if (aqErr) console.error("ai_quiz_questions error:", aqErr);
        else console.log("ai_quiz_questions columns:", Object.keys(questions[0] || {}));
    } catch (e) {
        console.error("Execution error:", e);
    }
}

checkSchema();
