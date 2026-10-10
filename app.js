/**
 * app.js
 * Main UI Controller for Indian Stock Market Industry Trend Web Application
 */

class IndustryTrendApp {
  constructor() {
    this.industries = [];
    this.customOverrides = {};
    this.industryDataCache = new Map(); // industryId -> calculated result
    this.stockCandlesMap = {};

    this.currentCapFilter = "All"; // "All" | "Large" | "Mid" | "Small"
    this.searchQuery = "";
    this.currentSort = "momentum"; // "momentum" | "dma50" | "breadth" | "name"
    this.currentView = localStorage.getItem("view_mode") || "cards"; // "cards" | "rows"

    this.activeChartIndustry = null;
    this.chartTimeframe = "1Y"; // "3M" | "6M" | "1Y" | "2Y"
    this.activeEditorIndustry = null;
    this.chartInstance = null;

    this.init();
  }

  async init() {
    this.loadCustomOverrides();
    this.industries = this.mergeIndustries();
    this.setupEventListeners();
    this.renderViewSwitcher();
    this.renderStatsBanner();
    this.renderIndustries();

    // Start background progressive calculation
    this.calculateAllIndustriesProgressive();
  }

  loadCustomOverrides() {
    try {
      const stored = localStorage.getItem("custom_industry_constituents");
      if (stored) {
        this.customOverrides = JSON.parse(stored);
      }
    } catch (e) {
      this.customOverrides = {};
    }
  }

  saveCustomOverrides() {
    try {
      localStorage.setItem("custom_industry_constituents", JSON.stringify(this.customOverrides));
    } catch (e) {
      console.warn("Could not save overrides to localStorage:", e);
    }
  }

  mergeIndustries() {
    const defaults = window.DEFAULT_INDUSTRIES || [];
    return defaults.map(ind => {
      if (this.customOverrides[ind.id]) {
        return {
          ...ind,
          tickers: [...this.customOverrides[ind.id]]
        };
      }
      return { ...ind, tickers: [...ind.tickers] };
    });
  }

  setupEventListeners() {
    // Cap filters
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCapFilter = btn.dataset.cap;
        this.renderIndustries();
      });
    });

    // Search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderIndustries();
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.renderIndustries();
      });
    }

    // View toggles
    document.getElementById("viewCardsBtn")?.addEventListener("click", () => {
      this.setView("cards");
    });
    document.getElementById("viewRowsBtn")?.addEventListener("click", () => {
      this.setView("rows");
    });

    // Refresh / Sync button
    document.getElementById("refreshBtn")?.addEventListener("click", () => {
      this.refreshAllData();
    });

    // Modal close buttons & backdrop click
    document.getElementById("chartModalClose")?.addEventListener("click", () => this.closeChartModal());
    document.getElementById("chartModal")?.addEventListener("click", (e) => {
      if (e.target.id === "chartModal") this.closeChartModal();
    });

    document.getElementById("editorModalClose")?.addEventListener("click", () => this.closeEditorModal());
    document.getElementById("editorModal")?.addEventListener("click", (e) => {
      if (e.target.id === "editorModal") this.closeEditorModal();
    });

    // Add stock form in editor
    document.getElementById("addStockBtn")?.addEventListener("click", () => this.handleAddStock());
    document.getElementById("newStockInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleAddStock();
      }
    });

    // Reset default constituents
    document.getElementById("resetDefaultsBtn")?.addEventListener("click", () => this.handleResetDefaults());

    // Timeframe filter buttons in chart modal
    document.querySelectorAll(".tf-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tf-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.chartTimeframe = btn.dataset.tf;
        this.drawChart();
      });
    });
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
   * Progressive background calculation across all 120+ industries
   */
  async calculateAllIndustriesProgressive(forceRefresh = false) {
    const progressContainer = document.getElementById("progressContainer");
    const progressBarFill = document.getElementById("progressBarFill");
    const progressStatus = document.getElementById("progressStatus");

    if (progressContainer) progressContainer.style.display = "block";

    // Collect all distinct tickers
    const allSymbols = new Set();
    this.industries.forEach(ind => {
      ind.tickers.forEach(t => allSymbols.add(t));
    });
    const symbolsArray = Array.from(allSymbols);

    let completed = 0;
    const total = symbolsArray.length;

    // Fetch batches to be respectful to proxies
    const batchSize = 6;
    for (let i = 0; i < symbolsArray.length; i += batchSize) {
      const batch = symbolsArray.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (symbol) => {
          try {
            const candles = await window.DataService.getStockCandles(symbol, forceRefresh);
            if (candles) {
              this.stockCandlesMap[symbol] = candles;
            }
          } catch (err) {
            console.warn(`Error loading ${symbol}:`, err);
          } finally {
            completed++;
            const pct = Math.round((completed / total) * 100);
            if (progressBarFill) progressBarFill.style.width = `${pct}%`;
            if (progressStatus) progressStatus.textContent = `Syncing data: ${completed} / ${total} stocks (${pct}%)`;
          }
        })
      );

      // Recalculate industries whose constituents are ready
      this.recomputeAllCachedIndustries();
      this.renderStatsBanner();
      this.renderIndustries();
    }

    if (progressStatus) progressStatus.textContent = `All ${total} constituent stocks synchronized.`;
    setTimeout(() => {
      if (progressContainer) progressContainer.style.display = "none";
    }, 1200);

    const syncStatusEl = document.getElementById("syncStatusText");
    if (syncStatusEl) {
      syncStatusEl.textContent = `Live Synced (${total} Tickers)`;
    }
  }

  recomputeAllCachedIndustries() {
    this.industries.forEach(ind => {
      const result = window.TechMath.computeIndustryTrend(ind.tickers, this.stockCandlesMap);
      if (result) {
        this.industryDataCache.set(ind.id, result);
      }
    });
  }

  async refreshAllData() {
    this.industryDataCache.clear();
    await window.DataService.clearCache();
    await this.calculateAllIndustriesProgressive(true);
  }

  getFilteredAndSortedIndustries() {
    return this.industries
      .filter(ind => {
        // Market Cap filter
        if (this.currentCapFilter !== "All" && ind.marketCap !== this.currentCapFilter) {
          return false;
        }
        // Search filter
        if (this.searchQuery) {
          const nameMatch = ind.name.toLowerCase().includes(this.searchQuery);
          const sectorMatch = ind.sector.toLowerCase().includes(this.searchQuery);
          const tickerMatch = ind.tickers.some(t => t.toLowerCase().includes(this.searchQuery));
          if (!nameMatch && !sectorMatch && !tickerMatch) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const dataA = this.industryDataCache.get(a.id);
        const dataB = this.industryDataCache.get(b.id);

        if (this.currentSort === "name") {
          return a.name.localeCompare(b.name);
        }

        const metricsA = dataA?.metrics;
        const metricsB = dataB?.metrics;

        if (!metricsA && !metricsB) return 0;
        if (!metricsA) return 1;
        if (!metricsB) return -1;

        if (this.currentSort === "momentum") {
          return metricsB.ret1M - metricsA.ret1M;
        } else if (this.currentSort === "dma50") {
          return metricsB.pctDiff50 - metricsA.pctDiff50;
        } else if (this.currentSort === "breadth") {
          return metricsB.breadthPct - metricsA.breadthPct;
        }
        return 0;
      });
  }

  renderStatsBanner() {
    const list = Array.from(this.industryDataCache.values());
    if (list.length === 0) return;

    let bullishCount = 0;
    let totalBreadth = 0;
    let topIndustry = null;
    let topReturn = -Infinity;

    this.industries.forEach(ind => {
      const data = this.industryDataCache.get(ind.id);
      if (data && data.metrics) {
        if (data.metrics.trend === "BULLISH" || data.metrics.trend === "MODERATE_BULL") {
          bullishCount++;
        }
        totalBreadth += data.metrics.breadthPct;
        if (data.metrics.ret1M > topReturn) {
          topReturn = data.metrics.ret1M;
          topIndustry = ind.name;
        }
      }
    });

    const bullishPct = list.length > 0 ? Math.round((bullishCount / list.length) * 100) : 0;
    const avgBreadth = list.length > 0 ? Math.round(totalBreadth / list.length) : 0;

    const elTotal = document.getElementById("statTotalIndustries");
    const elBullish = document.getElementById("statBullishPct");
    const elBreadth = document.getElementById("statAvgBreadth");
    const elTop = document.getElementById("statTopIndustry");

    if (elTotal) elTotal.textContent = `${this.industries.length} Industries`;
    if (elBullish) elBullish.textContent = `${bullishPct}% Bullish`;
    if (elBreadth) elBreadth.textContent = `${avgBreadth}% above 50 DMA`;
    if (elTop) elTop.textContent = topIndustry ? `${topIndustry} (${topReturn > 0 ? '+' : ''}${topReturn}%)` : "-";
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
      this.renderCardsView(container, filtered);
    } else {
      this.renderRowsView(container, filtered);
    }
  }

  renderCardsView(container, list) {
    const html = `
      <div class="industries-grid">
        ${list.map(ind => this.createCardHTML(ind)).join("")}
      </div>
    `;
    container.innerHTML = html;
    this.attachCardEventListeners();
  }

  createCardHTML(ind) {
    const data = this.industryDataCache.get(ind.id);
    const metrics = data?.metrics;

    const capClass = `badge-${ind.marketCap.toLowerCase()}`;
    const trend = metrics?.trend || "CALCULATING";
    const trendBadgeClass = trend.includes("BULL") ? "badge-bullish" : trend.includes("BEAR") ? "badge-bearish" : "badge-neutral";
    const trendText = trend.replace("_", " ");

    const dma50Diff = metrics ? `${metrics.pctDiff50 >= 0 ? '+' : ''}${metrics.pctDiff50}%` : "--";
    const dma200Diff = metrics ? `${metrics.pctDiff200 >= 0 ? '+' : ''}${metrics.pctDiff200}%` : "--";

    const dma50Val = metrics?.dma50 ? `₹${metrics.dma50}` : "Loading...";
    const dma200Val = metrics?.dma200 ? `₹${metrics.dma200}` : "Loading...";

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
          <span class="badge ${trendBadgeClass}">${trendText}</span>
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

  renderRowsView(container, list) {
    const html = `
      <div class="table-wrapper">
        <table class="market-table">
          <thead>
            <tr>
              <th>Industry Name</th>
              <th>Cap</th>
              <th>Trend</th>
              <th>50 DMA Dist</th>
              <th>200 DMA Dist</th>
              <th>1W Return</th>
              <th>1M Return</th>
              <th>1Y Return</th>
              <th>Breadth (> 50 DMA)</th>
              <th>Stocks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(ind => this.createRowHTML(ind)).join("")}
          </tbody>
        </table>
      </div>
    `;
    container.innerHTML = html;
    this.attachCardEventListeners();
  }

  createRowHTML(ind) {
    const data = this.industryDataCache.get(ind.id);
    const metrics = data?.metrics;

    const capClass = `badge-${ind.marketCap.toLowerCase()}`;
    const trend = metrics?.trend || "CALCULATING";
    const trendBadgeClass = trend.includes("BULL") ? "badge-bullish" : trend.includes("BEAR") ? "badge-bearish" : "badge-neutral";

    const d50 = metrics ? `${metrics.pctDiff50 >= 0 ? '+' : ''}${metrics.pctDiff50}%` : "--";
    const d200 = metrics ? `${metrics.pctDiff200 >= 0 ? '+' : ''}${metrics.pctDiff200}%` : "--";
    const r1w = metrics ? `${metrics.ret1W >= 0 ? '+' : ''}${metrics.ret1W}%` : "--";
    const r1m = metrics ? `${metrics.ret1M >= 0 ? '+' : ''}${metrics.ret1M}%` : "--";
    const r1y = metrics ? `${metrics.ret1Y >= 0 ? '+' : ''}${metrics.ret1Y}%` : "--";
    const br = metrics ? `${metrics.breadthPct}%` : "--";

    return `
      <tr>
        <td>
          <div class="table-industry-title">
            <span>${ind.name}</span>
          </div>
          <span style="font-size:11px; color:var(--text-muted);">${ind.sector}</span>
        </td>
        <td><span class="badge ${capClass}">${ind.marketCap}</span></td>
        <td><span class="badge ${trendBadgeClass}">${trend.replace('_', ' ')}</span></td>
        <td class="table-num ${metrics?.pctDiff50 >= 0 ? 'metric-positive' : 'metric-negative'}">${d50}</td>
        <td class="table-num ${metrics?.pctDiff200 >= 0 ? 'metric-positive' : 'metric-negative'}">${d200}</td>
        <td class="table-num ${metrics?.ret1W >= 0 ? 'metric-positive' : 'metric-negative'}">${r1w}</td>
        <td class="table-num ${metrics?.ret1M >= 0 ? 'metric-positive' : 'metric-negative'}">${r1m}</td>
        <td class="table-num ${metrics?.ret1Y >= 0 ? 'metric-positive' : 'metric-negative'}">${r1y}</td>
        <td class="table-num">${br}</td>
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
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        this.openChartModal(id);
      });
    });

    document.querySelectorAll(".edit-stocks-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        this.openEditorModal(id);
      });
    });
  }

  /* ==========================================================================
     CHART MODAL & VISUALIZATION
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
    document.getElementById("chartModalDesc").textContent = `${ind.description} • ${ind.marketCap} Cap • ${ind.sector}`;

    // Fill stats
    document.getElementById("cStatPrice").textContent = metrics ? `₹${metrics.latestValue}` : "--";
    document.getElementById("cStatDma50").textContent = metrics ? `₹${metrics.dma50}` : "--";
    document.getElementById("cStatDma200").textContent = metrics ? `₹${metrics.dma200}` : "--";
    document.getElementById("cStatDist50").textContent = metrics ? `${metrics.pctDiff50 >= 0 ? '+' : ''}${metrics.pctDiff50}%` : "--";
    document.getElementById("cStatDist50").className = `val ${metrics?.pctDiff50 >= 0 ? 'metric-positive' : 'metric-negative'}`;
    document.getElementById("cStatDist200").textContent = metrics ? `${metrics.pctDiff200 >= 0 ? '+' : ''}${metrics.pctDiff200}%` : "--";
    document.getElementById("cStatDist200").className = `val ${metrics?.pctDiff200 >= 0 ? 'metric-positive' : 'metric-negative'}`;
    document.getElementById("cStatBreadth").textContent = metrics ? `${metrics.breadthPct}% (${metrics.stocksAbove50Count}/${metrics.totalConstituents})` : "--";

    modal.classList.add("active");
    this.drawChart();
  }

  closeChartModal() {
    document.getElementById("chartModal")?.classList.remove("active");
    this.activeChartIndustry = null;
  }

  drawChart() {
    const ind = this.activeChartIndustry;
    if (!ind) return;

    const data = this.industryDataCache.get(ind.id);
    const canvas = document.getElementById("industryChartCanvas");
    if (!canvas || !data) return;

    // Filter by timeframe
    let sliceDays = 252; // default 1Y
    if (this.chartTimeframe === "3M") sliceDays = 63;
    else if (this.chartTimeframe === "6M") sliceDays = 126;
    else if (this.chartTimeframe === "1Y") sliceDays = 252;
    else if (this.chartTimeframe === "2Y") sliceDays = 504;

    const totalDays = data.dates.length;
    const startIdx = Math.max(0, totalDays - sliceDays);

    const dates = data.dates.slice(startIdx);
    const indexValues = data.indexValues.slice(startIdx);
    const dma50Series = data.dma50Series.slice(startIdx);
    const dma200Series = data.dma200Series.slice(startIdx);

    // If Chart.js library is loaded via CDN, render with high-res interactive Chart.js
    if (window.Chart) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const ctx = canvas.getContext("2d");
      this.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Industry Composite Price",
              data: indexValues,
              borderColor: "#06b6d4",
              borderWidth: 2.2,
              tension: 0.1,
              pointRadius: 0,
              pointHoverRadius: 5
            },
            {
              label: "50 DMA",
              data: dma50Series,
              borderColor: "#f59e0b",
              borderWidth: 2,
              borderDash: [5, 4],
              tension: 0.1,
              pointRadius: 0,
              pointHoverRadius: 4
            },
            {
              label: "200 DMA",
              data: dma200Series,
              borderColor: "#a855f7",
              borderWidth: 2,
              borderDash: [6, 4],
              tension: 0.1,
              pointRadius: 0,
              pointHoverRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false
          },
          plugins: {
            legend: {
              display: false // we use our own styled legend
            },
            tooltip: {
              backgroundColor: "#111726",
              titleColor: "#f3f4f6",
              bodyColor: "#9ca3af",
              borderColor: "rgba(255,255,255,0.15)",
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.parsed.y}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: { color: "#6b7280", maxTicksLimit: 8 }
            },
            y: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: {
                color: "#6b7280",
                callback: (val) => `₹${val}`
              }
            }
          }
        }
      });
    } else {
      // Robust native Canvas fallback renderer (works 100% offline without CDN)
      this.renderNativeCanvasChart(canvas, dates, indexValues, dma50Series, dma200Series);
    }
  }

  renderNativeCanvasChart(canvas, dates, prices, d50, d200) {
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Calculate min/max bounds
    let min = Infinity;
    let max = -Infinity;
    prices.forEach(v => {
      if (v != null) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    });
    d50.forEach(v => {
      if (v != null) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    });
    d200.forEach(v => {
      if (v != null) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    });

    const pad = (max - min) * 0.1 || 5;
    min -= pad;
    max += pad;

    const padLeft = 60;
    const padBottom = 30;
    const plotW = w - padLeft - 20;
    const plotH = h - padBottom - 20;

    const getX = (i) => padLeft + (i / (prices.length - 1)) * plotW;
    const getY = (val) => 20 + plotH - ((val - min) / (max - min)) * plotH;

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = 20 + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();

      const labelVal = Number((max - (i / 4) * (max - min)).toFixed(1));
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px sans-serif";
      ctx.fillText(`₹${labelVal}`, 10, y + 3);
    }

    // Helper to draw series
    const drawSeries = (series, color, lineWidth, isDashed = false) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      if (isDashed) ctx.setLineDash([5, 4]);
      else ctx.setLineDash([]);

      ctx.beginPath();
      let started = false;
      for (let i = 0; i < series.length; i++) {
        const val = series[i];
        if (val != null) {
          const x = getX(i);
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    drawSeries(d200, "#a855f7", 2, true); // 200 DMA violet
    drawSeries(d50, "#f59e0b", 2, true);  // 50 DMA gold
    drawSeries(prices, "#06b6d4", 2.2);   // Price cyan
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
    if (data && data.constituentsAnalysis) {
      data.constituentsAnalysis.forEach(item => map.set(item.symbol, item));
    }

    const html = `
      <table class="constituents-table">
        <thead>
          <tr>
            <th>Stock Symbol</th>
            <th>Latest Close</th>
            <th>50 DMA Diff</th>
            <th>1M Return</th>
            <th>Historical Days</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${ind.tickers.map(sym => {
            const info = map.get(sym);
            const price = info ? `₹${info.latestPrice}` : "Loading...";
            const diff50 = info ? `${info.pctDiff50 >= 0 ? '+' : ''}${info.pctDiff50}%` : "--";
            const diffClass = info?.pctDiff50 >= 0 ? 'metric-positive' : 'metric-negative';
            const r1m = info ? `${info.return1M >= 0 ? '+' : ''}${info.return1M}%` : "--";
            const days = info?.totalCandles ? `${info.totalCandles} days (≥2 yrs)` : "Checking...";

            return `
              <tr>
                <td><strong>${sym.replace('.NS', '')}</strong> <span style="font-size:11px; color:var(--text-muted);">${sym}</span></td>
                <td style="font-family:var(--font-mono);">${price}</td>
                <td style="font-family:var(--font-mono);" class="${diffClass}">${diff50}</td>
                <td style="font-family:var(--font-mono);" class="${info?.return1M >= 0 ? 'metric-positive' : 'metric-negative'}">${r1m}</td>
                <td><span class="stock-chip" style="color:var(--bullish);">${days}</span></td>
                <td>
                  <button class="btn-remove" data-symbol="${sym}">Remove</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;

    container.innerHTML = html;

    container.querySelectorAll(".btn-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const symbol = btn.dataset.symbol;
        this.handleRemoveStock(symbol);
      });
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
      this.showEditorAlert(`"${symbol}" is already a constituent of this industry.`, "error");
      return;
    }

    const addBtn = document.getElementById("addStockBtn");
    if (addBtn) {
      addBtn.disabled = true;
      addBtn.textContent = "Validating 2Y data...";
    }

    try {
      // Validate >= 2 years requirement
      const validation = await window.DataService.validateTickerTwoYearsHistory(symbol);
      if (!validation.valid) {
        this.showEditorAlert(validation.reason, "error");
        return;
      }

      // Add to constituent list
      ind.tickers.push(symbol);
      this.customOverrides[ind.id] = ind.tickers;
      this.saveCustomOverrides();

      // Recalculate industry
      this.recomputeAllCachedIndustries();
      this.renderEditorConstituentList();
      this.renderIndustries();
      this.renderStatsBanner();

      input.value = "";
      this.showEditorAlert(`Successfully added ${symbol} (${validation.candleCount} days history validated)!`, "success");
    } finally {
      if (addBtn) {
        addBtn.disabled = false;
        addBtn.textContent = "+ Add Stock";
      }
    }
  }

  handleRemoveStock(symbol) {
    const ind = this.activeEditorIndustry;
    if (!ind) return;

    if (ind.tickers.length <= 1) {
      this.showEditorAlert("An industry must have at least 1 stock component.", "error");
      return;
    }

    ind.tickers = ind.tickers.filter(s => s !== symbol);
    this.customOverrides[ind.id] = ind.tickers;
    this.saveCustomOverrides();

    this.recomputeAllCachedIndustries();
    this.renderEditorConstituentList();
    this.renderIndustries();
    this.renderStatsBanner();

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

    this.recomputeAllCachedIndustries();
    this.renderEditorConstituentList();
    this.renderIndustries();
    this.renderStatsBanner();

    this.showEditorAlert(`Reset ${ind.name} to default factory constituents.`, "success");
  }

  showEditorAlert(message, type = "error") {
    const alertBox = document.getElementById("editorAlert");
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.style.display = "block";
  }

  hideEditorAlert() {
    const alertBox = document.getElementById("editorAlert");
    if (alertBox) alertBox.style.display = "none";
  }
}

// Instantiate on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.App = new IndustryTrendApp();
});
