
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://esdeyoadcgyjppfeqaky.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PZXB0cABIeJ8dmHMNX8rhw_oWrmzQnm'; // Note: In a real script I'd use service role for bulk insert, but publishable might work for public tables.
// Actually, I'll try to use the publishable key, but usually, it has RLS.
// I'll assume the user has RLS disabled or I can insert.

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const questions = [
  // FOREX - BEGINNER
  {
    module: 'forex',
    level: 'Beginner',
    question: 'What does "PIP" stand for in Forex trading?',
    options: ['Percentage in Point', 'Price Interest Point', 'Percentage in Price', 'Private Investment Plan'],
    correct_answer: 'Percentage in Point'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'Which of the following is considered a "Major" currency pair?',
    options: ['EUR/USD', 'EUR/GBP', 'USD/TRY', 'AUD/NZD'],
    correct_answer: 'EUR/USD'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'If you are "Long" on a currency pair, what are you doing?',
    options: ['Buying the pair', 'Selling the pair', 'Waiting for a crash', 'Hedging against inflation'],
    correct_answer: 'Buying the pair'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'What is the "Spread" in Forex trading?',
    options: ['The difference between the bid and ask price', 'The total profit made on a trade', 'The commission charged by the broker', 'The volatility of the market'],
    correct_answer: 'The difference between the bid and ask price'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'Which city is the largest Forex trading center in the world?',
    options: ['London', 'New York', 'Tokyo', 'Hong Kong'],
    correct_answer: 'London'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'What is "Leverage" in trading?',
    options: ['Using borrowed funds to increase position size', 'Reducing the risk of a trade', 'The speed of market execution', 'A type of technical indicator'],
    correct_answer: 'Using borrowed funds to increase position size'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'In the pair GBP/USD, which is the "Base" currency?',
    options: ['GBP', 'USD', 'Both are equal', 'The one with the higher value'],
    correct_answer: 'GBP'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'A "Bullish" market sentiment means prices are expected to:',
    options: ['Rise', 'Fall', 'Stay the same', 'Be extremely volatile'],
    correct_answer: 'Rise'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'What is a "Lot" in Forex?',
    options: ['A standardized unit of measurement for transaction size', 'A specific time frame for trading', 'A type of charting software', 'A group of traders'],
    correct_answer: 'A standardized unit of measurement for transaction size'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'Which of these is a technical analysis tool?',
    options: ['Moving Average', 'GDP Report', 'Interest Rate Decision', 'Corporate Earnings'],
    correct_answer: 'Moving Average'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'What is a "Stop Loss" order?',
    options: ['An order to close a trade at a set price to limit losses', 'An order to double the position if price falls', 'A strategy to never lose money', 'A way to pause the market'],
    correct_answer: 'An order to close a trade at a set price to limit losses'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'What does "Bearish" mean?',
    options: ['Prices are falling or expected to fall', 'Prices are rising rapidly', 'The market is closed', 'Trading volume is very high'],
    correct_answer: 'Prices are falling or expected to fall'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'Which currency is known as the "Greenback"?',
    options: ['US Dollar', 'British Pound', 'Japanese Yen', 'Australian Dollar'],
    correct_answer: 'US Dollar'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'What is the "Ask" price?',
    options: ['The price at which you buy a currency', 'The price at which you sell a currency', 'The closing price of the day', 'The highest price of the year'],
    correct_answer: 'The price at which you buy a currency'
  },
  {
    module: 'forex',
    level: 'Beginner',
    question: 'How many pips is 0.0001 in a standard pair like EUR/USD?',
    options: ['1 pip', '10 pips', '0.1 pips', '100 pips'],
    correct_answer: '1 pip'
  },

  // FOREX - INTERMEDIATE
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'What is the "Carry Trade" strategy?',
    options: ['Buying a high-interest currency against a low-interest one', 'Holding a trade for more than a year', 'Trading only on news events', 'Using maximum leverage on every trade'],
    correct_answer: 'Buying a high-interest currency against a low-interest one'
  },
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'Which economic indicator typically has the highest impact on Forex markets?',
    options: ['Non-Farm Payrolls (NFP)', 'Retail Sales', 'Consumer Confidence Index', 'Housing Starts'],
    correct_answer: 'Non-Farm Payrolls (NFP)'
  },
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'What is "Slippage"?',
    options: ['Executing a trade at a different price than requested', 'A technical indicator for trends', 'When a broker steals pips', 'The time it takes to deposit funds'],
    correct_answer: 'Executing a trade at a different price than requested'
  },
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'The Fibonacci Retracement level 61.8% is often referred to as:',
    options: ['The Golden Ratio', 'The Breakout Point', 'The Dead Zone', 'The Pivot Point'],
    correct_answer: 'The Golden Ratio'
  },
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'What is a "Doji" in candlestick charting?',
    options: ['A candle with identical or near-identical open and close prices', 'A very long bullish candle', 'A candle with no wicks', 'A pattern indicating a strong trend'],
    correct_answer: 'A candle with identical or near-identical open and close prices'
  },
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'What is "Quantitative Easing"?',
    options: ['A central bank policy to increase money supply', 'A way to calculate position size', 'A technical strategy using math', 'The process of closing all losing trades'],
    correct_answer: 'A central bank policy to increase money supply'
  },
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'Which of these is a "Lagging" indicator?',
    options: ['Moving Average', 'RSI', 'Stochastic Oscillator', 'MACD (Histogram)'],
    correct_answer: 'Moving Average'
  },
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'What does "Correlation" mean in Forex?',
    options: ['The relationship between the movements of two currency pairs', 'The connection between a broker and a trader', 'The accuracy of a signal provider', 'The total number of trades in a day'],
    correct_answer: 'The relationship between the movements of two currency pairs'
  },
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'A "Margin Call" occurs when:',
    options: ['Account equity falls below the required margin', 'The broker calls you to suggest a trade', 'You reach your daily profit target', 'The market is about to close'],
    correct_answer: 'Account equity falls below the required margin'
  },
  {
    module: 'forex',
    level: 'Intermediate',
    question: 'What is a "Trailing Stop"?',
    options: ['A stop loss that moves automatically as profit increases', 'A stop loss that never changes', 'A trade that follows a professional', 'A way to enter a trade late'],
    correct_answer: 'A stop loss that moves automatically as profit increases'
  },

  // FOREX - ELITE
  {
    module: 'forex',
    level: 'Elite',
    question: 'What is "Negative Convexity" typically associated with?',
    options: ['Mortgage-backed securities and certain options', 'Strong trending markets', 'High volatility in majors', 'Central bank interventions'],
    correct_answer: 'Mortgage-backed securities and certain options'
  },
  {
    module: 'forex',
    level: 'Elite',
    question: 'In Elliott Wave Theory, which wave is typically the longest and strongest?',
    options: ['Wave 3', 'Wave 1', 'Wave 5', 'Wave B'],
    correct_answer: 'Wave 3'
  },
  {
    module: 'forex',
    level: 'Elite',
    question: 'What is "Gamma Scalping"?',
    options: ['Adjusting a delta-neutral portfolio to profit from volatility', 'Trading only on the 1-minute chart', 'Using a specific RSI setting', 'A method to bypass broker spreads'],
    correct_answer: 'Adjusting a delta-neutral portfolio to profit from volatility'
  },
  {
    module: 'forex',
    level: 'Elite',
    question: 'Which of the following is a component of the "Ichimoku Cloud" (Kumo)?',
    options: ['Senkou Span B', 'MACD Line', 'Bollinger Band Middle', 'Volume Profile'],
    correct_answer: 'Senkou Span B'
  },
  {
    module: 'forex',
    level: 'Elite',
    question: 'What does a "Yield Curve Inversion" typically signal?',
    options: ['Potential upcoming recession', 'Strong economic growth', 'Lowering interest rates immediately', 'High inflation expectations'],
    correct_answer: 'Potential upcoming recession'
  },
  {
    module: 'forex',
    level: 'Elite',
    question: 'What is the "Black-Scholes" model used for?',
    options: ['Pricing options contracts', 'Predicting currency crashes', 'Calculating leverage requirements', 'Determining optimal stop loss'],
    correct_answer: 'Pricing options contracts'
  },
  {
    module: 'forex',
    level: 'Elite',
    question: 'What is "Intermarket Analysis"?',
    options: ['Studying relationships between stocks, bonds, and currencies', 'Trading between two different brokers', 'Copying trades from other markets', 'Using news from different countries'],
    correct_answer: 'Studying relationships between stocks, bonds, and currencies'
  },
  {
    module: 'forex',
    level: 'Elite',
    question: 'Which bank is responsible for the "London Fix"?',
    options: ['A group of major commercial banks', 'The Bank of England', 'The Federal Reserve', 'The European Central Bank'],
    correct_answer: 'A group of major commercial banks'
  },
  {
    module: 'forex',
    level: 'Elite',
    question: 'What is "Algorithmic HFT"?',
    options: ['High-Frequency Trading using complex algorithms', 'A type of manual fundamental analysis', 'Holding trades for long periods', 'Trading without any risk management'],
    correct_answer: 'High-Frequency Trading using complex algorithms'
  },
  {
    module: 'forex',
    level: 'Elite',
    question: 'What is the "Triangular Arbitrage" strategy?',
    options: ['Exploiting price discrepancies between three currency pairs', 'Using three different indicators to enter a trade', 'Trading only triangles in technical analysis', 'A scam strategy from the 90s'],
    correct_answer: 'Exploiting price discrepancies between three currency pairs'
  }
];

async function seed() {
  console.log('Seeding Forex questions...');
  const { data, error } = await supabase
    .from('ai_quiz_questions')
    .insert(questions.map(q => ({
      ...q,
      quiz_id: 'forex_master_lib'
    })));

  if (error) {
    console.error('Error seeding:', error);
  } else {
    console.log('Successfully seeded ' + questions.length + ' Forex questions!');
  }
}

seed();
