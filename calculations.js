/**
 * calculations.js
 * Technical calculations engine matching TradingView formula standards
 * - Arithmetic basket average: (StockA + StockB + StockC) / N
 * - Common start date alignment (cuts off prior to newest stock listing date, matching TradingView)
 * - 1D (Daily) and 1W (Weekly) aggregations
 * - Compatible with TradingView Lightweight Charts format ({ time, value })
 */

const TechMath = {
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
   * Aggregates daily series into weekly bars (Friday close & sum volume)
   */
  convertToWeekly(dailyDates, dailyValues, dailyVolumes) {
    const weeklyDates = [];
    const weeklyValues = [];
    const weeklyVolumes = [];

    let currentWeekKey = null;
    let weekClose = null;
    let weekVol = 0;
    let lastDate = null;

    for (let i = 0; i < dailyDates.length; i++) {
      const dateStr = dailyDates[i];
      const val = dailyValues[i];
      const vol = dailyVolumes[i] || 0;
      const d = new Date(dateStr);

      const startOfYear = new Date(d.getFullYear(), 0, 1);
      const weekNo = Math.ceil((((d - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
      const weekKey = `${d.getFullYear()}-W${weekNo}`;

      if (currentWeekKey !== null && currentWeekKey !== weekKey) {
        weeklyDates.push(lastDate);
        weeklyValues.push(Number(weekClose.toFixed(2)));
        weeklyVolumes.push(weekVol);
        weekVol = 0;
      }

      currentWeekKey = weekKey;
      weekClose = val;
      weekVol += vol;
      lastDate = dateStr;
    }

    if (currentWeekKey !== null && weekClose !== null) {
      weeklyDates.push(lastDate);
      weeklyValues.push(Number(weekClose.toFixed(2)));
      weeklyVolumes.push(weekVol);
    }

    return { weeklyDates, weeklyValues, weeklyVolumes };
  },

  /**
   * Computes TradingView basket average:
   * (P1 + P2 + ... + Pn) / n
   * Strictly aligns to the date where ALL constituent stocks are listed.
   */
  computeIndustryTrend(tickers, stockCandlesMap) {
    const validTickers = [];
    const tickerDateMap = {};
    const tickerVolMap = {};

    tickers.forEach(symbol => {
      const candles = stockCandlesMap[symbol];
      if (candles && Array.isArray(candles) && candles.length >= 100) {
        validTickers.push(symbol);
        const pMap = new Map();
        const vMap = new Map();
        candles.forEach(c => {
          if (c && c.date && typeof c.close === 'number' && !isNaN(c.close)) {
            pMap.set(c.date, c.close);
            vMap.set(c.date, c.volume || 0);
          }
        });
        tickerDateMap[symbol] = pMap;
        tickerVolMap[symbol] = vMap;
      }
    });

    if (validTickers.length === 0) return null;

    // 1. Find common start date where ALL stocks exist (TradingView behavior)
    let commonStartDate = "";
    validTickers.forEach(sym => {
      const dates = Array.from(tickerDateMap[sym].keys()).sort();
      if (dates.length > 0) {
        if (!commonStartDate || dates[0] > commonStartDate) {
          commonStartDate = dates[0];
        }
      }
    });

    // 2. Gather all chronological dates >= commonStartDate
    const allDatesSet = new Set();
    validTickers.forEach(sym => {
      for (const d of tickerDateMap[sym].keys()) {
        if (d >= commonStartDate) {
          allDatesSet.add(d);
        }
      }
    });
    const sortedDates = Array.from(allDatesSet).sort();

    if (sortedDates.length < 30) return null;

    const dailyValues = [];
    const dailyVolumes = [];
    const dailyDates = [];

    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      let sumPrice = 0;
      let sumVol = 0;
      let count = 0;

      validTickers.forEach(sym => {
        const p = tickerDateMap[sym].get(date);
        const v = tickerVolMap[sym].get(date);
        if (p !== undefined) {
          sumPrice += p;
          sumVol += (v || 0);
          count++;
        }
      });

      // Require all constituent stocks to have price on this date
      if (count === validTickers.length) {
        const avgPrice = Number((sumPrice / count).toFixed(2));
        const avgVol = Math.round(sumVol / count);
        dailyValues.push(avgPrice);
        dailyVolumes.push(avgVol);
        dailyDates.push(date);
      }
    }

    if (dailyValues.length === 0) return null;

    // Daily SMAs
    const daily50DMA = this.calculateSMA(dailyValues, 50);
    const daily200DMA = this.calculateSMA(dailyValues, 200);

    // Weekly conversion (matches TradingView "1W" timeframe)
    const { weeklyDates, weeklyValues, weeklyVolumes } = this.convertToWeekly(dailyDates, dailyValues, dailyVolumes);

    // Format for TradingView Lightweight Charts
    const tvDailyPrice = [];
    const tvDaily50 = [];
    const tvDaily200 = [];
    const tvDailyVol = [];

    const d50DateMap = new Map();
    const d200DateMap = new Map();

    for (let i = 0; i < dailyDates.length; i++) {
      const time = dailyDates[i];
      const val = dailyValues[i];
      const vol = dailyVolumes[i];
      const isUp = i === 0 || val >= dailyValues[i - 1];

      tvDailyPrice.push({ time, value: val });
      if (daily50DMA[i] !== null) {
        tvDaily50.push({ time, value: daily50DMA[i] });
        d50DateMap.set(time, daily50DMA[i]);
      }
      if (daily200DMA[i] !== null) {
        tvDaily200.push({ time, value: daily200DMA[i] });
        d200DateMap.set(time, daily200DMA[i]);
      }
      tvDailyVol.push({
        time,
        value: vol,
        color: isUp ? "rgba(8, 153, 129, 0.65)" : "rgba(242, 54, 69, 0.65)"
      });
    }

    // Weekly series: displays 50 DMA & 200 DMA at each weekly close (matching TradingView "Basic DMA's")
    const tvWeeklyPrice = [];
    const tvWeekly50 = [];
    const tvWeekly200 = [];
    const tvWeeklyVol = [];

    for (let i = 0; i < weeklyDates.length; i++) {
      const time = weeklyDates[i];
      const val = weeklyValues[i];
      const vol = weeklyVolumes[i];
      const isUp = i === 0 || val >= weeklyValues[i - 1];

      tvWeeklyPrice.push({ time, value: val });
      const d50Val = d50DateMap.get(time);
      if (d50Val !== undefined) tvWeekly50.push({ time, value: d50Val });
      const d200Val = d200DateMap.get(time);
      if (d200Val !== undefined) tvWeekly200.push({ time, value: d200Val });
      tvWeeklyVol.push({
        time,
        value: vol,
        color: isUp ? "rgba(8, 153, 129, 0.65)" : "rgba(242, 54, 69, 0.65)"
      });
    }

    // Individual Constituents Breakdown
    const constituentsAnalysis = [];
    let stocksAbove50Count = 0;

    validTickers.forEach(sym => {
      const candles = stockCandlesMap[sym];
      const closes = candles.map(c => c.close);
      const stock50 = this.calculateSMA(closes, 50);
      const stock200 = this.calculateSMA(closes, 200);

      const latestPrice = closes[closes.length - 1];
      const latest50 = stock50[stock50.length - 1];
      const latest200 = stock200[stock200.length - 1];

      const isAbove50 = latest50 ? latestPrice >= latest50 : false;
      const isAbove200 = latest200 ? latestPrice >= latest200 : false;

      if (isAbove50) stocksAbove50Count++;

      const pctDiff50 = latest50 ? Number((((latestPrice - latest50) / latest50) * 100).toFixed(2)) : 0;
      const pctDiff200 = latest200 ? Number((((latestPrice - latest200) / latest200) * 100).toFixed(2)) : 0;

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
      ? Number(((stocksAbove50Count / validTickers.length) * 100).toFixed(1)) 
      : 0;

    // Latest Summary Metrics
    const dn = dailyValues.length;
    const latestVal = dailyValues[dn - 1];
    const latest50 = daily50DMA[dn - 1];
    const latest200 = daily200DMA[dn - 1];

    const pctDiff50 = latest50 ? Number((((latestVal - latest50) / latest50) * 100).toFixed(2)) : 0;
    const pctDiff200 = latest200 ? Number((((latestVal - latest200) / latest200) * 100).toFixed(2)) : 0;

    const ret1W = dn >= 6 ? Number((((latestVal - dailyValues[dn - 6]) / dailyValues[dn - 6]) * 100).toFixed(2)) : 0;
    const ret1M = dn >= 22 ? Number((((latestVal - dailyValues[dn - 22]) / dailyValues[dn - 22]) * 100).toFixed(2)) : 0;
    const ret3M = dn >= 64 ? Number((((latestVal - dailyValues[dn - 64]) / dailyValues[dn - 64]) * 100).toFixed(2)) : 0;
    const ret1Y = dn >= 252 ? Number((((latestVal - dailyValues[dn - 252]) / dailyValues[dn - 252]) * 100).toFixed(2)) : 0;

    let trend = "NEUTRAL";
    if (latest50 && latest200) {
      if (latestVal > latest50 && latest50 > latest200) trend = "BULLISH";
      else if (latestVal < latest50 && latest50 < latest200) trend = "BEARISH";
      else if (latestVal > latest50) trend = "MODERATE_BULL";
      else trend = "MODERATE_BEAR";
    }

    return {
      daily: {
        dates: dailyDates,
        values: dailyValues,
        volumes: dailyVolumes,
        tvPrice: tvDailyPrice,
        tvDma50: tvDaily50,
        tvDma200: tvDaily200,
        tvVolume: tvDailyVol
      },
      weekly: {
        dates: weeklyDates,
        values: weeklyValues,
        volumes: weeklyVolumes,
        tvPrice: tvWeeklyPrice,
        tvDma50: tvWeekly50,
        tvDma200: tvWeekly200,
        tvVolume: tvWeeklyVol
      },
      commonStartDate,
      constituentsAnalysis,
      metrics: {
        latestValue: latestVal,
        dma50: latest50,
        dma200: latest200,
        pctDiff50,
        pctDiff200,
        ret1W,
        ret1M,
        ret3M,
        ret1Y,
        breadthPct,
        stocksAbove50Count,
        totalConstituents: validTickers.length,
        trend
      }
    };
  }
};

window.TechMath = TechMath;
