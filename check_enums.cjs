require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const OLD_URL = 'https://tcqrhihgxslpzdqcdwbg.supabase.co';
const OLD_KEY = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY;

const oldSupabase = createClient(OLD_URL, OLD_KEY);

async function checkEnums() {
    console.log('🔍 Checking Enum Values...');
    const { data } = await oldSupabase.from('videos').select('asset_type, visibility, module, risk_level, goal, presenter_gender');
    
    const enums = {
        asset_type: new Set(),
        visibility: new Set(),
        module: new Set(),
        risk_level: new Set(),
        goal: new Set(),
        presenter_gender: new Set()
    };

    data.forEach(row => {
        if (row.asset_type) enums.asset_type.add(row.asset_type);
        if (row.visibility) enums.visibility.add(row.visibility);
        if (row.module) enums.module.add(row.module);
        if (row.risk_level) enums.risk_level.add(row.risk_level);
        if (row.goal) enums.goal.add(row.goal);
        if (row.presenter_gender) enums.presenter_gender.add(row.presenter_gender);
    });

    console.log(enums);
}

checkEnums();
