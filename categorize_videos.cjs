require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://esdeyoadcgyjppfeqaky.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not defined in .env or .env.local');
    process.exit(1);
}

async function categorizeVideos() {
  const { data: videos, error } = await supabase.from('videos').select('id, title');
  if (error) {
    console.error('Error fetching videos:', error);
    return;
  }

  const categories = {
    forex: [/forex/i, /pairs/i, /london session/i, /new york session/i, /spreads/i, /swaps/i],
    stocks: [/stocks/i, /equity/i, /shareholders/i, /s&p 500/i, /nasdaq/i, /dividends/i, /market indexes/i, /valuation/i],
    commodities: [/commodities/i, /futures/i, /agricultural/i],
    risk: [/risk/i, /drawdown/i, /expectancy/i, /position sizing/i, /variance/i, /capital/i, /management/i],
    psychology: [/mindset/i, /psychology/i, /discipline/i, /emotion/i, /behavior/i, /behavioral/i],
    prop_trading: [/prop firm/i, /prop trading/i, /funded/i, /payout/i, /rule/i, /consistency/i]
  };

  console.log(`Categorizing ${videos.length} videos...`);
  
  for (const video of videos) {
    let assignedCategory = 'general';
    for (const [cat, patterns] of Object.entries(categories)) {
      if (patterns.some(p => p.test(video.title))) {
        assignedCategory = cat;
        break;
      }
    }
    
    const { error: updateError } = await supabase
      .from('videos')
      .update({ category: assignedCategory })
      .eq('id', video.id);

    if (updateError) {
      console.error(`Error updating video ${video.id}:`, updateError.message);
    }
  }

  console.log('Successfully categorized all videos!');
}

categorizeVideos();
