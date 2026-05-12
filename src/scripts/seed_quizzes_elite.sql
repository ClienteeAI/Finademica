
-- SEED MASTER V2 - BATCH 3 (ELITE QUESTIONS)
-- This script links Elite questions to existing Quizzes.

DO $$
DECLARE
    f_eli uuid; s_eli uuid; c_eli uuid; m_eli uuid;
BEGIN
    -- Get existing Quiz IDs
    SELECT id INTO f_eli FROM quizzes WHERE module = 'forex' AND level = 'Elite' LIMIT 1;
    SELECT id INTO s_eli FROM quizzes WHERE module = 'stocks' AND level = 'Elite' LIMIT 1;
    SELECT id INTO c_eli FROM quizzes WHERE module = 'crypto' AND level = 'Elite' LIMIT 1;
    SELECT id INTO m_eli FROM quizzes WHERE module = 'commodities' AND level = 'Elite' LIMIT 1;

    -- FOREX ELITE
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (f_eli, 'What is "Slippage-Adjusted Backtesting"?', '["Testing accounting for execution delays", "Avoiding spreads", "Demo trading", "Speed of light"]'::jsonb, 0, 'Realistic backtesting must account for slippage.'),
    (f_eli, 'Which central bank uses the "Dot Plot" for projections?', '["Federal Reserve (FED)", "ECB", "BOJ", "SNB"]'::jsonb, 0, 'The FED Dot Plot shows where officials expect rates to be.'),
    (f_eli, 'What is "Delta Neutral" hedging?', '["Reducing directional risk to zero", "Buying stable currencies", "Zero tax strategy", "No broker trading"]'::jsonb, 0, 'Delta neutral portfolios profit from volatility, not direction.'),
    (f_eli, 'What is a "Liquidity Provider" (LP)?', '["Entity providing buy/sell orders", "Screen cleaner", "Rich trader", "Internet type"]'::jsonb, 0, 'LPs ensure markets remain efficient and tradable.'),
    (f_eli, 'What does the "LIBOR" replacement "SOFR" stand for?', '["Secured Overnight Financing Rate", "Standard Report", "Online Regulation", "Forex Reserve"]'::jsonb, 0, 'SOFR is a broad measure of the cost of borrowing cash overnight.'),
    (f_eli, 'What is "Intermarket Analysis"?', '["Studying relationships between assets", "Trading between brokers", "Internal company review", "Secret market signals"]'::jsonb, 0, 'Intermarket analysis looks at how stocks, bonds, and currencies interact.'),
    (f_eli, 'What is the "Black-Scholes" model used for?', '["Pricing options contracts", "Forex trend prediction", "Stock buybacks", "Mining difficulty"]'::jsonb, 0, 'Black-Scholes is the standard for option pricing.'),
    (f_eli, 'What is "Market Depth"?', '["The volume of buy/sell orders at different prices", "How long the market is open", "The number of active traders", "A measure of asset age"]'::jsonb, 0, 'Market depth reveals the level of liquidity available.'),
    (f_eli, 'What is "Gamma" in options Greeks?', '["The rate of change in Delta", "The rate of change in Theta", "The cost of the option", "The time to expiration"]'::jsonb, 0, 'Gamma measures the acceleration of an option price.'),
    (f_eli, 'What is "Statistical Arbitrage"?', '["Using mathematical models to find price inefficiencies", "Guessing based on stats", "A type of tax audit", "Manual scalping"]'::jsonb, 0, 'Stat-Arb uses algorithmic trading to exploit mean reversion.');

    -- STOCKS ELITE
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (s_eli, 'What is "Enterprise Value" (EV)?', '["Measure of company total value including debt", "Building price", "Total profit", "CEO salary"]'::jsonb, 0, 'EV = Market Cap + Debt - Cash.'),
    (s_eli, 'What is "Discounted Cash Flow" (DCF) analysis?', '["Valuing based on future cash flow projections", "Post-sale price", "Fee discount", "Bank statement study"]'::jsonb, 0, 'DCF calculates the present value of future earnings.'),
    (s_eli, 'What is a "Poison Pill" strategy?', '["Defense mechanism against hostile takeover", "Competitor bankruptcy", "High-risk algorithm", "Hiding losses"]'::jsonb, 0, 'Poison pills dilute the value of the company to the acquirer.'),
    (s_eli, 'What is "Alpha" in investment?', '["Excess return relative to benchmark", "Risk-free rate", "Total volume", "First trader name"]'::jsonb, 0, 'Alpha measures the active return on an investment.'),
    (s_eli, 'What is "Mezzanine Financing"?', '["Hybrid of debt and equity financing", "Bank floor loans", "Market insurance", "Small company strategy"]'::jsonb, 0, 'Mezzanine is often used in leveraged buyouts.'),
    (s_eli, 'What is a "Special Purpose Acquisition Company" (SPAC)?', '["A shell company designed to take a private company public", "A tech company", "A type of investment bank", "A government fund"]'::jsonb, 0, 'SPACs are often called "blank-check companies".'),
    (s_eli, 'What is "Wash Trading"?', '["Illegal act of buying/selling to create fake volume", "Cleaning your office", "Selling for a tax loss", "High-speed trading"]'::jsonb, 0, 'Wash trading is a form of market manipulation.'),
    (s_eli, 'What is the "Sharpe Ratio"?', '["Measure of risk-adjusted return", "A type of chart tool", "The profit per share", "A measure of company size"]'::jsonb, 0, 'Higher Sharpe ratios indicate better risk-adjusted performance.'),
    (s_eli, 'What is "Short Interest"?', '["The number of shares sold short but not yet covered", "The interest paid on a loan", "A type of market sentiment", "The profit from shorting"]'::jsonb, 0, 'High short interest can lead to a short squeeze.'),
    (s_eli, 'What is "Dark Pool" trading?', '["Private exchanges for trading large blocks of shares", "Trading after midnight", "Hacking a brokerage", "Underwater company stocks"]'::jsonb, 0, 'Dark pools hide large orders from the public eye.');

    -- CRYPTO ELITE
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (c_eli, 'What is "Zero-Knowledge Proof" (ZKP)?', '["Method to prove truth without revealing data", "Zero risk trade", "Empty wallet", "No transactions"]'::jsonb, 0, 'ZKP is vital for blockchain privacy.'),
    (c_eli, 'What is "MEV" (Maximal Extractable Value)?', '["Profit from reordering transactions", "Total market value", "Max withdrawal", "Security measure"]'::jsonb, 0, 'MEV is a major topic in Ethereum validator rewards.'),
    (c_eli, 'What is "Sharding"?', '["Splitting blockchain into smaller parts for speed", "Cyber attack", "Deleting old data", "Dividing keys"]'::jsonb, 0, 'Sharding is a key scaling solution for Ethereum.'),
    (c_eli, 'What is a "DAO"?', '["Decentralized Autonomous Organization", "Digital Asset", "Account Operations", "Asset Optimization"]'::jsonb, 0, 'DAOs use smart contracts for governance.'),
    (c_eli, 'What is "Byzantine Fault Tolerance"?', '["Ability to function despite failing components", "Old encryption", "Hacking method", "Legal requirement"]'::jsonb, 0, 'BFT is essential for decentralized consensus.'),
    (c_eli, 'What is a "Flash Loan"?', '["Uncollateralized loan repaid in the same transaction", "A fast bank loan", "A high-interest loan", "A loan from a crypto friend"]'::jsonb, 0, 'Flash loans are unique to DeFi and programmable money.'),
    (c_eli, 'What is "Impermanent Loss"?', '["Temporary loss in value for liquidity providers", "When you forget your key", "A permanent market crash", "A type of tax penalty"]'::jsonb, 0, 'Impermanent loss happens when prices move away from the entry point.'),
    (c_eli, 'What is "Liquidity Mining"?', '["Earning tokens for providing liquidity to a protocol", "Mining Bitcoin", "Selling all your coins", "A type of exchange fee"]'::jsonb, 0, 'Liquidity mining incentivizes users to join a platform.'),
    (c_eli, 'What is "Cross-Chain Interoperability"?', '["The ability of different blockchains to communicate", "Trading on two exchanges", "Using two different wallets", "A type of high-speed internet"]'::jsonb, 0, 'Bridges allow assets to move between chains.'),
    (c_eli, 'What is a "Sybil Attack"?', '["When one entity creates many fake identities to gain control", "A type of computer virus", "A hack of a crypto exchange", "A physical attack on a miner"]'::jsonb, 0, 'Proof of Stake/Work prevents Sybil attacks.');

    -- COMMODITIES ELITE
    INSERT INTO ai_quiz_questions (quiz_id, question, options, correct_option, explanation) VALUES 
    (m_eli, 'What is "Crack Spread"?', '["Price difference between crude and refined products", "Gold chart pattern", "Pipeline cost", "Market volatility"]'::jsonb, 0, 'Refiners monitor crack spreads for profitability.'),
    (m_eli, 'What is "Basis Risk"?', '["Risk that spot and futures prices do not converge", "Bankruptcy risk", "Password loss risk", "Currency fluctuation"]'::jsonb, 0, 'Basis risk can impact the effectiveness of a hedge.'),
    (m_eli, 'What is "Physical Delivery"?', '["Actual transfer of commodity at maturity", "Digital file transfer", "Fast execution", "Bank visit"]'::jsonb, 0, 'Most financial traders avoid physical delivery.'),
    (m_eli, 'What is "Margin of Safety"?', '["Buying below intrinsic value or production cost", "Low leverage", "Cash in bank", "Stop losses"]'::jsonb, 0, 'In commodities, production cost provides a floor.'),
    (m_eli, 'What is the "LME"?', '["London Metal Exchange", "Museum", "Commodity bank", "Gold bar"]'::jsonb, 0, 'The LME is the world hub for industrial metal trading.'),
    (m_eli, 'What is "Backwardation-Driven Yield"?', '["Profit from rolling futures contracts in backwardation", "Yield from farming", "A type of dividend", "A market loss"]'::jsonb, 0, 'Roll yield is positive when a market is in backwardation.'),
    (m_eli, 'What is a "Commodity Trading Advisor" (CTA)?', '["A regulated professional managing commodity accounts", "A crypto analyst", "A type of trading software", "A news website"]'::jsonb, 0, 'CTAs are key institutional players in the markets.'),
    (m_eli, 'What is "Strategic Petroleum Reserve" (SPR)?', '["Oil stockpiles maintained for national security", "A private oil company", "A type of gasoline", "A new oil well"]'::jsonb, 0, 'Governments release SPR oil during supply emergencies.'),
    (m_eli, 'What is the "GSCI" Index?', '["Goldman Sachs Commodity Index", "Global Stock Central Index", "Green Supply Chain Info", "General Silver Coin Index"]'::jsonb, 0, 'GSCI is a leading benchmark for commodity performance.'),
    (m_eli, 'What is "Resource Nationalism"?', '["Government control over natural resources", "A type of patriotism", "Buying local products only", "A new mining law"]'::jsonb, 0, 'Resource nationalism can disrupt global supply chains.');

END $$;
