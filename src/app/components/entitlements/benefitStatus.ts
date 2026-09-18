import type { Entitlement } from '../../types/portalTypes';

type BenefitStatusVariant = 'active' | 'exhausted' | 'low' | 'unlimited';

// Status pill states, carried over from the 14 Sep PRD — the current revision
// references the pill (AC-07, AC-08) but no longer defines it.
// Active (green) / Low (yellow, remaining < 25%) / Unlimited (blue) /
// Exhausted (red, limited benefit fully used). Inactive (grey) is rendered by
// InactiveCategoryCard, which has no entitlement behind it.
export function benefitStatus(e: Entitlement): { variant: BenefitStatusVariant; label: string } {
  const cap = e.cap;
  if (cap === null || cap === undefined) return { variant: 'unlimited', label: 'Unlimited' };

  if (e.status === 'exhausted' || e.used >= cap) return { variant: 'exhausted', label: 'Exhausted' };
  if (cap > 0 && e.remaining / cap < 0.25) return { variant: 'low', label: 'Low' };

  return { variant: 'active', label: 'Active' };
}

// Progress rings share the pill's thresholds: green while Active, yellow once
// Low (used > 75%). At Exhausted (100%) the ring drops to the track grey and
// the checkmark carries the state instead.
export function usageRingColor(pct: number): string {
  if (pct >= 100) return '#e5e7eb';
  if (pct > 75) return '#f59e0b';
  return '#34d399';
}

// AC-09 "Status" sort: most urgent first, matching the existing usage/remaining
// sorts which also surface attention-needed benefits at the top.
const STATUS_RANK: Record<BenefitStatusVariant, number> = {
  exhausted: 0,
  low: 1,
  active: 2,
  unlimited: 3,
};

export function benefitStatusRank(e: Entitlement): number {
  return STATUS_RANK[benefitStatus(e).variant];
}

// §4 Avg Usage Rate: the mean of each limited benefit's own rate — not the
// combined pool's used/allocation, which weights large benefits more heavily.
export function averageUsageRate(entitlements: Entitlement[]): number {
  const limited = entitlements.filter(e => e.cap !== null && e.cap !== undefined);
  if (!limited.length) return 0;
  const total = limited.reduce((sum, e) => sum + e.used / (e.cap ?? e.allocation), 0);
  return Math.round((total / limited.length) * 100);
}
