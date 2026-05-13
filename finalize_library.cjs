require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not defined');
    process.exit(1);
}
const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const STARTER_PACK_IDS = [
  '971c88bf-c340-4f0a-8a5c-228dda351598', // Who Trades Stocks?
  '64968cbe-8ab8-4ac5-88eb-b4874263f9c5', // Why Stock Prices Move
  '27bc001e-c368-46d7-b52b-334ad5bbec3b', // Pro vs Amateur
  '41c2208b-98b6-4c9e-a9e5-de406ae20daa', // Market Indexes
  '47e36928-45a9-48f0-93ed-cce85ab69e1a', // Stock Valuation
  '3181bcdf-7370-4a2b-a94c-f669e3430d60', // Bull & Bear
  'd35a59b0-7e04-404b-afcf-22f6c8c92c8d', // What Commodities Are
  '15c4225d-c3c2-49c4-b271-53f48dc2f282', // From Beginner to Pro
  '00428b96-10ec-44f5-a877-5d48a6dca788', // Risk Management
  'e7541472-4b7a-4274-9771-712dc8b81480'  // Common Mistakes
];

const VAULT_TITLES = [
  'Advanced Drawdown Defense',
  'Multi-Account Logic',
  'Risk Asymmetry',
  'Order Execution Explained',
  'Institutional Thinking'
];

async function finalizeLibrary() {
  console.log('🔒 Locking the Vault...');
  const { data: vaultVideos } = await supabase.from('videos').select('id, title');
  const vaultIds = vaultVideos.filter(v => VAULT_TITLES.some(t => v.title.includes(t))).map(v => v.id);
  
  if (vaultIds.length > 0) {
    await supabase.from('videos').update({ visibility: 'locked' }).in('id', vaultIds);
    console.log(`Locked ${vaultIds.length} Institutional videos.`);
  }

  console.log('🎁 Granting Starter Pack to all users...');
  const { data: users } = await supabase.from('users').select('id');
  
  for (const user of users) {
    const unlocks = STARTER_PACK_IDS.map(vId => ({
      user_id: user.id,
      video_id: vId,
      unlock_reason: 'starter_pack'
    }));
    
    const { error } = await supabase.from('user_video_unlocks').upsert(unlocks);
    if (error) console.error(`Error for user ${user.id}:`, error.message);
  }

  console.log('✅ Library finalized!');
}

finalizeLibrary();
