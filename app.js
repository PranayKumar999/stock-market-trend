/**
 * app.js
 * Main UI Controller with Full Eager Loading & TradingView Lightweight Charts integration
 */

class IndustryTrendApp {
  constructor() {
    this.industries = [];
    this.customOverrides = {};
    this.industryDataCache = new Map();
    this.stockCandlesMap = {};

    this.currentCapFilter = "All";
    this.searchQuery = "";
    this.sortColumn = "ret1m";
    this.sortDirection = "desc";
    this.currentView = localStorage.getItem("view_mode") || "cards";
    this.theme = localStorage.getItem("preferred_theme") || "dark";

    this.activeChartIndustry = null;
    this.chartInterval = "1W"; // "1D" | "1W" (Default 1W like TradingView)
    this.chartRange = "5Y"; // "1M" | "3M" | "6M" | "1Y" | "5Y" | "ALL"
    this.tvChart = null;
    this.priceSeries = null;
    this.dma50Series = null;
    this.dma200Series = null;
    this.volumeSeries = null;

    this.init();
  }

  async init() {
    this.applyTheme(this.theme);
    this.loadCustomOverrides();
    this.industries = this.mergeIndustries();
    this.setupEventListeners();
    this.renderViewSwitcher();
    this.renderIndustries();

    // Eagerly process all industries (No lazy loading)
    this.syncAllIndustries();
  }

  loadCustomOverrides() {
    try {
      const stored = localStorage.getItem("custom_industry_constituents");
      if (stored) this.customOverrides = JSON.parse(stored);
    } catch (e) {
      this.customOverrides = {};
    }
  }

  saveCustomOverrides() {
    try {
      localStorage.setItem("custom_industry_constituents", JSON.stringify(this.customOverrides));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  mergeIndustries() {
    const defaults = window.DEFAULT_INDUSTRIES || [];
    return defaults.map(ind => {
      if (this.customOverrides[ind.id]) {
        return { ...ind, tickers: [...this.customOverrides[ind.id]] };
      }
      return { ...ind, tickers: [...ind.tickers] };
    });
  }

  setupEventListeners() {
    // Market cap filters
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCapFilter = btn.dataset.cap;
        this.renderIndustries();
      });
    });

    // Search input
    document.getElementById("searchInput")?.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderIndustries();
    });

    // View toggles
    document.getElementById("viewCardsBtn")?.addEventListener("click", () => this.setView("cards"));
    document.getElementById("viewRowsBtn")?.addEventListener("click", () => this.setView("rows"));

    // Theme toggle (TradingView Dark / Light)
    document.getElementById("themeToggleBtn")?.addEventListener("click", () => {
      const nextTheme = this.theme === "dark" ? "light" : "dark";
      this.applyTheme(nextTheme);
    });

    // Global refresh / sync
    document.getElementById("refreshBtn")?.addEventListener("click", async () => {
      await window.DataService.clearCache();
      this.industryDataCache.clear();
      this.stockCandlesMap = {};
      this.syncAllIndustries(true);
    });

    // Chart Modal controls
    document.getElementById("chartModalClose")?.addEventListener("click", () => this.closeChartModal());
    document.getElementById("chartModal")?.addEventListener("click", (e) => {
      if (e.target.id === "chartModal") this.closeChartModal();
    });

    // Interval toggle: 1D vs 1W
    document.querySelectorAll(".interval-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".interval-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.chartInterval = btn.dataset.interval;
        this.renderTradingViewChart();
      });
    });

    // Range selector: 1M, 3M, 6M, 1Y, 5Y, ALL
    document.querySelectorAll(".range-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".range-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.chartRange = btn.dataset.range;
        this.applyRangeSelection();
      });
    });

    // Constituent Editor Modal controls
    document.getElementById("editorModalClose")?.addEventListener("click", () => this.closeEditorModal());
    document.getElementById("editorModal")?.addEventListener("click", (e) => {
      if (e.target.id === "editorModal") this.closeEditorModal();
    });

    document.getElementById("addStockBtn")?.addEventListener("click", () => this.handleAddStock());
    document.getElementById("newStockInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleAddStock();
      }
    });

    document.getElementById("resetDefaultsBtn")?.addEventListener("click", () => this.handleResetDefaults());
  }

  setView(mode) {
    this.currentView = mode;
    localStorage.setItem("view_mode", mode);
    this.renderViewSwitcher();
    this.renderIndustries();
  }

  renderViewSwitcher() {
    const cardsBtn = document.getElementById("viewCardsBtn");
    const rowsBtn = document.getElementById("viewRowsBtn");
    if (this.currentView === "cards") {
      cardsBtn?.classList.add("active");
      rowsBtn?.classList.remove("active");
    } else {
      rowsBtn?.classList.add("active");
      cardsBtn?.classList.remove("active");
    }
  }

  /**
   * Eager background sync for all industries (No lazy loading blanks)
   */
  async syncAllIndustries(forceRefresh = false) {
    const progressContainer = document.getElementById("progressContainer");
    const progressBarFill = document.getElementById("progressBarFill");
    const progressStatus = document.getElementById("progressStatus");

    if (progressContainer) progressContainer.style.display = "block";

    const allSymbols = new Set();
    this.industries.forEach(ind => ind.tickers.forEach(t => allSymbols.add(t)));
    const symbolsArray = Array.from(allSymbols);

    let completed = 0;
    const total = symbolsArray.length;
    const batchSize = 6;

    for (let i = 0; i < symbolsArray.length; i += batchSize) {
      const batch = symbolsArray.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (symbol) => {
          try {
            const candles = await window.DataService.getStockCandles(symbol, forceRefresh);
            if (candles) this.stockCandlesMap[symbol] = candles;
          } finally {
            completed++;
            const pct = Math.round((completed / total) * 100);
            if (progressBarFill) progressBarFill.style.width = `${pct}%`;
            if (progressStatus) progressStatus.textContent = `Syncing stocks: ${completed} / ${total} (${pct}%)`;
          }
        })
      );

      this.recomputeAllIndustries();
      this.renderIndustries();
      this.renderStatsBanner();
    }

    if (progressStatus) progressStatus.textContent = `All ${total} stocks synchronized.`;
    setTimeout(() => {
      if (progressContainer) progressContainer.style.display = "none";
    }, 1000);

    const syncStatusEl = document.getElementById("syncStatusText");
    if (syncStatusEl) syncStatusEl.textContent = `Live Synced (${total} Stocks)`;
  }

  recomputeAllIndustries() {
    this.industries.forEach(ind => {
      const result = window.TechMath.computeIndustryTrend(ind.tickers, this.stockCandlesMap);
      if (result) this.industryDataCache.set(ind.id, result);
    });
  }

  getFilteredAndSortedIndustries() {
    return this.industries
      .filter(ind => {
        if (this.currentCapFilter !== "All" && ind.marketCap !== this.currentCapFilter) return false;
        if (this.searchQuery) {
          const matchName = ind.name.toLowerCase().includes(this.searchQuery);
          const matchSec = ind.sector.toLowerCase().includes(this.searchQuery);
          const matchTick = ind.tickers.some(t => t.toLowerCase().includes(this.searchQuery));
          if (!matchName && !matchSec && !matchTick) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dir = this.sortDirection === "asc" ? 1 : -1;
        if (this.sortColumn === "name") {
          return dir * a.name.localeCompare(b.name);
        }
        if (this.sortColumn === "cap") {
          const capRank = { "Large": 3, "Mid": 2, "Small": 1 };
          return dir * ((capRank[a.marketCap] || 0) - (capRank[b.marketCap] || 0));
        }
        if (this.sortColumn === "stocks") {
          return dir * (a.tickers.length - b.tickers.length);
        }

        const dataA = this.industryDataCache.get(a.id);
        const dataB = this.industryDataCache.get(b.id);
        if (!dataA && !dataB) return 0;
        if (!dataA) return 1;
        if (!dataB) return -1;

        if (this.sortColumn === "trend") {
          const score = { "BULLISH": 5, "MODERATE_BULL": 4, "NEUTRAL": 3, "MODERATE_BEAR": 2, "BEARISH": 1 };
          const sA = score[dataA.metrics?.trend] || 0;
          const sB = score[dataB.metrics?.trend] || 0;
          if (sA !== sB) return dir * (sA - sB);
          return dir * ((dataA.metrics?.ret1M || 0) - (dataB.metrics?.ret1M || 0));
        }

        if (this.sortColumn === "ret1m") {
          return dir * ((dataA.metrics?.ret1M || 0) - (dataB.metrics?.ret1M || 0));
        }

        if (this.sortColumn === "dma50") {
          return dir * ((dataA.metrics?.pctDiff50 || 0) - (dataB.metrics?.pctDiff50 || 0));
        }

        if (this.sortColumn === "dma200") {
          return dir * ((dataA.metrics?.pctDiff200 || 0) - (dataB.metrics?.pctDiff200 || 0));
        }

        if (this.sortColumn === "breadth") {
          return dir * ((dataA.metrics?.breadthPct || 0) - (dataB.metrics?.breadthPct || 0));
        }

        return 0;
      });
  }

  renderStatsBanner() {
    const list = Array.from(this.industryDataCache.values());
    let bullishCount = 0;
    let totalBreadth = 0;
    let topIndustry = null;
    let topReturn = -Infinity;

    this.industries.forEach(ind => {
      const data = this.industryDataCache.get(ind.id);
      if (data && data.metrics) {
        if (data.metrics.trend.includes("BULL")) bullishCount++;
        totalBreadth += data.metrics.breadthPct;
        if (data.metrics.ret1M > topReturn) {
          topReturn = data.metrics.ret1M;
          topIndustry = ind.name;
        }
      }
    });

    const totalCalculated = list.length;
    const bullishPct = totalCalculated > 0 ? Math.round((bullishCount / totalCalculated) * 100) : "--";
    const avgBreadth = totalCalculated > 0 ? Math.round(totalBreadth / totalCalculated) : "--";

    document.getElementById("statTotalIndustries").textContent = `${this.industries.length} Industries`;
    document.getElementById("statBullishPct").textContent = totalCalculated > 0 ? `${bullishPct}% Bullish` : "--";
    document.getElementById("statAvgBreadth").textContent = totalCalculated > 0 ? `${avgBreadth}% above 50 DMA` : "--";
    document.getElementById("statTopIndustry").textContent = topIndustry ? `${topIndustry} (${topReturn > 0 ? '+' : ''}${topReturn}%)` : "--";
  }

  renderIndustries() {
    const container = document.getElementById("industriesContainer");
    if (!container) return;

    const filtered = this.getFilteredAndSortedIndustries();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No industries match your search criteria</h3>
          <p>Try clearing search keywords or changing Market Cap filters.</p>
        </div>
      `;
      return;
    }

    if (this.currentView === "cards") {
      container.innerHTML = `
        <div class="industries-grid">
          ${filtered.map(ind => this.createCardHTML(ind)).join("")}
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="table-wrapper">
          <table class="market-table">
            <thead>
              <tr>
                <th class="sortable-th ${this.sortColumn === 'name' ? 'active-th' : ''}" data-sort="name">
                  <div class="th-content">
                    <span>Industry Name</span>
                    ${this.getSortChevronHTML('name')}
                  </div>
                </th>
                <th class="sortable-th ${this.sortColumn === 'cap' ? 'active-th' : ''}" data-sort="cap">
                  <div class="th-content">
                    <span>Cap</span>
                    ${this.getSortChevronHTML('cap')}
                  </div>
                </th>
                <th class="sortable-th ${this.sortColumn === 'trend' ? 'active-th' : ''}" data-sort="trend">
                  <div class="th-content">
                    <span>Trend</span>
                    ${this.getSortChevronHTML('trend')}
                  </div>
                </th>
                <th class="sortable-th ${this.sortColumn === 'dma50' ? 'active-th' : ''}" data-sort="dma50">
                  <div class="th-content">
                    <span>50 DMA Dist</span>
                    ${this.getSortChevronHTML('dma50')}
                  </div>
                </th>
                <th class="sortable-th ${this.sortColumn === 'dma200' ? 'active-th' : ''}" data-sort="dma200">
                  <div class="th-content">
                    <span>200 DMA Dist</span>
                    ${this.getSortChevronHTML('dma200')}
                  </div>
                </th>
                <th class="sortable-th ${this.sortColumn === 'ret1m' ? 'active-th' : ''}" data-sort="ret1m">
                  <div class="th-content">
                    <span>1M Return</span>
                    ${this.getSortChevronHTML('ret1m')}
                  </div>
                </th>
                <th class="sortable-th ${this.sortColumn === 'breadth' ? 'active-th' : ''}" data-sort="breadth">
                  <div class="th-content">
                    <span>Breadth (> 50 DMA)</span>
                    ${this.getSortChevronHTML('breadth')}
                  </div>
                </th>
                <th class="sortable-th ${this.sortColumn === 'stocks' ? 'active-th' : ''}" data-sort="stocks">
                  <div class="th-content">
                    <span>Stocks</span>
                    ${this.getSortChevronHTML('stocks')}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(ind => this.createRowHTML(ind)).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    this.attachCardEventListeners();
  }

  getSortChevronHTML(columnKey) {
    const isActive = this.sortColumn === columnKey;
    const directionClass = isActive ? this.sortDirection : "";
    return `
      <span class="sort-icon-wrapper ${isActive ? 'active-sort ' + directionClass : ''}">
        <svg class="sort-chevron-icon" width="9" height="13" viewBox="0 0 9 13" fill="none">
          <path class="chevron-up" d="M1.5 4.5L4.5 1.5L7.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="chevron-down" d="M1.5 8.5L4.5 11.5L7.5 8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    `;
  }

  createCardHTML(ind) {
    const data = this.industryDataCache.get(ind.id);
    const metrics = data?.metrics;

    const capClass = `badge-${ind.marketCap.toLowerCase()}`;
    const trend = metrics?.trend || "SYNCING";
    const trendBadgeClass = trend.includes("BULL") ? "badge-bullish" : trend.includes("BEAR") ? "badge-bearish" : "badge-neutral";

    const dma50Diff = metrics ? `${metrics.pctDiff50 >= 0 ? '+' : ''}${metrics.pctDiff50}%` : "--";
    const dma200Diff = metrics ? `${metrics.pctDiff200 >= 0 ? '+' : ''}${metrics.pctDiff200}%` : "--";
    const dma50Val = metrics?.dma50 ? `₹${metrics.dma50}` : "--";
    const dma200Val = metrics?.dma200 ? `₹${metrics.dma200}` : "--";
    const ret1M = metrics ? `${metrics.ret1M >= 0 ? '+' : ''}${metrics.ret1M}%` : "--";
    const breadthPct = metrics ? `${metrics.breadthPct}%` : "0%";

    const chips = ind.tickers.map(t => `<span class="stock-chip">${t.replace('.NS', '')}</span>`).join("");

    return `
      <div class="industry-card" data-id="${ind.id}">
        <div class="card-top">
          <div class="card-title-group">
            <h3 class="industry-name">${ind.name}</h3>
            <p class="industry-desc">${ind.description}</p>
          </div>
          <span class="badge ${capClass}">${ind.marketCap} Cap</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="badge ${trendBadgeClass}">${trend.replace('_', ' ')}</span>
          <span style="font-size:12px; font-weight:600; color:var(--text-secondary);">
            1M Return: <strong class="${metrics?.ret1M >= 0 ? 'metric-positive' : 'metric-negative'}">${ret1M}</strong>
          </span>
        </div>

        <div class="dma-metrics-grid">
          <div class="dma-metric-item">
            <div class="dma-metric-label">
              <span class="dot-indicator dot-50"></span> 50 DMA
            </div>
            <div class="dma-metric-value ${metrics?.pctDiff50 >= 0 ? 'metric-positive' : 'metric-negative'}">
              ${dma50Diff}
            </div>
            <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">${dma50Val}</span>
          </div>

          <div class="dma-metric-item">
            <div class="dma-metric-label">
              <span class="dot-indicator dot-200"></span> 200 DMA
            </div>
            <div class="dma-metric-value ${metrics?.pctDiff200 >= 0 ? 'metric-positive' : 'metric-negative'}">
              ${dma200Diff}
            </div>
            <span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">${dma200Val}</span>
          </div>
        </div>

        <div class="breadth-meter">
          <div class="breadth-label-group">
            <span>Market Breadth (> 50 DMA)</span>
            <strong>${breadthPct}</strong>
          </div>
          <div class="breadth-bar-track">
            <div class="breadth-bar-fill" style="width: ${breadthPct}"></div>
          </div>
        </div>

        <div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:4px;">Constituent Stocks (${ind.tickers.length}):</div>
          <div class="constituents-preview">${chips}</div>
        </div>

        <div class="card-actions">
          <button class="btn btn-primary btn-sm view-chart-btn" data-id="${ind.id}">
            📊 Chart (50/200 DMA)
          </button>
          <button class="btn btn-sm edit-stocks-btn" data-id="${ind.id}">
            ⚙️ Edit Stocks
          </button>
        </div>
      </div>
    `;
  }

  createRowHTML(ind) {
    const data = this.industryDataCache.get(ind.id);
    const metrics = data?.metrics;
    const capClass = `badge-${ind.marketCap.toLowerCase()}`;
    const trend = metrics?.trend || "SYNCING";
    const trendBadgeClass = trend.includes("BULL") ? "badge-bullish" : trend.includes("BEAR") ? "badge-bearish" : "badge-neutral";

    return `
      <tr data-id="${ind.id}">
        <td>
          <div class="table-industry-title">${ind.name}</div>
          <span style="font-size:11px; color:var(--text-muted);">${ind.sector}</span>
        </td>
        <td><span class="badge ${capClass}">${ind.marketCap}</span></td>
        <td><span class="badge ${trendBadgeClass}">${trend.replace('_', ' ')}</span></td>
        <td class="table-num ${metrics?.pctDiff50 >= 0 ? 'metric-positive' : 'metric-negative'}">
          ${metrics ? `${metrics.pctDiff50 >= 0 ? '+' : ''}${metrics.pctDiff50}%` : '--'}
        </td>
        <td class="table-num ${metrics?.pctDiff200 >= 0 ? 'metric-positive' : 'metric-negative'}">
          ${metrics ? `${metrics.pctDiff200 >= 0 ? '+' : ''}${metrics.pctDiff200}%` : '--'}
        </td>
        <td class="table-num ${metrics?.ret1M >= 0 ? 'metric-positive' : 'metric-negative'}">
          ${metrics ? `${metrics.ret1M >= 0 ? '+' : ''}${metrics.ret1M}%` : '--'}
        </td>
        <td class="table-num">${metrics ? `${metrics.breadthPct}%` : '--'}</td>
        <td><span class="stock-chip">${ind.tickers.length} stocks</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-primary btn-sm view-chart-btn" data-id="${ind.id}">Chart</button>
            <button class="btn btn-sm edit-stocks-btn" data-id="${ind.id}">Edit</button>
          </div>
        </td>
      </tr>
    `;
  }

  attachCardEventListeners() {
    document.querySelectorAll(".view-chart-btn").forEach(btn => {
      btn.onclick = () => this.openChartModal(btn.dataset.id);
    });

    document.querySelectorAll(".edit-stocks-btn").forEach(btn => {
      btn.onclick = () => this.openEditorModal(btn.dataset.id);
    });

    document.querySelectorAll(".sortable-th").forEach(th => {
      th.onclick = () => {
        const col = th.dataset.sort;
        if (this.sortColumn === col) {
          this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
        } else {
          this.sortColumn = col;
          this.sortDirection = (col === "name" || col === "cap") ? "asc" : "desc";
        }
        this.renderIndustries();
      };
    });
  }

  /* ==========================================================================
     TRADINGVIEW LIGHTWEIGHT CHARTS INTEGRATION
     ========================================================================== */
  openChartModal(industryId) {
    const ind = this.industries.find(i => i.id === industryId);
    if (!ind) return;

    this.activeChartIndustry = ind;
    const modal = document.getElementById("chartModal");
    if (!modal) return;

    const data = this.industryDataCache.get(ind.id);
    const metrics = data?.metrics;

    document.getElementById("chartModalTitle").textContent = ind.name;
    const formulaText = `(${ind.tickers.map(t => t.replace('.NS', '')).join('+')})/${ind.tickers.length}`;
    document.getElementById("chartModalDesc").textContent = `TradingView Formula: ${formulaText} • ${ind.marketCap} Cap • ${ind.sector}`;

    document.getElementById("cStatPrice").textContent = metrics ? `₹${metrics.latestValue}` : "--";
    document.getElementById("cStatDma50").textContent = metrics ? `₹${metrics.dma50}` : "--";
    document.getElementById("cStatDma200").textContent = metrics ? `₹${metrics.dma200}` : "--";

    const d50El = document.getElementById("cStatDist50");
    d50El.textContent = metrics ? `${metrics.pctDiff50 >= 0 ? '+' : ''}${metrics.pctDiff50}%` : "--";
    d50El.className = `val ${metrics?.pctDiff50 >= 0 ? 'metric-positive' : 'metric-negative'}`;

    const d200El = document.getElementById("cStatDist200");
    d200El.textContent = metrics ? `${metrics.pctDiff200 >= 0 ? '+' : ''}${metrics.pctDiff200}%` : "--";
    d200El.className = `val ${metrics?.pctDiff200 >= 0 ? 'metric-positive' : 'metric-negative'}`;

    document.getElementById("cStatBreadth").textContent = metrics ? `${metrics.breadthPct}% (${metrics.stocksAbove50Count}/${metrics.totalConstituents})` : "--";

    modal.classList.add("active");

    // Initialize or render chart
    setTimeout(() => {
      this.renderTradingViewChart();
    }, 50);
  }

  closeChartModal() {
    document.getElementById("chartModal")?.classList.remove("active");
    if (this.tvChart) {
      this.tvChart.remove();
      this.tvChart = null;
    }
    this.activeChartIndustry = null;
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("preferred_theme", theme);
    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
      btn.innerHTML = theme === "dark" ? "🌙 Dark" : "☀️ Light";
    }
    if (this.tvChart && this.activeChartIndustry) {
      this.renderTradingViewChart();
    }
  }

  renderTradingViewChart() {
    const ind = this.activeChartIndustry;
    if (!ind) return;

    const data = this.industryDataCache.get(ind.id);
    const container = document.querySelector(".chart-canvas-container");
    if (!container || !data) return;

    container.innerHTML = ""; // Clear canvas container

    if (!window.LightweightCharts) {
      container.innerHTML = `<div style="padding:40px; text-align:center; color:#ef4444;">TradingView Lightweight Charts library failed to load from CDN.</div>`;
      return;
    }

    const isDark = (document.documentElement.getAttribute("data-theme") || "dark") === "dark";
    const chartBg = isDark ? "#131722" : "#ffffff";
    const chartText = isDark ? "#787b86" : "#787b86";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)";
    const borderColor = isDark ? "#2a2e39" : "#e0e3eb";

    // 1. Create TradingView Chart instance
    this.tvChart = window.LightweightCharts.createChart(container, {
      width: container.clientWidth || 800,
      height: container.clientHeight || 420,
      layout: {
        background: { type: 'solid', color: chartBg },
        textColor: chartText
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor }
      },
      crosshair: {
        mode: window.LightweightCharts.CrosshairMode ? window.LightweightCharts.CrosshairMode.Normal : 1
      },
      rightPriceScale: {
        borderColor: borderColor
      },
      timeScale: {
        borderColor: borderColor,
        timeVisible: true
      }
    });

    // Universal Series creation adapter (supports Lightweight Charts v3, v4 and v5)
    const addLine = (opts) => {
      if (typeof this.tvChart.addSeries === "function" && window.LightweightCharts.LineSeries) {
        return this.tvChart.addSeries(window.LightweightCharts.LineSeries, opts);
      }
      if (typeof this.tvChart.addLineSeries === "function") {
        return this.tvChart.addLineSeries(opts);
      }
      throw new Error("Unable to create LineSeries");
    };

    const addHistogram = (opts) => {
      if (typeof this.tvChart.addSeries === "function" && window.LightweightCharts.HistogramSeries) {
        return this.tvChart.addSeries(window.LightweightCharts.HistogramSeries, opts);
      }
      if (typeof this.tvChart.addHistogramSeries === "function") {
        return this.tvChart.addHistogramSeries(opts);
      }
      throw new Error("Unable to create HistogramSeries");
    };

    // 2. Add Volume Histogram (bottom overlay)
    this.volumeSeries = addHistogram({
      priceFormat: { type: "volume" },
      priceScaleId: ""
    });
    this.volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.80,
        bottom: 0
      }
    });

    // 3. Add 200 DMA Line (Black in Light mode, White in Dark mode like TradingView)
    this.dma200Series = addLine({
      color: isDark ? "#ffffff" : "#131722",
      lineWidth: 2,
      title: "200 DMA"
    });

    // 4. Add 50 DMA Line (Orange/Gold solid line like TradingView)
    this.dma50Series = addLine({
      color: "#ff9800",
      lineWidth: 2,
      title: "50 DMA"
    });

    // 5. Add Basket Price Line (Purple, matching TradingView)
    this.priceSeries = addLine({
      color: "#a855f7",
      lineWidth: 2.2,
      title: "Basket Price"
    });

    // Feed dataset according to selected Interval (1D vs 1W)
    const series = this.chartInterval === "1W" ? data.weekly : data.daily;
    if (series.tvPrice && series.tvPrice.length > 0) {
      this.priceSeries.setData(series.tvPrice);
    }
    if (series.tvDma50 && series.tvDma50.length > 0) {
      this.dma50Series.setData(series.tvDma50);
    }
    if (series.tvDma200 && series.tvDma200.length > 0) {
      this.dma200Series.setData(series.tvDma200);
    }
    if (series.tvVolume && series.tvVolume.length > 0) {
      this.volumeSeries.setData(series.tvVolume);
    }

    // Apply active Range
    this.applyRangeSelection();

    // Responsive resize handler
    window.addEventListener("resize", () => {
      if (this.tvChart && container) {
        this.tvChart.applyOptions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    });
  }

  applyRangeSelection() {
    if (!this.tvChart || !this.activeChartIndustry) return;
    const data = this.industryDataCache.get(this.activeChartIndustry.id);
    if (!data) return;

    const series = this.chartInterval === "1W" ? data.weekly : data.daily;
    const tvData = series.tvPrice;
    if (!tvData || tvData.length === 0) return;

    if (this.chartRange === "ALL") {
      this.tvChart.timeScale().fitContent();
      return;
    }

    const n = tvData.length;
    let lookback = n;
    const isW = this.chartInterval === "1W";

    if (this.chartRange === "1M") lookback = isW ? 4 : 22;
    else if (this.chartRange === "3M") lookback = isW ? 13 : 65;
    else if (this.chartRange === "6M") lookback = isW ? 26 : 130;
    else if (this.chartRange === "1Y") lookback = isW ? 52 : 252;
    else if (this.chartRange === "5Y") lookback = isW ? 260 : 1260;

    if (lookback >= n) {
      this.tvChart.timeScale().fitContent();
      return;
    }

    const fromIdx = Math.max(0, n - lookback);
    try {
      this.tvChart.timeScale().setVisibleRange({
        from: tvData[fromIdx].time,
        to: tvData[n - 1].time
      });
    } catch (e) {
      this.tvChart.timeScale().fitContent();
    }
  }

  /* ==========================================================================
     CONSTITUENT EDITOR MODAL
     ========================================================================== */
  openEditorModal(industryId) {
    const ind = this.industries.find(i => i.id === industryId);
    if (!ind) return;

    this.activeEditorIndustry = ind;
    const modal = document.getElementById("editorModal");
    if (!modal) return;

    document.getElementById("editorModalTitle").textContent = `Edit Constituents: ${ind.name}`;
    document.getElementById("editorModalSubtitle").textContent = `Manage component stocks for ${ind.name} (${ind.marketCap} Cap)`;

    this.hideEditorAlert();
    this.renderEditorConstituentList();
    modal.classList.add("active");
  }

  closeEditorModal() {
    document.getElementById("editorModal")?.classList.remove("active");
    this.activeEditorIndustry = null;
  }

  renderEditorConstituentList() {
    const ind = this.activeEditorIndustry;
    const container = document.getElementById("editorConstituentsList");
    if (!ind || !container) return;

    const data = this.industryDataCache.get(ind.id);
    const map = new Map();
    if (data?.constituentsAnalysis) {
      data.constituentsAnalysis.forEach(item => map.set(item.symbol, item));
    }

    container.innerHTML = `
      <table class="constituents-table">
        <thead>
          <tr>
            <th>Stock Symbol</th>
            <th>Latest Close</th>
            <th>50 DMA Diff</th>
            <th>200 DMA Diff</th>
            <th>1M Return</th>
            <th>History</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${ind.tickers.map(sym => {
            const info = map.get(sym);
            const price = info ? `₹${info.latestPrice}` : "Fetching...";
            const diff50 = info ? `${info.pctDiff50 >= 0 ? '+' : ''}${info.pctDiff50}%` : "--";
            const diff200 = info ? `${info.pctDiff200 >= 0 ? '+' : ''}${info.pctDiff200}%` : "--";
            const r1m = info ? `${info.return1M >= 0 ? '+' : ''}${info.return1M}%` : "--";
            const days = info?.totalCandles ? `${info.totalCandles} trading days` : "Verifying...";

            return `
              <tr>
                <td><strong>${sym.replace('.NS', '')}</strong> <span style="font-size:11px; color:var(--text-muted);">${sym}</span></td>
                <td style="font-family:var(--font-mono);">${price}</td>
                <td style="font-family:var(--font-mono);" class="${info?.pctDiff50 >= 0 ? 'metric-positive' : 'metric-negative'}">${diff50}</td>
                <td style="font-family:var(--font-mono);" class="${info?.pctDiff200 >= 0 ? 'metric-positive' : 'metric-negative'}">${diff200}</td>
                <td style="font-family:var(--font-mono);" class="${info?.return1M >= 0 ? 'metric-positive' : 'metric-negative'}">${r1m}</td>
                <td><span class="stock-chip" style="color:var(--bullish);">${days}</span></td>
                <td><button class="btn-remove" data-symbol="${sym}">Remove</button></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;

    container.querySelectorAll(".btn-remove").forEach(btn => {
      btn.onclick = () => this.handleRemoveStock(btn.dataset.symbol);
    });
  }

  async handleAddStock() {
    const input = document.getElementById("newStockInput");
    const rawSymbol = input?.value?.trim();
    if (!rawSymbol) return;

    const ind = this.activeEditorIndustry;
    if (!ind) return;

    const symbol = window.DataService.normalizeSymbol(rawSymbol);

    if (ind.tickers.includes(symbol)) {
      this.showEditorAlert(`"${symbol}" is already a constituent.`, "error");
      return;
    }

    const addBtn = document.getElementById("addStockBtn");
    addBtn.disabled = true;
    addBtn.textContent = "Validating 2Y data...";

    try {
      const validation = await window.DataService.validateTickerTwoYearsHistory(symbol);
      if (!validation.valid) {
        this.showEditorAlert(validation.reason, "error");
        return;
      }

      ind.tickers.push(symbol);
      this.customOverrides[ind.id] = ind.tickers;
      this.saveCustomOverrides();

      this.recomputeAllIndustries();
      this.renderEditorConstituentList();
      this.renderIndustries();

      input.value = "";
      this.showEditorAlert(`Added ${symbol} (${validation.candleCount} days history validated)!`, "success");
    } finally {
      addBtn.disabled = false;
      addBtn.textContent = "+ Add Stock";
    }
  }

  handleRemoveStock(symbol) {
    const ind = this.activeEditorIndustry;
    if (!ind) return;

    if (ind.tickers.length <= 1) {
      this.showEditorAlert("Industry must have at least 1 stock component.", "error");
      return;
    }

    ind.tickers = ind.tickers.filter(s => s !== symbol);
    this.customOverrides[ind.id] = ind.tickers;
    this.saveCustomOverrides();

    this.recomputeAllIndustries();
    this.renderEditorConstituentList();
    this.renderIndustries();
    this.showEditorAlert(`Removed ${symbol} from constituents.`, "success");
  }

  handleResetDefaults() {
    const ind = this.activeEditorIndustry;
    if (!ind) return;

    const defaultObj = (window.DEFAULT_INDUSTRIES || []).find(i => i.id === ind.id);
    if (!defaultObj) return;

    ind.tickers = [...defaultObj.tickers];
    delete this.customOverrides[ind.id];
    this.saveCustomOverrides();

    this.recomputeAllIndustries();
    this.renderEditorConstituentList();
    this.renderIndustries();
    this.showEditorAlert(`Reset to default factory constituents.`, "success");
  }

  showEditorAlert(msg, type = "error") {
    const el = document.getElementById("editorAlert");
    if (!el) return;
    el.textContent = msg;
    el.className = `alert-box alert-${type}`;
    el.style.display = "block";
  }

  hideEditorAlert() {
    const el = document.getElementById("editorAlert");
    if (el) el.style.display = "none";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.App = new IndustryTrendApp();
});
