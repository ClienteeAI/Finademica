
-- SEED MASTER V2 - BATCH 1 (50 QUESTIONS)
-- This script creates the Quizzes (Forex, Stocks, Crypto, Commodities) and links questions to them.

DO $$
DECLARE
    f_beg uuid; f_int uuid; f_eli uuid;
    s_beg uuid; s_int uuid; s_eli uuid;
    c_beg uuid; c_int uuid; c_eli uuid;
    m_beg uuid; m_int uuid; m_eli uuid;
BEGIN
    -- ENSURE COLUMNS EXIST ON ai_quiz_questions for frontend performance
    ALTER TABLE ai_quiz_questions ADD COLUMN IF NOT EXISTS module TEXT;
    ALTER TABLE ai_quiz_questions ADD COLUMN IF NOT EXISTS level TEXT;

    -- Ensure Quizzes exist and get IDs (Using robust check to avoid ON CONFLICT constraint errors)
    
    -- FOREX
    SELECT id INTO f_beg FROM quizzes WHERE module = 'forex' AND level = 'Beginner' LIMIT 1;
    IF f_beg IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('forex', 'Beginner', 75, 5) RETURNING id INTO f_beg; END IF;
    
    SELECT id INTO f_int FROM quizzes WHERE module = 'forex' AND level = 'Intermediate' LIMIT 1;
    IF f_int IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('forex', 'Intermediate', 75, 10) RETURNING id INTO f_int; END IF;
    
    SELECT id INTO f_eli FROM quizzes WHERE module = 'forex' AND level = 'Elite' LIMIT 1;
    IF f_eli IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('forex', 'Elite', 75, 15) RETURNING id INTO f_eli; END IF;

    -- STOCKS
    SELECT id INTO s_beg FROM quizzes WHERE module = 'stocks' AND level = 'Beginner' LIMIT 1;
    IF s_beg IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('stocks', 'Beginner', 75, 5) RETURNING id INTO s_beg; END IF;
    
    SELECT id INTO s_int FROM quizzes WHERE module = 'stocks' AND level = 'Intermediate' LIMIT 1;
    IF s_int IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('stocks', 'Intermediate', 75, 10) RETURNING id INTO s_int; END IF;
    
    SELECT id INTO s_eli FROM quizzes WHERE module = 'stocks' AND level = 'Elite' LIMIT 1;
    IF s_eli IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('stocks', 'Elite', 75, 15) RETURNING id INTO s_eli; END IF;

    -- CRYPTO
    SELECT id INTO c_beg FROM quizzes WHERE module = 'crypto' AND level = 'Beginner' LIMIT 1;
    IF c_beg IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('crypto', 'Beginner', 75, 5) RETURNING id INTO c_beg; END IF;
    
    SELECT id INTO c_int FROM quizzes WHERE module = 'crypto' AND level = 'Intermediate' LIMIT 1;
    IF c_int IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('crypto', 'Intermediate', 75, 10) RETURNING id INTO c_int; END IF;
    
    SELECT id INTO c_eli FROM quizzes WHERE module = 'crypto' AND level = 'Elite' LIMIT 1;
    IF c_eli IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('crypto', 'Elite', 75, 15) RETURNING id INTO c_eli; END IF;

    -- COMMODITIES
    SELECT id INTO m_beg FROM quizzes WHERE module = 'commodities' AND level = 'Beginner' LIMIT 1;
    IF m_beg IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('commodities', 'Beginner', 75, 5) RETURNING id INTO m_beg; END IF;
    
    SELECT id INTO m_int FROM quizzes WHERE module = 'commodities' AND level = 'Intermediate' LIMIT 1;
    IF m_int IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('commodities', 'Intermediate', 75, 10) RETURNING id INTO m_int; END IF;
    
    SELECT id INTO m_eli FROM quizzes WHERE module = 'commodities' AND level = 'Elite' LIMIT 1;
    IF m_eli IS NULL THEN INSERT INTO quizzes (module, level, pass_score, question_count) VALUES ('commodities', 'Elite', 75, 15) RETURNING id INTO m_eli; END IF;

    -- FOREX BEGINNER
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (f_beg, 'forex', 'Beginner', 'What does "PIP" stand for in Forex trading?', '["Percentage in Point", "Price Interest Point", "Percentage in Price", "Private Investment Plan"]'::jsonb, 0, 'PIP stands for Percentage in Point, representing the smallest price move a given exchange rate makes.'),
    (f_beg, 'forex', 'Beginner', 'Which of the following is considered a "Major" currency pair?', '["EUR/USD", "EUR/GBP", "USD/TRY", "AUD/NZD"]'::jsonb, 0, 'EUR/USD is the most traded currency pair and belongs to the "Majors".'),
    (f_beg, 'forex', 'Beginner', 'If you are "Long" on a currency pair, what are you doing?', '["Buying the pair", "Selling the pair", "Waiting for a crash", "Hedging against inflation"]'::jsonb, 0, 'Going "Long" means buying the base currency and selling the quote currency.'),
    (f_beg, 'forex', 'Beginner', 'What is the "Spread" in Forex trading?', '["The difference between the bid and ask price", "The total profit made on a trade", "The commission charged by the broker", "The volatility of the market"]'::jsonb, 0, 'The spread is the difference between the buy (ask) and sell (bid) price.'), 'forex', 'Beginner',
    (f_beg, 'forex', 'Beginner', 'Which city is the largest Forex trading center in the world?', '["London", "New York", "Tokyo", "Hong Kong"]'::jsonb, 0, 'London handles roughly 40% of all Forex transactions worldwide.'),
    (f_beg, 'forex', 'Beginner', 'What is "Leverage" in trading?', '["Using borrowed funds to increase position size", "Reducing risk", "Market speed", "A technical indicator"]'::jsonb, 0, 'Leverage allows you to control a large position with a small amount of capital.'),
    (f_beg, 'forex', 'Beginner', 'In the pair GBP/USD, which is the "Base" currency?', '["GBP", "USD", "Both", "Higher value one"]'::jsonb, 0, 'The first currency in a pair is the base currency.'),
    (f_beg, 'forex', 'Beginner', 'A "Bullish" market sentiment means prices are expected to:', '["Rise", "Fall", "Stay same", "Be volatile"]'::jsonb, 0, 'Bulls push prices up.'),
    (f_beg, 'forex', 'Beginner', 'What is a "Lot" in Forex?', '["A standardized unit of transaction size", "A time frame", "Charting software", "A group of traders"]'::jsonb, 0, 'Standard lots are typically 100,000 units of the base currency.'),
    (f_beg, 'forex', 'Beginner', 'Which of these is a technical analysis tool?', '["Moving Average", "GDP Report", "Interest Rate", "Earnings"]'::jsonb, 0, 'Moving averages help identify trends based on past prices.');

    -- STOCKS BEGINNER
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (s_beg, 'stocks', 'Beginner', 'What does "IPO" stand for?', '["Initial Public Offering", "Internal Profit Option", "International Price Order", "Instant Payment"]'::jsonb, 0, 'IPO is when a company first sells shares to the public.'),
    (s_beg, 'stocks', 'Beginner', 'Which index represents the 500 largest US companies?', '["S&P 500", "Dow Jones", "Nasdaq 100", "Russell 2000"]'::jsonb, 0, 'The Standard & Poor 500 is a key market benchmark.'),
    (s_beg, 'stocks', 'Beginner', 'What is a "Dividend"?', '["A portion of profits paid to shareholders", "The cost of buying stock", "A market crash", "Tax on sales"]'::jsonb, 0, 'Dividends are a way companies share profits with investors.'),
    (s_beg, 'stocks', 'Beginner', 'What is "Market Capitalization"?', '["Total value of company shares", "Price of one share", "Total debt", "Number of employees"]'::jsonb, 0, 'Market Cap = Share Price x Total Shares.'),
    (s_beg, 'stocks', 'Beginner', 'What is a "Blue Chip" stock?', '["Stock in a large, well-established company", "Penny stock", "Losing stock", "Casino stock"]'::jsonb, 0, 'Blue chips are reliable, large-cap companies like Apple or Microsoft.'),
    (s_beg, 'stocks', 'Beginner', 'What is the "P/E Ratio"?', '["Price-to-Earnings Ratio", "Profit-to-Expense", "Price-to-Equity", "Percentage-of-Earnings"]'::jsonb, 0, 'P/E measures a company current share price relative to its per-share earnings.'),
    (s_beg, 'stocks', 'Beginner', 'A "Bear Market" is characterized by:', '["Falling prices and pessimism", "Rising prices", "Stable volume", "Winter trading"]'::jsonb, 0, 'Bears pull prices down.'),
    (s_beg, 'stocks', 'Beginner', 'Which exchange is known for technology stocks?', '["NASDAQ", "NYSE", "LSE", "JPX"]'::jsonb, 0, 'NASDAQ hosts most major tech giants.'),
    (s_beg, 'stocks', 'Beginner', 'What is a "Ticker Symbol"?', '["Unique letters representing a stock", "Sound of a drop", "Technical indicator", "Founder name"]'::jsonb, 0, 'For example, TSLA for Tesla or AAPL for Apple.'),
    (s_beg, 'stocks', 'Beginner', 'What is a "Share"?', '["A unit of ownership in a company", "A loan", "The profit", "A contract"]'::jsonb, 0, 'Owning a share means you own a piece of the corporation.');

    -- CRYPTO BEGINNER
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (c_beg, 'crypto', 'Beginner', 'What is the "Blockchain"?', '["A decentralized digital ledger", "A bank vault", "A browser", "Mining hardware"]'::jsonb, 0, 'Blockchain is a distributed database that maintains a growing list of records.'),
    (c_beg, 'crypto', 'Beginner', 'Who is the anonymous creator of Bitcoin?', '["Satoshi Nakamoto", "Vitalik Buterin", "Elon Musk", "Charlie Lee"]'::jsonb, 0, 'The identity of Satoshi remains unknown.'),
    (c_beg, 'crypto', 'Beginner', 'What is "Mining" in crypto?', '["Verifying transactions for rewards", "Digging in ground", "Buying from exchange", "Storing in safe"]'::jsonb, 0, 'Miners use hardware to solve complex puzzles and secure the network.'),
    (c_beg, 'crypto', 'Beginner', 'What is a "Wallet" in cryptocurrency?', '["Tool to manage digital keys", "Leather pouch", "Bank account", "Transaction list"]'::jsonb, 0, 'Wallets store private keys, not the coins themselves.'),
    (c_beg, 'crypto', 'Beginner', 'What does "HODL" mean?', '["Holding for long term", "Highly Organized Ledger", "Fast transaction", "Buying much"]'::jsonb, 0, 'HODL originated from a typo for "hold" on a Bitcoin forum.'),
    (c_beg, 'crypto', 'Beginner', 'What is the maximum supply of Bitcoin?', '["21 Million", "100 Million", "Infinite", "1 Billion"]'::jsonb, 0, 'Bitcoin has a hard cap of 21,000,000 coins.'),
    (c_beg, 'crypto', 'Beginner', 'What is an "Altcoin"?', '["Any crypto other than Bitcoin", "Aluminum coin", "Scam coin", "Payment only coin"]'::jsonb, 0, 'Altcoins include Ethereum, Solana, and thousands of others.'),
    (c_beg, 'crypto', 'Beginner', 'What is a "Stablecoin"?', '["Crypto pegged to an asset like USD", "Never loses value", "Gold backed only", "Non-tradable"]'::jsonb, 0, 'USDT and USDC are popular stablecoins pegged to the US Dollar.'),
    (c_beg, 'crypto', 'Beginner', 'What is the "Genesis Block"?', '["The first block of a blockchain", "Rich block", "Hacked block", "Last block"]'::jsonb, 0, 'Block 0 of the Bitcoin blockchain was mined on Jan 3, 2009.'),
    (c_beg, 'crypto', 'Beginner', 'What is "DeFi"?', '["Decentralized Finance", "Digital File", "Deferred Interest", "Detailed Forex"]'::jsonb, 0, 'DeFi removes intermediaries from financial transactions.');

    -- COMMODITIES BEGINNER
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (m_beg, 'commodities', 'Beginner', 'What is a "Commodity"?', '["Basic good like oil or gold", "Electronic device", "Bank stock", "Service"]'::jsonb, 0, 'Commodities are interchangeable goods used as inputs in production.'),
    (m_beg, 'commodities', 'Beginner', 'Which commodity is known as a "Safe Haven"?', '["Gold", "Oil", "Copper", "Coffee"]'::jsonb, 0, 'Investors flock to gold during times of economic uncertainty.'),
    (m_beg, 'commodities', 'Beginner', 'What is "Crude Oil"?', '["Unrefined petroleum", "Cooking oil", "Gasoline", "Machine oil"]'::jsonb, 0, 'Crude oil is the raw material for gasoline and plastics.'),
    (m_beg, 'commodities', 'Beginner', 'What are "Hard Commodities"?', '["Natural resources mined or extracted", "Difficult to trade", "Agri products", "Fixed price"]'::jsonb, 0, 'Hard commodities include energy and metals.'),
    (m_beg, 'commodities', 'Beginner', 'What are "Soft Commodities"?', '["Agri products or livestock", "Gold and silver", "Digital currencies", "Fragile goods"]'::jsonb, 0, 'Soft commodities are grown, not mined.'),
    (m_beg, 'commodities', 'Beginner', 'Which city is the hub for Gold trading?', '["London", "Chicago", "Tokyo", "Paris"]'::jsonb, 0, 'The London Bullion Market is the global center for OTC gold.'),
    (m_beg, 'commodities', 'Beginner', 'What is a "Futures Contract"?', '["Agreement to buy/sell at set price in future", "Fortune teller contract", "Prediction", "Insurance"]'::jsonb, 0, 'Futures are used by producers to lock in prices.'),
    (m_beg, 'commodities', 'Beginner', 'Which of these is a Soft Commodity?', '["Wheat", "Silver", "Crude Oil", "Platinum"]'::jsonb, 0, 'Wheat is an agricultural product.'),
    (m_beg, 'commodities', 'Beginner', 'What is "OPEC"?', '["Organization of oil-exporting nations", "Trading platform", "Energy tax", "Clean energy committee"]'::jsonb, 0, 'OPEC manages oil supply to influence global prices.'),
    (m_beg, 'commodities', 'Beginner', 'How is Gold typically measured?', '["Troy Ounces", "Kilograms", "Pounds", "Liters"]'::jsonb, 0, 'One troy ounce is approximately 31.1 grams.');

    -- FOREX INTERMEDIATE
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (f_int, 'forex', 'Intermediate', 'What is the "Carry Trade" strategy?', '["Buying a high-interest currency against a low-interest one", "Holding a trade for more than a year", "Trading only on news events", "Using maximum leverage on every trade"]'::jsonb, 0, 'Carry trade involves profiting from interest rate differentials.'),
    (f_int, 'forex', 'Intermediate', 'Which economic indicator typically has the highest impact on Forex markets?', '["Non-Farm Payrolls (NFP)", 'forex', 'Intermediate', "Retail Sales", "Consumer Confidence Index", "Housing Starts"]'::jsonb, 0, 'NFP data from the US causes significant market volatility.'),
    (f_int, 'forex', 'Intermediate', 'What is "Slippage"?', '["Executing a trade at a different price than requested", "A technical indicator", "When a broker steals pips", "Deposit time"]'::jsonb, 0, 'Slippage occurs during high volatility or low liquidity.'),
    (f_int, 'forex', 'Intermediate', 'The Fibonacci Retracement level 61.8% is often referred to as:', '["The Golden Ratio", "The Breakout Point", "The Dead Zone", "The Pivot Point"]'::jsonb, 0, '61.8% is a key reversal level in technical analysis.'),
    (f_int, 'forex', 'Intermediate', 'What is a "Doji" in candlestick charting?', '["A candle with identical or near-identical open and close prices", "A long bullish candle", "A candle with no wicks", "A trend pattern"]'::jsonb, 0, 'Dojis represent market indecision.'),
    (f_int, 'forex', 'Intermediate', 'What is "Quantitative Easing"?', '["A central bank policy to increase money supply", "A way to calculate position size", "A math strategy", "Closing losing trades"]'::jsonb, 0, 'QE is used by central banks to stimulate the economy.'),
    (f_int, 'forex', 'Intermediate', 'Which of these is a "Lagging" indicator?', '["Moving Average", "RSI", "Stochastic Oscillator", "MACD Histogram"]'::jsonb, 0, 'Lagging indicators follow the price action.'),
    (f_int, 'forex', 'Intermediate', 'What does "Correlation" mean in Forex?', '["Relationship between movements of two currency pairs", "Connection between broker and trader", "Signal accuracy", "Total daily trades"]'::jsonb, 0, 'Positive correlation means pairs move in the same direction.'),
    (f_int, 'forex', 'Intermediate', 'A "Margin Call" occurs when:', '["Account equity falls below required margin", "Broker suggests a trade", "Profit target reached", "Market close"]'::jsonb, 0, 'Margin calls require you to deposit more funds or close positions.'),
    (f_int, 'forex', 'Intermediate', 'What is a "Trailing Stop"?', '["A stop loss that moves as profit increases", "A fixed stop loss", "Following a pro trader", "Entering a trade late"]'::jsonb, 0, 'Trailing stops protect profits while allowing room for more growth.');

    -- STOCKS INTERMEDIATE
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (s_int, 'stocks', 'Intermediate', 'What is "EBITDA"?', '["Earnings Before Interest, Taxes, Depreciation, and Amortization", "Every Business Interest Total", "Earnings Beyond Internal Tax", "Equity Balance"]'::jsonb, 0, 'EBITDA is a measure of a company overall financial performance.'),
    (s_int, 'stocks', 'Intermediate', 'What is a "Short Squeeze"?', '["Rapid price rise forcing shorts to buy back", "Slow price decline", "Stock buyback", "Technical pattern"]'::jsonb, 0, 'A short squeeze sends prices skyrocketing.'),
    (s_int, 'stocks', 'Intermediate', 'What does "Beta" measure in a stock?', '["Volatility relative to the market", "Dividend yield", "Debt ratio", "Profit margin"]'::jsonb, 0, 'Beta of 1.0 means the stock moves with the market.'),
    (s_int, 'stocks', 'Intermediate', 'What is "Insider Trading"?', '["Trading based on non-public material information", "Trading from inside a bank", "Buying for family", "Pre-market trading"]'::jsonb, 0, 'Insider trading is illegal and strictly regulated.'),
    (s_int, 'stocks', 'Intermediate', 'What is a "Growth Stock"?', '["Company expected to grow at above-average rate", "High dividend stock", "Low P/E stock", "Slowly dying company"]'::jsonb, 0, 'Growth stocks reinvest profits into the business.'),
    (s_int, 'stocks', 'Intermediate', 'What is "Fundamental Analysis"?', '["Evaluating based on financial statements", "Studying chart patterns", "Social media trends", "AI predictions"]'::jsonb, 0, 'Fundamentals focus on intrinsic value.'),
    (s_int, 'stocks', 'Intermediate', 'What is "Technical Analysis"?', '["Evaluating based on price and volume history", "Reading annual reports", "CEO interviews", "Global news"]'::jsonb, 0, 'Technical analysis uses charts to find patterns.'),
    (s_int, 'stocks', 'Intermediate', 'What is a "Penny Stock"?', '["High-risk stock at very low price", "Stock worth one penny", "Penny dividends", "UK only stock"]'::jsonb, 0, 'Penny stocks are highly speculative.'),
    (s_int, 'stocks', 'Intermediate', 'What is "Revenue"?', '["Total money from sales", "Profit after expenses", "Tax paid", "Company debt"]'::jsonb, 0, 'Revenue is the "top line" of an income statement.'),
    (s_int, 'stocks', 'Intermediate', 'What is a "Limit Order"?', '["Order to buy/sell at specific price or better", "Immediate order", "Max loss amount", "Share restriction"]'::jsonb, 0, 'Limit orders give you price control.');

    -- CRYPTO INTERMEDIATE
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (c_int, 'crypto', 'Intermediate', 'What is "Proof of Stake" (PoS)?', 'crypto', 'Intermediate', '["Consensus where validators are chosen by holdings", "Physical coin proof", "Bank storage law", "Mining speed"]'::jsonb, 0, 'PoS is more energy-efficient than Proof of Work.'),
    (c_int, 'crypto', 'Intermediate', 'What is a "Smart Contract"?', '["Self-executing contract in code", "Computer signed contract", "Digital lawyer", "Employee tracker"]'::jsonb, 0, 'Smart contracts execute automatically when conditions are met.'),
    (c_int, 'crypto', 'Intermediate', 'What is a "DEX"?', '["Decentralized Exchange", "Digital Entry", "Data Execution", "Dual Energy"]'::jsonb, 0, 'Uniswap is a famous example of a DEX.'),
    (c_int, 'crypto', 'Intermediate', 'What is "Gas Fee"?', '["Cost to perform a network transaction", "Mining electricity tax", "Exchange profit", "Wallet fee"]'::jsonb, 0, 'Gas fees vary based on network congestion.'),
    (c_int, 'crypto', 'Intermediate', 'What is "Staking"?', '["Locking crypto to support network and earn rewards", "Selling all coins", "Betting on Bitcoin", "Physical vault"]'::jsonb, 0, 'Staking helps secure decentralized networks.'),
    (c_int, 'crypto', 'Intermediate', 'What is a "Layer 2" solution?', '["Protocol on top of blockchain to improve scaling", "Key backup", "Different wallet", "Miner group"]'::jsonb, 0, 'Layer 2s like Polygon reduce fees and increase speed.'),
    (c_int, 'crypto', 'Intermediate', 'What is "Burning" in crypto?', '["Permanently removing coins from circulation", "Hacking", "Selling for loss", "Hardware destruction"]'::jsonb, 0, 'Burning can create deflationary pressure.'),
    (c_int, 'crypto', 'Intermediate', 'What is "Yield Farming"?', '["Lending crypto to earn interest", "Growing food", "Mining pool", "Buy low sell high"]'::jsonb, 0, 'Yield farming is a popular DeFi strategy.'),
    (c_int, 'crypto', 'Intermediate', 'What is a "Hard Fork"?', '["Major update creating a new blockchain version", "Mining tool", "Market crash", "Lost private key"]'::jsonb, 0, 'Bitcoin Cash was created from a hard fork of Bitcoin.'),
    (c_int, 'crypto', 'Intermediate', 'What is a "Whitepaper"?', '["Document explaining project goals and tech", "Blank paper", "Legal contract", "Owner list"]'::jsonb, 0, 'Bitcoin whitepaper was released by Satoshi in 2008.');

    -- COMMODITIES INTERMEDIATE
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (m_int, 'commodities', 'Intermediate', 'What is "Contango"?', '["Future price higher than spot price", "Market dance", "Falling prices", "Oil purity"]'::jsonb, 0, 'Contango is common in many commodity markets.'),
    (m_int, 'commodities', 'Intermediate', 'What is "Backwardation"?', '["Spot price higher than future price", "Moving backwards", "Demand decrease", "Oil refinery"]'::jsonb, 0, 'Backwardation suggests a shortage or high immediate demand.'),
    (m_int, 'commodities', 'Intermediate', 'What is the "WTI" benchmark?', '["West Texas Intermediate", "World Trade Interest", "Western Timber", "World Treasury"]'::jsonb, 0, 'WTI is a major oil price benchmark.'),
    (m_int, 'commodities', 'Intermediate', 'What is "Brent Crude"?', '["Oil from North Sea", "Engine oil brand", "Saudi oil", "Volatility measure"]'::jsonb, 0, 'Brent is used to price two-thirds of global oil.'),
    (m_int, 'commodities', 'Intermediate', 'What is "Hedging" in commodities?', '["Using futures to lock in prices", "Buying much gold", "News trading", "Quality reduction"]'::jsonb, 0, 'Producers hedge to protect against price drops.'),
    (m_int, 'commodities', 'Intermediate', 'What is a "Spot Price"?', '["Current market price for immediate delivery", "10-year price", "Average price", "Broker price"]'::jsonb, 0, 'Spot prices reflect the current supply and demand.'),
    (m_int, 'commodities', 'Intermediate', 'What is the "Gold-to-Silver Ratio"?', '["Amount of silver to buy one ounce of gold", "Daily volume", "Gold purity", "Inflation measure"]'::jsonb, 0, 'The ratio helps traders find relative value.'),
    (m_int, 'commodities', 'Intermediate', 'What is "Speculation" in commodities?', '["Trading for profit without owning the asset", "Chemical study", "Physical delivery", "Trading tax"]'::jsonb, 0, 'Speculators provide liquidity to the markets.'),
    (m_int, 'commodities', 'Intermediate', 'What are "Exchange-Traded Commodities" (ETCs)?', 'commodities', 'Intermediate', '["Investment vehicles tracking prices", "Street market goods", "Crypto coins", "Oil well list"]'::jsonb, 0, 'ETCs allow individual investors easy access to commodities.'),
    (m_int, 'commodities', 'Intermediate', 'What is "Base Metal"?', '["Industrial metals like copper and zinc", "Jewelry only", "Ocean metals", "No value metals"]'::jsonb, 0, 'Base metals are vital for global infrastructure.');

    -- FOREX ELITE
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (f_eli, 'forex', 'Elite', 'What is "Slippage-Adjusted Backtesting"?', '["Testing accounting for execution delays", "Avoiding spreads", "Demo trading", "Speed of light"]'::jsonb, 0, 'Realistic backtesting must account for slippage.'),
    (f_eli, 'forex', 'Elite', 'Which central bank uses the "Dot Plot" for projections?', '["Federal Reserve (FED)", 'forex', 'Elite', "ECB", "BOJ", "SNB"]'::jsonb, 0, 'The FED Dot Plot shows where officials expect rates to be.'),
    (f_eli, 'forex', 'Elite', 'What is "Delta Neutral" hedging?', '["Reducing directional risk to zero", "Buying stable currencies", "Zero tax strategy", "No broker trading"]'::jsonb, 0, 'Delta neutral portfolios profit from volatility, not direction.'),
    (f_eli, 'forex', 'Elite', 'What is a "Liquidity Provider" (LP)?', 'forex', 'Elite', '["Entity providing buy/sell orders", "Screen cleaner", "Rich trader", "Internet type"]'::jsonb, 0, 'LPs ensure markets remain efficient and tradable.'),
    (f_eli, 'forex', 'Elite', 'What does the "LIBOR" replacement "SOFR" stand for?', '["Secured Overnight Financing Rate", "Standard Report", "Online Regulation", "Forex Reserve"]'::jsonb, 0, 'SOFR is a broad measure of the cost of borrowing cash overnight.'),
    (f_eli, 'forex', 'Elite', 'What is "Intermarket Analysis"?', '["Studying relationships between assets", "Trading between brokers", "Internal company review", "Secret market signals"]'::jsonb, 0, 'Intermarket analysis looks at how stocks, bonds, and currencies interact.'),
    (f_eli, 'forex', 'Elite', 'What is the "Black-Scholes" model used for?', '["Pricing options contracts", "Forex trend prediction", "Stock buybacks", "Mining difficulty"]'::jsonb, 0, 'Black-Scholes is the standard for option pricing.'),
    (f_eli, 'forex', 'Elite', 'What is "Market Depth"?', '["The volume of buy/sell orders at different prices", "How long the market is open", "The number of active traders", "A measure of asset age"]'::jsonb, 0, 'Market depth reveals the level of liquidity available.'),
    (f_eli, 'forex', 'Elite', 'What is "Gamma" in options Greeks?', '["The rate of change in Delta", "The rate of change in Theta", "The cost of the option", "The time to expiration"]'::jsonb, 0, 'Gamma measures the acceleration of an option price.'),
    (f_eli, 'forex', 'Elite', 'What is "Statistical Arbitrage"?', '["Using mathematical models to find price inefficiencies", "Guessing based on stats", "A type of tax audit", "Manual scalping"]'::jsonb, 0, 'Stat-Arb uses algorithmic trading to exploit mean reversion.');

    -- STOCKS ELITE
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (s_eli, 'stocks', 'Elite', 'What is "Enterprise Value" (EV)?', 'stocks', 'Elite', '["Measure of company total value including debt", "Building price", "Total profit", "CEO salary"]'::jsonb, 0, 'EV = Market Cap + Debt - Cash.'),
    (s_eli, 'stocks', 'Elite', 'What is "Discounted Cash Flow" (DCF) analysis?', 'stocks', 'Elite', '["Valuing based on future cash flow projections", "Post-sale price", "Fee discount", "Bank statement study"]'::jsonb, 0, 'DCF calculates the present value of future earnings.'),
    (s_eli, 'stocks', 'Elite', 'What is a "Poison Pill" strategy?', '["Defense mechanism against hostile takeover", "Competitor bankruptcy", "High-risk algorithm", "Hiding losses"]'::jsonb, 0, 'Poison pills dilute the value of the company to the acquirer.'),
    (s_eli, 'stocks', 'Elite', 'What is "Alpha" in investment?', '["Excess return relative to benchmark", "Risk-free rate", "Total volume", "First trader name"]'::jsonb, 0, 'Alpha measures the active return on an investment.'),
    (s_eli, 'stocks', 'Elite', 'What is "Mezzanine Financing"?', '["Hybrid of debt and equity financing", "Bank floor loans", "Market insurance", "Small company strategy"]'::jsonb, 0, 'Mezzanine is often used in leveraged buyouts.'),
    (s_eli, 'stocks', 'Elite', 'What is a "Special Purpose Acquisition Company" (SPAC)?', 'stocks', 'Elite', '["A shell company designed to take a private company public", "A tech company", "A type of investment bank", "A government fund"]'::jsonb, 0, 'SPACs are often called "blank-check companies".'),
    (s_eli, 'stocks', 'Elite', 'What is "Wash Trading"?', '["Illegal act of buying/selling to create fake volume", "Cleaning your office", "Selling for a tax loss", "High-speed trading"]'::jsonb, 0, 'Wash trading is a form of market manipulation.'),
    (s_eli, 'stocks', 'Elite', 'What is the "Sharpe Ratio"?', '["Measure of risk-adjusted return", "A type of chart tool", "The profit per share", "A measure of company size"]'::jsonb, 0, 'Higher Sharpe ratios indicate better risk-adjusted performance.'),
    (s_eli, 'stocks', 'Elite', 'What is "Short Interest"?', '["The number of shares sold short but not yet covered", "The interest paid on a loan", "A type of market sentiment", "The profit from shorting"]'::jsonb, 0, 'High short interest can lead to a short squeeze.'),
    (s_eli, 'stocks', 'Elite', 'What is "Dark Pool" trading?', '["Private exchanges for trading large blocks of shares", "Trading after midnight", "Hacking a brokerage", "Underwater company stocks"]'::jsonb, 0, 'Dark pools hide large orders from the public eye.');

    -- CRYPTO ELITE
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (c_eli, 'crypto', 'Elite', 'What is "Zero-Knowledge Proof" (ZKP)?', 'crypto', 'Elite', '["Method to prove truth without revealing data", "Zero risk trade", "Empty wallet", "No transactions"]'::jsonb, 0, 'ZKP is vital for blockchain privacy.'),
    (c_eli, 'crypto', 'Elite', 'What is "MEV" (Maximal Extractable Value)?', 'crypto', 'Elite', '["Profit from reordering transactions", "Total market value", "Max withdrawal", "Security measure"]'::jsonb, 0, 'MEV is a major topic in Ethereum validator rewards.'),
    (c_eli, 'crypto', 'Elite', 'What is "Sharding"?', '["Splitting blockchain into smaller parts for speed", "Cyber attack", "Deleting old data", "Dividing keys"]'::jsonb, 0, 'Sharding is a key scaling solution for Ethereum.'),
    (c_eli, 'crypto', 'Elite', 'What is a "DAO"?', '["Decentralized Autonomous Organization", "Digital Asset", "Account Operations", "Asset Optimization"]'::jsonb, 0, 'DAOs use smart contracts for governance.'),
    (c_eli, 'crypto', 'Elite', 'What is "Byzantine Fault Tolerance"?', '["Ability to function despite failing components", "Old encryption", "Hacking method", "Legal requirement"]'::jsonb, 0, 'BFT is essential for decentralized consensus.'),
    (c_eli, 'crypto', 'Elite', 'What is a "Flash Loan"?', '["Uncollateralized loan repaid in the same transaction", "A fast bank loan", "A high-interest loan", "A loan from a crypto friend"]'::jsonb, 0, 'Flash loans are unique to DeFi and programmable money.'),
    (c_eli, 'crypto', 'Elite', 'What is "Impermanent Loss"?', '["Temporary loss in value for liquidity providers", "When you forget your key", "A permanent market crash", "A type of tax penalty"]'::jsonb, 0, 'Impermanent loss happens when prices move away from the entry point.'),
    (c_eli, 'crypto', 'Elite', 'What is "Liquidity Mining"?', '["Earning tokens for providing liquidity to a protocol", "Mining Bitcoin", "Selling all your coins", "A type of exchange fee"]'::jsonb, 0, 'Liquidity mining incentivizes users to join a platform.'),
    (c_eli, 'crypto', 'Elite', 'What is "Cross-Chain Interoperability"?', '["The ability of different blockchains to communicate", "Trading on two exchanges", "Using two different wallets", "A type of high-speed internet"]'::jsonb, 0, 'Bridges allow assets to move between chains.'),
    (c_eli, 'crypto', 'Elite', 'What is a "Sybil Attack"?', '["When one entity creates many fake identities to gain control", "A type of computer virus", "A hack of a crypto exchange", "A physical attack on a miner"]'::jsonb, 0, 'Proof of Stake/Work prevents Sybil attacks.');

    -- COMMODITIES ELITE
    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES 
    (m_eli, 'commodities', 'Elite', 'What is "Crack Spread"?', '["Price difference between crude and refined products", "Gold chart pattern", "Pipeline cost", "Market volatility"]'::jsonb, 0, 'Refiners monitor crack spreads for profitability.'),
    (m_eli, 'commodities', 'Elite', 'What is "Basis Risk"?', '["Risk that spot and futures prices do not converge", "Bankruptcy risk", "Password loss risk", "Currency fluctuation"]'::jsonb, 0, 'Basis risk can impact the effectiveness of a hedge.'),
    (m_eli, 'commodities', 'Elite', 'What is "Physical Delivery"?', '["Actual transfer of commodity at maturity", "Digital file transfer", "Fast execution", "Bank visit"]'::jsonb, 0, 'Most financial traders avoid physical delivery.'),
    (m_eli, 'commodities', 'Elite', 'What is "Margin of Safety"?', '["Buying below intrinsic value or production cost", "Low leverage", "Cash in bank", "Stop losses"]'::jsonb, 0, 'In commodities, production cost provides a floor.'),
    (m_eli, 'commodities', 'Elite', 'What is the "LME"?', '["London Metal Exchange", "Museum", "Commodity bank", "Gold bar"]'::jsonb, 0, 'The LME is the world hub for industrial metal trading.'),
    (m_eli, 'commodities', 'Elite', 'What is "Backwardation-Driven Yield"?', '["Profit from rolling futures contracts in backwardation", "Yield from farming", "A type of dividend", "A market loss"]'::jsonb, 0, 'Roll yield is positive when a market is in backwardation.'),
    (m_eli, 'commodities', 'Elite', 'What is a "Commodity Trading Advisor" (CTA)?', 'commodities', 'Elite', '["A regulated professional managing commodity accounts", "A crypto analyst", "A type of trading software", "A news website"]'::jsonb, 0, 'CTAs are key institutional players in the markets.'),
    (m_eli, 'commodities', 'Elite', 'What is "Strategic Petroleum Reserve" (SPR)?', 'commodities', 'Elite', '["Oil stockpiles maintained for national security", "A private oil company", "A type of gasoline", "A new oil well"]'::jsonb, 0, 'Governments release SPR oil during supply emergencies.'),
    (m_eli, 'commodities', 'Elite', 'What is the "GSCI" Index?', '["Goldman Sachs Commodity Index", "Global Stock Central Index", "Green Supply Chain Info", "General Silver Coin Index"]'::jsonb, 0, 'GSCI is a leading benchmark for commodity performance.'),
    (m_eli, 'commodities', 'Elite', 'What is "Resource Nationalism"?', '["Government control over natural resources", "A type of patriotism", "Buying local products only", "A new mining law"]'::jsonb, 0, 'Resource nationalism can disrupt global supply chains.');

    -- BATCH 4: 10 MORE QUESTIONS PER CATEGORY
    -- FOREX BEGINNER (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_beg, 'What does "Shorting" a currency mean?', '["Selling a currency expecting it to fall", "Buying a small amount", "Trading for a short time", "Using low leverage"]'::jsonb, 0, 'Shorting means selling an asset first to buy it back cheaper later.'),
    (f_beg, 'What is "Margin" in trading?', '["The collateral required to open a position", "The total profit", "The broker fee", "The market volume"]'::jsonb, 0, 'Margin is essentially a security deposit to maintain a leveraged position.'),
    (f_beg, 'Which trading session is known for high volatility in EUR pairs?', '["London", "Sydney", "Tokyo", "Hong Kong"]'::jsonb, 0, 'London session is the most active for European currencies.'),
    (f_beg, 'Which of these is an "Exotic" currency pair?', '["USD/TRY", "EUR/USD", "GBP/JPY", "AUD/USD"]'::jsonb, 0, 'Exotics involve one major currency and one from an emerging economy.'),
    (f_beg, 'What is a "Market Order"?', '["Immediate execution at best available price", "Waiting for a specific price", "A group of trades", "A type of chart"]'::jsonb, 0, 'Market orders are executed instantly.'),
    (f_beg, 'What is "Risk Management"?', '["Limiting potential losses on trades", "Buying more when losing", "Using max leverage", "Ignoring stop losses"]'::jsonb, 0, 'Risk management is the most critical skill for long-term survival.'),
    (f_beg, 'What is the "1% Rule" in trading?', '["Never risk more than 1% of equity per trade", "Profit 1% every day", "Pay 1% commission", "Trade 1 hour a day"]'::jsonb, 0, 'The 1% rule prevents account blowouts during losing streaks.'),
    (f_beg, 'What does the "D1" timeframe represent?', '["Daily candles", "1 minute candles", "1 month candles", "1 year candles"]'::jsonb, 0, 'D1 stands for Daily candles.'),
    (f_beg, 'What are the four parts of a candlestick?', '["Open, High, Low, Close", "Start, End, Middle, Peak", "Up, Down, Left, Right", "Body, Wick, Color, Size"]'::jsonb, 0, 'OHLC data defines every candle.'),
    (f_beg, 'What is "Fundamental Analysis" primarily based on?', '["Economic data and news", "Chart patterns", "Moving averages", "Price history"]'::jsonb, 0, 'Fundamentals look at the underlying health of an economy.');

    -- STOCKS BEGINNER (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_beg, 'What is "Dividend Yield"?', '["Annual dividend divided by share price", "Total profit", "Number of shares", "Stock price growth"]'::jsonb, 0, 'Yield measures the return on investment from dividends alone.'),
    (s_beg, 'What is "Volume" in stock trading?', '["Number of shares traded in a period", "The price of the stock", "The speed of the trend", "The size of the company"]'::jsonb, 0, 'High volume indicates strong interest in a stock.'),
    (s_beg, 'What is "Support" in technical analysis?', '["Price level where buying interest prevents further drops", "Price level where selling starts", "A loan from a broker", "Help from a mentor"]'::jsonb, 0, 'Support acts as a "floor" for prices.'),
    (s_beg, 'What is "Resistance" in technical analysis?', '["Price level where selling interest prevents further rises", "A fast price drop", "A type of market crash", "Ignoring a trend"]'::jsonb, 0, 'Resistance acts as a "ceiling" for prices.'),
    (s_beg, 'What is "Sector Rotation"?', '["Money moving from one industry to another", "Changing brokers", "Selling all stocks", "Stock split"]'::jsonb, 0, 'Investors move money to sectors expected to perform better.'),
    (s_beg, 'What is a "Large Cap" company?', '["Company with market cap over $10 Billion", "A company with many offices", "A high-priced stock", "A company with a long history"]'::jsonb, 0, 'Large caps are generally more stable.'),
    (s_beg, 'What is "Earnings Season"?', '["Period when most companies report quarterly results", "When stocks go up", "Christmas trading", "End of the year"]'::jsonb, 0, 'Earnings season usually brings high volatility.'),
    (s_beg, 'What does "Nasdaq" primarily focus on?', '["Technology and growth stocks", "Old industrial companies", "Banks only", "Oil companies"]'::jsonb, 0, 'Nasdaq is the home of tech giants.'),
    (s_beg, 'What is a "Preferred Share"?', '["Stock with priority for dividends but no voting rights", "A stock everyone likes", "Expensive stock", "Government stock"]'::jsonb, 0, 'Preferred shares behave somewhat like bonds.'),
    (s_beg, 'What is "Market Breadth"?', '["The number of stocks participating in a move", "The price range of a stock", "The total market value", "The width of a chart"]'::jsonb, 0, 'Breadth helps confirm if a trend is healthy.');

    -- CRYPTO BEGINNER (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_beg, 'What is "Cold Storage"?', '["Storing crypto offline for security", "Keeping hardware in a fridge", "Holding coins for 10 years", "Buying during a crash"]'::jsonb, 0, 'Cold storage is the safest way to store large amounts of crypto.'),
    (c_beg, 'What is an "NFT" (Non-Fungible Token)?', '["A unique digital asset on a blockchain", "A new type of Bitcoin", "A fast transaction method", "A digital wallet"]'::jsonb, 0, 'NFTs represent ownership of unique items like art or collectibles.'),
    (c_beg, 'What is "Gas" on the Ethereum network?', '["The fee paid to process transactions", "A type of mining fuel", "A digital currency", "The speed of the network"]'::jsonb, 0, 'Gas prices change based on network demand.'),
    (c_beg, 'What is the "Halving" in Bitcoin?', '["The reward for mining a block is cut in half", "The price of Bitcoin drops by 50%", "The number of users is reduced", "Mining becomes twice as fast"]'::jsonb, 0, 'Halving happens approximately every 4 years and reduces supply.'),
    (c_beg, 'What is a "Whale" in crypto?', '["An entity holding a huge amount of cryptocurrency", "A sea-themed token", "A type of hacking attack", "A rich exchange owner"]'::jsonb, 0, 'Whales can influence market prices with their large trades.'),
    (c_beg, 'What is "FOMO"?', '["Fear Of Missing Out", "Financial Order Market Optimization", "Fast Online Money Opportunity", "Future Of Market Operations"]'::jsonb, 0, 'FOMO often leads traders to buy at the top.'),
    (c_beg, 'What is a "Seed Phrase"?', '["A series of words to recover a wallet", "The name of a new coin", "A trading password", "A list of transaction IDs"]'::jsonb, 0, 'Never share your seed phrase with anyone.'),
    (c_beg, 'What is "Liquidity" in a crypto exchange?', '["The ease of buying or selling without price impact", "The amount of cash in the bank", "The speed of the website", "The number of coins listed"]'::jsonb, 0, 'High liquidity means tighter spreads and better execution.'),
    (c_beg, 'What is an "Airdrop"?', '["Free tokens sent to wallet addresses", "A network crash", "Buying coins from the air", "A type of cloud storage"]'::jsonb, 0, 'Airdrops are often used for marketing new projects.'),
    (c_beg, 'What is "KYC" (Know Your Customer)?', '["Identity verification process by exchanges", "A type of trading signal", "A security key", "A customer support tool"]'::jsonb, 0, 'KYC is required by regulators to prevent money laundering.');

    -- COMMODITIES BEGINNER (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_beg, 'What is "Inflation Hedging"?', '["Buying assets to protect against currency devaluation", "Predicting price drops", "Selling gold for cash", "Ignoring price changes"]'::jsonb, 0, 'Gold and silver are traditional inflation hedges.'),
    (m_beg, 'What is "Doctor Copper"?', '["Copper as an indicator of global economic health", "A famous commodity trader", "A type of medical equipment", "A copper-based medicine"]'::jsonb, 0, 'Copper is used in almost all infrastructure, reflecting growth.'),
    (m_beg, 'What is "Natural Gas" used for primarily?', '["Heating and electricity generation", "Running cars", "Making jewelry", "Food production"]'::jsonb, 0, 'Natural gas is a key energy commodity.'),
    (m_beg, 'What are "Metals" commodities divided into?', '["Precious and Base", "Hard and Soft", "Gold and Non-Gold", "Old and New"]'::jsonb, 0, 'Precious (Gold, Silver) and Base (Copper, Nickel).'),
    (m_beg, 'Which of these is an "Agricultural" commodity?', '["Coffee", "Gold", "Crude Oil", "Aluminum"]'::jsonb, 0, 'Coffee is one of the most traded soft commodities.'),
    (m_beg, 'What is "Physical Gold" vs "Paper Gold"?', '["Owning the bars vs owning a certificate", "Gold coins vs gold jewelry", "Real gold vs fake gold", "Expensive gold vs cheap gold"]'::jsonb, 0, 'Paper gold includes ETFs and futures.'),
    (m_beg, 'What influences "Wheat" prices the most?', '["Weather and crop reports", "Interest rates", "Stock market trends", "Tech innovations"]'::jsonb, 0, 'Agri products are highly sensitive to climate.'),
    (m_beg, 'What is a "Commodity Index"?', '["A basket of different commodities tracking performance", "A list of gold prices", "A trading manual", "A type of stock market"]'::jsonb, 0, 'The Bloomberg Commodity Index is a popular benchmark.'),
    (m_beg, 'What is "Supply and Demand"?', '["The core drivers of commodity prices", "A trading strategy", "A type of contract", "A broker fee"]'::jsonb, 0, 'If supply drops or demand rises, prices generally increase.'),
    (m_beg, 'Which country is a major producer of "Silver"?', '["Mexico", "UK", "Japan", "Egypt"]'::jsonb, 0, 'Mexico is the largest silver producer in the world.');

    -- FOREX INTERMEDIATE (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_int, 'What is the "Average True Range" (ATR)?', '["A measure of market volatility", "A trend indicator", "A profit target", "A type of moving average"]'::jsonb, 0, 'ATR helps traders set stop losses based on volatility.'),
    (f_int, 'What is a "Head and Shoulders" pattern?', '["A trend reversal pattern", "A trend continuation pattern", "A market noise signal", "A type of news event"]'::jsonb, 0, 'It consists of a peak, followed by a higher peak, and a lower peak.'),
    (f_int, 'What is "Divergence" in trading?', '["When price and indicator move in opposite directions", "When two pairs move together", "A sudden price crash", "A gap in the market"]'::jsonb, 0, 'Divergence often signals a potential reversal.'),
    (f_int, 'What is the "RSI" (Relative Strength Index)?', '["A momentum oscillator that measures speed and change", "A volume indicator", "A trend line", "A news filter"]'::jsonb, 0, 'RSI helps identify overbought or oversold conditions.'),
    (f_int, 'What is "Price Action" trading?', '["Trading based on raw price movement on a clean chart", "Using 10 indicators", "Following news only", "Automated bot trading"]'::jsonb, 0, 'Price action focuses on patterns, support, and resistance.'),
    (f_int, 'What is "Liquidity Grab"?', '["When price hits stop losses before reversing", "Buying all available shares", "A broker fee", "A type of market crash"]'::jsonb, 0, 'Big players use liquidity pools to fill large orders.'),
    (f_int, 'What is "Multiple Time Frame" (MTF) analysis?', '["Analyzing an asset on several timeframes before entry", "Trading 10 pairs at once", "Using 5 different brokers", "Checking the news every hour"]'::jsonb, 0, 'MTF helps align short-term entries with long-term trends.'),
    (f_int, 'What is a "Limit Order" vs "Stop Order"?', '["Limit is for better price, Stop is for breakout", "Limit is for exit, Stop is for entry", "Same thing", "Broker preference"]'::jsonb, 0, 'Limit orders are passive; Stop orders become market orders when hit.'),
    (f_int, 'What is "Market Sentiment"?', '["The overall attitude of investors toward a market", "The current price", "A technical indicator", "A news headline"]'::jsonb, 0, 'Sentiment can be bullish, bearish, or neutral.'),
    (f_int, 'What is "Drawdown"?', '["The peak-to-trough decline during a specific period", "Total profit", "Broker withdrawal", "Position size"]'::jsonb, 0, 'Max drawdown is a key risk metric for any strategy.');

    -- STOCKS INTERMEDIATE (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_int, 'What is "Free Cash Flow" (FCF)?', '["Cash a company generates after capital expenditures", "Total revenue", "Money in the bank", "Profit from sales"]'::jsonb, 0, 'FCF is used to pay dividends, buy back shares, or reduce debt.'),
    (s_int, 'What is "Return on Equity" (ROE)?', '["Measure of financial performance calculated by net income / equity", "Stock price growth", "Dividend yield", "Total company value"]'::jsonb, 0, 'ROE measures how effectively management uses assets to create profit.'),
    (s_int, 'What is a "Dead Cat Bounce"?', '["A temporary recovery in a declining trend", "A market crash", "A successful trade", "A stock split"]'::jsonb, 0, 'It is often a trap for buyers before the trend continues down.'),
    (s_int, 'What is "Bollinger Bands"?', '["Volatility envelopes above and below a moving average", "A type of dividend", "A news group", "A stock index"]'::jsonb, 0, 'Bands expand and contract based on market volatility.'),
    (s_int, 'What is "Short Interest"?', '["Percentage of shares held by short sellers", "Interest on a bank loan", "Market enthusiasm", "Broker commission"]'::jsonb, 0, 'High short interest can signal a potential short squeeze.'),
    (s_int, 'What is "Value Investing"?', '["Buying stocks that are undervalued by the market", "Buying high-growth tech", "Day trading", "Following social media"]'::jsonb, 0, 'Value investors look for a "margin of safety".'),
    (s_int, 'What is "Dollar Cost Averaging" (DCA)?', '["Investing a fixed amount at regular intervals", "Buying all at once", "Using leverage", "Selling when price drops"]'::jsonb, 0, 'DCA reduces the impact of volatility on the overall purchase.'),
    (s_int, 'What is a "Trailing P/E" vs "Forward P/E"?', '["Past earnings vs expected future earnings", "Price vs Profit", "Stock vs Bond", "Buy vs Sell"]'::jsonb, 0, 'Forward P/E is based on analyst estimates for the next year.'),
    (s_int, 'What is "Insider Ownership"?', '["Percentage of shares held by company executives", "Illegal trading", "Bank ownership", "Public shares"]'::jsonb, 0, 'High insider ownership aligns management interests with shareholders.'),
    (s_int, 'What is a "Stock Buyback"?', '["When a company buys its own shares from the market", "Returning a stock to the broker", "A market crash", "A merger"]'::jsonb, 0, 'Buybacks reduce share count and can increase EPS.');

    -- CRYPTO INTERMEDIATE (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_int, 'What is "Impermanent Loss"?', '["Loss in value for liquidity providers when prices move", "Losing your private key", "A permanent market crash", "A type of tax penalty"]'::jsonb, 0, 'It happens when the price ratio of paired assets changes.'),
    (c_int, 'What is "On-Chain Analysis"?', '["Studying blockchain data to understand market behavior", "Checking news", "Technical charting", "Interviewing developers"]'::jsonb, 0, 'Analysis include wallet movements, hash rate, and exchange flows.'),
    (c_int, 'What is a "Flash Loan"?', '["Uncollateralized loan repaid in the same transaction", "A very fast bank loan", "A high-interest crypto loan", "A loan from a friend"]'::jsonb, 0, 'Flash loans are a unique feature of DeFi protocols.'),
    (c_int, 'What is "EIP-1559"?', '["An Ethereum upgrade that introduced fee burning", "A new Bitcoin protocol", "A type of wallet", "A security standard"]'::jsonb, 0, 'EIP-1559 made Ethereum fees more predictable and deflationary.'),
    (c_int, 'What is "TVL" (Total Value Locked)?', '["The total value of assets in a DeFi protocol", "The price of a coin", "Market cap", "Number of users"]'::jsonb, 0, 'TVL is a key metric for measuring DeFi adoption.'),
    (c_int, 'What is "Governance Token"?', '["Token that gives holders voting rights in a project", "A token for paying taxes", "A high-security coin", "A government-issued crypto"]'::jsonb, 0, 'Governance tokens allow decentralized decision-making.'),
    (c_int, 'What is "Layer 0"?', '["Infrastructure that allows blockchains to communicate", "The user interface", "The internet itself", "A type of wallet"]'::jsonb, 0, 'Projects like Polkadot and Cosmos are considered Layer 0s.'),
    (c_int, 'What is a "Mixing Service" (Tumbler)?', '["Tool to hide transaction history for privacy", "A type of crypto exchange", "A hardware wallet", "A coin mining pool"]'::jsonb, 0, 'Mixing services make it harder to trace the origin of funds.'),
    (c_int, 'What is "Tokenomics"?', '["The economics and supply/demand of a token", "Trading strategy", "Mining software", "A list of developers"]'::jsonb, 0, 'Tokenomics includes inflation rate, utility, and distribution.'),
    (c_int, 'What is a "Bridge" in crypto?', '["Protocol to move assets between different blockchains", "A type of security", "A physical mining site", "A way to connect wallets"]'::jsonb, 0, 'Bridges are essential for multi-chain interoperability.');

    -- COMMODITIES INTERMEDIATE (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_int, 'What is "Seasonality" in agriculture?', '["Predictable price patterns based on harvest cycles", "Changes in interest rates", "Stock market trends", "Tech updates"]'::jsonb, 0, 'Crops have clear planting and harvesting windows.'),
    (m_int, 'What is "Fracking" (Hydraulic Fracturing)?', '["Method to extract oil and gas from shale rock", "A type of mining", "Cleaning oil", "Predicting weather"]'::jsonb, 0, 'Fracking revolutionized US oil and gas production.'),
    (m_int, 'What is "Speculative Net Length"?', '["The total position of non-commercial traders", "The length of a gold bar", "Total market volume", "Broker fee"]'::jsonb, 0, 'Traders monitor the COT report for speculative positioning.'),
    (m_int, 'What is "LME Warehouse Stocks"?', '["Inventory of metals held in LME-approved sites", "A list of gold mines", "A type of investment", "Metal prices"]'::jsonb, 0, 'Falling stocks often signal supply shortages and higher prices.'),
    (m_int, 'What is "Refinery Margin"?', '["Profit from converting crude oil into products", "Price of oil", "Gasoline tax", "A type of trading fee"]'::jsonb, 0, 'Also known as the "Crack Spread".'),
    (m_int, 'What is "Geopolitical Risk" in commodities?', '["Political events that disrupt supply chains", "Weather changes", "Market trends", "Interest rate hikes"]'::jsonb, 0, 'Conflicts in oil-rich regions cause immediate price spikes.'),
    (m_int, 'What is "Base Load" power?', '["The minimum level of demand on an electrical grid", "A high-power battery", "Solar energy only", "A type of fuel"]'::jsonb, 0, 'Natural gas and coal often provide base load power.'),
    (m_int, 'What is the "Silver Institute"?', '["Organization providing data on silver supply/demand", "A place to buy silver", "A silver mine", "A museum"]'::jsonb, 0, 'The Silver Institute is the main source for industry stats.'),
    (m_int, 'What is "Quality Spread"?', '["Price difference between different grades of an asset", "Spread between bid/ask", "Broker commission", "Market volatility"]'::jsonb, 0, 'For example, the spread between Brent and WTI crude.'),
    (m_int, 'What is "Storage Cost" (Carry)?', '["The cost of holding a physical commodity", "The price of buying it", "Broker fee", "Market tax"]'::jsonb, 0, 'Storage cost is a major factor in the Contango market.');

    -- FOREX ELITE (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_eli, 'What is "Order Flow Trading"?', '["Analyzing the actual buy/sell orders in the market", "Using moving averages", "Following news", "Scalping on 1 minute"]'::jsonb, 0, 'Order flow reveals where the "big money" is entering.'),
    (f_eli, 'What is "Vanna" in options Greeks?', '["Sensitivity of Delta to changes in volatility", "Sensitivity to time", "Price of the option", "Broker fee"]'::jsonb, 0, 'Vanna is critical for sophisticated hedging strategies.'),
    (f_eli, 'What is "Charm" (Delta Decay)?', '["The rate at which Delta changes over time", "The beauty of a chart", "A type of signal", "Market enthusiasm"]'::jsonb, 0, 'Charm is a second-order Greek important for long-term options.'),
    (f_eli, 'What is "High-Frequency Trading" (HFT)?', '["Algorithmic trading at extremely high speeds", "Trading many times a day", "Using high leverage", "Trading only on news"]'::jsonb, 0, 'HFT accounts for a large percentage of market volume.'),
    (f_eli, 'What is "Dark Liquidity"?', '["Volume not visible on the public order book", "Illegal trading", "Trading after hours", "A market crash"]'::jsonb, 0, 'Dark pools allow institutions to trade without moving the market.'),
    (f_eli, 'What is "Convexity" in bond/forex math?', '["The non-linear relationship between price and yield", "A type of trend", "A chart pattern", "A risk level"]'::jsonb, 0, 'Convexity helps traders understand interest rate sensitivity.'),
    (f_eli, 'What is "Skew" in options?', '["Difference in implied volatility between options", "A crooked chart", "A market error", "A type of signal"]'::jsonb, 0, 'Volatility skew reflects market bias toward specific outcomes.'),
    (f_eli, 'What is "Mean Reversion"?', '["The theory that prices return to an average over time", "Prices always going up", "A type of indicator", "A trading bot"]'::jsonb, 0, 'Mean reversion strategies profit from overextensions.'),
    (f_eli, 'What is "Basis" in currency swaps?', '["The difference between spot and forward rates", "The core of a trade", "A type of tax", "Broker fee"]'::jsonb, 0, 'Basis swaps are used by banks for global liquidity management.'),
    (f_eli, 'What is "Back-Testing Overfitting"?', '["Optimizing a strategy too much for past data", "Testing too many pairs", "Using old data", "Making a mistake"]'::jsonb, 0, 'Overfitted strategies usually fail in live trading.');

    -- STOCKS ELITE (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_eli, 'What is "Net Present Value" (NPV)?', '["The difference between present value of cash in/out", "Total company value", "Stock price today", "Future profit"]'::jsonb, 0, 'NPV is a core tool for capital budgeting.'),
    (s_eli, 'What is "WACC" (Weighted Average Cost of Capital)?', '["The average rate a company pays to finance assets", "Total company debt", "Wages paid to employees", "Market cap"]'::jsonb, 0, 'WACC is used as the discount rate in DCF analysis.'),
    (s_eli, 'What is "LBO" (Leveraged Buyout)?', '["Acquisition of a company using a significant amount of debt", "A type of stock split", "A merger", "A bank loan"]'::jsonb, 0, 'Private equity firms use LBOs to take companies private.'),
    (s_eli, 'What is "CAPM" (Capital Asset Pricing Model)?', '["Model used to determine expected return on an asset", "A trading software", "A list of stocks", "A type of index"]'::jsonb, 0, 'CAPM relates risk (Beta) to expected return.'),
    (s_eli, 'What is "Market Efficiency Hypothesis" (EMH)?', '["Theory that asset prices reflect all available info", "Markets are always right", "No one can make money", "A type of indicator"]'::jsonb, 0, 'Strong EMH suggests that beating the market is impossible.'),
    (s_eli, 'What is "Stagflation"?', '["High inflation combined with stagnant economic growth", "Low prices and high growth", "Market crash", "A type of tax"]'::jsonb, 0, 'Stagflation is a nightmare scenario for central banks.'),
    (s_eli, 'What is a "Rights Issue"?', '["Offering existing shareholders new shares at a discount", "A legal battle", "A stock split", "A merger"]'::jsonb, 0, 'Companies use rights issues to raise capital quickly.'),
    (s_eli, 'What is "Goodwill" on a balance sheet?', '["Intangible asset from acquiring another company", "A company reputation", "Total profit", "Charity work"]'::jsonb, 0, 'Goodwill represents value above the fair market value of assets.'),
    (s_eli, 'What is "Securitization"?', '["Pooling various debts into a tradeable security", "Securing a website", "Buying insurance", "Market regulation"]'::jsonb, 0, 'MBS (Mortgage-Backed Securities) are a product of securitization.'),
    (s_eli, 'What is "Contingent Convertible" (CoCo) Bond?', '["Debt that converts to equity if a trigger is met", "A type of stock", "A crypto coin", "A bank loan"]'::jsonb, 0, 'CoCos are often used by banks to meet capital requirements.');

    -- CRYPTO ELITE (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_eli, 'What is "Optimistic Rollup"?', '["A Layer 2 scaling solution that assumes transactions are valid", "A positive market trend", "A type of wallet", "A news group"]'::jsonb, 0, 'Rollups execute transactions off-chain and post data to Ethereum.'),
    (c_eli, 'What is "ZK-Rollup"?', '["A Layer 2 using zero-knowledge proofs for validation", "A secret crypto", "A fast mining tool", "A type of airdrop"]'::jsonb, 0, 'ZK-Rollups are more complex but offer faster finality than Optimistic.'),
    (c_eli, 'What is "Liquid Staking"?', '["Receiving a tradeable token in exchange for staked assets", "Staking for a short time", "Selling staked coins", "Mining in a pool"]'::jsonb, 0, 'Lido (stETH) is the most popular liquid staking protocol.'),
    (c_eli, 'What is "Account Abstraction" (ERC-4337)?', '["Enabling smart contracts to function as wallets", "Deleting old accounts", "Hiding account balance", "A type of bridge"]'::jsonb, 0, 'It allows for features like social recovery and gasless trades.'),
    (c_eli, 'What is "Re-staking"?', '["Using staked assets to secure other networks", "Staking twice", "Selling and re-buying", "Mining more coins"]'::jsonb, 0, 'EigenLayer introduced the concept of re-staking on Ethereum.'),
    (c_eli, 'What is "Slashing" in PoS?', '["Penalty where a validator loses staked funds", "Cutting transaction fees", "A market crash", "Deleting data"]'::jsonb, 0, 'Slashing prevents malicious behavior in the network.'),
    (c_eli, 'What is "Front-Running"?', '["Executing a trade ahead of a known pending transaction", "Buying first", "A type of racing", "A security feature"]'::jsonb, 0, 'In DeFi, this is often done by bots watching the mempool.'),
    (c_eli, 'What is "Slippage Tolerance"?', '["Maximum price change you are willing to accept", "How much a broker can steal", "A market limit", "A type of fee"]'::jsonb, 0, 'Low tolerance might cause trades to fail during volatility.'),
    (c_eli, 'What is "Cross-Margin" vs "Isolated Margin"?', '["Using entire balance as collateral vs specific amount", "Trading on two exchanges", "Using two wallets", "Buy vs Sell"]'::jsonb, 0, 'Cross-margin shares risk across the whole account.'),
    (c_eli, 'What is "Quantum Resistance" in blockchain?', '["Security against attacks from quantum computers", "High-speed transactions", "A type of encryption", "A future goal"]'::jsonb, 0, 'Future blockchains will need new algorithms to survive quantum computing.');

    -- COMMODITIES ELITE (BATCH 2)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_eli, 'What is "Roll Yield"?', '["Profit or loss from rolling a futures contract", "Yield from farming", "A type of dividend", "Market tax"]'::jsonb, 0, 'Roll yield is positive in Backwardation and negative in Contango.'),
    (m_eli, 'What is "Tolling Agreement"?', '["Contract where one party provides raw material to a refiner", "A road tax", "A type of mining law", "A bank loan"]'::jsonb, 0, 'The refiner is paid a fee (toll) for the processing service.'),
    (m_eli, 'What is "Convenience Yield"?', '["The benefit of holding physical inventory over futures", "Easy trading", "Lower fees", "A type of signal"]'::jsonb, 0, 'Convenience yield is high when inventory is very low.'),
    (m_eli, 'What is "Netback Pricing"?', '["Final price minus transportation and refining costs", "Total revenue", "Profit after tax", "A type of discount"]'::jsonb, 0, 'Netback tells producers their actual profit per unit at the source.'),
    (m_eli, 'What is "Take-or-Pay" Contract?', '["Buyer must pay for a minimum volume even if not taken", "A choice to pay", "A type of delivery", "A market tax"]'::jsonb, 0, 'Common in natural gas and pipeline agreements.'),
    (m_eli, 'What is "LME Ring" trading?', '["The open-outcry trading floor in London", "A type of jewelry", "A crypto project", "A security feature"]'::jsonb, 0, 'The LME is one of the last exchanges to use physical trading pits.'),
    (m_eli, 'What is "Grade Differential"?', '["Price difference based on quality of the commodity", "A type of trend", "Broker fee", "Market tax"]'::jsonb, 0, 'High-grade copper commands a premium over lower grades.'),
    (m_eli, 'What is "Charter Rate" in shipping?', '["The cost of renting a vessel to transport commodities", "A type of tax", "A price of oil", "A market trend"]'::jsonb, 0, 'Charter rates (like Baltic Dry Index) impact commodity prices.'),
    (m_eli, 'What is "Hedging Effectiveness"?', '["The degree to which a hedge reduces risk", "The profit of a hedge", "The cost of a hedge", "A type of signal"]'::jsonb, 0, 'A perfect hedge has 100% effectiveness.'),
    (m_eli, 'What is "Resource Depletion" modeling?', '["Estimating the remaining life of a mine or well", "Predicting crashes", "A type of tax", "A market trend"]'::jsonb, 0, 'Investors use depletion models to value resource companies.');

    -- BATCH 5: REACHING 360 QUESTIONS
    -- FOREX BEGINNER (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_beg, 'What is the "Economic Calendar"?', '["A schedule of upcoming economic news releases", "A diary of your trades", "A list of bank holidays", "A history of price movements"]'::jsonb, 0, 'Traders use calendars to avoid being caught off guard by news.'),
    (f_beg, 'What is the "Quote Currency" in a pair?', '["The second currency in the pair", "The first currency", "The stronger one", "The US Dollar"]'::jsonb, 0, 'In EUR/USD, USD is the quote currency.'),
    (f_beg, 'What is "Scalping"?', '["A style of trading for very small, quick profits", "Holding trades for weeks", "Selling at the very top", "Using no leverage"]'::jsonb, 0, 'Scalpers often trade on M1 or M5 timeframes.'),
    (f_beg, 'What is "Day Trading"?', '["Closing all positions before the market close", "Trading only when it is sunny", "Buying on Monday, selling on Friday", "Holding for months"]'::jsonb, 0, 'Day traders avoid "overnight risk".'),
    (f_beg, 'What is "Swing Trading"?', '["Holding trades for several days to weeks", "Trading quick reversals", "Trading only on weekends", "Using maximum leverage"]'::jsonb, 0, 'Swing traders aim to capture "swings" in price.'),
    (f_beg, 'What is "Position Trading"?', '["Holding trades for months or years", "Trading based on news", "Day trading", "Trading with a small account"]'::jsonb, 0, 'Position traders focus on long-term fundamental trends.'),
    (f_beg, 'What is "Greed" in trading psychology?', '["Over-leveraging or staying in a trade too long for more profit", "Buying at the bottom", "Using a stop loss", "Trading on news"]'::jsonb, 0, 'Greed often leads to giving back profits or blowing accounts.'),
    (f_beg, 'What is "Fear" in trading psychology?', '["Hesitating to enter or exiting too early due to risk", "Being afraid of the broker", "Using small leverage", "Setting a take profit"]'::jsonb, 0, 'Fear can prevent traders from following their plan.'),
    (f_beg, 'What is "Market Sentiment"?', '["The collective mood of traders toward an asset", "The current price", "A news headline", "A technical indicator"]'::jsonb, 0, 'Sentiment is often described as Bullish or Bearish.'),
    (f_beg, 'What does the "H1" timeframe represent?', '["1 hour candles", "1 minute candles", "1 day candles", "1 month candles"]'::jsonb, 0, 'H1 stands for Hourly candles.');

    -- STOCKS BEGINNER (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_beg, 'What is "Market Capitalization"?', '["Total dollar value of all outstanding shares", "The price of one share", "The amount of cash a company has", "The number of employees"]'::jsonb, 0, 'Market Cap = Share Price x Total Shares.'),
    (s_beg, 'What is a "Shareholder Meeting"?', '["Annual gathering of company owners to vote on issues", "A party for employees", "A meeting of the board of directors", "A trading seminar"]'::jsonb, 0, 'Shareholders vote on things like board members and major changes.'),
    (s_beg, 'What is a "Stock Split"?', '["Increasing share count to lower price per share", "Dividing a company in two", "Selling half your stocks", "A type of market crash"]'::jsonb, 0, 'Splits make shares more accessible to retail investors.'),
    (s_beg, 'What is a "Reverse Stock Split"?', '["Reducing share count to increase price per share", "Buying back all shares", "A company merger", "A market rally"]'::jsonb, 0, 'Often used by companies to avoid being delisted for low prices.'),
    (s_beg, 'What is a "Bull Market"?', '["A period of rising stock prices", "A market crash", "Sideways movement", "A market closed for holidays"]'::jsonb, 0, 'Bull markets are characterized by optimism and growth.'),
    (s_beg, 'What is a "Bear Market"?', '["A period of falling stock prices", "A rapid rally", "Stable prices", "A technical breakout"]'::jsonb, 0, 'Bear markets are characterized by pessimism and decline.'),
    (s_beg, 'What is "Pre-Market" trading?', '["Trading that occurs before the regular market open", "Trading for beginners", "Buying stocks before they are listed", "Trading on weekends"]'::jsonb, 0, 'Pre-market trading has lower liquidity and higher volatility.'),
    (s_beg, 'What is "Post-Market" trading?', '["Trading that occurs after the regular market close", "Trading for professional only", "Selling stocks after a crash", "Trading at night"]'::jsonb, 0, 'Also known as "After Hours" trading.'),
    (s_beg, 'What is a "Brokerage Account"?', '["An account that allows you to buy and sell securities", "A bank savings account", "A social media account", "A type of insurance policy"]'::jsonb, 0, 'You need a broker to access the stock exchanges.'),
    (s_beg, 'What is "Margin Interest"?', '["The cost of borrowing money from a broker to trade", "The profit from a trade", "A fee for withdrawing cash", "A dividend payment"]'::jsonb, 0, 'Brokers charge interest on the funds you borrow for leverage.');

    -- CRYPTO BEGINNER (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_beg, 'What is "Decentralization"?', '["Distributing power away from a central authority", "Having many banks", "Storing data in one place", "A type of crypto exchange"]'::jsonb, 0, 'Decentralization is the core philosophy of blockchain.'),
    (c_beg, 'What is "Immutability"?', '["The inability for data to be changed once written", "The speed of transactions", "The price of a coin", "A type of hacking"]'::jsonb, 0, 'Once a transaction is on the blockchain, it cannot be reversed.'),
    (c_beg, 'What is a "Consensus Mechanism"?', '["The process by which nodes agree on the state of the ledger", "A type of crypto wallet", "A trading strategy", "A news group"]'::jsonb, 0, 'PoW and PoS are the most common consensus mechanisms.'),
    (c_beg, 'What is a "Public Address"?', '["A string of characters used to receive crypto", "Your home address", "Your IP address", "Your private password"]'::jsonb, 0, 'You can share your public address safely with others.'),
    (c_beg, 'What is a "Private Key"?', '["A secret code used to authorize transactions", "A login for an exchange", "A public link", "A type of news"]'::jsonb, 0, 'Whoever has the private key owns the crypto.'),
    (c_beg, 'What is "Double Spending"?', '["Spending the same digital currency twice", "Buying two different coins", "Using two wallets", "Paying double fees"]'::jsonb, 0, 'Blockchain prevents double spending without a central authority.'),
    (c_beg, 'What is a "Hardware Wallet"?', '["A physical device for secure crypto storage", "A heavy laptop", "A type of bank safe", "A physical Bitcoin"]'::jsonb, 0, 'Hardware wallets like Ledger keep keys offline.'),
    (c_beg, 'What is "FUD"?', '["Fear, Uncertainty, and Doubt", "Financial United Data", "Fast Upward Direction", "Future Universal Digital"]'::jsonb, 0, 'FUD is often spread to drive prices down.'),
    (c_beg, 'What is a "Satoshi"?', '["The smallest unit of a Bitcoin", "The creator of Ethereum", "A type of crypto wallet", "A news website"]'::jsonb, 0, 'One Bitcoin equals 100 million Satoshis.'),
    (c_beg, 'What is "Staking"?', '["Locking up coins to support a network and earn rewards", "Selling all coins", "Betting on Bitcoin", "Mining with a GPU"]'::jsonb, 0, 'Staking is used in Proof of Stake networks.');

    -- COMMODITIES BEGINNER (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_beg, 'What are "Soft Commodities"?', '["Agricultural products like coffee and sugar", "Metals like gold and silver", "Energy products like oil", "Crypto assets"]'::jsonb, 0, 'Softs are grown, not mined.'),
    (m_beg, 'What is "Hard Commodity"?', '["Natural resources that are mined or extracted", "Difficult products to trade", "Crops that are hard to grow", "Fixed price assets"]'::jsonb, 0, 'Examples include oil, gold, and copper.'),
    (m_beg, 'What is a "Safe Haven"?', '["An asset expected to retain value during turmoil", "A secure bank", "A type of insurance", "A risk-free trade"]'::jsonb, 0, 'Gold is the ultimate safe haven asset.'),
    (m_beg, 'What influences "Oil" prices the most?', '["Geopolitical events and OPEC decisions", "Weather in London", "Stock market tech trends", "Interest rates in Japan"]'::jsonb, 0, 'Oil is the most politically sensitive commodity.'),
    (m_beg, 'What is "Shale Oil"?', '["Oil found in shale rock formations", "A type of synthetic oil", "Old oil from the ocean", "Oil used for paint"]'::jsonb, 0, 'The US is a leader in shale oil production.'),
    (m_beg, 'What are "Livestock" commodities?', '["Animals like cattle and hogs", "Grains like wheat", "Metals like silver", "Energy products"]'::jsonb, 0, 'Livestock trading is a major part of the commodities market.'),
    (m_beg, 'What is a "Commodity ETF"?', '["A fund that tracks the price of a commodity or index", "A physical gold bar", "A type of crypto", "A bank loan"]'::jsonb, 0, 'GLD and SLV are popular examples.'),
    (m_beg, 'What is "Supply Chain" in commodities?', '["The process of moving goods from producer to consumer", "A chain used in mining", "A list of suppliers", "A trading network"]'::jsonb, 0, 'Disruptions in the supply chain cause price spikes.'),
    (m_beg, 'What is "Demand Destruction"?', '["When high prices cause consumers to buy less", "A market crash", "A physical disaster", "A type of tax"]'::jsonb, 0, 'If oil is too expensive, people drive less, reducing demand.'),
    (m_beg, 'Which exchange is the largest for "Agriculture" futures?', '["CBOT (Chicago Board of Trade)", "NYSE", "LSE", "JPX"]'::jsonb, 0, 'CBOT is the global hub for grain trading.');

    -- FOREX INTERMEDIATE (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_int, 'What is "Standard Deviation" in trading?', '["A measure of how much price varies from the average", "A type of moving average", "A profit target", "A trend line"]'::jsonb, 0, 'Standard deviation is the core of Bollinger Bands.'),
    (f_int, 'What is a "Stop-Limit Order"?', '["An order that triggers a limit order when a price is hit", "A guaranteed stop loss", "A type of news trade", "Same as a market order"]'::jsonb, 0, 'It gives you more control over the entry price after a trigger.'),
    (f_int, 'What is "Risk/Reward Ratio"?', '["Potential profit compared to potential loss", "Winning percentage", "Total account risk", "Broker commission"]'::jsonb, 0, 'A 1:2 ratio means you risk $1 to make $2.'),
    (f_int, 'What is "Position Sizing"?', '["Calculating the number of units to trade based on risk", "Choosing which pair to trade", "Setting a take profit", "Checking the timeframe"]'::jsonb, 0, 'Correct sizing is the most important part of risk management.'),
    (f_int, 'What is "Volatility"?', '["The degree of variation in price over time", "The speed of the trend", "The total daily volume", "The price of the spread"]'::jsonb, 0, 'High volatility means larger price swings.'),
    (f_int, 'What is "Liquidity"?', '["The ability to enter/exit trades with minimal price impact", "The amount of cash in your account", "The speed of your internet", "The number of pairs available"]'::jsonb, 0, 'Major pairs like EUR/USD have the highest liquidity.'),
    (f_int, 'What is a "Trailing Stop Loss"?', '["A stop that moves automatically as price goes in your favor", "A fixed stop loss", "A stop that never moves", "A type of take profit"]'::jsonb, 0, 'It helps lock in profits while giving the trade room to breathe.'),
    (f_int, 'What is "Correlation"?', '["How two currency pairs move in relation to each other", "The link between a broker and trader", "The accuracy of a signal", "The daily profit"]'::jsonb, 0, 'Positive correlation means they move together; negative means opposite.'),
    (f_int, 'What is "MT4/MT5"?', '["The most popular trading platforms for Forex", "Types of currency pairs", "Technical indicators", "News websites"]'::jsonb, 0, 'MetaTrader is the industry standard for retail traders.'),
    (f_int, 'What is "Margin Call"?', '["When your account equity falls below the required margin", "A call from your broker for advice", "Reaching your profit target", "The market closing"]'::jsonb, 0, 'A margin call often leads to forced liquidation of positions.');

    -- STOCKS INTERMEDIATE (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_int, 'What is "Earnings Per Share" (EPS)?', '["Net income divided by number of outstanding shares", "Dividend amount", "Total company profit", "Stock price"]'::jsonb, 0, 'EPS is a key indicator of a company profitability.'),
    (s_int, 'What is "Book Value"?', '["Total assets minus total liabilities", "The price of the stock", "The market cap", "The value of the brand"]'::jsonb, 0, 'Book value is the "theoretical" liquidation value of a company.'),
    (s_int, 'What is "P/B Ratio"?', '["Price-to-Book Ratio", "Price-to-Balance", "Profit-to-Book", "Percentage-of-Book"]'::jsonb, 0, 'P/B compares market value to book value.'),
    (s_int, 'What is "Debt-to-Equity" Ratio?', '["Measure of financial leverage (Total Liabilities / Equity)", "Total debt", "Profit margin", "Dividend yield"]'::jsonb, 0, 'High D/E can indicate a risky financial structure.'),
    (s_int, 'What is "Operating Margin"?', '["Operating income divided by revenue", "Total profit", "Cost of sales", "Tax rate"]'::jsonb, 0, 'It shows how much profit a company makes on each dollar of sales.'),
    (s_int, 'What is "Moving Average Convergence Divergence" (MACD)?', '["A trend-following momentum indicator", "A price level", "A volume tool", "A news filter"]'::jsonb, 0, 'MACD shows the relationship between two moving averages of price.'),
    (s_int, 'What is "RSI" Overbought level?', '["Typically above 70", "Above 100", "Above 50", "Above 20"]'::jsonb, 0, 'High RSI suggests the asset may be due for a correction.'),
    (s_int, 'What is "RSI" Oversold level?', '["Typically below 30", "Below 0", "Below 50", "Below 70"]'::jsonb, 0, 'Low RSI suggests the asset may be due for a bounce.'),
    (s_int, 'What is "Support and Resistance"?', '["Price levels where trends tend to pause or reverse", "Broker fees", "Technical indicators", "News events"]'::jsonb, 0, 'Support is the floor; Resistance is the ceiling.'),
    (s_int, 'What is a "Gap" in stock charts?', '["An area where no trading occurred between periods", "A price drop", "A trading error", "A type of order"]'::jsonb, 0, 'Gaps often occur after earnings or major news overnight.');

    -- CRYPTO INTERMEDIATE (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_int, 'What is a "Smart Contract" Audit?', '["A security review of the code by experts", "Checking the price", "Using the contract", "A legal battle"]'::jsonb, 0, 'Audits are critical to prevent hacks and exploits.'),
    (c_int, 'What is "Slippage"?', '["The difference between expected and actual trade price", "A slow network", "A broker fee", "A price crash"]'::jsonb, 0, 'Slippage is common in low liquidity pools or high volatility.'),
    (c_int, 'What is "Liquidity Provider" (LP) Token?', '["A token representing your share in a liquidity pool", "A reward coin", "A governance token", "A stablecoin"]'::jsonb, 0, 'LPs receive these tokens when they deposit assets into a DEX.'),
    (c_int, 'What is "Auto-Market Maker" (AMM)?', '["A protocol that uses math to price assets", "A manual trader", "A type of exchange bot", "A security feature"]'::jsonb, 0, 'Uniswap is the most famous example of an AMM.'),
    (c_int, 'What is "Oracle" in blockchain?', '["A service that provides real-world data to smart contracts", "A crypto wallet", "A type of coin", "A news website"]'::jsonb, 0, 'Chainlink is the leading decentralized oracle network.'),
    (c_int, 'What is "Burn Rate"?', '["The speed at which tokens are removed from circulation", "Electricity cost", "Trading fee", "Price drop speed"]'::jsonb, 0, 'Burning can make a token deflationary over time.'),
    (c_int, 'What is "MEV" (Maximal Extractable Value)?', '["Profit from reordering or inserting transactions", "Market cap", "Max withdrawal", "Mining reward"]'::jsonb, 0, 'MEV is often extracted by searchers and validators.'),
    (c_int, 'What is "Wrapped Bitcoin" (WBTC)?', '["An ERC-20 token pegged to the price of Bitcoin", "Bitcoin in a safe", "A fake Bitcoin", "A type of mining"]'::jsonb, 0, 'WBTC allows you to use Bitcoin value on the Ethereum network.'),
    (c_int, 'What is "Proof of Attendance" (POAP)?', '["A badge showing you participated in an event", "A work requirement", "A type of consensus", "A mining reward"]'::jsonb, 0, 'POAPs are unique NFTs given to attendees.'),
    (c_int, 'What is "Decentralized Identifier" (DID)?', '["A way to manage identity without a central authority", "A user ID on an exchange", "A social media handle", "A wallet address"]'::jsonb, 0, 'DIDs are part of the Web3 identity movement.');

    -- COMMODITIES INTERMEDIATE (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_int, 'What is "Base Load" vs "Peak Load"?', '["Minimum constant demand vs period of highest demand", "Low price vs high price", "Oil vs Gas", "Buy vs Sell"]'::jsonb, 0, 'Energy producers must manage both to keep the grid stable.'),
    (m_int, 'What is "Crack Spread"?', '["Price difference between crude oil and refined products", "A technical pattern", "Cost of mining", "A type of news"]'::jsonb, 0, 'Refiners watch the crack spread for profitability.'),
    (m_int, 'What is "Backwardation"?', '["When the spot price is higher than the futures price", "A market rally", "A price drop", "A type of news"]'::jsonb, 0, 'Backwardation suggests high immediate demand or shortage.'),
    (m_int, 'What is "Contango"?', '["When the futures price is higher than the spot price", "A market rally", "A price drop", "A type of news"]'::jsonb, 0, 'Contango is the normal state for many commodities (storage costs).'),
    (m_int, 'What is "Hedging"?', '["Using futures to lock in a price and reduce risk", "Buying much gold", "News trading", "Using high leverage"]'::jsonb, 0, 'Producers and consumers use hedging to manage price risk.'),
    (m_int, 'What is "Basis"?', '["The difference between local cash price and futures price", "The core of a trade", "A type of tax", "Broker fee"]'::jsonb, 0, 'Basis accounts for local supply/demand and transport costs.'),
    (m_int, 'What is "COT Report" (Commitments of Traders)?', '["A weekly report showing positions of market participants", "A news headline", "A technical indicator", "A broker report"]'::jsonb, 0, 'Traders use COT to see what "Smart Money" is doing.'),
    (m_int, 'What is "WTI" (West Texas Intermediate)?', '["A major benchmark for US oil prices", "A type of gas", "A mining company", "A news agency"]'::jsonb, 0, 'WTI is traded primarily on the NYMEX.'),
    (m_int, 'What is "Brent Crude"?', '["The global benchmark for oil prices (North Sea)", "A type of machine oil", "Oil from Texas", "A brand of gasoline"]'::jsonb, 0, 'Brent prices about two-thirds of the world internationally traded oil.'),
    (m_int, 'What is "Troy Ounce"?', '["The standard unit of measure for precious metals", "A type of gold bar", "A historical coin", "A unit for oil"]'::jsonb, 0, 'One troy ounce is approx 31.1 grams.');

    -- FOREX ELITE (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_eli, 'What is "Gamma Scalping"?', '["Adjusting positions to remain delta neutral as price moves", "Scalping on M1", "Buying expensive options", "A type of signal"]'::jsonb, 0, 'Gamma scalping is used by option market makers.'),
    (f_eli, 'What is "Negative Convexity"?', '["When price rise is smaller than price fall for same yield change", "A bad trend", "A market crash", "A type of indicator"]'::jsonb, 0, 'Common in mortgage-backed securities.'),
    (f_eli, 'What is "VIX" (Volatility Index)?', '["A measure of market expected volatility (Fear Gauge)", "A price index", "A trend tool", "A crypto coin"]'::jsonb, 0, 'VIX reflects expectations for the next 30 days.'),
    (f_eli, 'What is "Yield Curve Inversion"?', '["When short-term rates are higher than long-term rates", "When rates go down", "When the market crashes", "A type of tax"]'::jsonb, 0, 'An inverted yield curve is often a precursor to a recession.'),
    (f_eli, 'What is "Quantitative Tightening" (QT)?', '["A central bank reducing its balance sheet", "Increasing money supply", "Lowering interest rates", "Buying bonds"]'::jsonb, 0, 'QT is the opposite of QE and reduces liquidity.'),
    (f_eli, 'What is "LIBOR" Replacement?', '["SOFR (Secured Overnight Financing Rate)", "Bitcoin", "USD", "EUR"]'::jsonb, 0, 'SOFR replaced LIBOR after scandals and lack of transactions.'),
    (f_eli, 'What is "Carry Trade" Unwinding?', '["Rapidly closing high-yield positions during volatility", "Opening a new trade", "Buying more", "Selling at profit"]'::jsonb, 0, 'Unwinding can cause sharp moves in pairs like USD/JPY.'),
    (f_eli, 'What is "Forward Points"?', '["Difference between spot and forward price", "Technical signals", "Profit targets", "Broker fees"]'::jsonb, 0, 'Points represent the interest rate differential between two currencies.'),
    (f_eli, 'What is "Triangular Arbitrage"?', '["Exploiting price differences between three currencies", "Trading triangles", "A chart pattern", "A type of bot"]'::jsonb, 0, 'It involves a sequence of three trades to capture risk-free profit.'),
    (f_eli, 'What is "Monte Carlo Simulation"?', '["Testing a strategy against thousands of random scenarios", "A trading game", "A type of news", "A broker fee"]'::jsonb, 0, 'Monte Carlo helps understand the range of possible outcomes.');

    -- STOCKS ELITE (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_eli, 'What is "EV/EBITDA" Multiple?', '["Enterprise Value divided by EBITDA", "Price divided by earnings", "Revenue divided by debt", "Total profit"]'::jsonb, 0, 'It is a common valuation metric used for acquisitions.'),
    (s_eli, 'What is "Capital Asset Pricing Model" (CAPM)?', '["Formula for expected return based on risk (Beta)", "A list of stocks", "A type of bot", "A news group"]'::jsonb, 0, 'Expected Return = Risk-Free Rate + Beta * Market Premium.'),
    (s_eli, 'What is "Gordon Growth Model"?', '["Method to value a stock based on constant dividend growth", "A trend tool", "A price level", "A news filter"]'::jsonb, 0, 'Value = Dividend / (Cost of Equity - Growth Rate).'),
    (s_eli, 'What is "Sharpe Ratio"?', '["Measure of risk-adjusted return", "Total profit", "Winning percentage", "Winning streak"]'::jsonb, 0, 'Higher Sharpe ratio indicates better performance for the risk taken.'),
    (s_eli, 'What is "Sortino Ratio"?', '["Sharpe ratio variation focusing only on downside risk", "A type of trend", "A price level", "A news group"]'::jsonb, 0, 'It is often considered better than Sharpe for many investors.'),
    (s_eli, 'What is "Information Ratio"?', '["Measure of active return vs tracking error", "News speed", "Number of data points", "A type of signal"]'::jsonb, 0, 'It measures a manager ability to generate excess returns.'),
    (s_eli, 'What is "Treynor Ratio"?', '["Risk-adjusted return focusing on systematic risk (Beta)", "Profit per share", "Total market value", "A type of bot"]'::jsonb, 0, 'It is similar to Sharpe but uses Beta instead of Standard Deviation.'),
    (s_eli, 'What is "Alpha" in investing?', '["The excess return of an investment relative to a benchmark", "The first trade", "The risk-free rate", "Total volume"]'::jsonb, 0, 'Alpha measures the value added by a manager.'),
    (s_eli, 'What is "Beta" in investing?', '["Measure of an asset sensitivity to market movements", "The second version", "A type of dividend", "Total profit"]'::jsonb, 0, 'Beta of 1.0 means the asset moves with the market.'),
    (s_eli, 'What is "Tracking Error"?', '["The divergence between an investment and its benchmark", "A mistake in a trade", "A news error", "A type of fee"]'::jsonb, 0, 'Passive funds aim for minimal tracking error.');

    -- CRYPTO ELITE (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_eli, 'What is "Zero-Knowledge Rollup" (ZK-Rollup)?', '["Layer 2 scaling using validity proofs", "A secret crypto", "A fast mining tool", "A type of airdrop"]'::jsonb, 0, 'ZK-rollups offer high security and fast finality.'),
    (c_eli, 'What is "Optimistic Rollup"?', '["Layer 2 scaling assuming transactions are valid", "A positive trend", "A type of wallet", "A news group"]'::jsonb, 0, 'Optimistic rollups rely on fraud proofs and have longer withdrawal times.'),
    (c_eli, 'What is "Proto-Danksharding" (EIP-4844)?', '["Ethereum upgrade introducing data blobs to reduce L2 fees", "A new coin", "A type of wallet", "A security standard"]'::jsonb, 0, 'It is a key step toward full sharding for Ethereum.'),
    (c_eli, 'What is "Validator" in PoS?', '["A node that verifies transactions and proposes blocks", "A crypto miner", "A legal expert", "An exchange employee"]'::jsonb, 0, 'Validators stake coins to participate in the network.'),
    (c_eli, 'What is "Slashing"?', '["The removal of staked funds from a malicious validator", "A price drop", "A fee discount", "A type of news"]'::jsonb, 0, 'Slashing ensures validators act honestly.'),
    (c_eli, 'What is "Liveness" in blockchain?', '["The property that a system continues to make progress", "The price of a coin", "The speed of the network", "A type of signal"]'::jsonb, 0, 'Liveness ensures that the blockchain does not halt.'),
    (c_eli, 'What is "Safety" (Finality) in blockchain?', '["The property that committed transactions cannot be changed", "A security key", "A type of wallet", "A news group"]'::jsonb, 0, 'Safety ensures that everyone agrees on the same history.'),
    (c_eli, 'What is "Flash Loan Attack"?', '["Using flash loans to manipulate DeFi protocols", "A fast hack", "A type of mining", "A news error"]'::jsonb, 0, 'Attackers use high capital to exploit oracle or logic errors.'),
    (c_eli, 'What is "Sandwich Attack"?', '["Placing orders before and after a user trade to profit", "A food-themed hack", "A type of double spending", "A news group"]'::jsonb, 0, 'It is a common form of MEV extraction.'),
    (c_eli, 'What is "Sybil Resistance"?', '["Protection against one entity creating many identities", "A type of encryption", "A fast network", "A news group"]'::jsonb, 0, 'PoW and PoS are primary methods of Sybil resistance.');

    -- COMMODITIES ELITE (BATCH 3)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_eli, 'What is "Basis Risk"?', '["Risk that spot and futures prices do not converge", "Bankruptcy risk", "A type of news", "Broker fee"]'::jsonb, 0, 'Basis risk can make hedging imperfect.'),
    (m_eli, 'What is "Convenience Yield"?', '["Benefit of holding physical inventory over futures", "Easy trading", "Lower fees", "A type of signal"]'::jsonb, 0, 'Convenience yield rises when physical supply is tight.'),
    (m_eli, 'What is "Roll Yield"?', '["Profit/loss from rolling a futures contract to next month", "Yield from farming", "A dividend", "A tax"]'::jsonb, 0, 'Positive roll yield is common in backwardation.'),
    (m_eli, 'What is "Crack Spread"?', '["Difference between crude oil and refined products", "A price level", "A news headline", "A technical pattern"]'::jsonb, 0, 'It represents the refinery gross margin.'),
    (m_eli, 'What is "LME" (London Metal Exchange)?', '["The world hub for industrial metal trading", "A museum", "A bank", "A news agency"]'::jsonb, 0, 'The LME uses "The Ring" for physical open-outcry trading.'),
    (m_eli, 'What is "Physical Delivery"?', '["Actual transfer of a commodity at contract maturity", "A digital file", "A news group", "A fast execution"]'::jsonb, 0, 'Most financial traders close positions before maturity to avoid delivery.'),
    (m_eli, 'What is "Take-or-Pay"?', '["Contract requiring payment for a minimum volume", "A choice to pay", "A type of delivery", "A market tax"]'::jsonb, 0, 'Common in natural gas and pipeline contracts.'),
    (m_eli, 'What is "Strategic Petroleum Reserve" (SPR)?', '["Oil stockpiles held by governments for emergencies", "A private company", "A type of gas", "A news agency"]'::jsonb, 0, 'Governments release SPR oil to stabilize prices during supply shocks.'),
    (m_eli, 'What is "Resource Nationalism"?', '["Government control over natural resources", "A type of patriotism", "Buying local only", "A new law"]'::jsonb, 0, 'It can lead to supply disruptions and higher global prices.'),
    (m_eli, 'What is "Tolling Agreement"?', '["Refiner processes raw material for a fee without ownership", "A road tax", "A bank loan", "A news group"]'::jsonb, 0, 'The refiner is paid for the service, but the customer keeps the products.');

    -- BATCH 6: FINAL MASSIVE PUSH (REACHING 540 QUESTIONS)
    -- FOREX BEGINNER (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_beg, 'What is the "Loonie"?', '["Nickname for the Canadian Dollar", "A type of bird", "A bad trade", "A news event"]'::jsonb, 0, 'The Canadian $1 coin features a loon bird.'),
    (f_beg, 'What is the "Kiwi"?', '["Nickname for the New Zealand Dollar", "A fruit", "A type of indicator", "A small trade"]'::jsonb, 0, 'New Zealand national bird is the kiwi.'),
    (f_beg, 'What is the "Aussie"?', '["Nickname for the Australian Dollar", "A person from Australia", "A trading strategy", "A type of chart"]'::jsonb, 0, 'AUD is frequently called the Aussie.'),
    (f_beg, 'What is "Swap" or "Rollover"?', '["Interest paid/earned for holding a trade overnight", "Changing pairs", "Closing a trade", "Using leverage"]'::jsonb, 0, 'Swap is based on the interest rate differential between the two currencies.'),
    (f_beg, 'What is a "Direct Quote"?', '["Domestic currency price of one unit of foreign currency", "A price from a broker", "A market order", "A fast trade"]'::jsonb, 0, 'For example, in the US, EUR/USD is a direct quote.'),
    (f_beg, 'What is an "Indirect Quote"?', '["Foreign currency price of one unit of domestic currency", "A news headline", "A pending order", "A slow trade"]'::jsonb, 0, 'For example, in the US, USD/JPY is an indirect quote.'),
    (f_beg, 'What is a "Pipette"?', '["A fractional pip (1/10th of a pip)", "A small pipe", "A type of coin", "A trading bot"]'::jsonb, 0, 'Many brokers use 5 decimal places for more precision.'),
    (f_beg, 'What is a "Buy Limit" order?', '["Order to buy at a price below the current market", "Buying immediately", "Buying at the top", "Selling for a loss"]'::jsonb, 0, 'Use a buy limit if you expect price to bounce off a support level.'),
    (f_beg, 'What is a "Sell Limit" order?', '["Order to sell at a price above the current market", "Selling immediately", "Selling at the bottom", "Buying at the top"]'::jsonb, 0, 'Use a sell limit if you expect price to hit a resistance and fall.'),
    (f_beg, 'What is a "Buy Stop" order?', '["Order to buy at a price above the current market", "Stopping a buy trade", "A type of loss", "A news filter"]'::jsonb, 0, 'Buy stops are often used for breakout strategies.'),
    (f_beg, 'What is a "Sell Stop" order?', '["Order to sell at a price below the current market", "Stopping a sell trade", "A profit target", "A chart tool"]'::jsonb, 0, 'Sell stops are often used for breakdown strategies.'),
    (f_beg, 'What is "MT5"?', '["MetaTrader 5, the successor to MT4", "A type of mountain", "A news agency", "A crypto coin"]'::jsonb, 0, 'MT5 offers more timeframes and technical indicators than MT4.'),
    (f_beg, 'What is "Social Trading"?', '["Copying the trades of experienced investors", "Trading on Facebook", "Meeting other traders", "A type of news"]'::jsonb, 0, 'Platforms like eToro popularized social trading.'),
    (f_beg, 'What is a "Demo Account"?', '["A practice account using virtual money", "A small account", "An account for demos", "A hacker account"]'::jsonb, 0, 'Every beginner should start on a demo account.'),
    (f_beg, 'What is "Over-Trading"?', '["Trading too frequently or with too much risk", "Trading after hours", "Trading on holidays", "Winning too much"]'::jsonb, 0, 'Over-trading is a common path to account destruction.');

    -- STOCKS BEGINNER (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_beg, 'What is "Earnings Season"?', '["The period when most companies report quarterly results", "When stocks go up", "Christmas time", "End of the year"]'::jsonb, 0, 'It happens four times a year.'),
    (s_beg, 'What is a "Blue Chip" stock?', '["Stock in a large, well-established, financially sound company", "A cheap stock", "A crypto coin", "A casino stock"]'::jsonb, 0, 'Examples include Apple, Microsoft, and Coca-Cola.'),
    (s_beg, 'What is a "Penny Stock"?', '["High-risk stock trading at a very low price (under $5)", "A stock worth one penny", "A stock from the UK", "A small company"]'::jsonb, 0, 'Penny stocks are highly volatile and often manipulated.'),
    (s_beg, 'What is an "Exchange"?', '["A marketplace where stocks are bought and sold", "A type of wallet", "A bank", "A news agency"]'::jsonb, 0, 'Examples include the NYSE and NASDAQ.'),
    (s_beg, 'What is "Volatility"?', '["The rate at which the price of a stock increases or decreases", "The speed of the trend", "Total volume", "Market cap"]'::jsonb, 0, 'High volatility means higher risk and potential reward.'),
    (s_beg, 'What is a "Ticker Symbol"?', '["A unique series of letters representing a stock", "A trading sound", "A type of indicator", "A company logo"]'::jsonb, 0, 'For example, AAPL for Apple or TSLA for Tesla.'),
    (s_beg, 'What is "Liquidity" in stocks?', '["How easily a stock can be bought or sold without price impact", "The amount of cash in a company", "The speed of the website", "The number of shares"]'::jsonb, 0, 'Highly liquid stocks have high trading volume.'),
    (s_beg, 'What is "Diversification"?', '["Spreading investments across different assets to reduce risk", "Buying only one stock", "Selling all stocks", "Trading with leverage"]'::jsonb, 0, 'Do not put all your eggs in one basket.'),
    (s_beg, 'What is a "Market Index"?', '["A group of stocks used to track market performance", "A trading manual", "A list of brokers", "A type of news"]'::jsonb, 0, 'Examples include the S&P 500 and the Dow Jones.'),
    (s_beg, 'What is "Portfolio"?', '["A collection of all your investments", "A type of bag", "A trading strategy", "A news group"]'::jsonb, 0, 'Your portfolio might include stocks, bonds, and crypto.'),
    (s_beg, 'What is "Bid-Ask Spread"?', '["The difference between the buy and sell price", "The total profit", "A broker fee", "A price gap"]'::jsonb, 0, 'The spread is a cost of trading.'),
    (s_beg, 'What is "Market Cap"?', '["The total market value of a company", "The price of one share", "The number of shares", "The company debt"]'::jsonb, 0, 'Market Cap = Shares Outstanding x Current Price.'),
    (s_beg, 'What is a "Bull"?', '["A trader who expects prices to rise", "A type of animal", "A bad trader", "A news agency"]'::jsonb, 0, 'Bulls push prices up with their horns.'),
    (s_beg, 'What is a "Bear"?', '["A trader who expects prices to fall", "A type of animal", "A rich trader", "A news agency"]'::jsonb, 0, 'Bears push prices down with their paws.'),
    (s_beg, 'What is "ROI"?', '["Return on Investment", "Rate of Interest", "Risk Of Inflation", "Revenue On Income"]'::jsonb, 0, 'ROI measures the efficiency of an investment.');

    -- CRYPTO BEGINNER (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_beg, 'What is a "Block" in a blockchain?', '["A collection of transaction data", "A piece of hardware", "A type of wallet", "A news group"]'::jsonb, 0, 'Blocks are linked together to form the chain.'),
    (c_beg, 'What is "Mining Reward"?', '["New coins given to miners for securing the network", "A medal", "A discount on fees", "A free wallet"]'::jsonb, 0, 'This incentivizes miners to use their resources.'),
    (c_beg, 'What is "Staking"?', '["Locking up assets to participate in network consensus", "Selling all assets", "Betting on a coin", "Mining with a GPU"]'::jsonb, 0, 'Staking is used in Proof of Stake (PoS) systems.'),
    (c_beg, 'What is a "Hot Wallet"?', '["A wallet connected to the internet", "A physical wallet", "A high-security wallet", "A broken wallet"]'::jsonb, 0, 'Hot wallets are convenient but less secure than cold storage.'),
    (c_beg, 'What is "CEX" (Centralized Exchange)?', '["An exchange managed by a company (e.g. Binance)", "A decentralized exchange", "A news group", "A type of wallet"]'::jsonb, 0, 'CEXs are easy to use but require trust in the company.'),
    (c_beg, 'What is "DEX" (Decentralized Exchange)?', '["An exchange that runs on smart contracts (e.g. Uniswap)", "A central bank", "A hardware wallet", "A news website"]'::jsonb, 0, 'DEXs allow trading directly from your own wallet.'),
    (c_beg, 'What is a "Stablecoin"?', '["A crypto pegged to a stable asset like USD", "A coin that never moves", "A gold-backed coin only", "A type of news"]'::jsonb, 0, 'Examples include USDT, USDC, and DAI.'),
    (c_beg, 'What is "Gas Fee"?', '["A fee paid to the network for processing transactions", "Mining fuel", "A trading commission", "A wallet fee"]'::jsonb, 0, 'Gas fees prevent network spam and reward validators.'),
    (c_beg, 'What is "Bitcoin Halving"?', '["When the block reward is reduced by 50%", "When price drops 50%", "When users are cut in half", "A type of news"]'::jsonb, 0, 'Halving reduces the rate of new Bitcoin supply.'),
    (c_beg, 'What is the "Whitepaper"?', '["A document explaining a project goals and technology", "A blank paper", "A legal contract", "A list of owners"]'::jsonb, 0, 'The Bitcoin whitepaper was released in 2008.'),
    (c_beg, 'What is "Satoshi Nakamoto"?', '["The pseudonymous creator of Bitcoin", "A type of coin", "A Japanese exchange", "A crypto wallet"]'::jsonb, 0, 'The identity of Satoshi remains unknown.'),
    (c_beg, 'What is "Ethereum"?', '["A blockchain for decentralized applications and smart contracts", "A type of Bitcoin", "A news agency", "A hardware wallet"]'::jsonb, 0, 'Ethereum is the second largest cryptocurrency by market cap.'),
    (c_beg, 'What is "Decentralization"?', '["Distributing power away from a central authority", "Storing data in one bank", "A type of exchange", "A news group"]'::jsonb, 0, 'Decentralization increases security and censorship resistance.'),
    (c_beg, 'What is "Immutability"?', '["The inability to change data once written to the blockchain", "Transaction speed", "Coin price", "A type of hack"]'::jsonb, 0, 'Immutability is a key feature of trustless systems.'),
    (c_beg, 'What is a "Private Key"?', '["A secret code used to access and manage your crypto", "Your login name", "Your public address", "A news group"]'::jsonb, 0, 'Never share your private key or seed phrase.');

    -- COMMODITIES BEGINNER (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_beg, 'What is "Gold" known as?', '["A safe haven asset", "A risky bet", "A fast mover", "A tech asset"]'::jsonb, 0, 'Gold preserves wealth during economic crises.'),
    (m_beg, 'What is "OPEC"?', '["Organization of the Petroleum Exporting Countries", "A news agency", "A trading platform", "A type of oil"]'::jsonb, 0, 'OPEC coordinates oil production policies.'),
    (m_beg, 'What is "Crude Oil"?', '["Unrefined petroleum", "Machine oil", "Cooking oil", "A type of gas"]'::jsonb, 0, 'Crude oil is the raw material for many products.'),
    (m_beg, 'What is "Natural Gas"?', '["A hydrocarbon gas used for fuel and energy", "A type of air", "A cooking oil", "A news agency"]'::jsonb, 0, 'Natural gas is cleaner than coal or oil.'),
    (m_beg, 'What is "Silver" used for besides investment?', '["Industrial and solar applications", "Making paper", "Building houses", "Fuel"]'::jsonb, 0, 'Silver is a key industrial metal.'),
    (m_beg, 'What is "Copper" often called?', '["Doctor Copper", "The Red Metal", "Old Metal", "Rich Metal"]'::jsonb, 0, 'Copper price reflects global economic activity.'),
    (m_beg, 'What is "Wheat"?', '["An agricultural (Soft) commodity", "A metal", "An energy product", "A crypto coin"]'::jsonb, 0, 'Wheat is a staple food commodity.'),
    (m_beg, 'What is "Coffee"?', '["One of the most traded soft commodities", "A metal", "A news agency", "A type of gas"]'::jsonb, 0, 'Coffee is traded primarily on the ICE exchange.'),
    (m_beg, 'What is "Inflation Hedge"?', '["An asset that protects against falling currency value", "A way to lose money", "A type of tax", "A news filter"]'::jsonb, 0, 'Commodities are traditional inflation hedges.'),
    (m_beg, 'What is "Supply and Demand"?', '["The primary drivers of commodity prices", "A trading strategy", "A type of order", "A news group"]'::jsonb, 0, 'Low supply and high demand lead to higher prices.'),
    (m_beg, 'What is a "Futures Contract"?', '["Agreement to buy/sell at a set price in the future", "A prediction", "A type of insurance", "A news headline"]'::jsonb, 0, 'Futures are the main way commodities are traded.'),
    (m_beg, 'What is "Spot Price"?', '["The current market price for immediate delivery", "The price next year", "A broker fee", "A news error"]'::jsonb, 0, 'Spot prices reflect the current physical market.'),
    (m_beg, 'What is "Brent Crude"?', '["The international benchmark for oil (North Sea)", "US oil benchmark", "A type of gas", "A news agency"]'::jsonb, 0, 'Brent is used to price global oil exports.'),
    (m_beg, 'What is "WTI Crude"?', '["The US benchmark for oil (Texas)", "Global benchmark", "A machine oil", "A news agency"]'::jsonb, 0, 'WTI stands for West Texas Intermediate.'),
    (m_beg, 'What is "Base Metal"?', '["Industrial metals like zinc and aluminum", "Precious metals", "Old metals", "No value metals"]'::jsonb, 0, 'Base metals are used in manufacturing and construction.');

    -- FOREX INTERMEDIATE (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_int, 'What is "Average True Range" (ATR)?', '["A measure of market volatility over time", "A trend indicator", "A profit target", "A volume tool"]'::jsonb, 0, 'ATR helps in setting stop loss levels based on current volatility.'),
    (f_int, 'What is a "Divergence" in RSI?', '["When price makes a new high but RSI does not", "When price and RSI move together", "A news event", "A market crash"]'::jsonb, 0, 'Divergence often signals a potential price reversal.'),
    (f_int, 'What is "Multiple Time Frame" (MTF) analysis?', '["Checking several timeframes to confirm a trade", "Trading 10 pairs", "Using 5 indicators", "Checking news"]'::jsonb, 0, 'MTF analysis helps align short-term entries with long-term trends.'),
    (f_int, 'What is a "Fibonacci Retracement"?', '["A tool to identify potential support and resistance levels", "A type of chart", "A profit target only", "A news group"]'::jsonb, 0, 'It is based on key mathematical ratios (e.g. 61.8%).'),
    (f_int, 'What is "Price Action" trading?', '["Trading based on raw price movement without indicators", "Using 10 indicators", "Following news", "Bot trading"]'::jsonb, 0, 'Price action focuses on candlesticks, support, and resistance.'),
    (f_int, 'What is "Standard Lot"?', '["100,000 units of the base currency", "10,000 units", "1,000 units", "100 units"]'::jsonb, 0, 'A standard lot is the default institutional trade size.'),
    (f_int, 'What is a "Mini Lot"?', '["10,000 units of the base currency", "100,000 units", "1,000 units", "100 units"]'::jsonb, 0, 'A mini lot is 0.1 of a standard lot.'),
    (f_int, 'What is a "Micro Lot"?', '["1,000 units of the base currency", "10,000 units", "100,000 units", "100 units"]'::jsonb, 0, 'A micro lot is 0.01 of a standard lot.'),
    (f_int, 'What is "Pip Value"?', '["The dollar value of one pip move", "The price of a pip", "A broker fee", "A news group"]'::jsonb, 0, 'Pip value depends on the position size and currency pair.'),
    (f_int, 'What is "Spread"?', '["The difference between bid and ask price", "Total profit", "A broker commission", "A price gap"]'::jsonb, 0, 'Spread is a primary cost for retail Forex traders.'),
    (f_int, 'What is "Leverage"?', '["Using borrowed funds to increase position size", "Reducing risk", "A type of news", "A trading bot"]'::jsonb, 0, 'Leverage can magnify both profits and losses.'),
    (f_int, 'What is "Margin"?', '["The amount of money required to open a leveraged position", "Total profit", "A broker fee", "A news agency"]'::jsonb, 0, 'Think of margin as a security deposit.'),
    (f_int, 'What is "Free Margin"?', '["The equity in your account not tied up in margin", "Free money", "A bonus", "A news group"]'::jsonb, 0, 'Free margin is used to open new positions or withstand losses.'),
    (f_int, 'What is "Margin Level"?', '["Ratio of equity to used margin expressed as percentage", "The price of margin", "A type of order", "A news group"]'::jsonb, 0, 'If your margin level drops too low, you may get a margin call.'),
    (f_int, 'What is a "Slippage"?', '["Difference between requested and actual execution price", "A market crash", "A broker fee", "A trading error"]'::jsonb, 0, 'Slippage is common during high volatility news events.');

    -- STOCKS INTERMEDIATE (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_int, 'What is "EBITDA"?', '["Earnings Before Interest, Taxes, Depreciation, and Amortization", "Every Business Is Total Daily Average", "Earnings Beyond Income Tax and Debt", "Equity Balance"]'::jsonb, 0, 'It measures a company overall financial performance.'),
    (s_int, 'What is "P/E Ratio"?', '["Price-to-Earnings ratio", "Profit-to-Expense", "Price-to-Equity", "Percentage-of-Earnings"]'::jsonb, 0, 'It is a key valuation metric for stocks.'),
    (s_int, 'What is "Dividend Yield"?', '["Annual dividend per share divided by stock price", "Total dividend", "Profit margin", "Market cap"]'::jsonb, 0, 'It shows the return on investment from dividends.'),
    (s_int, 'What is a "Short Squeeze"?', '["Rapid price rise forcing short sellers to buy back", "A market crash", "A stock split", "A news group"]'::jsonb, 0, 'Short squeezes can cause parabolic price moves.'),
    (s_int, 'What is "Beta"?', '["Measure of a stock volatility relative to the market", "The price of a stock", "A type of news", "A trading bot"]'::jsonb, 0, 'A beta > 1 means more volatile than the market.'),
    (s_int, 'What is "Market Capitalization"?', '["Total value of a company shares", "The price of one share", "The company debt", "The number of employees"]'::jsonb, 0, 'Market Cap = Share Price x Total Shares.'),
    (s_int, 'What is "Fundamental Analysis"?', '["Evaluating a company financial health and value", "Studying charts", "Following news only", "Bot trading"]'::jsonb, 0, 'Fundamentals include earnings, revenue, and assets.'),
    (s_int, 'What is "Technical Analysis"?', '["Evaluating stocks based on price and volume history", "Reading reports", "Interviewing CEOs", "Checking news"]'::jsonb, 0, 'Technicals use charts and patterns to predict moves.'),
    (s_int, 'What is a "Growth Stock"?', '["A company expected to grow at above-average rates", "A high dividend stock", "A cheap stock", "A dying company"]'::jsonb, 0, 'Growth stocks usually reinvest all profits.'),
    (s_int, 'What is a "Value Stock"?', '["A stock trading for less than its intrinsic value", "An expensive stock", "A high-growth stock", "A news agency"]'::jsonb, 0, 'Value investors look for "bargains" in the market.'),
    (s_int, 'What is "Revenue"?', '["Total money from sales before expenses", "Total profit", "Money in the bank", "Company debt"]'::jsonb, 0, 'Revenue is the "top line" of an income statement.'),
    (s_int, 'What is "Net Income"?', '["Profit after all expenses and taxes", "Total revenue", "Money from sales", "A news group"]'::jsonb, 0, 'Net income is the "bottom line".'),
    (s_int, 'What is "Profit Margin"?', '["Percentage of revenue that is profit", "Total profit", "The price of a stock", "A news headline"]'::jsonb, 0, 'Higher margins indicate better efficiency.'),
    (s_int, 'What is "Stock Buyback"?', '["Company buying its own shares from the market", "Returning a stock", "A merger", "A market crash"]'::jsonb, 0, 'Buybacks can increase the value of remaining shares.'),
    (s_int, 'What is "Insider Trading"?', '["Trading based on non-public material information (Illegal)", "Trading from inside a bank", "Buying for family", "Pre-market trading"]'::jsonb, 0, 'Insider trading is strictly regulated and prohibited.');

    -- CRYPTO INTERMEDIATE (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_int, 'What is "Proof of Stake" (PoS)?', '["Consensus mechanism where validators are chosen by holdings", "Physical coin proof", "Bank law", "Mining speed"]'::jsonb, 0, 'PoS is more energy-efficient than PoW.'),
    (c_int, 'What is a "Smart Contract"?', '["Self-executing contract written in code", "A computer signed contract", "A digital lawyer", "A news filter"]'::jsonb, 0, 'Smart contracts execute automatically when conditions are met.'),
    (c_int, 'What is a "DEX"?', '["Decentralized Exchange", "Digital Entry", "Data Execution", "Dual Energy"]'::jsonb, 0, 'Uniswap and PancakeSwap are examples of DEXs.'),
    (c_int, 'What is "Staking"?', '["Locking up coins to support a network and earn rewards", "Selling all coins", "Betting on Bitcoin", "Mining with a GPU"]'::jsonb, 0, 'Staking helps secure decentralized networks.'),
    (c_int, 'What is a "Layer 2" solution?', '["A protocol built on top of a blockchain to improve scaling", "A second backup", "A different wallet", "A news group"]'::jsonb, 0, 'Examples include Arbitrum, Optimism, and Polygon.'),
    (c_int, 'What is "Burning" in crypto?', '["Permanently removing tokens from circulation", "Hacking a wallet", "A price drop", "A news headline"]'::jsonb, 0, 'Burning can create deflationary pressure.'),
    (c_int, 'What is "Yield Farming"?', '["Lending assets to earn interest or rewards", "Growing food", "Mining in a pool", "Buying low selling high"]'::jsonb, 0, 'Yield farming is a core part of DeFi (Decentralized Finance).'),
    (c_int, 'What is a "Hard Fork"?', '["Major update that creates a new version of the blockchain", "A physical tool", "A market crash", "A news error"]'::jsonb, 0, 'Bitcoin Cash is a result of a hard fork from Bitcoin.'),
    (c_int, 'What is "Gas"?', '["The unit that measures computational effort for transactions", "A type of fuel", "A crypto coin", "A news group"]'::jsonb, 0, 'Users pay gas fees to incentivize miners/validators.'),
    (c_int, 'What is "Web3"?', '["The decentralized version of the internet built on blockchain", "A new browser", "The third web page", "A news agency"]'::jsonb, 0, 'Web3 focuses on ownership and user control.'),
    (c_int, 'What is "DeFi"?', '["Decentralized Finance", "Digital File", "Deferred Interest", "Detailed Forex"]'::jsonb, 0, 'DeFi replaces traditional banks with smart contracts.'),
    (c_int, 'What is a "DAO"?', '["Decentralized Autonomous Organization", "Digital Asset", "Account Operations", "Dual Asset"]'::jsonb, 0, 'DAOs are managed by community voting and code.'),
    (c_int, 'What is "NFT"?', '["Non-Fungible Token (Unique digital asset)", "New Finance Tool", "Network File", "Next-Gen Tech"]'::jsonb, 0, 'NFTs represent ownership of unique digital or physical items.'),
    (c_int, 'What is a "Stablecoin"?', '["A crypto pegged to a stable asset like USD", "A coin that never moves", "A news headline", "A gold-backed coin only"]'::jsonb, 0, 'Stablecoins provide a way to stay in crypto without volatility.'),
    (c_int, 'What is a "MetaMask"?', '["A popular crypto wallet for browsers and mobile", "A news group", "A type of mask", "A trading bot"]'::jsonb, 0, 'MetaMask allows users to interact with DeFi and Web3 apps.');

    -- COMMODITIES INTERMEDIATE (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_int, 'What is "Seasonality" in commodities?', '["Price patterns that repeat at specific times of the year", "A news event", "A market crash", "A type of gas"]'::jsonb, 0, 'Agri products and energy often have strong seasonal trends.'),
    (m_int, 'What is "Backwardation"?', '["When spot price is higher than futures price", "A market rally", "A price drop", "A news headline"]'::jsonb, 0, 'Backwardation suggests a tight physical supply market.'),
    (m_int, 'What is "Contango"?', '["When futures price is higher than spot price", "A market rally", "A price drop", "A news headline"]'::jsonb, 0, 'Contango often reflects storage costs and abundant supply.'),
    (m_int, 'What is "Hedging"?', '["Using futures to lock in a price and reduce risk", "Buying much gold", "News trading", "Using high leverage"]'::jsonb, 0, 'A farmer might sell futures to lock in a price for their crop.'),
    (m_int, 'What is "Speculation"?', '["Trading to profit from price changes without owning the asset", "A news headline", "A type of delivery", "A broker fee"]'::jsonb, 0, 'Speculators provide liquidity to the commodity markets.'),
    (m_int, 'What is a "Commodity Index"?', '["A basket of commodities used to track performance", "A news group", "A price level", "A trading bot"]'::jsonb, 0, 'The S&P GSCI is a famous commodity index.'),
    (m_int, 'What is "LME"?', '["London Metal Exchange", "London Market", "List of Metals", "Law of Metals"]'::jsonb, 0, 'The LME is the world hub for industrial metal trading.'),
    (m_int, 'What is "Physical Delivery"?', '["Actually taking the physical commodity at contract end", "A news headline", "A digital file", "A broker fee"]'::jsonb, 0, 'Most traders roll their contracts to avoid physical delivery.'),
    (m_int, 'What is "Crude Oil Benchmark"?', '["A standard price reference for oil (e.g. Brent, WTI)", "A news headline", "A machine oil", "A type of gas"]'::jsonb, 0, 'Benchmarks are used to price oil around the world.'),
    (m_int, 'What is "WTI"?', '["West Texas Intermediate (US Oil Benchmark)", "World Trade", "Western Timber", "World Treasury"]'::jsonb, 0, 'WTI is the primary benchmark for North American crude.'),
    (m_int, 'What is "Brent"?', '["International benchmark for oil from North Sea", "US benchmark", "A news agency", "A machine oil"]'::jsonb, 0, 'Brent prices two-thirds of the world internationally traded oil.'),
    (m_int, 'What is "Bullion"?', '["Bulk gold or silver in bars or ingots", "A news headline", "A type of soup", "A coin only"]'::jsonb, 0, 'Bullion is valued by weight and purity, not face value.'),
    (m_int, 'What is "Base Metal"?', '["Metals used in industry like copper and zinc", "Precious metals", "Old metals", "No value metals"]'::jsonb, 0, 'Base metals are essential for global infrastructure.'),
    (m_int, 'What is "Soft Commodity"?', '["Agricultural products like coffee, sugar, and wheat", "Metals", "Oil", "A news agency"]'::jsonb, 0, 'Softs are grown rather than mined or extracted.'),
    (m_int, 'What is "Hard Commodity"?', '["Natural resources that are mined (Oil, Gold, Copper)", "Difficult trades", "Crops", "A news headline"]'::jsonb, 0, 'Hard commodities are extracted from the earth.');

    -- FOREX ELITE (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_eli, 'What is "Quantitative Easing" (QE)?', '["Central bank buying assets to increase money supply", "Raising rates", "A news headline", "A market crash"]'::jsonb, 0, 'QE is used to stimulate an economy by lowering interest rates.'),
    (f_eli, 'What is "Quantitative Tightening" (QT)?', '["Central bank reducing assets to decrease money supply", "Lowering rates", "A news headline", "A market rally"]'::jsonb, 0, 'QT is the opposite of QE and is used to control inflation.'),
    (f_eli, 'What is a "Carry Trade"?', '["Borrowing in low-interest currency to buy high-interest one", "A long-term trade", "A news headline", "A type of bot"]'::jsonb, 0, 'Traders profit from the interest rate differential (Swap).'),
    (f_eli, 'What is "Order Flow Trading"?', '["Analyzing buy and sell orders to find market bias", "Using RSI", "Following news", "Scalping only"]'::jsonb, 0, 'Order flow shows the "footprints" of institutional traders.'),
    (f_eli, 'What is "Intermarket Analysis"?', '["Studying relationships between different asset classes", "Trading 2 brokers", "A news headline", "A price level"]'::jsonb, 0, 'For example, how gold prices affect the AUD/USD pair.'),
    (f_eli, 'What is "Black-Scholes Model"?', '["A mathematical model for pricing options", "A trend tool", "A news filter", "A broker report"]'::jsonb, 0, 'It is the standard model for European option pricing.'),
    (f_eli, 'What is "Implied Volatility" (IV)?', '["Market expectation of future price volatility", "Historical volatility", "A news headline", "A price target"]'::jsonb, 0, 'Higher IV means more expensive options premiums.'),
    (f_eli, 'What is "Delta" in options?', '["Sensitivity of an option price to changes in underlying asset", "A trend line", "A news agency", "A profit target"]'::jsonb, 0, 'Delta of 0.5 means the option moves $0.50 for every $1 move in the stock.'),
    (f_eli, 'What is "Theta" in options?', '["Sensitivity of an option price to time decay", "Volatility measure", "A news group", "A price level"]'::jsonb, 0, 'Options lose value as they get closer to expiration (time decay).'),
    (f_eli, 'What is "Gamma" in options?', '["Rate of change of Delta relative to underlying price", "Trend strength", "A news filter", "A type of bot"]'::jsonb, 0, 'Gamma is highest when an option is "at-the-money".'),
    (f_eli, 'What is "Vega" in options?', '["Sensitivity of an option price to changes in volatility", "A trend tool", "A news agency", "A profit target"]'::jsonb, 0, 'High Vega means the option price is very sensitive to volatility changes.'),
    (f_eli, 'What is "Rho" in options?', '["Sensitivity of an option price to changes in interest rates", "A trend line", "A news group", "A profit target"]'::jsonb, 0, 'Rho is generally the least sensitive Greek for short-term options.'),
    (f_eli, 'What is "Hedge Fund"?', '["Pooled investment fund using advanced strategies", "A simple fund", "A type of bank", "A news agency"]'::jsonb, 0, 'Hedge funds use leverage, long/short positions, and derivatives.'),
    (f_eli, 'What is "Arbitrage"?', '["Simultaneously buying and selling to profit from price diff", "A news headline", "A market crash", "A type of bot"]'::jsonb, 0, 'Arbitrage is theoretically risk-free profit.'),
    (f_eli, 'What is "Algorithmic Trading"?', '["Using computer programs to execute trades automatically", "Manual trading", "Following news", "A news agency"]'::jsonb, 0, 'Algos can execute trades much faster than humans.');

    -- STOCKS ELITE (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_eli, 'What is "WACC"?', '["Weighted Average Cost of Capital", "World Asset Center", "Weekly Average", "Working Account"]'::jsonb, 0, 'It represents a company average cost of financing.'),
    (s_eli, 'What is "DCF" (Discounted Cash Flow)?', '["Valuing a company based on future cash flow projections", "A news filter", "A type of bot", "A price drop"]'::jsonb, 0, 'DCF is a core valuation method in corporate finance.'),
    (s_eli, 'What is "NPV" (Net Present Value)?', '["The difference between present value of cash in and out", "Total profit", "A news headline", "A price target"]'::jsonb, 0, 'A positive NPV indicates a profitable investment.'),
    (s_eli, 'What is "ROE" (Return on Equity)?', '["Net income divided by shareholder equity", "Profit margin", "A news group", "A market cap"]'::jsonb, 0, 'It shows how effectively management is using company assets.'),
    (s_eli, 'What is "ROA" (Return on Assets)?', '["Net income divided by total assets", "Total profit", "A news agency", "A price target"]'::jsonb, 0, 'It shows how profitable a company is relative to its total assets.'),
    (s_eli, 'What is "Capital Gains"?', '["Profit from the sale of an asset", "Interest income", "A news headline", "A broker fee"]'::jsonb, 0, 'Capital gains are taxed differently than income in many countries.'),
    (s_eli, 'What is a "Stock Option"?', '["Contract giving the right to buy/sell at a set price", "A choice of stock", "A news group", "A type of bond"]'::jsonb, 0, 'Options are derivatives used for hedging or speculation.'),
    (s_eli, 'What is "Margin of Safety"?', '["The difference between market price and intrinsic value", "A stop loss", "A news filter", "A broker limit"]'::jsonb, 0, 'Value investors want a large margin of safety to reduce risk.'),
    (s_eli, 'What is "Enterprise Value" (EV)?', '["Total value of a company (Market Cap + Debt - Cash)", "Price of shares", "Total revenue", "A news agency"]'::jsonb, 0, 'EV is used to value a company for acquisition.'),
    (s_eli, 'What is "P/S Ratio"?', '["Price-to-Sales ratio", "Profit-to-Sales", "Price-to-Stock", "Percentage-of-Sales"]'::jsonb, 0, 'P/S is useful for valuing companies with no earnings yet.'),
    (s_eli, 'What is "Acid-Test Ratio"?', '["A measure of a company ability to pay short-term debts", "A news headline", "A type of indicator", "A chemical test"]'::jsonb, 0, 'It is more stringent than the current ratio as it excludes inventory.'),
    (s_eli, 'What is "Alpha"?', '["The excess return of an investment relative to its benchmark", "The first trade", "A news group", "Total profit"]'::jsonb, 0, 'Alpha measures the active return on an investment.'),
    (s_eli, 'What is "Sharpe Ratio"?', '["Measure of risk-adjusted return", "Total profit", "Winning rate", "A news agency"]'::jsonb, 0, 'Higher Sharpe ratio means better return for the risk taken.'),
    (s_eli, 'What is "Portfolio Rebalancing"?', '["Adjusting weights of assets in a portfolio", "Selling everything", "A news filter", "A broker fee"]'::jsonb, 0, 'Rebalancing maintains the desired risk profile over time.'),
    (s_eli, 'What is "Wash Trading"?', '["Illegal act of buying/selling to create fake volume", "Cleaning office", "Selling for loss", "A news error"]'::jsonb, 0, 'Wash trading is a form of market manipulation.');

    -- CRYPTO ELITE (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_eli, 'What is "Zero-Knowledge Proof" (ZKP)?', '["Proving something is true without revealing the data", "Zero risk", "A news group", "A price level"]'::jsonb, 0, 'ZKP is vital for privacy-focused blockchains like Zcash.'),
    (c_eli, 'What is "MEV" (Maximal Extractable Value)?', '["Profit from reordering transactions within a block", "Total value", "A news headline", "A mining reward"]'::jsonb, 0, 'MEV is often extracted by bots using front-running.'),
    (c_eli, 'What is "Sharding"?', '["Splitting a blockchain into smaller parts for speed", "A type of attack", "A news filter", "A hardware wallet"]'::jsonb, 0, 'Sharding is a key part of Ethereum roadmap for scalability.'),
    (c_eli, 'What is "Oracle Problem"?', '["The risk of centralized data in a decentralized system", "A broken computer", "A news agency", "A slow network"]'::jsonb, 0, 'Oracles must be decentralized to maintain trustless security.'),
    (c_eli, 'What is "Flash Loan"?', '["Uncollateralized loan repaid in the same transaction", "A fast bank loan", "A news headline", "A type of coin"]'::jsonb, 0, 'Flash loans allow anyone to access massive capital for one block.'),
    (c_eli, 'What is "Governance Token"?', '["Token giving holders voting rights in a project", "A tax token", "A news group", "A security coin"]'::jsonb, 0, 'Examples include UNI, COMP, and AAVE.'),
    (c_eli, 'What is "Liquidity Mining"?', '["Earning tokens for providing liquidity to a protocol", "Mining Bitcoin", "A news headline", "A type of wallet"]'::jsonb, 0, 'Liquidity mining incentivizes users to provide capital.'),
    (c_eli, 'What is "Impermenent Loss"?', '["Loss in value for LP when prices move relative to each other", "Losing key", "A news group", "A market crash"]'::jsonb, 0, 'It is a primary risk for liquidity providers in AMMs.'),
    (c_eli, 'What is "Layer 0"?', '["Infrastructure for connecting different blockchains", "The user interface", "A news agency", "A hardware wallet"]'::jsonb, 0, 'Cosmos and Polkadot are considered Layer 0 protocols.'),
    (c_eli, 'What is "Cross-Chain Bridge"?', '["Protocol to move assets between different blockchains", "A type of security", "A news filter", "A trading bot"]'::jsonb, 0, 'Bridges are necessary for an interoperable multi-chain ecosystem.'),
    (c_eli, 'What is "Sybil Attack"?', '["Creating many fake identities to gain network control", "A news headline", "A hacker virus", "A price crash"]'::jsonb, 0, 'PoW and PoS are designed to prevent Sybil attacks.'),
    (c_eli, 'What is "Byzantine Fault Tolerance" (BFT)?', '["Ability to reach agreement despite failing nodes", "Old encryption", "A news group", "A price level"]'::jsonb, 0, 'BFT is essential for decentralized network consensus.'),
    (c_eli, 'What is "Danksharding"?', '["A new way of handling data on Ethereum to scale L2s", "A bad trade", "A news agency", "A hardware wallet"]'::jsonb, 0, 'It simplifies the Ethereum scaling roadmap significantly.'),
    (c_eli, 'What is "Total Value Locked" (TVL)?', '["Total dollar value of assets in a DeFi protocol", "Market cap", "A news headline", "Number of users"]'::jsonb, 0, 'TVL is a common metric for DeFi project adoption.'),
    (c_eli, 'What is "HODL"?', '["Holding crypto for the long term (meme for Hold)", "High-Order Digital Ledger", "A news filter", "A price drop"]'::jsonb, 0, 'HODL originated from a typo on a Bitcoin forum in 2013.');

    -- COMMODITIES ELITE (BATCH 4)
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_eli, 'What is "Contango"?', '["When futures price is higher than spot price", "Market rally", "Price drop", "News headline"]'::jsonb, 0, 'Contango implies storage costs and carry costs.'),
    (m_eli, 'What is "Backwardation"?', '["When spot price is higher than futures price", "Market crash", "Price level", "News headline"]'::jsonb, 0, 'Backwardation suggests a shortage or immediate demand for physical goods.'),
    (m_eli, 'What is "Crack Spread"?', '["Price difference between crude oil and refined products", "A technical pattern", "A news headline", "A machine oil"]'::jsonb, 0, 'Refiners use crack spreads to manage profit margins.'),
    (m_eli, 'What is "Basis Risk"?', '["Risk that futures and spot prices do not converge", "Bankruptcy risk", "A news group", "A broker fee"]'::jsonb, 0, 'Basis risk can make hedging imperfect.'),
    (m_eli, 'What is "Roll Yield"?', '["Profit or loss from rolling a futures contract", "Yield from farming", "A news agency", "A price level"]'::jsonb, 0, 'Traders earn positive roll yield in backwardation.'),
    (m_eli, 'What is "Physical Delivery"?', '["Actual transfer of a commodity at contract end", "A digital file", "A news filter", "A broker fee"]'::jsonb, 0, 'Most financial traders roll their positions to avoid delivery.'),
    (m_eli, 'What is "LME Warehouse Stock"?', '["Metals held in LME approved warehouses", "A list of mines", "A news agency", "A price level"]'::jsonb, 0, 'Warehouse stocks give clues about global supply and demand.'),
    (m_eli, 'What is "Geopolitical Risk"?', '["Political events that disrupt supply (e.g. War)", "A news headline", "A weather report", "A price level"]'::jsonb, 0, 'Commodities like oil are very sensitive to geopolitics.'),
    (m_eli, 'What is "Resource Nationalism"?', '["Government control over natural resources", "A news headline", "Patriotism", "A price level"]'::jsonb, 0, 'Resource nationalism can cause global supply shocks.'),
    (m_eli, 'What is "Strategic Petroleum Reserve" (SPR)?', '["Oil stockpiles held by governments", "A news agency", "A private company", "A price target"]'::jsonb, 0, 'SPR releases are used to stabilize markets during supply cuts.'),
    (m_eli, 'What is "Hedging Effectiveness"?', '["Degree to which a hedge reduces risk", "Hedge profit", "A news filter", "A price level"]'::jsonb, 0, 'A perfect hedge has an effectiveness of 1.0 (100%).'),
    (m_eli, 'What is "Tolling Agreement"?', '["Refiner processes raw material for a fee", "A road tax", "A news headline", "A bank loan"]'::jsonb, 0, 'The refiner is paid a toll for their service.'),
    (m_eli, 'What is "Netback Pricing"?', '["Revenue minus transport and refining costs", "Total profit", "A news agency", "A price level"]'::jsonb, 0, 'Netback tells producers their actual profit at the source.'),
    (m_eli, 'What is "Take-or-Pay"?', '["Contract requiring payment for minimum volume", "A choice to pay", "A news group", "A market tax"]'::jsonb, 0, 'Common in gas and pipeline contracts to guarantee revenue.'),
    (m_eli, 'What is "Margin of Safety"?', '["The gap between price and production cost", "A stop loss", "A news headline", "A broker fee"]'::jsonb, 0, 'If prices are near production costs, there is a natural floor.');

END $$;




