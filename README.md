# Indian Stock Market — Industry Trend Tracker

A lightweight web application for tracking Indian stock market industry trends with **50 DMA** and **200 DMA** daily moving averages across **120+ industries** filtered by Market Cap (Large, Mid, Small).

## Quick Start (Zero Setup)
Simply double-click **[`index.html`](file:///c:/Users/prana/OneDrive/Desktop/Pranay/sector%20trend/index.html)** in this folder to open it in your web browser (Chrome, Edge, Brave, Firefox, etc.).
- No installation of databases, Node.js, Python, or Docker required.
- Everything runs directly inside your browser.

---

## Key Features

1. **120+ Indian Industries**:
   - Covers all major NSE industries: IT, Private & PSU Banks, Defense, Capital Goods, Auto Ancillaries, Chemicals, Pharma, Real Estate, Energy, FMCG, and more.
   - Filterable by **Large Cap**, **Mid Cap**, and **Small Cap**.

2. **50 DMA & 200 DMA Trend Analysis**:
   - Equal-weighted composite industry index with 50 DMA and 200 DMA calculation.
   - Trend status badge: **Bullish**, **Bearish**, or **Neutral**.
   - Market Breadth metric: % of constituent stocks currently trading above their individual 50 DMA.
   - 1-Week, 1-Month, 3-Month, and 1-Year momentum percentage returns.

3. **Dual View Layout**:
   - **Cards View**: Grid of visual cards with DMA metric tiles, trend badges, and market breadth progress bars.
   - **Rows / Table View**: Sortable tabular financial view for scanning.

4. **Interactive Chart Modal**:
   - Visual plot of the Industry Price (Cyan), 50 DMA (Gold), and 200 DMA (Violet).
   - Timeframe toggles: 3M, 6M, 1Y, and 2Y.

5. **Constituent Editor**:
   - Add or remove stocks from any industry.
   - **Minimum 2 Years Rule**: Automatically checks that added stocks have at least 2 full years (~450 trading days) of history on NSE.
   - One-click "Reset to Default" button.
   - Custom adjustments are automatically saved in your browser's local storage.

6. **Free Market Data & Local Caching**:
   - Fetches historical price data via free Yahoo Finance API with CORS proxy failover.
   - Caches historical candles in browser **IndexedDB** so repeat visits load instantly.
