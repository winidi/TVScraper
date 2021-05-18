# TVScraper
Get real-time indicator data from TradingView

- Only login via Email supported
- Shows the last watched trading pair and timeframe from last seesion
- Prints a csv string to TradingViewScraper/IndicatorData/indicatorData.txt with all indicator values. (You need to detect them by hand)
- Note that TV has a slight delay may depend on your subscription plan

Probably will add switching to other tradingpairs, multiple charts etc. as time goes by.

## Get Started

Edit email and pw variables or create an .env file.

```
git clone https://github.com/winidi/TVScraper
cd TVScraper/TradingViewScraper/
npm install
node index.js
```
