// src/api/marketplaceAnalytics.js

const LATENCY = 150;
const delay = () => new Promise((r) => setTimeout(r, LATENCY));

/**
 * KPIs del marketplace (mock)
 */
export async function fetchMarketplaceKpis({ dateRange } = {}) {
  await delay();
  return {
    date_range: dateRange ?? "last_30_days",
    totalOrders: 540,
    totalRevenue: 45200,
    avgTicket: 83.7,
    activeSellers: 46,
    activeBuyers: 120,
  };
}

/**
 * Serie de ventas del marketplace (mock)
 */
export async function fetchMarketplaceSalesSeries({ dateRange } = {}) {
  await delay();
  return {
    date_range: dateRange ?? "last_7_days",
    series: [
      { date: "2025-01-01", value: 1200 },
      { date: "2025-01-02", value: 1800 },
      { date: "2025-01-03", value: 900 },
    ],
  };
}
