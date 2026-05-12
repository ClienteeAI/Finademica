
-- BATCH 2: CRYPTO & COMMODITIES + ELITE LEVELS
-- Copy and paste this into your Supabase SQL Editor

INSERT INTO ai_quiz_questions (module, level, question, options, correct_answer, quiz_id)
VALUES 
-- CRYPTO BEGINNER
('crypto', 'Beginner', 'What is the "Blockchain"?', '["A decentralized digital ledger", "A high-security bank vault", "A type of internet browser", "A chain used to lock mining hardware"]', 'A decentralized digital ledger', 'crypto_master'),
('crypto', 'Beginner', 'Who is the anonymous creator of Bitcoin?', '["Satoshi Nakamoto", "Vitalik Buterin", "Elon Musk", "Charlie Lee"]', 'Satoshi Nakamoto', 'crypto_master'),
('crypto', 'Beginner', 'What is "Mining" in crypto?', '["Using computer power to verify transactions and earn rewards", "Digging for physical coins in the ground", "Buying coins from an exchange", "Storing coins in a safe place"]', 'Using computer power to verify transactions and earn rewards', 'crypto_master'),
('crypto', 'Beginner', 'What is a "Wallet" in cryptocurrency?', '["A tool to store and manage digital keys", "A physical leather pouch for Bitcoins", "A bank account for crypto", "A list of all transactions ever made"]', 'A tool to store and manage digital keys', 'crypto_master'),
('crypto', 'Beginner', 'What does "HODL" mean in the crypto community?', '["Holding onto a crypto for the long term", "Highly Organized Digital Ledger", "A type of fast transaction", "Buying as much as possible"]', 'Holding onto a crypto for the long term', 'crypto_master'),
('crypto', 'Beginner', 'What is the maximum supply of Bitcoin?', '["21 Million", "100 Million", "Infinite", "1 Billion"]', '21 Million', 'crypto_master'),
('crypto', 'Beginner', 'What is an "Altcoin"?', '["Any cryptocurrency other than Bitcoin", "A coin made of aluminum", "A fake or scam cryptocurrency", "A coin used only for payments"]', 'Any cryptocurrency other than Bitcoin', 'crypto_master'),
('crypto', 'Beginner', 'What is a "Stablecoin"?', '["A crypto pegged to a stable asset like the US Dollar", "A coin that never loses value", "A coin backed by gold only", "A coin that cannot be traded"]', 'A crypto pegged to a stable asset like the US Dollar', 'crypto_master'),
('crypto', 'Beginner', 'What is the "Genesis Block"?', '["The very first block of a blockchain", "A block containing a lot of money", "A block that was hacked", "The last block of the year"]', 'The very first block of a blockchain', 'crypto_master'),
('crypto', 'Beginner', 'What is "DeFi"?', '["Decentralized Finance", "Digital Electronic File", "Deferred Financial Interest", "Detailed Forex Information"]', 'Decentralized Finance', 'crypto_master'),
('crypto', 'Beginner', 'What is an "NFT"?', '["Non-Fungible Token", "New Financial Technology", "Network File Transfer", "Next-Gen Finance Tool"]', 'Non-Fungible Token', 'crypto_master'),
('crypto', 'Beginner', 'Which network is known for Smart Contracts?', '["Ethereum", "Bitcoin", "Litecoin", "Dogecoin"]', 'Ethereum', 'crypto_master'),
('crypto', 'Beginner', 'What is a "Private Key"?', '["A secret password used to spend your crypto", "The code for your physical house", "Your bank account number", "A key to the crypto exchange office"]', 'A secret password used to spend your crypto', 'crypto_master'),
('crypto', 'Beginner', 'What is "FOMO"?', '["Fear Of Missing Out", "Financial Option Market Order", "Fast Online Money Opportunity", "Future Of Market Operations"]', 'Fear Of Missing Out', 'crypto_master'),
('crypto', 'Beginner', 'What is an "Exchange" (CEX)?', '["A platform to buy and sell cryptocurrencies", "A place to swap physical coins", "A type of crypto wallet", "A news website for crypto"]', 'A platform to buy and sell cryptocurrencies', 'crypto_master'),

-- COMMODITIES BEGINNER
('commodities', 'Beginner', 'What is a "Commodity"?', '["A basic good used in commerce like oil or gold", "A high-tech electronic device", "A type of stock in a bank", "A service provided by a company"]', 'A basic good used in commerce like oil or gold', 'comm_master'),
('commodities', 'Beginner', 'Which commodity is known as a "Safe Haven" asset?', '["Gold", "Oil", "Copper", "Coffee"]', 'Gold', 'comm_master'),
('commodities', 'Beginner', 'What is "Crude Oil"?', '["Unrefined petroleum found in the ground", "A type of cooking oil", "A finished gasoline product", "Oil used for machinery only"]', 'Unrefined petroleum found in the ground', 'comm_master'),
('commodities', 'Beginner', 'What are "Hard Commodities"?', '["Natural resources that must be mined or extracted", "Commodities that are difficult to trade", "Agricultural products", "Commodities with a fixed price"]', 'Natural resources that must be mined or extracted', 'comm_master'),
('commodities', 'Beginner', 'What are "Soft Commodities"?', '["Agricultural products or livestock", "Commodities like gold and silver", "Digital currencies", "Commodities that are easy to break"]', 'Agricultural products or livestock', 'comm_master'),
('commodities', 'Beginner', 'Which city is the main hub for Gold trading?', '["London", "Chicago", "Tokyo", "Paris"]', 'London', 'comm_master'),
('commodities', 'Beginner', 'What is a "Futures Contract"?', '["An agreement to buy/sell at a set price in the future", "A contract signed by a fortune teller", "A stock market prediction", "A type of insurance policy"]', 'An agreement to buy/sell at a set price in the future', 'comm_master'),
('commodities', 'Beginner', 'Which of these is a Soft Commodity?', '["Wheat", "Silver", "Crude Oil", "Platinum"]', 'Wheat', 'comm_master'),
('commodities', 'Beginner', 'What is "OPEC"?', '["An organization of major oil-exporting nations", "A global trading platform", "A type of energy tax", "A committee for clean energy"]', 'An organization of major oil-exporting nations', 'comm_master'),
('commodities', 'Beginner', 'How is Gold typically measured in markets?', '["Troy Ounces", "Kilograms", "Pounds", "Liters"]', 'Troy Ounces', 'comm_master'),

-- FOREX ELITE (CONTINUED)
('forex', 'Elite', 'What is "Slippage-Adjusted Backtesting"?', '["Testing a strategy while accounting for execution delays", "A way to avoid paying spreads", "Trading only on demo accounts", "Calculating the speed of light"]', 'Testing a strategy while accounting for execution delays', 'forex_master'),
('forex', 'Elite', 'Which central bank uses the "Dot Plot" for interest rate projections?', '["The Federal Reserve (FED)", "The European Central Bank (ECB)", "The Bank of Japan (BOJ)", "The Swiss National Bank (SNB)"]', 'The Federal Reserve (FED)', 'forex_master'),
('forex', 'Elite', 'What is "Delta Neutral" hedging?', '["Reducing the directional risk of a portfolio to zero", "Buying only currencies that are not moving", "A strategy to pay zero taxes", "Trading without using a broker"]', 'Reducing the directional risk of a portfolio to zero', 'forex_master'),
('forex', 'Elite', 'What is a "Liquidity Provider" (LP)?', '["An entity that provides buy/sell orders to a market", "A tool to wash your computer screen", "A trader with a lot of cash", "A type of high-speed internet"]', 'An entity that provides buy/sell orders to a market', 'forex_master'),
('forex', 'Elite', 'What does the "LIBOR" replacement "SOFR" stand for?', '["Secured Overnight Financing Rate", "Standard Open Financial Report", "Systemic Online Forex Regulation", "Specialized Overnight Forex Reserve"]', 'Secured Overnight Financing Rate', 'forex_master'),

-- STOCKS ELITE (CONTINUED)
('stocks', 'Elite', 'What is "Enterprise Value" (EV)?', '["A measure of a company total value including debt", "The price of the company building", "The total profit of the company", "The salary of the CEO"]', 'A measure of a company total value including debt', 'stocks_master'),
('stocks', 'Elite', 'What is "Discounted Cash Flow" (DCF) analysis?', '["Valuing an asset based on its future cash flow projections", "Calculating the price of a stock after a sale", "A way to get discounts on trading fees", "Studying the bank statements of a company"]', 'Valuing an asset based on its future cash flow projections', 'stocks_master'),
('stocks', 'Elite', 'What is a "Poison Pill" strategy?', '["A defense mechanism to prevent a hostile takeover", "A way to bankrupt a competitor", "A type of high-risk trading algorithm", "A strategy to hide company losses"]', 'A defense mechanism to prevent a hostile takeover', 'stocks_master'),
('stocks', 'Elite', 'What is "Alpha" in investment performance?', '["The excess return of an investment relative to a benchmark", "The risk-free rate of return", "The total volume of trades made", "The name of the first trader in a company"]', 'The excess return of an investment relative to a benchmark', 'stocks_master'),
('stocks', 'Elite', 'What is "Mezzanine Financing"?', '["A hybrid of debt and equity financing", "Loans taken from the middle floor of a bank", "A type of stock market insurance", "A strategy for very small companies"]', 'A hybrid of debt and equity financing', 'stocks_master');

ON CONFLICT DO NOTHING;
