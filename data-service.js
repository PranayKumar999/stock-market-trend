/**
 * data-service.js
 * Historical stock data fetcher & IndexedDB caching engine
 * Prioritizes direct connection to Yahoo Finance API (Zero Proxies / 0 timeouts via run.bat)
 */

class DataService {
  constructor() {
    // Database v4 ensures fresh real data
    this.dbName = "IndianStockTrendDB_v4";
    this.dbVersion = 1;
    this.db = null;
    this.memoryCache = new Map();
    this.inFlightRequests = new Map();
    this.cacheExpiryMs = 24 * 60 * 60 * 1000; // 24 hours
  }

  async initDB() {
    if (this.db) return this.db;

    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("stock_candles")) {
          db.createObjectStore("stock_candles", { keyPath: "symbol" });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.warn("IndexedDB init failed:", event.target.error);
        resolve(null);
      };
    });
  }

  normalizeSymbol(raw) {
    if (!raw) return "";
    const trimmed = raw.trim().toUpperCase();
    const isBSE = trimmed.endsWith(".BO");
    let clean = trimmed.replace(".NS", "").replace(".BO", "");

    // Exact Yahoo Finance ticker mappings for NSE/BSE
    const aliases = {
      // Renamed / Demerged companies
      "ZOMATO": "ETERNAL.NS",
      "TATAMOTORS": "TMPV.NS",
      "HPCL": "HINDPETRO.NS",
      "PBFINTECH": "POLICYBZR.NS",
      "AMARAJABAT": "ARE&M.NS",
      "UNITDSPR": "UNITDSPR.NS",
      "MCDOWELL-N": "UNITDSPR.NS",
      "LODHA": "LODHA.NS",
      "MACROTECH": "LODHA.NS",
      "MAHINDCIE": "CIEINDIA.NS",
      "TATACOFFEE": "TATACONSUM.NS",
      "TV18BRDCST": "NETWORK18.NS",
      "BARBEQUE": "UFBL.NS",
      "AKZOINDIA": "JSWDULUX.NS",
      "GUJGASLTD": "GUJENERGY.NS",
      "GUJGAS": "GUJENERGY.NS",
      "TIDEWATER": "VEEDOL.NS",
      "SEQUENT": "VIYASH.NS",
      "SHEELA": "SFL.NS",
      "AUTOMB": "ACGL.NS",
      "SERVO": "SERVOTECH.NS",
      "PASUPATI": "PASUPTAC.NS",
      "JAYBARMAR": "JAYBARMARU.NS",
      "REC": "RECLTD.NS",
      "HBLPOWER": "HBLENGINE.NS",
      "TRIL": "TARIL.NS",
      "GMDC": "GMDCLTD.NS",
      "GUJFLUORO": "FLUOROCHEM.NS",
      "DCMSRIRAM": "DCMSHRIRAM.NS",
      "MEGH": "MOL.NS",
      "CAREERP": "CPEDU.NS",
      "INDRATING": "INTLCONV.NS",
      "ROSSERLTD": "ROSSELLIND.NS",
      "PODDAR": "PODDARMENT.NS",
      "JAYAGRO": "JAYAGROGN.NS",
      "TINPLATE": "TCPLPACK.NS",
      "GSPL": "AEGISLOG.NS",

      // Official NSE ticker abbreviations
      "CITYUNIONB": "CUB.NS",
      "JUPITERWAG": "JWL.NS",
      "KALPATPOWR": "KPIL.NS",
      "FINOLEXIND": "FINPIPE.NS",
      "KAVERI": "KSCL.NS",
      "WESTCOAST": "WSTCSTPAPR.NS",
      "IGPETRO": "IGPL.NS",
      "SARDEN": "SARDAEN.NS",
      "PRATAAP": "DIAMONDYD.NS",
      "JBMMA": "JBMA.NS",
      "ZEN": "ZENTEC.NS",
      "GMRINFRA": "GMRAIRPORT.NS",
      "HITACHIENG": "POWERINDIA.NS",
      "MASTEEL": "MAITHANALL.NS",
      "SUVENPHAR": "SUVEN.NS",
      "PIRAMALPH": "PPLPHARMA.NS",
      "RHI": "RHIM.NS",
      "ASTRON": "ASTRAMICRO.NS",
      "STERLTD": "STERTOOLS.NS",
      "TATASTEELSL": "TATASTEEL.NS",
      "JMCPROJECT": "KPIL.NS",

      // Primary BSE tickers
      "HAWKINS": "HAWKINCOOK.BO",
      "SPICEJET": "SPICEJET.BO",
      "GOODRICKE": "GOODRICKE.BO"
    };

    if (aliases[clean]) {
      return aliases[clean];
    }

    return isBSE ? clean + ".BO" : clean + ".NS";
  }

  async getFromDB(symbol) {
    if (!this.db) await this.initDB();
    if (!this.db) return null;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction("stock_candles", "readonly");
        const store = tx.objectStore("stock_candles");
        const req = store.get(symbol);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async saveToDB(symbol, candles) {
    if (!this.db) await this.initDB();
    if (!this.db) return;
    try {
      const tx = this.db.transaction("stock_candles", "readwrite");
      const store = tx.objectStore("stock_candles");
      store.put({
        symbol,
        candles,
        fetchedAt: Date.now()
      });
    } catch (e) {
      console.warn("Error saving to IndexedDB:", e);
    }
  }

  isCacheValid(entry) {
    if (!entry || !entry.candles || entry.candles.length < 30) return false;
    const age = Date.now() - (entry.fetchedAt || 0);
    return age < this.cacheExpiryMs;
  }

  /**
   * Fetches real historical candles (up to 5 years of daily data)
   */
  async getStockCandles(rawSymbol, forceRefresh = false) {
    const symbol = this.normalizeSymbol(rawSymbol);

    if (!forceRefresh && this.memoryCache.has(symbol)) {
      return this.memoryCache.get(symbol);
    }

    if (this.inFlightRequests.has(symbol)) {
      return this.inFlightRequests.get(symbol);
    }

    const fetchPromise = (async () => {
      try {
        await this.initDB();

        if (!forceRefresh) {
          const cached = await this.getFromDB(symbol);
          if (cached && this.isCacheValid(cached)) {
            this.memoryCache.set(symbol, cached.candles);
            return cached.candles;
          }
        }

        // Fetch real market candles
        const candles = await this.fetchFromYahooWithFailover(symbol);

        if (candles && candles.length >= 30) {
          await this.saveToDB(symbol, candles);
          this.memoryCache.set(symbol, candles);
          return candles;
        }

        // Return stale cache if available
        const stale = await this.getFromDB(symbol);
        if (stale && stale.candles) {
          this.memoryCache.set(symbol, stale.candles);
          return stale.candles;
        }

        return null;
      } finally {
        this.inFlightRequests.delete(symbol);
      }
    })();

    this.inFlightRequests.set(symbol, fetchPromise);
    return fetchPromise;
  }

  /**
   * Prioritizes direct connection to Yahoo Finance API (Zero Proxies)
   */
  async fetchFromYahooWithFailover(symbol) {
    const q1Url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5y&interval=1d&includePrePost=false`;
    const q2Url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5y&interval=1d&includePrePost=false`;

    // 1. Direct query1 (Fastest, zero proxy latency, works via run.bat)
    try {
      const res = await fetch(q1Url, { signal: AbortSignal.timeout(5000) });
      if (res.status === 404) return null; // Invalid ticker, stop immediately
      if (res.ok) {
        const json = await res.json();
        const candles = this.parseYahooResponse(json);
        if (candles && candles.length >= 30) return candles;
      }
    } catch (e) {}

    // 2. Direct query2 (Alternative CDN direct route)
    try {
      const res = await fetch(q2Url, { signal: AbortSignal.timeout(5000) });
      if (res.status === 404) return null;
      if (res.ok) {
        const json = await res.json();
        const candles = this.parseYahooResponse(json);
        if (candles && candles.length >= 30) return candles;
      }
    } catch (e) {}

    // 3. Fallback: Codetabs proxy
    try {
      const url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(q1Url)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const json = await res.json();
        const candles = this.parseYahooResponse(json);
        if (candles && candles.length >= 30) return candles;
      }
    } catch (e) {}

    // 4. Fallback: AllOrigins JSON API
    try {
      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(q1Url)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        const json = JSON.parse(data.contents);
        const candles = this.parseYahooResponse(json);
        if (candles && candles.length >= 30) return candles;
      }
    } catch (e) {}

    return null;
  }

  parseYahooResponse(data) {
    try {
      const result = data?.chart?.result?.[0];
      if (!result) return null;

      const timestamps = result.timestamp;
      const quote = result.indicators?.quote?.[0];
      if (!timestamps || !quote || !quote.close) return null;

      const closes = quote.close;
      const opens = quote.open || closes;
      const highs = quote.high || closes;
      const lows = quote.low || closes;
      const volumes = quote.volume || [];

      const candles = [];
      for (let i = 0; i < timestamps.length; i++) {
        const close = closes[i];
        if (close !== null && close !== undefined && !isNaN(close)) {
          const d = new Date(timestamps[i] * 1000);
          const dateStr = d.toISOString().split("T")[0];
          candles.push({
            date: dateStr,
            open: Number((opens[i] ?? close).toFixed(2)),
            high: Number((highs[i] ?? close).toFixed(2)),
            low: Number((lows[i] ?? close).toFixed(2)),
            close: Number(close.toFixed(2)),
            volume: Number(volumes[i] ?? 0)
          });
        }
      }

      return candles.length > 0 ? candles : null;
    } catch (e) {
      return null;
    }
  }

  async validateTickerTwoYearsHistory(rawSymbol) {
    const symbol = this.normalizeSymbol(rawSymbol);
    try {
      const candles = await this.getStockCandles(symbol, true);
      if (!candles || candles.length === 0) {
        return {
          valid: false,
          candleCount: 0,
          reason: `Could not reach market data for "${symbol}". Check ticker or launch via run.bat.`
        };
      }

      if (candles.length < 450) {
        return {
          valid: false,
          candleCount: candles.length,
          reason: `Ticker "${symbol}" has only ${candles.length} trading days of history. Minimum 2 years (~450 trading days) required.`
        };
      }

      return {
        valid: true,
        candleCount: candles.length,
        symbol,
        latestPrice: candles[candles.length - 1].close
      };
    } catch (err) {
      return {
        valid: false,
        candleCount: 0,
        reason: `Validation failed: ${err.message}`
      };
    }
  }

  async clearCache() {
    this.memoryCache.clear();
    if (this.db) {
      const tx = this.db.transaction("stock_candles", "readwrite");
      tx.objectStore("stock_candles").clear();
    }
  }
}

window.DataService = new DataService();
