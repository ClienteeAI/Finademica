
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://esdeyoadcgyjppfeqaky.supabase.co';
const supabaseKey = 'sb_publishable_PZXB0cABIeJ8dmHMNX8rhw_oWrmzQnm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findUser() {
    console.log('Searching for user: callin.cz@gmail.com');
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'callin.cz@gmail.com');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('User found:', JSON.stringify(data, null, 2));
    }
}

findUser();
