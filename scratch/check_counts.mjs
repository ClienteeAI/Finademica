import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://esdeyoadcgyjppfeqaky.supabase.co', 'sb_publishable_PZXB0cABIeJ8dmHMNX8rhw_oWrmzQnm');

async function checkData() {
    try {
        const { count, error } = await supabase.from('quizzes').select('*', { count: 'exact', head: true });
        console.log("Quizzes count:", count);
        
        const { count: qCount, error: qErr } = await supabase.from('ai_quiz_questions').select('*', { count: 'exact', head: true });
        console.log("Questions count:", qCount);
    } catch (e) {
        console.error(e);
    }
}

checkData();
