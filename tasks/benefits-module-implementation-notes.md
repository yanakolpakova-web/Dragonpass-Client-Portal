# Benefits Module — Implementation Notes

> Working notes from the build against `PRD-benefits-module.md` (Confluence export,
> 15 Sep 2026 12:15 revision, 29 ACs). Records what was built, the decisions the PRD
> left open, and what still needs a ruling.

---

## Status

**All 29 acceptance criteria pass**, verified against the running app rather than by
inspection. Two carry caveats — see [Open questions](#open-questions).

| Section | ACs | State |
|---|---|---|
| 5.1.1 Summary banner | AC-01 – AC-05 | ✅ |
| 5.1.2 Cards grid | AC-06 – AC-10 | ✅ |
| 5.1.3 Limited card | AC-11 – AC-12 | ✅ |
| 5.1.4 Unlimited card | AC-13 – AC-15 | ✅ |
| 5.1.5 Pay-as-you-go | AC-16 | ✅ |
| 5.2 Detail page | AC-17 – AC-25 | ✅ |
| 5.3 Recent activity | AC-26 – AC-29 | ✅ |

---

## What changed

### Benefits list page

- **Summary banner** — four metrics with hint lines beneath each when any benefit is
  unlimited (AC-03 + AC-04 read together, per the 15 Sep decision recorded in the PRD).
- **Grid is catalogue-driven.** Previously it listed only the client's entitlements, so
  three Dragonpass categories never appeared. It now maps `CATALOG_PRODUCTS` and joins
  entitlements by `productSlug` (AC-07).
- **Five card treatments**: limited, unlimited, pay-as-you-go, inactive, and the
  aggregate "All Entitlements" banner.
- **Status pill** — Active / Low / Unlimited / Exhausted / Inactive, derived in
  `benefitStatus.ts`. Carried over from the 14 Sep PRD; the current revision references
  the pill but no longer defines it.
- **Responsive grid** — 3 columns ≥1024px, 2 at 768px, 1 at 375px (AC-06). The banner
  follows suit: one row ≥1280px, 2×2 below 1024px, stacked on mobile.
- **Sort** — defaults to usage descending (AC-09); options Name / Remaining / Status /
  Usage.

### Detail page

- **KPI cards** reduced to metric name + large number; sparklines and the hardcoded
  "↗ 12%" change removed.
- **Unlimited treatment** (AC-20) — Allocation and Remaining read "Unlimited",
  Usage Rate reads "—", instead of inventing figures from a non-existent pool.
- **Usage alerts** — editable thresholds for limited benefits (AC-21); volume and
  daily-volume alerts, off by default with no presets, for unlimited (AC-22).
- **Alert recipients** — add / list / remove, replacing a single comma-joined field.
- **Daily usage chart** — combo bar-and-line (`UsageComboChart`), 7 days by default,
  with a 7 / 30 / 90 / custom range dropdown (AC-23, AC-25).
- **Recent activity** — six columns per AC-26; search, status/customer filters, time
  range and CSV export all functional (AC-28); row click opens the Order Management
  modal (AC-29).

### Card affordance (post-PM feedback)

User testing showed people didn't realise cards were clickable. The hover cue existed
but there was **no resting-state affordance** — and four of nine cards aren't clickable
and don't respond at all, which taught testers that cards are inert.

- Persistent **arrow-right** icon on clickable cards only, so its presence is itself the
  signal. Non-clickable cards have none.
- Cards are now real `<button>` elements — keyboard focus, a visible focus ring, and
  correct screen-reader semantics. They were `<div onClick>`, which none of that.
- Hover is colour only: background tints to `#f9fafb`, border and arrow darken. No
  shadow, no lift, no movement.

---

## Decisions the PRD left open

| Decision | Choice | Why |
|---|---|---|
| Low threshold | remaining < 25% | From the 14 Sep PRD; the current revision defines no pill states |
| Ring colour bands | ≤75% green · >75% amber · 100% red ring + checkmark | Aligned exactly to the Low/Exhausted pill boundaries so ring and pill flip together |
| Status sort order | Exhausted → Low → Active → Unlimited → Inactive | Most urgent first, matching the existing usage/remaining sorts |
| "Usage" sort metric | total used, not percentage | Confirmed with PM; puts limited and unlimited on one scale |
| Unsupported-category copy | "This category is not available for this channel." | AC-07 says only "explanatory note" |
| PAYG unit | "redemptions" | Matches the unlimited card's existing wording |
| `payg` identifier | added to `Product.clientStatus` | AC-27 refers to `category = pyag`; spelled `payg` in code |

---

## Open questions

### 1. AC-27's `category = payg` clause is unreachable

AC-27 requires "No data available" when `category = payg`. That lives on the detail
page — but PAYG cards are not clickable, so it cannot fire. The code handles it
defensively.

This is a **live contradiction between two instructions**: the PM's note said "All cards
are clickable… clicking either the All Entitlements card or individual product module
cards navigates to the corresponding detail page", and a later instruction made PAYG and
Inactive cards non-clickable. Needs one ruling.

### 2. AC-05 superseded, not met as written

AC-05 says the banner "scrolls to the benefit cards grid". Per the PM it now opens an
aggregate detail page. The AC text should be updated to match.

### 3. AC-17 renders an undocumented status pill

The detail header shows a status pill AC-17 doesn't list, and which the PRD's own
"Removed in this revision" note names explicitly. Extra rather than missing — worth
confirming before it's treated as intended.

### 4. Aggregate page: alerts have no meaning

The All Entitlements page offers per-benefit alert thresholds and recipients for a
combined pool. Nothing can act on that. It appears only when every benefit is limited;
with any unlimited benefit the volume-alert variant shows instead, which is defensible.

### 5. Swappable products — not started

PM has proposed a "Swappable Product" category for cross-category (SaaS "Combine")
entitlements, with a per-membership-template list on its detail page. Not in the 29 ACs;
needs new criteria. The blocking question is **double counting**: if a swappable point
can be spent on Lounge, does it also appear in Lounge's allocation? The summary banner
sums across categories, so AC-01 – AC-04 likely reopen.

---

## Known limitations

- **All data is mock.** Usage series, activity rows and "Avg: N/day" are generated
  client-side. The old AC requiring real API data was deleted in this revision, so
  nothing fails on it — but nothing is wired to an API either.
- **Nothing persists.** Alert thresholds, recipients and Save fire a toast only.
- **No typecheck in CI.** `typescript` isn't in `package.json` and `vite build` doesn't
  typecheck, so type errors don't surface. One pre-existing example:
  `tabs/ActiveEntitlementsTab.tsx` passes an `onManage` prop that `EntitlementCard`
  doesn't accept. That file is also unreferenced.
- **Duplicate grid markup.** `BenefitsFlow.tsx` (dev docs) re-implements the card grid
  in two places with hardcoded `grid-cols-3`, so it won't reflow like the real page.
- **`theme.css` sets `button { font-weight: 500 }`.** Any text inside a `<button>`
  without an explicit weight silently renders medium. This has bitten twice — the
  summary banner and the benefit cards. Both now set `font-normal` explicitly.

---

## Contrast notes

Secondary text was moved from `#9ca3af` (the *disabled* token) to `#6a7282` (tertiary),
taking it from **2.54:1 to 4.84:1** — above the 4.5:1 WCAG AA threshold for normal text.

Still below AA: text on **inactive cards**, at **2.35:1**. The token is correct; the
card-level `opacity-60` caps it. No colour can clear 4.5:1 through that multiplier —
reaching AA means expressing "greyed out" through colour rather than opacity.

---

## Key files

| File | Role |
|---|---|
| `entitlements/EntitlementsPage.tsx` | List page: catalogue-driven grid, search, sort, card routing |
| `entitlements/EntitlementCard.tsx` | Benefit card, `InactiveCategoryCard`, `PayAsYouGoCard` |
| `entitlements/EntitlementsSummaryBanner.tsx` | Summary banner and its aggregation |
| `entitlements/EntitlementDetailPage.tsx` | Detail page: KPIs, alerts, chart, activity |
| `entitlements/benefitStatus.ts` | Status derivation, ring colour, sort rank, `averageUsageRate` |
| `entitlements/catalogData.ts` | Dragonpass category catalogue; `clientStatus` drives card type |
| `entitlements/mockEntitlements.ts` | Per-environment entitlement mocks |
| `charts/ChartPrimitives.tsx` | `UsageComboChart` added alongside existing primitives |

---

## Sharing a build without touching `main`

`.github/workflows/deploy.yml` fires on push to `main` **or** `workflow_dispatch`, so any
branch can be deployed manually from the Actions tab. Note GitHub Pages serves one site
per repo — deploying a branch replaces whatever is live.

For a client preview that touches nothing:

```bash
npx vite build --base=/ --outDir dist-preview
```

then drag `dist-preview/` to a static host. It won't open over `file://` — the bundle
uses ES modules, which browsers block on that protocol.

`index.html` loads `https://mcp.figma.com/mcp/html-to-design/capture.js` from the Figma
Make scaffold. Worth stripping from anything client-facing.
