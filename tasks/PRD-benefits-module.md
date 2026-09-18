# 「Client Portal」Enable Client to See the Entitlements Volume & Status — Benefits module

> Source: Confluence export, 15 Sep 2026 12:15. Converted to Markdown.
>
> **Revision history**
> - *15 Sep 12:15* (this version) — 29 ACs. Adds §5.1.5 Pay-as-you-go (AC-16). Everything from the old AC-16 onward renumbered +1. No other text changed.
> - *15 Sep 08:18* — 28 ACs. Major rewrite of the 14 Sep version.
> - *14 Sep* — 38 ACs. Superseded.
>
> Blocks marked **[NOTE]** were added after the export and are not part of the
> original document. Source typos are preserved verbatim.

## 1. Requirement Overview

| Item | Details |
|---|---|
| Requirement Source – Business Channel | Generic API; Dragonpass App |
| Requirement Theme | Enable client to see & manage their benefits |
| Requirement Value | Customers can self-serve view benefit allocation, usage and remaining balance in real time, eliminating manual export by operations. Establishes the foundation for future benefit budget management and coupon-type benefit expansion. |
| Product Module | Benefits module |
| Priority | P0 (MVP) |

### Feature

1. Benefits list page with All Benefits summary banner (Total Benefits / Total Used / Total Remaining / Avg Usage Rate) and benefit card grid with search & sort;
2. Benefit detail page with 4 KPI cards, Daily usage chart (last 14 days), and Recent activity table with cross-navigation to Order Management;
3. Unlimited benefit display adaptation across banner, cards and detail page (∞ icon, no remaining/usage %, Usage Velocity & Active Users replacement metrics);
4. Usage alert threshold configuration (80%/90% toggles + alert recipients) for limited benefits.

### Delivery Scope

- Benefits list page (summary banner + card grid + search/sort);
- Benefit detail page (header + 4 KPIs + Usage alerts + Daily usage chart + Recent activity table).

### Out of Scope for This Sprint

- Benefit configuration, issuance and on/off-shelf operations (SaaS ops backend);
- Coupon-type benefit integration;
- Usage velocity threshold alerts for Unlimited benefits (P1);
- Dark mode.

> **[NOTE] Section 1 has not been updated to match Section 5** in either 15 Sep
> revision. Five statements above are contradicted by the acceptance criteria:
>
> - *Feature 3* promises Usage Velocity and Active Users replacement metrics. AC-20 removes them — unlimited KPIs now mirror the banner instead.
> - *Feature 2* specifies a 14-day chart. AC-23 specifies 7 days by default.
> - *Feature 4* describes fixed 80%/90% toggles. AC-21 makes the thresholds manually editable.
> - *Out of Scope* lists unlimited velocity threshold alerts as P1. AC-22 brings them into scope.
> - Neither *Feature* nor *Delivery Scope* mentions pay-as-you-go categories, which AC-16 now requires.
>
> Where the two disagree, Section 5 is the later text.

---

## 2. Background & Goals

### 2.1 Background

Client Portal currently has two modules: Analytics (data dashboard) and Order Management (order display). However, customers cannot self-serve view the allocation, usage, and remaining balance of the benefits they have purchased. Currently, this data must be manually exported by operations staff from the SaaS system and provided to customers — which is inefficient and cannot be updated in real time.

The SaaS Benefits System already has complete data on benefit templates, issued instances, and redemption usage, providing the data foundation for integration into Client Portal.

### 2.2 Goals

1. Customers can self-serve view the allocation, used amount, and remaining amount of all their benefits in Client Portal, without relying on manual operations export.
2. Customers can click into an individual benefit to view details: usage trends, daily consumption, and recent redemption activity.
3. Unlimited (infinite allocation) benefits are displayed correctly — no misleading remaining numbers or usage percentages.
4. Customers can self-configure usage alert thresholds (for limited benefits).

---

## 3. User Stories (Customer Perspective)

1. As a Dragonpass Client, I want to see all my benefits in one place with their allocation, used amount, and remaining amount at a glance, so that I can quickly understand what benefits I have and how much is left.
2. As a Dragonpass Client, I want to click into a specific benefit to view detailed usage data including daily consumption trends and recent redemption activity, so that I can track how my team is consuming each benefit.
3. As a Dragonpass Client, I want unlimited benefits to be clearly labeled as "Unlimited" without showing misleading remaining numbers or usage percentages, so that I am not confused by incorrect or irrelevant metrics.
4. As a Dragonpass Client, I want to set usage alert thresholds (e.g., 80% and 90%) for my limited benefits and specify who receives the alerts, so that I get notified before hitting the cap and can take action in time.
5. As a Dragonpass Client, I want to search and sort my benefits by name, usage, remaining, or status, so that I can quickly find the benefit I am looking for.

---

## 4. Metrics needed in Benefit Module (MVP)

| Metric | Definition & Calculation Caliber | Presentation Format | Page Level |
|---|---|---|---|
| Total Entitlements | Count of distinct product moudle categories/types under the client. When at least one product moudle is Unlimited, displays "Unlimited" (aggregate pool is infinite). | Large number in summary banner | Level 1 — List |
| Total Used | Sum of redeemed/consumed points across all product module (limited + unlimited) in the current period. Always finite and always numeric. | Large number in summary banner | Level 1 — List |
| Total Remaining | Sum of (allocation − used) across limited entitlements. When at least one product moudle is Unlimited, displays "Unlimited" (infinite pool cannot be summed). | Large number in summary banner; "Unlimited" in blue when applicable | Level 1 — List |
| Avg Usage Rate | Average of (used ÷ allocation) across limited entitlements only. When at least one product moudle is Unlimited, displays "—" (N/A — infinite denominator). | Large percentage in summary banner; "—" (em dash, secondary grey) when applicable | Level 1 — List |
| Allocation | Total points allocated for this product moudle in the current period = product moudle template point allocation × number of eligible users (per SaaS instance). | Shown as denominator in "X of Y remaining"; also as ring context | Level 1 — List<br>Level 2 — Detail |
| Used | Total redeemed/consumed points for this product moudle in the current period, from order/redemption data. | Large 28px bold number; ring center shows usage % | Level 1 — List<br>Level 2 — Detail |
| Remaining | Allocation − Used. | "X of Y remaining" text, remaining value in bold; ring progress visualizes used portion | Level 1 — List<br>Level 2 — Detail |
| Usage % | Used ÷ Allocation × 100%. | Circular progress ring (48px); color: <50% green / 50–75% orange / >75% red / 100% checkmark ✓ | Level 1 — List<br>Level 2 — Detail |
| Daily Usage Trend | Daily consumption over the displayed period (past 7/30/90 days or custom range). | "Avg: X/day" label next to chart title | Level 2 — Detail |

> **[NOTE] The Status pill has no definition in this document.** The 14 Sep
> version defined four states (Active / Low / Unlimited / Exhausted), the 25%
> Low threshold, and the colour coding. That row was removed in the 15 Sep
> rewrite and has not returned. AC-08 and AC-07 both reference a status pill,
> but nothing specifies its states or colours.
>
> Also removed and not restored: Benefit Name, Benefit Description, Period Type,
> Reset Date, Usage Velocity, ∞ Indicator, Active Users, and the alert and
> activity-table field definitions.

---

## 5. Acceptance Criteria

### 5.1 Benefits List Page

#### 5.1.1 Summary Banner (All Entitlements)

| ID | Acceptance Criterion |
|---|---|
| AC-01 | The summary banner displays 4 metrics: Total Entitlements, Total Used, Total Remaining, Usage Rate |
| AC-02 | When all product module are limited (no Unlimite entitlements product module exists), all 4 metrics display numeric values |
| AC-03 | When at least one product module is entitlements unlimited: Total Entitlements displays "Unlimited"; Total Used displays the actual aggregated consumption number (always finite); Total Remaining displays "Unlimited"; Usage Rate displays "—" (N/A — infinite denominator cannot be calculated) |
| AC-04 | Given that some categories have unlimited entitlement points while others have limited points: Add small descriptive text under each metric if there is at least one category with unlimited points. For this scenario, we need to show the total count of limited entitlement types, remaining entitlements and usage rate as hints underneath each metric. |
| AC-05 | The banner is clickable and scrolls to the benefit cards grid |

> **[NOTE] Implemented as AC-03 + AC-04 read together** — decided 15 Sep 2026,
> superseding an earlier PM instruction (14 Sep) to compute all four metrics
> from limited benefits only.
>
> When at least one benefit is unlimited:
>
> | Metric | Headline | Hint |
> |---|---|---|
> | Total Entitlements | "Unlimited" (blue) | `3 limited` |
> | Total Used | finite number across **all** benefits | `across all benefits` |
> | Total Remaining | "Unlimited" (blue) | `3,890 limited` |
> | Usage Rate | "—" (grey) | `73% limited` |
>
> When all benefits are limited, all four are numeric and no hints render (AC-02).
>
> Built in `EntitlementsSummaryBanner.tsx`. Three details the ACs do not cover,
> resolved in the implementation:
>
> - AC-04 lists hint values for three metrics only. Total Used was given
>   `across all benefits` so its scope is legible beside three limited-only hints.
> - If every benefit is unlimited there is no limited pool to describe, so hints
>   are suppressed and the headline row is unchanged.
> - AC-01 names the fourth metric "Usage Rate" and the first "Total
>   Entitlements"; §4 calls them "Avg Usage Rate" and "Total Entitlements".
>   AC-01's naming was used, since AC-01 specifies the banner.

#### 5.1.2 Benefit Cards Grid

| ID | Acceptance Criterion |
|---|---|
| AC-06 | Benefits displayed in a responsive card grid (3 columns desktop, 2/1 on narrow screens) |
| AC-07 | Combine all benefit categories supported by the Product Moduleʼs DP and the categories currently available for the Channel into the Benefits module. The Benefits module shall display all categories supported by Dragonpass. For supported categories: show benefit consumption metrics normally. For unsupported categories: grey out the cards, only display the category icon, name, description, status pill and explanatory note. |
| AC-08 | Each card contains: benefit icon, name, one-line description, status & unlimited tags, usage progress visualization |
| AC-09 | Sort by benefit usage in descending order by default, left to right and top to bottom. |
| AC-10 | Empty state shows illustration + "No benefits found" when no results match |

> **[NOTE]** AC-09 replaced the 14 Sep sort requirement (Name / Usage /
> Remaining / Status) with a single default order and no stated sort control.
> Search is not mentioned in this section, though §3 user story 5 and §1
> Feature 1 both still reference search and sort.
>
> AC-07 and AC-16 together introduce three card treatments beyond the normal
> one: unsupported categories (greyed, icon + name + description + status pill +
> note), and pay-as-you-go categories (name + description + footnote). The two
> are described as similar but their field lists differ — AC-07 includes a
> status pill, AC-16 does not.

#### 5.1.3 Limited Benefit Card

| ID | Acceptance Criterion |
|---|---|
| AC-11 | Displays a circular progress ring with usage percentage |
| AC-12 | Displays used amount as large number + "X of Y remaining" (remaining in bold) |

#### 5.1.4 Unlimited Benefit Card

| ID | Acceptance Criterion |
|---|---|
| AC-13 | Circular progress ring replaced by ∞ infinity icon; no usage percentage displayed |
| AC-14 | Displays used amount as large number + "redemptions this period" |
| AC-15 | Does NOT display remaining number, usage percentage, or total allocation number |

#### 5.1.5 Pay as you go Product module

| ID | Acceptance Criterion |
|---|---|
| AC-16 | For certain PYAG (pay-as-you-go) benefit categories: no benefit points are issued to customers, and the initial benefit point balance is 0. Users may purchase the category directly and pay upon use. For these items, do NOT display the progress ring, usage volume or remaining balance. Similar to Inactive categories, only show the benefit name and description. The footnote below reads: This product module is provided to users on a pay-as-you-go basis. |

> **[NOTE] New in this revision.** This is the only added criterion; everything
> from the old AC-16 onward is renumbered +1.
>
> It also explains AC-27's `category = pyag`, which had no referent in the
> previous revision.
>
> Two things AC-16 leaves open: how the front end identifies a PYAG category
> (no field or flag is named), and whether "Similar to Inactive categories"
> means PYAG cards are greyed out the way AC-07's unsupported categories are.

### 5.2 Entitlement Detail Page

#### 5.2.1 Page Header

| ID | Acceptance Criterion |
|---|---|
| AC-17 | Header contains: back link ("← Back to Benefits"), benefit icon, name, description |

#### 5.2.2 KPI Cards (4 cards)

| ID | Acceptance Criterion |
|---|---|
| AC-18 | Each KPI card contains: metric name, large number |
| AC-19 | When the product module are limited, all 4 metrics display numeric values |
| AC-20 | When the entitlements of the product module is unlimited: Allocation displays "Unlimited"; Used displays the actual aggregated consumption number (always finite); Remaining displays "Unlimited"; Usage Rate displays "—" (N/A — infinite denominator cannot be calculated) |

> **[NOTE]** AC-18 drops the sparkline from the KPI card, and AC-20 replaces the
> Usage Velocity and Active Users substitutions with the same treatment as the
> banner. Both are implemented in the current prototype and are no longer
> required.
>
> Neither AC covers what the four KPI cards show for a PYAG category, where
> allocation and balance are 0 by definition.

#### 5.2.3 Usage Alerts

| ID | Acceptance Criterion |
|---|---|
| AC-21 | Limited benefit: displays 80% threshold toggle, 90% threshold toggle, Alert recipients email input, Save button；threshold values support manual input and adjustment. |
| AC-22 | Unlimited benefit: Display alert toggles for usage volume and daily usage volume. Toggles are disabled by default with no preset thresholds; users may input custom benefit usage volume for alerts. |

#### 5.2.4 Daily Usage Chart

| ID | Acceptance Criterion |
|---|---|
| AC-23 | Shows a combo bar-and-line chart with usage volume and line trend for the last 7 days by default. Hover to view the specific date and daily usage volume. |
| AC-24 | The chart is displayed for both Limited and Unlimited benefits. |
| AC-25 | Time range selector supports Last 7 days / 30 days / 90 days and custom date range. |

### 5.3 Recent Activity Detail

| ID | Acceptance Criterion |
|---|---|
| AC-26 | Table columns: Order ID, Benefit Module, Customer, Status, Created Time, Redemption Time. Show redemption records of benefit points issued to key customers for selected category. |
| AC-27 | Display "No data available" if there is no historical redemption order dataor category = pyag. |
| AC-28 | Support search, filters, time range (Today / Last 7d / Custom) and export. |
| AC-29 | Click order row to pop up order detail modal (reuse Order Management modal). |

> **[NOTE]** AC-29 changes the interaction from navigating to Order Management
> to opening a modal reusing that module's component.

---

## [NOTE] Current implementation status

| Area | State |
|---|---|
| Summary banner (AC-01 – AC-05) | Built, matches AC-03 + AC-04 |
| Card grid, search, empty state (AC-06, AC-10) | Existed before this work |
| Limited / unlimited cards (AC-11 – AC-15) | Existed before this work |
| Sort default (AC-09) | Repo sorts by used descending — appears to match |
| Status pill (AC-07, AC-08) | Repo has Active / Paused / Completed; no spec to build against |
| PYAG category (AC-16, AC-27) | Not started |
| Unsupported categories (AC-07) | Not started |
| Detail KPIs (AC-18 – AC-20) | Repo has sparklines and the old unlimited treatment; needs simplifying |
| Alerts (AC-21, AC-22) | Repo has fixed 80/90 toggles; needs editable thresholds and unlimited variant |
| Chart (AC-23 – AC-25) | Repo has a 14-day bar chart; needs combo chart, 7-day default, range selector |
| Activity table (AC-26 – AC-29) | Repo columns differ; needs new columns, export, modal |
