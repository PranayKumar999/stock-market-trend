# Indian Stock Market — Industry Trend Tracker

A fast, lightweight web application for tracking Indian stock market industry trends with **50 DMA** and **200 DMA** moving averages across **120+ industries**, filterable by Market Cap (Large, Mid, Small).

## Quick Start

### Option 1: Recommended (Direct Fast Access)
Double-click **`run.bat`** in this folder.
- Launches a local lightweight static server and opens the app in your default browser.
- Enables direct, high-speed connection to Yahoo Finance API with local browser caching.

### Option 2: Standalone
Double-click **`index.html`** to run directly in any modern browser.

---

## Key Features

1. **120+ Indian Master Industries**:
   - Comprehensive universe across NSE & BSE: IT, Private & PSU Banks, Defense, Capital Goods, Auto Ancillaries, Chemicals, Pharma, Real Estate, Energy, FMCG, and niche sectors.
   - Filter by **All Caps**, **Large Cap**, **Mid Cap**, and **Small Cap**.
   - Search by industry name, sector, or constituent stock symbol.
   - Interactive column header sorting: Click any table header (**1M Return**, **Trend**, **50 DMA Dist**, **200 DMA Dist**, **Breadth**, or **Industry Name**) with modern SVG dual-chevron arrows to toggle ascending/descending order.

2. **TradingView Lightweight Charts Integration**:
   - Native TradingView charting canvas with volume histogram, Basket Price (Purple), 50 DMA (Orange), and 200 DMA (White in Dark / Black in Light).
   - **Timeframe Resolution**: **1D** (Daily) and **1W** (Weekly).
   - **Range Selectors**: **1M**, **3M**, **6M**, **1Y**, **5Y**, and **ALL** with automatic data-length fitting (`fitContent`).
   - True **50 DMA & 200 DMA** calculation aligned with TradingView's *"Basic DMA's"* indicator across both Daily and Weekly charts.

3. **TradingView Light & Dark Themes**:
   - **Dark Theme**: Neutral charcoal/slate palette (`#131722` / `#1e222d`) with zero navy blue tint.
   - **Light Theme**: Clean, high-contrast TradingView light palette (`#ffffff` / `#f0f3fa`).
   - **Theme Toggle**: One-click header button (`🌙 Dark` / `☀️ Light`) with `localStorage` persistence and instant chart restyling.

4. **Dual Layout Views**:
   - **Cards View**: Visual metric cards featuring 50/200 DMA distances, trend badges (**Bullish**, **Bearish**, **Neutral**), and market breadth meters (% of constituent stocks above 50 DMA).
   - **Rows / Table View**: Financial terminal table for quick sorting and scanning.

5. **Constituent Editor & Custom Overrides**:
   - Add or remove stocks from any industry basket.
   - **Minimum 2 Years Rule**: Validates that added stocks have $\ge 2$ full years (~450 trading days) of history.
   - Supports both **NSE (`.NS`)** and primary **BSE (`.BO`)** tickers.
   - Automatically handles stock renames, demergers, and re-ticker actions.
   - One-click "Reset to Default" button.
   - Changes persist in browser `localStorage`.

6. **Free Market Data & Local Caching**:
   - Historical candle engine backed by browser **IndexedDB** (`stock_candles`).
   - Cached data loads instantly on repeat visits without network latency.
