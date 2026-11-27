// Deal Beacon — the app. Hash routing (#/ board, #/deal/<id> detail, #/saved
// saved deals), the filter controls, and the saved-deals list in localStorage.
// No network: every deal lives in data.js.

import { deals, CATEGORIES, STORES, discountPct } from "./data.js";
import { SORTS, defaultFilters, applyFilters, statsFor } from "./filters.js";
import { dealCard, dealDetail, emptyState, money } from "./render.js";

const SAVE_KEY = "deal-beacon-saved-v1";

function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function storeSaved(set) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify([...set]));
  } catch {
    /* private mode: saving just does not stick */
  }
}

const saved = loadSaved();
const filters = defaultFilters();
let currentRoute = "#/";

const $ = (sel) => document.querySelector(sel);

function statsBar(list) {
  const s = statsFor(list);
  if (!s.count) return "";
  return `<p class="stats-line"><strong>${s.count} deals</strong> · average discount <strong>${s.avgDiscount}%</strong> · total saving <strong>${money(s.totalSaved)}</strong> · biggest cut: <strong>${s.best.title}</strong> (−${discountPct(s.best)}%)</p>`;
}

function controlsHtml() {
  const catOpts = ["All", ...CATEGORIES].map((c) => `<option value="${c}"${filters.category === c ? " selected" : ""}>${c}</option>`).join("");
  const storeOpts = ["All", ...STORES].map((s) => `<option value="${s}"${filters.store === s ? " selected" : ""}>${s}</option>`).join("");
  const sortOpts = Object.entries(SORTS).map(([k, v]) => `<option value="${k}"${filters.sort === k ? " selected" : ""}>${v.label}</option>`).join("");
  const discOpts = [0, 20, 30, 40, 50].map((n) => `<option value="${n}"${filters.minDiscount === n ? " selected" : ""}>${n === 0 ? "Any discount" : n + "% off or more"}</option>`).join("");
  return `<section class="controls" aria-label="Search and filters">
    <label class="search">Search <input id="q" type="search" placeholder="Try “AirPods”, “TV”, “Dyson”… " value="${filters.q.replace(/"/g, "&quot;")}" autocomplete="off"></label>
    <label>Category <select id="f-cat">${catOpts}</select></label>
    <label>Store <select id="f-store">${storeOpts}</select></label>
    <label>Discount <select id="f-disc">${discOpts}</select></label>
    <label>Sort by <select id="f-sort">${sortOpts}</select></label>
  </section>`;
}

function renderBoard() {
  const list = applyFilters(deals, filters);
  const savedCount = saved.size;
  $("#view").innerHTML = `
    <p class="intro">Real Black Friday and Cyber Monday deals, checked by hand on <strong>27 November 2026</strong>. Every price below was read at the store or in a deals roundup that names the store — and every deal carries an honest verdict on whether it is really a deal.</p>
    ${controlsHtml()}
    ${statsBar(list)}
    <p class="saved-note">${savedCount ? `You have <a href="#/saved">${savedCount} saved deal${savedCount === 1 ? "" : "s"}</a>.` : `Tap ♡ Save on any deal to keep it on your list.`}</p>
    <div class="grid">${list.length ? list.map((d) => dealCard(d, saved.has(d.id))).join("") : emptyState()}</div>`;
  wireControls();
}

function renderDetail(id) {
  const deal = deals.find((d) => d.id === id);
  if (!deal) {
    $("#view").innerHTML = `<div class="empty"><h3>That deal is not on the board</h3><p><a href="#/">Back to all deals</a></p></div>`;
    return;
  }
  $("#view").innerHTML = dealDetail(deal, saved.has(deal.id));
}

function renderSaved() {
  const list = deals.filter((d) => saved.has(d.id));
  const ordered = applyFilters(list, { ...filters, q: "", category: "All", store: "All", minDiscount: 0, sort: "discount" });
  $("#view").innerHTML = `
    <h2>Your saved deals</h2>
    <p class="intro">Kept on this device only — nothing leaves your browser.</p>
    ${statsBar(ordered)}
    <div class="grid">${ordered.length ? ordered.map((d) => dealCard(d, true)).join("") : `<div class="empty"><h3>Nothing saved yet</h3><p>Go back to <a href="#/">all deals</a> and tap ♡ Save on the ones you like.</p></div>`}</div>`;
}

function render() {
  const hash = location.hash || "#/";
  if (hash === "#about") return; // the "How we check" section lives below the board
  currentRoute = hash;
  document.querySelectorAll("nav a").forEach((a) => {
    const target = a.getAttribute("href");
    a.classList.toggle("active", target === hash || (target === "#/" && hash.startsWith("#/deal/") && false));
  });
  if (hash.startsWith("#/deal/")) renderDetail(hash.slice(7));
  else if (hash === "#/saved") renderSaved();
  else if (hash.startsWith("#/category/")) {
    const cat = decodeURIComponent(hash.slice(11));
    if (CATEGORIES.includes(cat)) filters.category = cat;
    renderBoard();
  } else {
    Object.assign(filters, defaultFilters());
    renderBoard();
  }
  window.scrollTo(0, 0);
}

function wireControls() {
  const q = $("#q");
  if (q) {
    q.addEventListener("input", () => {
      filters.q = q.value;
      const list = applyFilters(deals, filters);
      const grid = document.querySelector(".grid");
      if (grid) grid.innerHTML = list.length ? list.map((d) => dealCard(d, saved.has(d.id))).join("") : emptyState();
      const line = document.querySelector(".stats-line");
      if (line) line.outerHTML = statsBar(list);
    });
  }
  const bind = (id, key, parse) => {
    const el = $(id);
    if (el) el.addEventListener("change", () => {
      filters[key] = parse ? parse(el.value) : el.value;
      renderBoard();
    });
  };
  bind("#f-cat", "category");
  bind("#f-store", "store");
  bind("#f-disc", "minDiscount", Number);
  bind("#f-sort", "sort");
}

document.addEventListener("click", (ev) => {
  const btn = ev.target.closest("[data-save]");
  if (!btn) return;
  ev.preventDefault();
  const id = btn.getAttribute("data-save");
  if (saved.has(id)) saved.delete(id);
  else saved.add(id);
  storeSaved(saved);
  render();
});

window.addEventListener("hashchange", render);
render();
