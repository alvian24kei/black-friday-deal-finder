// Deal Beacon — rendering. Turns deals into HTML: the deal card shown on the
// board, the detail view for one deal, and the small helpers (money, badges).

import { VERDICTS, discountPct, savedDollars } from "./data.js";

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function verdictBadge(deal) {
  const v = VERDICTS[deal.verdict];
  return `<span class="verdict verdict-${deal.verdict}" title="${esc(v.hint)}">${esc(v.label)}</span>`;
}

export function checkedLine(deal) {
  const d = new Date(deal.checked);
  const when = d.toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC",
  });
  return `Checked ${when} UTC · ${esc(deal.source)}`;
}

export function dealCard(deal, saved) {
  const pct = discountPct(deal);
  const heart = saved ? "♥" : "♡";
  return `<article class="card" data-id="${deal.id}">
    <a class="card-main" href="#/deal/${deal.id}">
      <div class="card-top">
        <span class="store">${esc(deal.store)}</span>
        <span class="pct">−${pct}%</span>
      </div>
      <h3>${esc(deal.title)}</h3>
      <p class="cat">${esc(deal.category)}</p>
      <div class="prices">
        <span class="now">${money(deal.price)}</span>
        <span class="was">${money(deal.was)}</span>
        <span class="save">save ${money(savedDollars(deal))}</span>
      </div>
      <div class="card-foot">${verdictBadge(deal)}</div>
      <p class="checked">${checkedLine(deal)}</p>
    </a>
    <div class="card-actions">
      <button class="save-btn" data-save="${deal.id}" aria-pressed="${saved ? "true" : "false"}">${heart} Save</button>
      <a class="store-link" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} ↗</a>
    </div>
  </article>`;
}

export function dealDetail(deal, saved) {
  const pct = discountPct(deal);
  const v = VERDICTS[deal.verdict];
  const barNow = Math.max(4, Math.round((deal.price / deal.was) * 100));
  return `<article class="detail">
    <p class="back"><a href="#/">&larr; All deals</a></p>
    <div class="detail-top">
      <span class="store">${esc(deal.store)}</span>
      <span class="cat">${esc(deal.category)}</span>
      ${verdictBadge(deal)}
    </div>
    <h2>${esc(deal.title)}</h2>
    <div class="detail-prices">
      <div><span class="lbl">Sale price</span><span class="now big">${money(deal.price)}</span></div>
      <div><span class="lbl">Usual price</span><span class="was big">${money(deal.was)}</span></div>
      <div><span class="lbl">You save</span><span class="save big">${money(savedDollars(deal))} (−${pct}%)</span></div>
    </div>
    <div class="pricebar" role="img" aria-label="Sale price is ${barNow} percent of the usual price">
      <div class="pricebar-now" style="width:${barNow}%"></div>
      <span class="pricebar-label">Sale ${money(deal.price)} vs usual ${money(deal.was)}</span>
    </div>
    <p class="verdict-note"><strong>${esc(v.label)}:</strong> ${esc(v.hint)} ${esc(deal.note)}</p>
    <p class="checked">${checkedLine(deal)}</p>
    <div class="detail-actions">
      <a class="store-link big" href="${esc(deal.url)}" target="_blank" rel="noopener">View this deal at ${esc(deal.store)} ↗</a>
      <button class="save-btn big" data-save="${deal.id}" aria-pressed="${saved ? "true" : "false"}">${saved ? "♥ Saved" : "♡ Save for later"}</button>
    </div>
    <p class="fine">Prices move fast on Black Friday — the store's page is the final word. This finder checked the price at the time above; it does not sell anything itself.</p>
  </article>`;
}

export function emptyState() {
  return `<div class="empty">
    <h3>No deals match those filters</h3>
    <p>Try a wider category, a lower minimum discount, or a different search.</p>
  </div>`;
}
