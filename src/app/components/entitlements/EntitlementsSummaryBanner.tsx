import { ArrowRight } from 'lucide-react';
import type { Entitlement } from '../../types/portalTypes';
import { averageUsageRate } from './benefitStatus';

interface EntitlementsSummaryBannerProps {
  entitlements: Entitlement[];
  onClick: () => void;
}

// Matches EntitlementCard: a null cap means the allocation is infinite.
const isUnlimited = (e: Entitlement) => e.cap === null || e.cap === undefined;

export function EntitlementsSummaryBanner({ entitlements, onClick }: EntitlementsSummaryBannerProps) {
  const limited = entitlements.filter((e) => !isUnlimited(e));
  const hasUnlimited = limited.length < entitlements.length;

  // AC-03: Total Used is finite in every case and covers limited + unlimited.
  const totalUsed = entitlements.reduce((sum, e) => sum + e.used, 0);

  const limitedAllocation = limited.reduce((sum, e) => sum + (e.cap ?? e.allocation), 0);
  const limitedRemaining = limited.reduce((sum, e) => sum + e.remaining, 0);
  const limitedUsageRate = averageUsageRate(entitlements);

  // With no limited benefits there is no limited pool to describe, so the
  // hints that quantify one are suppressed.
  const hasLimited = limited.length > 0;
  const ACROSS_ALL = 'across all benefits';

  const UNLIMITED = 'Unlimited';
  const EM_DASH = '—';

  const stats = [
    {
      label: 'Total Entitlements',
      value: hasUnlimited ? UNLIMITED : limitedAllocation.toLocaleString(),
      tone: 'default',
      hint: hasUnlimited && hasLimited
        ? `${limited.length} limited with ${limitedAllocation.toLocaleString()} entitlements total`
        : null,
    },
    {
      label: 'Total Used',
      value: totalUsed.toLocaleString(),
      tone: 'default',
      hint: hasUnlimited ? ACROSS_ALL : null,
    },
    {
      label: 'Total Remaining',
      value: hasUnlimited ? UNLIMITED : limitedRemaining.toLocaleString(),
      tone: 'default',
      hint: hasUnlimited && hasLimited
        ? `${limited.length} limited with ${limitedRemaining.toLocaleString()} entitlements remaining`
        : null,
    },
    {
      label: 'Usage Rate',
      value: hasUnlimited ? EM_DASH : `${limitedUsageRate}%`,
      tone: hasUnlimited ? 'muted' : 'default',
      hint: hasUnlimited && hasLimited ? `${limitedUsageRate}% of limited pool` : null,
    },
  ];

  const toneClass = (tone: string) => {
    if (tone === 'muted') return 'text-[#9ca3af]';
    return 'text-[#0a2333]';
  };

  return (
    <button
      onClick={onClick}
      className="group cursor-pointer w-full text-left bg-white rounded-xl border border-[#e5e7eb] p-5 mb-4 flex flex-wrap items-center gap-x-6 gap-y-4 transition-colors hover:border-[#0a2333]/30 hover:bg-[#f9fafb] focus:outline-none focus-visible:border-[#0a2333] focus-visible:ring-2 focus-visible:ring-[#0a2333]/20"
    >
      <div className="shrink-0 pr-2">
        <div className="flex items-center gap-2">
          <h2 className="font-['Cabin',sans-serif] font-bold text-[15px] text-[#0a2333]">
            All Entitlements
          </h2>
          <ArrowRight
            size={16}
            className="shrink-0 text-[#9ca3af] transition-colors group-hover:text-[#0a2333]"
          />
        </div>
        <p className="font-['Cabin',sans-serif] font-normal text-[12px] text-[#6a7282] mt-0.5">
          Combined point pool across all entitlements
        </p>
      </div>

      <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:flex lg:items-stretch lg:divide-x lg:divide-[#e5e7eb] xl:w-auto xl:shrink-0 xl:ml-auto">
        {stats.map((s, i) => (
          <div
            key={s.label}
            /* Dividers are drawn per tile because the tiles are a grid below lg:
               stacked on mobile, 2x2 on tablet. From lg the row is linear and
               divide-x takes over. */
            className={[
              'flex flex-col lg:flex-1 lg:px-5 lg:first:pl-0 lg:last:pr-0 xl:flex-initial xl:whitespace-nowrap',
              i > 0 ? 'max-sm:border-t max-sm:border-[#e5e7eb] max-sm:pt-5' : '',
              i < stats.length - 1 ? 'max-sm:pb-5' : '',
              i % 2 === 1 ? 'sm:max-lg:border-l sm:max-lg:border-[#e5e7eb] sm:max-lg:pl-5' : 'sm:max-lg:pr-5',
              i >= 2 ? 'sm:max-lg:border-t sm:max-lg:border-[#e5e7eb] sm:max-lg:pt-5' : 'sm:max-lg:pb-5',
            ].join(' ')}
          >
            <p className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider whitespace-nowrap">
              {s.label}
            </p>
            <span
              className={`font-['Cabin',sans-serif] font-bold tabular-nums leading-none mt-2 text-[28px] whitespace-nowrap ${toneClass(s.tone)}`}
            >
              {s.value}
            </span>
            {s.hint && (
              <p className="font-['Cabin',sans-serif] font-normal text-[13px] text-[#6a7282] mt-1.5">
                {s.hint}
              </p>
            )}
          </div>
        ))}
      </div>
    </button>
  );
}
