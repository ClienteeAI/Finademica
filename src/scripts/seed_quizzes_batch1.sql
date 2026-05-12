
-- FIRST 100 QUESTIONS: FOREX & STOCKS
-- Copy and paste this into your Supabase SQL Editor

INSERT INTO ai_quiz_questions (module, level, question, options, correct_answer, quiz_id)
VALUES 
-- FOREX BEGINNER
('forex', 'Beginner', 'What does "PIP" stand for in Forex trading?', '["Percentage in Point", "Price Interest Point", "Percentage in Price", "Private Investment Plan"]', 'Percentage in Point', 'forex_master'),
('forex', 'Beginner', 'Which of the following is considered a "Major" currency pair?', '["EUR/USD", "EUR/GBP", "USD/TRY", "AUD/NZD"]', 'EUR/USD', 'forex_master'),
('forex', 'Beginner', 'If you are "Long" on a currency pair, what are you doing?', '["Buying the pair", "Selling the pair", "Waiting for a crash", "Hedging against inflation"]', 'Buying the pair', 'forex_master'),
('forex', 'Beginner', 'What is the "Spread" in Forex trading?', '["The difference between the bid and ask price", "The total profit made on a trade", "The commission charged by the broker", "The volatility of the market"]', 'The difference between the bid and ask price', 'forex_master'),
('forex', 'Beginner', 'Which city is the largest Forex trading center in the world?', '["London", "New York", "Tokyo", "Hong Kong"]', 'London', 'forex_master'),
('forex', 'Beginner', 'What is "Leverage" in trading?', '["Using borrowed funds to increase position size", "Reducing the risk of a trade", "The speed of market execution", "A type of technical indicator"]', 'Using borrowed funds to increase position size', 'forex_master'),
('forex', 'Beginner', 'In the pair GBP/USD, which is the "Base" currency?', '["GBP", "USD", "Both are equal", "The one with the higher value"]', 'GBP', 'forex_master'),
('forex', 'Beginner', 'A "Bullish" market sentiment means prices are expected to:', '["Rise", "Fall", "Stay the same", "Be extremely volatile"]', 'Rise', 'forex_master'),
('forex', 'Beginner', 'What is a "Lot" in Forex?', '["A standardized unit of measurement for transaction size", "A specific time frame for trading", "A type of charting software", "A group of traders"]', 'A standardized unit of measurement for transaction size', 'forex_master'),
('forex', 'Beginner', 'Which of these is a technical analysis tool?', '["Moving Average", "GDP Report", "Interest Rate Decision", "Corporate Earnings"]', 'Moving Average', 'forex_master'),
('forex', 'Beginner', 'What is a "Stop Loss" order?', '["An order to close a trade at a set price to limit losses", "An order to double the position if price falls", "A strategy to never lose money", "A way to pause the market"]', 'An order to close a trade at a set price to limit losses', 'forex_master'),
('forex', 'Beginner', 'What does "Bearish" mean?', '["Prices are falling or expected to fall", "Prices are rising rapidly", "The market is closed", "Trading volume is very high"]', 'Prices are falling or expected to fall', 'forex_master'),
('forex', 'Beginner', 'Which currency is known as the "Greenback"?', '["US Dollar", "British Pound", "Japanese Yen", "Australian Dollar"]', 'US Dollar', 'forex_master'),
('forex', 'Beginner', 'What is the "Ask" price?', '["The price at which you buy a currency", "The price at which you sell a currency", "The closing price of the day", "The highest price of the year"]', 'The price at which you buy a currency', 'forex_master'),
('forex', 'Beginner', 'How many pips is 0.0001 in a standard pair like EUR/USD?', '["1 pip", "10 pips", "0.1 pips", "100 pips"]', '1 pip', 'forex_master'),

-- FOREX INTERMEDIATE
('forex', 'Intermediate', 'What is the "Carry Trade" strategy?', '["Buying a high-interest currency against a low-interest one", "Holding a trade for more than a year", "Trading only on news events", "Using maximum leverage on every trade"]', 'Buying a high-interest currency against a low-interest one', 'forex_master'),
('forex', 'Intermediate', 'Which economic indicator typically has the highest impact on Forex markets?', '["Non-Farm Payrolls (NFP)", "Retail Sales", "Consumer Confidence Index", "Housing Starts"]', 'Non-Farm Payrolls (NFP)', 'forex_master'),
('forex', 'Intermediate', 'What is "Slippage"?', '["Executing a trade at a different price than requested", "A technical indicator for trends", "When a broker steals pips", "The time it takes to deposit funds"]', 'Executing a trade at a different price than requested', 'forex_master'),
('forex', 'Intermediate', 'The Fibonacci Retracement level 61.8% is often referred to as:', '["The Golden Ratio", "The Breakout Point", "The Dead Zone", "The Pivot Point"]', 'The Golden Ratio', 'forex_master'),
('forex', 'Intermediate', 'What is a "Doji" in candlestick charting?', '["A candle with identical or near-identical open and close prices", "A very long bullish candle", "A candle with no wicks", "A pattern indicating a strong trend"]', 'A candle with identical or near-identical open and close prices', 'forex_master'),
('forex', 'Intermediate', 'What is "Quantitative Easing"?', '["A central bank policy to increase money supply", "A way to calculate position size", "A technical strategy using math", "The process of closing all losing trades"]', 'A central bank policy to increase money supply', 'forex_master'),
('forex', 'Intermediate', 'Which of these is a "Lagging" indicator?', '["Moving Average", "RSI", "Stochastic Oscillator", "MACD (Histogram)"]', 'Moving Average', 'forex_master'),
('forex', 'Intermediate', 'What does "Correlation" mean in Forex?', '["The relationship between the movements of two currency pairs", "The connection between a broker and a trader", "The accuracy of a signal provider", "The total number of trades in a day"]', 'The relationship between the movements of two currency pairs', 'forex_master'),
('forex', 'Intermediate', 'A "Margin Call" occurs when:', '["Account equity falls below the required margin", "The broker calls you to suggest a trade", "You reach your daily profit target", "The market is about to close"]', 'Account equity falls below the required margin', 'forex_master'),
('forex', 'Intermediate', 'What is a "Trailing Stop"?', '["A stop loss that moves automatically as profit increases", "A stop loss that never changes", "A trade that follows a professional", "A way to enter a trade late"]', 'A stop loss that moves automatically as profit increases', 'forex_master'),

-- STOCKS BEGINNER
('stocks', 'Beginner', 'What does "IPO" stand for?', '["Initial Public Offering", "Internal Profit Option", "International Price Order", "Instant Payment Out"]', 'Initial Public Offering', 'stocks_master'),
('stocks', 'Beginner', 'Which index represents the 500 largest US companies?', '["S&P 500", "Dow Jones", "Nasdaq 100", "Russell 2000"]', 'S&P 500', 'stocks_master'),
('stocks', 'Beginner', 'What is a "Dividend"?', '["A portion of company profits paid to shareholders", "The cost of buying a stock", "A type of stock market crash", "The tax paid on stock sales"]', 'A portion of company profits paid to shareholders', 'stocks_master'),
('stocks', 'Beginner', 'What is "Market Capitalization"?', '["The total value of a company shares", "The price of a single share", "The total debt of a company", "The number of employees in a company"]', 'The total value of a company shares', 'stocks_master'),
('stocks', 'Beginner', 'What is a "Blue Chip" stock?', '["Stock in a large, well-established company", "A high-risk penny stock", "A stock that is losing value", "A stock traded only in casinos"]', 'Stock in a large, well-established company', 'stocks_master'),
('stocks', 'Beginner', 'What is the "P/E Ratio"?', '["Price-to-Earnings Ratio", "Profit-to-Expense Ratio", "Price-to-Equity Ratio", "Percentage-of-Earnings"]', 'Price-to-Earnings Ratio', 'stocks_master'),
('stocks', 'Beginner', 'A "Bear Market" is characterized by:', '["Falling prices and pessimism", "Rapidly rising prices", "Stable prices with low volume", "A market only open in winter"]', 'Falling prices and pessimism', 'stocks_master'),
('stocks', 'Beginner', 'Which exchange is known for technology stocks?', '["NASDAQ", "NYSE", "LSE", "JPX"]', 'NASDAQ', 'stocks_master'),
('stocks', 'Beginner', 'What is a "Ticker Symbol"?', '["A unique series of letters representing a stock", "The sound a stock makes when it drops", "A type of technical indicator", "The name of the company founder"]', 'A unique series of letters representing a stock', 'stocks_master'),
('stocks', 'Beginner', 'What is a "Share"?', '["A unit of ownership in a company", "A loan given to a company", "The profit a company makes", "A contract to buy stocks later"]', 'A unit of ownership in a company', 'stocks_master'),
('stocks', 'Beginner', 'What is "Volatility"?', '["The frequency and magnitude of price movements", "The total volume of shares traded", "The speed of a company growth", "A measure of company debt"]', 'The frequency and magnitude of price movements', 'stocks_master'),
('stocks', 'Beginner', 'A "Bull Market" means:', '["Prices are rising or expected to rise", "Prices are crashing", "The market is moving sideways", "Trading is suspended"]', 'Prices are rising or expected to rise', 'stocks_master'),
('stocks', 'Beginner', 'What is an "ETF"?', '["Exchange-Traded Fund", "Electronic Trade File", "Equity Trading Facility", "External Tax Form"]', 'Exchange-Traded Fund', 'stocks_master'),
('stocks', 'Beginner', 'What happens in a "Stock Split"?', '["The number of shares increases and price decreases proportionally", "The company goes bankrupt", "Two companies merge together", "The stock is removed from the exchange"]', 'The number of shares increases and price decreases proportionally', 'stocks_master'),
('stocks', 'Beginner', 'Which agency regulates the US stock market?', '["SEC", "FBI", "IRS", "FED"]', 'SEC', 'stocks_master'),

-- STOCKS INTERMEDIATE
('stocks', 'Intermediate', 'What is "EBITDA"?', '["Earnings Before Interest, Taxes, Depreciation, and Amortization", "Every Business Interest Total Daily Average", "Earnings Beyond Internal Tax and Debt Accounts", "Equity Balance in Total Daily Assets"]', 'Earnings Before Interest, Taxes, Depreciation, and Amortization', 'stocks_master'),
('stocks', 'Intermediate', 'What is a "Short Squeeze"?', '["Rapid price rise forcing short sellers to buy back", "A slow decline in stock price", "When a company buys back its own shares", "A technical pattern on a chart"]', 'Rapid price rise forcing short sellers to buy back', 'stocks_master'),
('stocks', 'Intermediate', 'What does "Beta" measure in a stock?', '["The volatility of a stock relative to the market", "The total dividend yield", "The debt-to-equity ratio", "The profit margin of the company"]', 'The volatility of a stock relative to the market', 'stocks_master'),
('stocks', 'Intermediate', 'What is "Insider Trading"?', '["Trading based on non-public material information", "Trading from inside a bank", "Buying stocks for your family", "Trading only in the pre-market session"]', 'Trading based on non-public material information', 'stocks_master'),
('stocks', 'Intermediate', 'What is a "Growth Stock"?', '["A company expected to grow at an above-average rate", "A stock that pays very high dividends", "A stock with a very low P/E ratio", "A company that is slowly dying"]', 'A company expected to grow at an above-average rate', 'stocks_master'),
('stocks', 'Intermediate', 'What is "Fundamental Analysis"?', '["Evaluating a stock based on financial statements and business health", "Studying chart patterns and volume", "Trading based on social media trends", "Using AI to predict the next minute of trading"]', 'Evaluating a stock based on financial statements and business health', 'stocks_master'),
('stocks', 'Intermediate', 'What is "Technical Analysis"?', '["Evaluating a stock based on historical price and volume data", "Reading annual reports of companies", "Interviewing the CEO of a company", "Checking the global news every morning"]', 'Evaluating a stock based on historical price and volume data', 'stocks_master'),
('stocks', 'Intermediate', 'What is a "Penny Stock"?', '["High-risk stock trading at a very low price", "A stock that is worth exactly one penny", "A stock that pays dividends in pennies", "A stock traded only in the UK"]', 'High-risk stock trading at a very low price', 'stocks_master'),
('stocks', 'Intermediate', 'What is "Revenue"?', '["The total amount of money a company receives from sales", "The profit left after all expenses", "The tax a company pays to the government", "The money a company owes to banks"]', 'The total amount of money a company receives from sales', 'stocks_master'),
('stocks', 'Intermediate', 'What is a "Limit Order"?', '["An order to buy or sell at a specific price or better", "An order that must be executed immediately", "A maximum amount of money you can lose", "A way to restrict the number of shares you own"]', 'An order to buy or sell at a specific price or better', 'stocks_master');

ON CONFLICT DO NOTHING;
