// Deal Beacon — filtering and sorting. Pure functions over the deals list:
// search text, category, store, minimum discount, and the sort order.

import { discountPct } from "./data.js";

export const SORTS = {
  discount: { label: "Biggest discount %", key: "discount" },
  saving: { label: "Biggest saving ($)", key: "saving" },
  priceAsc: { label: "Lowest price", key: "priceAsc" },
  priceDesc: { label: "Highest price", key: "priceDesc" },
  name: { label: "Name A-Z", key: "name" },
};

export function defaultFilters() {
  return { q: "", category: "All", store: "All", minDiscount: 0, sort: "discount" };
}

export function applyFilters(deals, f) {
  const q = f.q.trim().toLowerCase();
  let out = deals.filter((d) => {
    if (f.category !== "All" && d.category !== f.category) return false;
    if (f.store !== "All" && d.store !== f.store) return false;
    if (discountPct(d) < f.minDiscount) return false;
    if (q) {
      const hay = `${d.title} ${d.store} ${d.category} ${d.note}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const by = {
    discount: (a, b) => discountPct(b) - discountPct(a) || a.price - b.price,
    saving: (a, b) => b.was - b.price - (a.was - a.price) || discountPct(b) - discountPct(a),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    name: (a, b) => a.title.localeCompare(b.title),
  }[f.sort] || ((a, b) => discountPct(b) - discountPct(a));
  return [...out].sort(by);
}

export function statsFor(deals) {
  if (!deals.length) return { count: 0, avgDiscount: 0, totalSaved: 0, best: null };
  const pcts = deals.map(discountPct);
  const avgDiscount = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
  const totalSaved = Math.round(deals.reduce((a, d) => a + (d.was - d.price), 0));
  const best = [...deals].sort((a, b) => discountPct(b) - discountPct(a))[0];
  return { count: deals.length, avgDiscount, totalSaved, best };
}
