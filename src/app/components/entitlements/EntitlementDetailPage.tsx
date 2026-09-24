// TODO(API reconciliation): Confirm with API/SaaS team which of the following fields
// are returned per single pass: allocation, used, remaining, usage %, daily-usage
// series (last 14 days), per-order activity (reference, date, customer, order ref,
// status). Any field not available needs to be hidden or replaced before Q2 ship.
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle, Layers, AlertTriangle, ChevronRight, SlidersHorizontal, ChevronDown, Check, CalendarDays, Plus, X, Download } from 'lucide-react';
import type { Entitlement } from '../../types/portalTypes';
import { Badge } from '../shared/Badge';
import { IconBox } from '../shared/IconBox';
import { PageShell } from '../shared/PageShell';
import { SearchInput } from '../shared/SearchInput';
import { Button } from '../shared/Button';
import { OrderDetailPanel } from '../orders/OrderDetailPanel';
import type { Order } from '../orders/orderData';
import { CATALOG_PRODUCTS } from './catalogData';
import { SWAPPABLE_MEMBERSHIPS } from './mockEntitlements';
import { UsageComboChart } from '../charts/ChartPrimitives';
import { benefitStatus } from './benefitStatus';
import { useApp } from '../../store';

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle, Layers,
};

function ThresholdInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      min={1}
      max={100}
      value={value}
      onChange={e => {
        const n = Number(e.target.value);
        if (!Number.isNaN(n)) onChange(Math.min(100, Math.max(1, n)));
      }}
      className="w-16 h-7 px-2 rounded-md border border-[#e5e7eb] bg-[#f9fafb] text-center text-[13px] font-['Cabin',sans-serif] font-semibold text-[#0a2333] focus:outline-none focus:border-[#0a2333]"
    />
  );
}

function FilterDropdown({
  label, value, options, onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="cursor-pointer flex items-center gap-1 h-8 px-3 rounded-lg border border-[#e5e7eb] bg-white font-['Cabin',sans-serif] text-[13px] text-[#45556c] hover:bg-[#f9fafb] transition-colors"
      >
        {label}
        {value !== 'all' && <span className="text-[#0a2333] font-medium">: {value}</span>}
        <ChevronDown size={12} className="text-[#9ca3af]" />
      </button>
      {open && (
        <div className="absolute left-0 top-9 z-20 min-w-[160px] bg-white border border-[#e5e7eb] rounded-xl shadow-lg py-1">
          {['all', ...options].map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="cursor-pointer w-full flex items-center justify-between gap-4 px-3 py-2 font-['Cabin',sans-serif] text-[13px] text-[#0a2333] hover:bg-[#f9fafb] transition-colors"
            >
              {opt === 'all' ? `All ${label.toLowerCase()}` : opt}
              {opt === value && <Check size={12} className="text-[#0a2333]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type ChartRange = 7 | 30 | 90 | 'custom';

function RangeDropdown({
  value, onChange, options, from, to, onFrom, onTo,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const label = value === 'custom'
    ? (from && to ? `${from} – ${to}` : 'Custom range')
    : options.find(o => o.value === value)?.label ?? '';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="cursor-pointer flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white font-['Cabin',sans-serif] text-[13px] text-[#45556c] hover:bg-[#f9fafb] transition-colors"
      >
        <CalendarDays size={13} />
        <span className="text-[#0a2333] font-medium">{label}</span>
        <ChevronDown size={12} className="text-[#9ca3af]" />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-20 w-56 bg-white border border-[#e5e7eb] rounded-xl shadow-lg py-1">
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className="cursor-pointer w-full flex items-center justify-between px-3 py-2 font-['Cabin',sans-serif] text-[13px] text-[#0a2333] hover:bg-[#f9fafb] transition-colors"
            >
              {o.label}
              {value === o.value && <Check size={12} className="text-[#0a2333]" />}
            </button>
          ))}
          <button
            onClick={() => onChange('custom')}
            className="cursor-pointer w-full flex items-center justify-between px-3 py-2 font-['Cabin',sans-serif] text-[13px] text-[#0a2333] hover:bg-[#f9fafb] transition-colors"
          >
            Custom range
            {value === 'custom' && <Check size={12} className="text-[#0a2333]" />}
          </button>
          {value === 'custom' && (
            <div className="flex flex-col gap-2 px-3 pt-2 pb-1 mt-1 border-t border-[#e5e7eb]">
              <label className="flex flex-col gap-1 font-['Cabin',sans-serif] text-[12px] text-[#6a7282]">
                From
                <input
                  type="date"
                  value={from}
                  onChange={e => onFrom(e.target.value)}
                  className="h-8 px-2 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[13px] font-['Cabin',sans-serif] text-[#0a2333] focus:outline-none focus:border-[#0a2333]"
                />
              </label>
              <label className="flex flex-col gap-1 font-['Cabin',sans-serif] text-[12px] text-[#6a7282]">
                To
                <input
                  type="date"
                  value={to}
                  onChange={e => onTo(e.target.value)}
                  className="h-8 px-2 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[13px] font-['Cabin',sans-serif] text-[#0a2333] focus:outline-none focus:border-[#0a2333]"
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VolumeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="number"
      min={1}
      value={value}
      placeholder="—"
      onChange={e => onChange(e.target.value)}
      className="w-20 h-7 px-2 rounded-md border border-[#e5e7eb] bg-[#f9fafb] text-center text-[13px] font-['Cabin',sans-serif] font-semibold text-[#0a2333] placeholder:font-normal placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0a2333]"
    />
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${checked ? 'bg-[#0a2333]' : 'bg-[#d1d5db]'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${checked ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function buildUsageSeries(days: number, seed: number, endDate?: string) {
  const out: { label: string; full: string; usage: number }[] = [];
  const end = endDate ? new Date(endDate) : new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const wave = Math.abs(Math.sin((seed + i) * 1.7));
    out.push({
      label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      full: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      usage: Math.round(20 + wave * 55),
    });
  }
  return out;
}

// Dates are relative to today so the Today / Last 7 days filters have something
// to match in the prototype.
function daysAgo(n: number, hour: number, minute: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function formatMoment(d: Date | null) {
  if (!d) return '—';
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${date}, ${time}`;
}

const ACTIVITY_ROWS = [
  { orderId: 'ORD-2026-0047', customer: 'J. Harrison', status: 'Used' as const, created: daysAgo(0, 9, 14), redeemed: daysAgo(0, 11, 2) },
  { orderId: 'ORD-2026-0046', customer: 'S. Mitchell', status: 'Used' as const, created: daysAgo(0, 14, 20), redeemed: daysAgo(0, 18, 45) },
  { orderId: 'ORD-2026-0045', customer: 'D. Chen', status: 'Pending' as const, created: daysAgo(1, 8, 5), redeemed: null },
  { orderId: 'ORD-2026-0044', customer: 'A. Patel', status: 'Used' as const, created: daysAgo(3, 16, 32), redeemed: daysAgo(2, 7, 10) },
  { orderId: 'ORD-2026-0043', customer: 'L. Kim', status: 'Used' as const, created: daysAgo(5, 11, 48), redeemed: daysAgo(5, 13, 26) },
  { orderId: 'ORD-2026-0042', customer: 'M. Torres', status: 'Cancelled' as const, created: daysAgo(9, 10, 2), redeemed: null },
  { orderId: 'ORD-2026-0041', customer: 'R. Singh', status: 'Used' as const, created: daysAgo(12, 19, 15), redeemed: daysAgo(12, 20, 40) },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const productIcon = (slug: string): React.ElementType =>
  iconMap[CATALOG_PRODUCTS.find(p => p.slug === slug)?.icon ?? ''] ?? Smartphone;

const productName = (slug: string) =>
  CATALOG_PRODUCTS.find(p => p.slug === slug)?.name ?? slug;

function makeOrder(row: typeof ACTIVITY_ROWS[number], moduleName: string): Order {
  return {
    id: row.orderId,
    orderRef: row.orderId,
    bookingRef: row.orderId,
    type: 'airport-lounge',
    serviceDate: formatMoment(row.created),
    benefit: 'ENTITLEMENT',
    total: 18,
    paid: 0,
    funded: 18,
    status: 'CONFIRMED',
    bookingId: row.orderId,
    bookingDate: formatMoment(row.created),
    customerName: row.customer,
    customerEmail: `${row.customer.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
    customerPhone: '+44 7700 900000',
    basePrice: 15,
    taxesFees: 3,
    paymentMethod: 'Entitlement',
    serviceDescription: moduleName,
  };
}

interface EntitlementDetailPageProps {
  entitlement: Entitlement;
  /** Set when the category has no entitlement behind it. */
  categoryState?: 'payg' | 'inactive';
  /** Overrides the computed rate — the aggregate view averages per-benefit rates. */
  usageRate?: number;
  activeView: string;
  onNavigate: (id: string) => void;
  onBack: () => void;
  /** Swappable (Combine) benefit: slugs of the categories its points cover. */
  swappableCategories?: string[];
  /** Slugs to spread across the activity rows, where a single benefit name
      would be wrong: a swappable pool, or the all-benefits aggregate. */
  activityModules?: string[];
}

export function EntitlementDetailPage({ entitlement, categoryState, usageRate, activeView, onNavigate, onBack, swappableCategories, activityModules }: EntitlementDetailPageProps) {
  const { dispatch } = useApp();
  const isPayg = categoryState === 'payg';
  // No pool of points behind this category, so there are no figures to show.
  const noPool = categoryState !== undefined;
  const status = benefitStatus(entitlement);
  const hasCap = entitlement.cap !== null && entitlement.cap !== undefined;
  const capValue = entitlement.cap || 0;
  const [alert80, setAlert80] = useState(entitlement.alertThresholds.thresholds.includes(80));
  const [alert90, setAlert90] = useState(entitlement.alertThresholds.thresholds.includes(90));
  const [threshold1, setThreshold1] = useState(entitlement.alertThresholds.thresholds[0] ?? 80);
  const [threshold2, setThreshold2] = useState(entitlement.alertThresholds.thresholds[1] ?? 90);
  const [volumeAlert, setVolumeAlert] = useState(false);
  const [volumeThreshold, setVolumeThreshold] = useState('');
  const [dailyAlert, setDailyAlert] = useState(false);
  const [dailyThreshold, setDailyThreshold] = useState('');
  const [recipients, setRecipients] = useState<string[]>(entitlement.alertThresholds.recipients);
  const [newRecipient, setNewRecipient] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const [chartRange, setChartRange] = useState<ChartRange>(7);
  const [chartFrom, setChartFrom] = useState('');
  const [chartTo, setChartTo] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [activePeriod, setActivePeriod] = useState<'today' | 'last7' | 'custom' | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const Icon = iconMap[entitlement.productIcon] || Smartphone;
  const pct = usageRate ?? (hasCap && capValue > 0 ? Math.min(100, (entitlement.used / capValue) * 100) : 0);
  const customDays = chartFrom && chartTo
    ? Math.min(365, Math.max(1, Math.round((new Date(chartTo).getTime() - new Date(chartFrom).getTime()) / 86400000) + 1))
    : 7;
  const chartDays = chartRange === 'custom' ? customDays : chartRange;
  const usageSeries = buildUsageSeries(
    chartDays,
    entitlement.id.length + entitlement.used,
    chartRange === 'custom' && chartTo ? chartTo : undefined,
  );
  const avgPerDay = Math.round(usageSeries.reduce((sum, d) => sum + d.usage, 0) / usageSeries.length);

  const addRecipient = () => {
    // Pasting a comma-separated list is common, so each address becomes its
    // own chip. Whatever is valid and new gets added; the rest is reported
    // rather than silently dropped.
    const entries = newRecipient.split(',').map(e => e.trim()).filter(Boolean);
    if (!entries.length) return;

    const seen = new Set<string>();
    const valid: string[] = [];
    const invalid: string[] = [];
    const duplicate: string[] = [];

    entries.forEach(e => {
      if (!EMAIL_RE.test(e)) invalid.push(e);
      else if (recipients.includes(e) || seen.has(e)) duplicate.push(e);
      else { seen.add(e); valid.push(e); }
    });

    if (valid.length) setRecipients([...recipients, ...valid]);

    const problems = [];
    if (invalid.length) problems.push(`Not a valid email address: ${invalid.join(', ')}.`);
    if (duplicate.length) problems.push(`Already added: ${duplicate.join(', ')}.`);
    setRecipientError(problems.join(' '));

    // Keep the malformed ones in the field so they can be corrected; a
    // duplicate is nothing to fix, so it is only reported.
    setNewRecipient(invalid.join(', '));
  };

  const UNLIMITED = 'Unlimited';
  const EM_DASH = '—';
  const showWarning = hasCap && pct >= 80;

  const inPeriod = (d: Date) => {
    if (activePeriod === 'all') return true;
    if (activePeriod === 'today') {
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }
    if (activePeriod === 'last7') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      return d >= cutoff;
    }
    // Custom range: an open end stays open.
    if (filterFrom && d < new Date(`${filterFrom}T00:00`)) return false;
    if (filterTo && d > new Date(`${filterTo}T23:59`)) return false;
    return true;
  };

  const isSwappable = Boolean(swappableCategories?.length);
  const memberships = SWAPPABLE_MEMBERSHIPS[entitlement.environment] ?? [];
  // "Eligible across all templates" is exactly that: the union of what the
  // templates cover, so it tracks the environment's data.
  const eligibleUnion = [...new Set(memberships.flatMap(m => m.eligible))];
  const moduleSlugs = isSwappable ? eligibleUnion : activityModules;

  // A swappable point is spent in one of the supported categories, so each row
  // reports where it landed rather than the benefit it was drawn from.
  const activityRows = ACTIVITY_ROWS.map((r, i) => {
    const slug = moduleSlugs?.length
      ? moduleSlugs[i % moduleSlugs.length]
      : entitlement.productSlug;
    return {
      ...r,
      moduleSlug: slug,
      module: moduleSlugs?.length ? productName(slug) : entitlement.productName,
    };
  });

  const q = activitySearch.trim().toLowerCase();
  // AC-27: a pay-as-you-go category has no redemption history to list.
  const filtered = (noPool ? [] : activityRows).filter(r =>
    (!q || r.orderId.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q)) &&
    (statusFilter === 'all' || r.status === statusFilter) &&
    (customerFilter === 'all' || r.customer === customerFilter) &&
    (categoryFilter === 'all' || r.module === categoryFilter) &&
    inPeriod(r.created)
  );

  const countInPeriod = (period: 'today' | 'last7') =>
    activityRows.filter(r => {
      if (period === 'today') return r.created.toDateString() === new Date().toDateString();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      return r.created >= cutoff;
    }).length;

  const customers = [...new Set(activityRows.map(r => r.customer))];
  // Only a swappable benefit spans more than one category, so the filter is
  // only offered where there is something to choose between.
  const categories = [...new Set(activityRows.map(r => r.module))];
  const hasHistory = !noPool && activityRows.length > 0;

  const exportCsv = () => {
    const header = ['Order ID', 'Benefit Module', 'Customer', 'Status', 'Created Time', 'Redemption Time'];
    const body = filtered.map(r => [
      r.orderId, r.module, r.customer, r.status, formatMoment(r.created), formatMoment(r.redeemed),
    ]);
    const csv = [header, ...body]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entitlement.productSlug}-activity.csv`;
    a.click();
    URL.revokeObjectURL(url);
    dispatch({ type: 'SET_TOAST', payload: { message: `Exported ${filtered.length} transactions`, type: 'success' } });
  };
  const exportMemberships = () => {
    const header = ['Membership Code', 'Swappable Entitlements', 'Eligible Products'];
    const body = memberships.map(m => [
      m.code,
      String(m.entitlements),
      m.eligible.map(productName).join('; '),
    ]);
    const csv = [header, ...body]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'swappable-products-detail.csv';
    a.click();
    URL.revokeObjectURL(url);
    dispatch({ type: 'SET_TOAST', payload: { message: `Exported ${memberships.length} membership templates`, type: 'success' } });
  };

  const hasActiveFilters = Boolean(q) || statusFilter !== 'all' || customerFilter !== 'all' || categoryFilter !== 'all' || activePeriod !== 'all';

  return (
    <PageShell activeView={activeView} onNavigate={onNavigate}>
      <div className="flex flex-col flex-1 overflow-auto w-full max-w-[1440px] mx-auto">

        {/* Header — scrolls with the page */}
        <div className="px-4 sm:px-8 pt-5 pb-4 border-b border-[#e5e7eb] shrink-0">
          <button
            onClick={onBack}
            className="cursor-pointer inline-flex items-center gap-1.5 font-['Cabin',sans-serif] text-[12px] text-[#6a7282] hover:text-[#0a2333] transition-colors mb-3"
          >
            <ArrowLeft size={13} />
            Back to Benefits
          </button>

          {/* Top-aligned: the eligible-categories list can wrap to several rows,
              and centring would drag the icon down past the title. The offset
              keeps a two-line header looking exactly as it did. */}
          <div className="flex items-start gap-4">
            <IconBox className="mt-[7px]">
              <Icon size={20} className="text-[#0a2333]" />
            </IconBox>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-['Cabin',sans-serif] font-bold text-[22px] text-[#0a2333]">{entitlement.productName}</h1>
                <Badge variant={isPayg ? 'payg' : categoryState === 'inactive' ? 'inactive' : status.variant}>
                  {isPayg ? 'Pay as you go' : categoryState === 'inactive' ? 'Inactive' : status.label}
                </Badge>
              </div>
              {/* On a swappable benefit the eligible list takes the description's
                  place — the description only restated it. The list is the union
                  across membership templates; no single template need cover all
                  of them, hence the label. */}
              {isSwappable ? (
                <div className="flex items-center flex-wrap gap-1.5 mt-0.5">
                  <span className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">
                    Eligible across all templates:
                  </span>
                  {eligibleUnion.map(slug => {
                    const CategoryIcon = productIcon(slug);
                    return (
                      <span
                        key={slug}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f3f4f6] font-['Cabin',sans-serif] text-[12px] text-[#374151]"
                      >
                        <CategoryIcon size={12} className="shrink-0 text-[#45556c]" />
                        {productName(slug)}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282] mt-0.5">{entitlement.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div>

          {/* KPI Cards */}
          <div className="px-4 sm:px-8 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Allocation */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex flex-col gap-1">
                <span className="font-['Cabin',sans-serif] text-[13px] text-[#62748e]">Allocation</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-['Cabin',sans-serif] font-bold text-[28px] text-[#0a2333] leading-tight">{noPool ? EM_DASH : hasCap ? entitlement.allocation.toLocaleString() : UNLIMITED}</span>
                </div>
              </div>

              {/* Used */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex flex-col gap-1">
                <span className="font-['Cabin',sans-serif] text-[13px] text-[#62748e]">Used</span>
                <div className="flex items-baseline gap-2">
                  <span className={`font-['Cabin',sans-serif] font-bold text-[28px] leading-tight ${noPool ? 'text-[#9ca3af]' : 'text-[#0a2333]'}`}>{noPool ? EM_DASH : entitlement.used.toLocaleString()}</span>
                </div>
              </div>

              {/* Remaining */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex flex-col gap-1">
                <span className="font-['Cabin',sans-serif] text-[13px] text-[#62748e]">Remaining</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-['Cabin',sans-serif] font-bold text-[28px] text-[#0a2333] leading-tight">{noPool ? EM_DASH : hasCap ? entitlement.remaining.toLocaleString() : UNLIMITED}</span>
                </div>
              </div>

              {/* Cap / Usage */}
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex flex-col gap-1">
                <span className="font-['Cabin',sans-serif] text-[13px] text-[#62748e]">Usage Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className={`font-['Cabin',sans-serif] font-bold text-[28px] leading-tight ${hasCap && !noPool ? 'text-[#0a2333]' : 'text-[#9ca3af]'}`}>
                    {hasCap && !noPool ? `${pct.toFixed(0)}%` : EM_DASH}
                  </span>
                  {hasCap && !noPool && showWarning && (
                    <span className={`flex items-center gap-0.5 font-['Cabin',sans-serif] text-[12px] ${pct >= 90 ? 'text-[#d4183d]' : 'text-amber-600'}`}>
                      <AlertTriangle size={12} />
                      {pct >= 100 ? 'Cap reached' : 'Approaching'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cap Configuration + Usage Chart side by side */}
          <div className="px-4 sm:px-8 py-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-[482px]">
              {/* Usage Alerts */}
              <div className="flex flex-col lg:min-h-0">
                <h3 className="font-['Cabin',sans-serif] font-bold text-[15px] text-[#0a2333] mb-3">Usage alerts</h3>
                <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex flex-col lg:flex-1 lg:min-h-0">
                  <div className="space-y-4 flex flex-col lg:flex-1 lg:min-h-0">
                    {noPool ? (
                      <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">
                        {isPayg
                          ? 'This category is provided on a pay-as-you-go basis. No benefit points are issued, so usage alerts do not apply.'
                          : 'This category is not available for this channel, so there is no usage to alert on.'}
                      </p>
                    ) : hasCap ? (
                      <>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 font-['Cabin',sans-serif] text-[13px] text-[#0a2333]">
                          Alert at
                          <ThresholdInput value={threshold1} onChange={setThreshold1} />
                          % usage
                        </div>
                        <div className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282]">Get notified before approaching your limit</div>
                      </div>
                      <div className="shrink-0">
                        <ToggleSwitch checked={alert80} onChange={(v) => {
                          setAlert80(v);
                          dispatch({ type: 'SET_TOAST', payload: { message: v ? `${threshold1}% alert enabled` : `${threshold1}% alert disabled`, type: 'success' } });
                        }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 font-['Cabin',sans-serif] text-[13px] text-[#0a2333]">
                          Alert at
                          <ThresholdInput value={threshold2} onChange={setThreshold2} />
                          % usage
                        </div>
                        <div className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282]">Final warning before hitting your cap</div>
                      </div>
                      <div className="shrink-0">
                        <ToggleSwitch checked={alert90} onChange={(v) => {
                          setAlert90(v);
                          dispatch({ type: 'SET_TOAST', payload: { message: v ? `${threshold2}% alert enabled` : `${threshold2}% alert disabled`, type: 'success' } });
                        }} />
                      </div>
                    </div>
                      </>
                    ) : (
                      <>
                        {/* AC-22: no cap to measure against, so alerts are on absolute
                            volume. Both off by default with no preset threshold. */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 font-['Cabin',sans-serif] text-[13px] text-[#0a2333]">
                            Alert when total usage reaches
                            <VolumeInput value={volumeThreshold} onChange={setVolumeThreshold} />
                            redemptions
                          </div>
                          <div className="shrink-0">
                          <ToggleSwitch checked={volumeAlert} onChange={(v) => {
                            setVolumeAlert(v);
                            dispatch({ type: 'SET_TOAST', payload: { message: v ? 'Usage volume alert enabled' : 'Usage volume alert disabled', type: 'success' } });
                          }} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 font-['Cabin',sans-serif] text-[13px] text-[#0a2333]">
                            Alert when same-day usage reaches
                            <VolumeInput value={dailyThreshold} onChange={setDailyThreshold} />
                            redemptions/day
                          </div>
                          <div className="shrink-0">
                          <ToggleSwitch checked={dailyAlert} onChange={(v) => {
                            setDailyAlert(v);
                            dispatch({ type: 'SET_TOAST', payload: { message: v ? 'Daily usage alert enabled' : 'Daily usage alert disabled', type: 'success' } });
                          }} />
                          </div>
                        </div>
                      </>
                    )}

                    {!noPool && (
                    <div className="flex items-start gap-2 rounded-lg border border-[#fde68a] bg-[#fffbeb] px-3 py-2">
                      <AlertTriangle size={14} className="text-[#b45309] shrink-0 mt-0.5" />
                      <p className="font-['Cabin',sans-serif] text-[12px] text-[#92400e]">
                        Usage data is reported with a one-day delay (T+1). Please account for this lag when setting alert thresholds.
                      </p>
                    </div>
                    )}

                    {!noPool && (
                    <div className="flex flex-col gap-2 lg:flex-1 lg:min-h-0">
                      <label className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">Alert recipients</label>

                      <div className="flex items-center gap-2">
                        <input
                          type="email"
                          value={newRecipient}
                          onChange={e => { setNewRecipient(e.target.value); setRecipientError(''); }}
                          aria-invalid={Boolean(recipientError)}
                          aria-describedby="recipient-hint"
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRecipient(); } }}
                          placeholder="name@company.com, another@company.com"
                          className={`flex-1 min-w-0 h-9 px-3 rounded-lg border text-[13px] font-['Cabin',sans-serif] text-[#0a2333] placeholder:text-[#9ca3af] focus:outline-none bg-[#f9fafb] ${
                            recipientError ? 'border-[#dc2626] focus:border-[#dc2626]' : 'border-[#e5e7eb] focus:border-[#0a2333]'
                          }`}
                        />
                        <button
                          onClick={addRecipient}
                          disabled={!newRecipient.trim()}
                          className="cursor-pointer shrink-0 flex items-center gap-1 h-9 px-3 rounded-lg border border-[#e5e7eb] font-['Cabin',sans-serif] text-[13px] text-[#45556c] hover:bg-[#f9fafb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                        >
                          <Plus size={14} />
                          Add
                        </button>
                      </div>

                      <p
                        id="recipient-hint"
                        role={recipientError ? 'alert' : undefined}
                        className={`font-['Cabin',sans-serif] text-[12px] ${recipientError ? 'text-[#dc2626]' : 'text-[#9ca3af]'}`}
                      >
                        {recipientError || 'Separate multiple addresses with commas'}
                      </p>

                      <div className="flex flex-wrap content-start gap-1.5 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
                        {recipients.map(r => (
                          <span key={r} className="inline-flex items-center gap-1 max-w-full h-7 pl-2.5 pr-1 rounded-full border border-[#e5e7eb] bg-[#f9fafb]">
                            <span className="truncate font-['Cabin',sans-serif] text-[12px] text-[#0a2333]">{r}</span>
                            <button
                              onClick={() => setRecipients(recipients.filter(x => x !== r))}
                              aria-label={`Remove ${r}`}
                              className="cursor-pointer shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-[#9ca3af] hover:text-[#0a2333] hover:bg-[#e5e7eb] transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => dispatch({ type: 'SET_TOAST', payload: { message: 'Configuration saved', type: 'success' } })}
                          className="cursor-pointer h-9 px-4 rounded-lg bg-[#0a2333] text-white font-['Cabin',sans-serif] font-medium text-[13px] hover:bg-[#152c3c] transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Daily Usage Chart */}
              <div className="flex flex-col lg:min-h-0">
                <h3 className="font-['Cabin',sans-serif] font-bold text-[15px] text-[#0a2333] mb-3">Daily usage</h3>
                <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex flex-col lg:flex-1 lg:min-h-0">
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    {/* AC-25: range selector */}
                    <RangeDropdown
                      value={String(chartRange)}
                      onChange={v => setChartRange(v === 'custom' ? 'custom' : (Number(v) as 7 | 30 | 90))}
                      options={[
                        { value: '7', label: 'Last 7 days' },
                        { value: '30', label: 'Last 30 days' },
                        { value: '90', label: 'Last 90 days' },
                      ]}
                      from={chartFrom}
                      to={chartTo}
                      onFrom={setChartFrom}
                      onTo={setChartTo}
                    />
                    <span className="font-['Cabin',sans-serif] text-[12px] text-[#62748e]">Avg: {avgPerDay}/day</span>
                  </div>
                  <div className="h-[230px] lg:h-auto lg:flex-1 lg:min-h-0">
                    <UsageComboChart
                      data={usageSeries}
                      xKey="label"
                      dataKey="usage"
                      height="100%"
                      barSize={chartDays > 30 ? 4 : chartDays > 7 ? 8 : 16}
                      labelFormatter={(label) => usageSeries.find(d => d.label === label)?.full ?? String(label)}
                    />
                  </div>
                </div>
              </div>  {/* close chart column */}
            </div>  {/* close grid */}
          </div>  {/* close px-8 py-2 */}

          {/* Swappable (Combine) benefit: which categories each membership
              template can spend its points in. */}
          {isSwappable && (
            <>
              <div className="px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between gap-3">
                <h3 className="font-['Cabin',sans-serif] font-bold text-[15px] text-[#0a2333]">
                  Swappable Products Detail
                </h3>
                <Button variant="ghost" onClick={exportMemberships}>
                  <Download size={13} />
                  Export
                </Button>
              </div>

              <div className="px-4 sm:px-8 pb-2">
                <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                <div className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <div className="flex items-center px-4 py-3">
                    <div className="w-[24%] shrink-0"><span className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider">Membership Code</span></div>
                    <div className="w-[26%] shrink-0"><span className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider">Swappable Entitlements</span></div>
                    <div className="flex-1"><span className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider">Eligible Products</span></div>
                  </div>
                </div>

                {memberships.map(m => (
                  <div key={m.code} className="flex items-center px-4 py-3.5 border-b border-[#e5e7eb] last:border-b-0">
                    <div className="w-[24%] shrink-0">
                      <span className="font-['Cabin',sans-serif] font-semibold text-[13px] text-[#0a2333]">{m.code}</span>
                    </div>
                    <div className="w-[26%] shrink-0">
                      <span className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] tabular-nums">{m.entitlements}</span>
                    </div>
                    <div className="flex-1 flex flex-wrap gap-1.5">
                      {m.eligible.map(slug => {
                        const CategoryIcon = productIcon(slug);
                        return (
                          <span
                            key={slug}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f3f4f6] font-['Cabin',sans-serif] text-[12px] text-[#374151]"
                          >
                            <CategoryIcon size={12} className="shrink-0 text-[#45556c]" />
                            {productName(slug)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
                </div>
                </div>
                </div>
              </div>
            </>
          )}

          {/* Recent Activity */}
          <div className="px-4 sm:px-8 pt-5 pb-3">
            <h3 className="font-['Cabin',sans-serif] font-bold text-[15px] text-[#0a2333] mb-3">Recent activity</h3>
            <div className="flex flex-wrap items-center gap-3">
              <SearchInput
                value={activitySearch}
                onChange={setActivitySearch}
                placeholder="Search order ID, customers..."
                className="flex-1 min-w-[180px] max-w-[400px]"
              />
              <Button variant="ghost" onClick={() => setShowFilters(v => !v)}>
                <SlidersHorizontal size={13} />
                {showFilters ? 'Hide filters' : 'Show filters'}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="text"
                  className="h-9 px-3 text-[12px]"
                  onClick={() => {
                    setActivitySearch('');
                    setStatusFilter('all');
                    setCustomerFilter('all');
                    setCategoryFilter('all');
                    setActivePeriod('all');
                    setFilterFrom('');
                    setFilterTo('');
                  }}
                >
                  Clear all
                </Button>
              )}
              <div className="hidden lg:block flex-1" />
              <RangeDropdown
                value={activePeriod}
                onChange={v => setActivePeriod(v as 'today' | 'last7' | 'custom' | 'all')}
                options={[
                  { value: 'all', label: 'All time' },
                  { value: 'today', label: `Today (${countInPeriod('today')})` },
                  { value: 'last7', label: `Last 7 days (${countInPeriod('last7')})` },
                ]}
                from={filterFrom}
                to={filterTo}
                onFrom={setFilterFrom}
                onTo={setFilterTo}
              />
              <Button
                variant="ghost"
                onClick={exportCsv}
                disabled={filtered.length === 0}
                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <Download size={13} />
                Export
              </Button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <FilterDropdown
                  label="Status"
                  value={statusFilter}
                  options={['Used', 'Pending', 'Cancelled']}
                  onChange={setStatusFilter}
                />
                <FilterDropdown
                  label="Customer"
                  value={customerFilter}
                  options={customers}
                  onChange={setCustomerFilter}
                />
                {categories.length > 1 && (
                  <FilterDropdown
                    label="Category"
                    value={categoryFilter}
                    options={categories}
                    onChange={setCategoryFilter}
                  />
                )}
              </div>
            )}
          </div>

          <div className="px-4 sm:px-8 pb-6">
            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
              <div className="overflow-x-auto">
              <div className="min-w-[860px]">
              <div className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <div className="flex items-center px-4 py-3">
                  <div className="w-[18%] shrink-0"><span className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider">Order ID</span></div>
                  <div className="w-[18%] shrink-0"><span className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider">Benefit Module</span></div>
                  <div className="w-[16%] shrink-0"><span className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider">Customer</span></div>
                  <div className="w-[12%] shrink-0"><span className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider">Status</span></div>
                  <div className="w-[18%] shrink-0"><span className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider">Created Time</span></div>
                  <div className="flex-1"><span className="font-['Cabin',sans-serif] font-semibold text-[11px] text-[#6a7282] uppercase tracking-wider">Redemption Time</span></div>
                  <div className="w-[48px] shrink-0" />
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="px-4 py-12 text-center font-['Cabin',sans-serif] text-[14px] text-[#9ca3af]">
                  {hasHistory ? 'No activity matches your filters.' : 'No data available'}
                </div>
              ) : (
                filtered.map((row, i) => {
                  const ModuleIcon = productIcon(row.moduleSlug);
                  return (
                  <div
                    key={i}
                    className="flex items-center px-4 py-3.5 border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors cursor-pointer group"
                    onClick={() => setSelectedOrder(makeOrder(row, row.module))}
                  >
                    <div className="w-[18%] shrink-0">
                      <div className="font-['Cabin',sans-serif] font-semibold text-[13px] text-[#0a2333]">{row.orderId}</div>
                    </div>
                    <div className="w-[18%] shrink-0 flex items-center gap-2">
                      <ModuleIcon size={14} className="shrink-0 text-[#45556c]" />
                      <span className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] truncate">{row.module}</span>
                    </div>
                    <div className="w-[16%] shrink-0">
                      <span className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333]">{row.customer}</span>
                    </div>
                    <div className="w-[12%] shrink-0">
                      <Badge variant={row.status === 'Used' ? 'confirmed' : row.status === 'Pending' ? 'pending' : 'cancelled'}>
                        {row.status}
                      </Badge>
                    </div>
                    <div className="w-[18%] shrink-0">
                      <span className="font-['Cabin',sans-serif] text-[13px] text-[#586e7d]">{formatMoment(row.created)}</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-['Cabin',sans-serif] text-[13px] text-[#586e7d]">{formatMoment(row.redeemed)}</span>
                    </div>
                    <div className="w-[48px] shrink-0 flex justify-end">
                      <ChevronRight size={16} className="text-[#9ca3af] group-hover:text-[#45556c] transition-colors" />
                    </div>
                  </div>
                  );
                })
              )}
              </div>
              </div>
            </div>
            <div className="mt-3">
              <span className="font-['Cabin',sans-serif] text-[12px] text-[#9ca3af]">
                {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

        </div>
      </div>

      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </PageShell>
  );
}
