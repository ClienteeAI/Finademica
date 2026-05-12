
-- SEED MASTER V2 - BATCH 2 (50 QUESTIONS - INTERMEDIATE)
-- This script links Intermediate questions to existing Quizzes.

DO $$
DECLARE
    f_int uuid; s_int uuid; c_int uuid; m_int uuid;
BEGIN
    -- Get existing Quiz IDs
    SELECT id INTO f_int FROM quizzes WHERE module = 'forex' AND level = 'Intermediate' LIMIT 1;
    SELECT id INTO s_int FROM quizzes WHERE module = 'stocks' AND level = 'Intermediate' LIMIT 1;
    SELECT id INTO c_int FROM quizzes WHERE module = 'crypto' AND level = 'Intermediate' LIMIT 1;
    SELECT id INTO m_int FROM quizzes WHERE module = 'commodities' AND level = 'Intermediate' LIMIT 1;

    -- FOREX INTERMEDIATE
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_int, 'What is the "Carry Trade" strategy?', '["Buying a high-interest currency against a low-interest one", "Holding a trade for more than a year", "Trading only on news events", "Using maximum leverage on every trade"]'::jsonb, 0, 'Carry trade involves profiting from interest rate differentials.'),
    (f_int, 'Which economic indicator typically has the highest impact on Forex markets?', '["Non-Farm Payrolls (NFP)", "Retail Sales", "Consumer Confidence Index", "Housing Starts"]'::jsonb, 0, 'NFP data from the US causes significant market volatility.'),
    (f_int, 'What is "Slippage"?', '["Executing a trade at a different price than requested", "A technical indicator", "When a broker steals pips", "Deposit time"]'::jsonb, 0, 'Slippage occurs during high volatility or low liquidity.'),
    (f_int, 'The Fibonacci Retracement level 61.8% is often referred to as:', '["The Golden Ratio", "The Breakout Point", "The Dead Zone", "The Pivot Point"]'::jsonb, 0, '61.8% is a key reversal level in technical analysis.'),
    (f_int, 'What is a "Doji" in candlestick charting?', '["A candle with identical or near-identical open and close prices", "A long bullish candle", "A candle with no wicks", "A trend pattern"]'::jsonb, 0, 'Dojis represent market indecision.'),
    (f_int, 'What is "Quantitative Easing"?', '["A central bank policy to increase money supply", "A way to calculate position size", "A math strategy", "Closing losing trades"]'::jsonb, 0, 'QE is used by central banks to stimulate the economy.'),
    (f_int, 'Which of these is a "Lagging" indicator?', '["Moving Average", "RSI", "Stochastic Oscillator", "MACD Histogram"]'::jsonb, 0, 'Lagging indicators follow the price action.'),
    (f_int, 'What does "Correlation" mean in Forex?', '["Relationship between movements of two currency pairs", "Connection between broker and trader", "Signal accuracy", "Total daily trades"]'::jsonb, 0, 'Positive correlation means pairs move in the same direction.'),
    (f_int, 'A "Margin Call" occurs when:', '["Account equity falls below required margin", "Broker suggests a trade", "Profit target reached", "Market close"]'::jsonb, 0, 'Margin calls require you to deposit more funds or close positions.'),
    (f_int, 'What is a "Trailing Stop"?', '["A stop loss that moves as profit increases", "A fixed stop loss", "Following a pro trader", "Entering a trade late"]'::jsonb, 0, 'Trailing stops protect profits while allowing room for more growth.');

    -- STOCKS INTERMEDIATE
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_int, 'What is "EBITDA"?', '["Earnings Before Interest, Taxes, Depreciation, and Amortization", "Every Business Interest Total", "Earnings Beyond Internal Tax", "Equity Balance"]'::jsonb, 0, 'EBITDA is a measure of a company overall financial performance.'),
    (s_int, 'What is a "Short Squeeze"?', '["Rapid price rise forcing shorts to buy back", "Slow price decline", "Stock buyback", "Technical pattern"]'::jsonb, 0, 'A short squeeze sends prices skyrocketing.'),
    (s_int, 'What does "Beta" measure in a stock?', '["Volatility relative to the market", "Dividend yield", "Debt ratio", "Profit margin"]'::jsonb, 0, 'Beta of 1.0 means the stock moves with the market.'),
    (s_int, 'What is "Insider Trading"?', '["Trading based on non-public material information", "Trading from inside a bank", "Buying for family", "Pre-market trading"]'::jsonb, 0, 'Insider trading is illegal and strictly regulated.'),
    (s_int, 'What is a "Growth Stock"?', '["Company expected to grow at above-average rate", "High dividend stock", "Low P/E stock", "Slowly dying company"]'::jsonb, 0, 'Growth stocks reinvest profits into the business.'),
    (s_int, 'What is "Fundamental Analysis"?', '["Evaluating based on financial statements", "Studying chart patterns", "Social media trends", "AI predictions"]'::jsonb, 0, 'Fundamentals focus on intrinsic value.'),
    (s_int, 'What is "Technical Analysis"?', '["Evaluating based on price and volume history", "Reading annual reports", "CEO interviews", "Global news"]'::jsonb, 0, 'Technical analysis uses charts to find patterns.'),
    (s_int, 'What is a "Penny Stock"?', '["High-risk stock at very low price", "Stock worth one penny", "Penny dividends", "UK only stock"]'::jsonb, 0, 'Penny stocks are highly speculative.'),
    (s_int, 'What is "Revenue"?', '["Total money from sales", "Profit after expenses", "Tax paid", "Company debt"]'::jsonb, 0, 'Revenue is the "top line" of an income statement.'),
    (s_int, 'What is a "Limit Order"?', '["Order to buy/sell at specific price or better", "Immediate order", "Max loss amount", "Share restriction"]'::jsonb, 0, 'Limit orders give you price control.');

    -- CRYPTO INTERMEDIATE
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_int, 'What is "Proof of Stake" (PoS)?', '["Consensus where validators are chosen by holdings", "Physical coin proof", "Bank storage law", "Mining speed"]'::jsonb, 0, 'PoS is more energy-efficient than Proof of Work.'),
    (c_int, 'What is a "Smart Contract"?', '["Self-executing contract in code", "Computer signed contract", "Digital lawyer", "Employee tracker"]'::jsonb, 0, 'Smart contracts execute automatically when conditions are met.'),
    (c_int, 'What is a "DEX"?', '["Decentralized Exchange", "Digital Entry", "Data Execution", "Dual Energy"]'::jsonb, 0, 'Uniswap is a famous example of a DEX.'),
    (c_int, 'What is "Gas Fee"?', '["Cost to perform a network transaction", "Mining electricity tax", "Exchange profit", "Wallet fee"]'::jsonb, 0, 'Gas fees vary based on network congestion.'),
    (c_int, 'What is "Staking"?', '["Locking crypto to support network and earn rewards", "Selling all coins", "Betting on Bitcoin", "Physical vault"]'::jsonb, 0, 'Staking helps secure decentralized networks.'),
    (c_int, 'What is a "Layer 2" solution?', '["Protocol on top of blockchain to improve scaling", "Key backup", "Different wallet", "Miner group"]'::jsonb, 0, 'Layer 2s like Polygon reduce fees and increase speed.'),
    (c_int, 'What is "Burning" in crypto?', '["Permanently removing coins from circulation", "Hacking", "Selling for loss", "Hardware destruction"]'::jsonb, 0, 'Burning can create deflationary pressure.'),
    (c_int, 'What is "Yield Farming"?', '["Lending crypto to earn interest", "Growing food", "Mining pool", "Buy low sell high"]'::jsonb, 0, 'Yield farming is a popular DeFi strategy.'),
    (c_int, 'What is a "Hard Fork"?', '["Major update creating a new blockchain version", "Mining tool", "Market crash", "Lost private key"]'::jsonb, 0, 'Bitcoin Cash was created from a hard fork of Bitcoin.'),
    (c_int, 'What is a "Whitepaper"?', '["Document explaining project goals and tech", "Blank paper", "Legal contract", "Owner list"]'::jsonb, 0, 'Bitcoin whitepaper was released by Satoshi in 2008.');

    -- COMMODITIES INTERMEDIATE
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_int, 'What is "Contango"?', '["Future price higher than spot price", "Market dance", "Falling prices", "Oil purity"]'::jsonb, 0, 'Contango is common in many commodity markets.'),
    (m_int, 'What is "Backwardation"?', '["Spot price higher than future price", "Moving backwards", "Demand decrease", "Oil refinery"]'::jsonb, 0, 'Backwardation suggests a shortage or high immediate demand.'),
    (m_int, 'What is the "WTI" benchmark?', '["West Texas Intermediate", "World Trade Interest", "Western Timber", "World Treasury"]'::jsonb, 0, 'WTI is a major oil price benchmark.'),
    (m_int, 'What is "Brent Crude"?', '["Oil from North Sea", "Engine oil brand", "Saudi oil", "Volatility measure"]'::jsonb, 0, 'Brent is used to price two-thirds of global oil.'),
    (m_int, 'What is "Hedging" in commodities?', '["Using futures to lock in prices", "Buying much gold", "News trading", "Quality reduction"]'::jsonb, 0, 'Producers hedge to protect against price drops.'),
    (m_int, 'What is a "Spot Price"?', '["Current market price for immediate delivery", "10-year price", "Average price", "Broker price"]'::jsonb, 0, 'Spot prices reflect the current supply and demand.'),
    (m_int, 'What is the "Gold-to-Silver Ratio"?', '["Amount of silver to buy one ounce of gold", "Daily volume", "Gold purity", "Inflation measure"]'::jsonb, 0, 'The ratio helps traders find relative value.'),
    (m_int, 'What is "Speculation" in commodities?', '["Trading for profit without owning the asset", "Chemical study", "Physical delivery", "Trading tax"]'::jsonb, 0, 'Speculators provide liquidity to the markets.'),
    (m_int, 'What are "Exchange-Traded Commodities" (ETCs)?', '["Investment vehicles tracking prices", "Street market goods", "Crypto coins", "Oil well list"]'::jsonb, 0, 'ETCs allow individual investors easy access to commodities.'),
    (m_int, 'What is "Base Metal"?', '["Industrial metals like copper and zinc", "Jewelry only", "Ocean metals", "No value metals"]'::jsonb, 0, 'Base metals are vital for global infrastructure.');

END $$;
