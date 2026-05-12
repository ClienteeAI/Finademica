
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://esdeyoadcgyjppfeqaky.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PZXB0cABIeJ8dmHMNX8rhw_oWrmzQnm';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log('Testing insert with only "question"...');
  const { data, error } = await supabase
    .from('ai_quiz_questions')
    .insert({
        question: 'Test?',
        module: 'forex',
        level: 'Beginner',
        quiz_id: 'test',
        options: ['A', 'B'],
        correct_answer: 'A'
    });

  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log('Insert Success:', data);
  }
}

test();
