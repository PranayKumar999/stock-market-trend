/**
 * calculations.js
 * Technical calculations engine for Indian Stock Market Industry Trend
 * - Equal-weighted composite industry index
 * - 50-day and 200-day Simple Moving Averages (50 DMA, 200 DMA)
 * - Momentum returns (1W, 1M, 3M, 1Y)
 * - Industry Breadth (% of stocks above 50 DMA)
 */

const TechMath = {
  /**
   * Calculates Simple Moving Average for a series of values
   * @param {Array<number>} values 
   * @param {number} period 
   * @returns {Array<number|null>} Array of same length with SMA or null where history is insufficient
   */
  calculateSMA(values, period) {
    const result = new Array(values.length).fill(null);
    if (!values || values.length < period) return result;

    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += values[i];
    }
    result[period - 1] = Number((sum / period).toFixed(2));

    for (let i = period; i < values.length; i++) {
      sum += values[i] - values[i - period];
      result[i] = Number((sum / period).toFixed(2));
    }
    return result;
  },

  /**
   * Builds an equal-weighted composite industry index from a map of stock candle arrays
   * Base = 100 at the beginning of the common timeline
   * @param {Array<string>} tickers List of ticker symbols
   * @param {Object} stockCandlesMap Map of symbol -> array of candles {date, close}
   * @returns {Object} { dates, indexValues, dma50, dma200, metrics, constituentsAnalysis }
   */
  computeIndustryTrend(tickers, stockCandlesMap) {
    const validTickers = [];
    const tickerDateMap = {};

    // 1. Gather valid constituent candle data
    tickers.forEach(symbol => {
      const candles = stockCandlesMap[symbol];
      if (candles && Array.isArray(candles) && candles.length >= 200) {
        validTickers.push(symbol);
        const map = new Map();
        candles.forEach(c => {
          if (c && c.date && typeof c.close === 'number' && !isNaN(c.close)) {
            map.set(c.date, c.close);
          }
        });
        tickerDateMap[symbol] = map;
      }
    });

    if (validTickers.length === 0) {
      return null;
    }

    // 2. Find common dates across available stocks (sorted chronologically)
    const allDatesSet = new Set();
    validTickers.forEach(sym => {
      for (const d of tickerDateMap[sym].keys()) {
        allDatesSet.add(d);
      }
    });
    const sortedDates = Array.from(allDatesSet).sort();

    // Need at least 200 dates for 200 DMA
    if (sortedDates.length < 200) {
      return null;
    }

    // 3. Normalize each stock to base 100 on its first available trading day
    // and compute equal-weighted daily average
    const indexValues = [];
    const activeDates = [];

    // Find initial price for each stock
    const basePrices = {};
    validTickers.forEach(sym => {
      const m = tickerDateMap[sym];
      for (const d of sortedDates) {
        if (m.has(d)) {
          basePrices[sym] = m.get(d);
          break;
        }
      }
    });

    let prevIndex = 100;
    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      let sumNormalized = 0;
      let count = 0;

      validTickers.forEach(sym => {
        const m = tickerDateMap[sym];
        if (m.has(date)) {
          const base = basePrices[sym] || m.get(date);
          const current = m.get(date);
          sumNormalized += (current / base) * 100;
          count++;
        }
      });

      if (count > 0) {
        const val = Number((sumNormalized / count).toFixed(2));
        indexValues.push(val);
        activeDates.push(date);
        prevIndex = val;
      }
    }

    // 4. Calculate 50 DMA and 200 DMA
    const dma50Series = this.calculateSMA(indexValues, 50);
    const dma200Series = this.calculateSMA(indexValues, 200);

    // 5. Individual Stock DMA & Market Breadth Analysis
    const constituentsAnalysis = [];
    let stocksAbove50DmaCount = 0;

    validTickers.forEach(sym => {
      const candles = stockCandlesMap[sym];
      const closes = candles.map(c => c.close);
      const stockDma50 = this.calculateSMA(closes, 50);
      const stockDma200 = this.calculateSMA(closes, 200);
      const latestPrice = closes[closes.length - 1];
      const latest50 = stockDma50[stockDma50.length - 1];
      const latest200 = stockDma200[stockDma200.length - 1];

      const isAbove50 = latest50 ? latestPrice >= latest50 : false;
      const isAbove200 = latest200 ? latestPrice >= latest200 : false;

      if (isAbove50) stocksAbove50DmaCount++;

      const pctDiff50 = latest50 ? Number((((latestPrice - latest50) / latest50) * 100).toFixed(2)) : 0;
      const pctDiff200 = latest200 ? Number((((latestPrice - latest200) / latest200) * 100).toFixed(2)) : 0;

      // 1M return of individual stock (approx 21 trading days)
      const prev1M = closes.length >= 22 ? closes[closes.length - 22] : closes[0];
      const return1M = Number((((latestPrice - prev1M) / prev1M) * 100).toFixed(2));

      constituentsAnalysis.push({
        symbol: sym,
        latestPrice,
        dma50: latest50,
        dma200: latest200,
        pctDiff50,
        pctDiff200,
        return1M,
        isAbove50,
        isAbove200,
        totalCandles: closes.length
      });
    });

    const breadthPct = validTickers.length > 0 
      ? Number(((stocksAbove50DmaCount / validTickers.length) * 100).toFixed(1)) 
      : 0;

    // 6. Summary metrics for current index
    const n = indexValues.length;
    const latestVal = indexValues[n - 1];
    const latestDma50 = dma50Series[n - 1];
    const latestDma200 = dma200Series[n - 1];

    const pctDiff50 = latestDma50 ? Number((((latestVal - latestDma50) / latestDma50) * 100).toFixed(2)) : 0;
    const pctDiff200 = latestDma200 ? Number((((latestVal - latestDma200) / latestDma200) * 100).toFixed(2)) : 0;

    // Momentum returns
    const ret1W = n >= 6 ? Number((((latestVal - indexValues[n - 6]) / indexValues[n - 6]) * 100).toFixed(2)) : 0;
    const ret1M = n >= 22 ? Number((((latestVal - indexValues[n - 22]) / indexValues[n - 22]) * 100).toFixed(2)) : 0;
    const ret3M = n >= 64 ? Number((((latestVal - indexValues[n - 64]) / indexValues[n - 64]) * 100).toFixed(2)) : 0;
    const ret1Y = n >= 251 ? Number((((latestVal - indexValues[n - 251]) / indexValues[n - 251]) * 100).toFixed(2)) : 0;

    // Trend classification
    let trend = "NEUTRAL";
    if (latestDma50 && latestDma200) {
      if (latestVal > latestDma50 && latestDma50 > latestDma200) {
        trend = "BULLISH";
      } else if (latestVal < latestDma50 && latestDma50 < latestDma200) {
        trend = "BEARISH";
      } else if (latestVal > latestDma50) {
        trend = "MODERATE_BULL";
      } else {
        trend = "MODERATE_BEAR";
      }
    }

    return {
      dates: activeDates,
      indexValues,
      dma50Series,
      dma200Series,
      constituentsAnalysis,
      metrics: {
        latestValue: latestVal,
        dma50: latestDma50,
        dma200: latestDma200,
        pctDiff50,
        pctDiff200,
        ret1W,
        ret1M,
        ret3M,
        ret1Y,
        breadthPct,
        stocksAbove50Count: stocksAbove50DmaCount,
        totalConstituents: validTickers.length,
        trend
      }
    };
  }
};

window.TechMath = TechMath;
