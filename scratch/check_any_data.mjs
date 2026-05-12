import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://esdeyoadcgyjppfeqaky.supabase.co', 'sb_publishable_PZXB0cABIeJ8dmHMNX8rhw_oWrmzQnm');

async function checkAnyData() {
    try {
        const { count, error } = await supabase.from('clients').select('*', { count: 'exact', head: true });
        console.log("Clients count:", count);
        
        const { count: vCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });
        console.log("Videos count:", vCount);
    } catch (e) {
        console.error(e);
    }
}

checkAnyData();
