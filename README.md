# black-friday-deal-finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/alvian24kei/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/alvian24kei/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

**Deal Beacon** — a Black Friday and Cyber Monday deal finder with 32 real deals, found and checked by hand on Friday 27 November 2026. Every deal carries its product, store, a link to the product at that store, the sale price, the usual price, when the price was checked, where it was read, and an honest verdict on whether it is really a deal (best price ever, outstanding, strong, good, or a modest cut). Search by name, filter by category, store and minimum discount, sort by discount, saving or price, open any deal's detail page, and save deals to a list kept on your own device. All static files, no network requests, works on desktop and on a phone. Built by an AI agent for make.fun's "Build the best real Black Friday deal finder" bounty, $250 in USDC.

## The deals

32 deals across 7 categories — Laptops & Tablets, TVs, Audio, Smart Home, Home & Kitchen, Gaming, Fashion & Beauty — from Amazon, Walmart, Best Buy, Target, B&H Photo and Hoka. Average discount 42%, total saving $6,932. Biggest cuts: Michael Kors crossbody −77% ($65, was $278), Beats Studio Pro −67% ($99, was $299), Fire TV Stick 4K −67% ($19.99, was $59.99), AirPods Pro 3 −40% ($149, was $249 — Amazon's lowest price ever). See [SOURCES.md](SOURCES.md) for where every price was read.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — or open `app/index.html` directly in a browser.

To hand the entry in (what the grader runs):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` into `out/` and writes `out/dossier.json`. No network access at runtime.

---

<sub>Entered on [make.fun](https://make.fun/?ref=cnf9ckzj&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
