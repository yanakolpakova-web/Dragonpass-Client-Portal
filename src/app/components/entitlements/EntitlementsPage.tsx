import { useState, useEffect, useRef } from 'react';
import { ArrowDownUp, ChevronDown, Check } from 'lucide-react';
import { PageShell } from '../shared/PageShell';
import { SearchInput } from '../shared/SearchInput';
import { TestModeBadge } from '../shared/TestModeBadge';
import { EntitlementCard, InactiveCategoryCard, PayAsYouGoCard } from './EntitlementCard';
import { EntitlementsEmptyState } from './EntitlementsEmptyState';
import { EntitlementsSummaryBanner } from './EntitlementsSummaryBanner';
import { EntitlementDetailPage } from './EntitlementDetailPage';
import { ProductDetailView } from './ProductDetailView';
import { EntitlementsSkeleton } from '../shared/Skeleton';
import { MOCK_ENTITLEMENTS } from './mockEntitlements';
import { CATALOG_PRODUCTS } from './catalogData';
import type { Entitlement, Product } from '../../types/portalTypes';
import { benefitStatusRank, averageUsageRate } from './benefitStatus';
import { useEnvironment } from '../../contexts/EnvironmentContext';

export const ALL_BENEFITS_ID = '__all__';

// A category with no entitlement (pay-as-you-go, or one this channel does not
// carry) still opens a detail page, so stand in a zero record for it.
function emptyEntitlement(product: Product, environment: 'test' | 'production'): Entitlement {
  return {
    id: `category-${product.slug}`,
    productSlug: product.slug,
    productName: product.name,
    productIcon: product.icon,
    description: product.shortDescription,
    environment,
    benefitType: 'entitlement',
    unitCostGBP: product.unitCostGBP,
    allocation: 0,
    used: 0,
    remaining: 0,
    cap: 0,
    status: 'active',
    alertThresholds: { enabled: false, thresholds: [], recipients: [] },
    lastAlertedThreshold: null,
    startDate: '',
    createdAt: '',
    updatedAt: '',
  };
}

// Stands in for "every benefit at once" so the detail page can render the same
// aggregate the summary banner shows.
function aggregateEntitlement(entitlements: Entitlement[], environment: 'test' | 'production'): Entitlement {
  const limited = entitlements.filter(e => e.cap !== null && e.cap !== undefined);
  const hasUnlimited = limited.length < entitlements.length;
  const limitedAllocation = limited.reduce((sum, e) => sum + (e.cap ?? e.allocation), 0);

  return {
    id: ALL_BENEFITS_ID,
    productSlug: 'all',
    productName: 'All Entitlements',
    productIcon: 'Layers',
    description: 'Combined point pool across all entitlements',
    environment,
    benefitType: 'entitlement',
    unitCostGBP: 0,
    allocation: limitedAllocation,
    used: entitlements.reduce((sum, e) => sum + e.used, 0),
    remaining: limited.reduce((sum, e) => sum + e.remaining, 0),
    // Any unlimited benefit makes the combined pool infinite.
    cap: hasUnlimited ? null : limitedAllocation,
    status: 'active',
    alertThresholds: { enabled: false, thresholds: [], recipients: [] },
    lastAlertedThreshold: null,
    startDate: '',
    createdAt: '',
    updatedAt: '',
  };
}

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'remaining', label: 'Remaining' },
  { value: 'status', label: 'Status' },
  { value: 'usage', label: 'Usage' },
] as const;

type SortOption = typeof SORT_OPTIONS[number]['value'];

function SortDropdown({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find(o => o.value === value)!;

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
        className="cursor-pointer flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white font-['Cabin',sans-serif] text-[13px] text-[#45556c] hover:bg-[#f9fafb] transition-colors"
      >
        <ArrowDownUp size={13} />
        <span>Sort:</span>
        <span className="text-[#0a2333] font-medium">{current.label}</span>
        <ChevronDown size={12} className="text-[#9ca3af]" />
      </button>
      {open && (
        <div className="absolute left-0 top-10 z-20 w-40 bg-white border border-[#e5e7eb] rounded-xl shadow-lg py-1 overflow-hidden">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="cursor-pointer w-full flex items-center justify-between px-3 py-2 font-['Cabin',sans-serif] text-[13px] text-[#0a2333] hover:bg-[#f9fafb] transition-colors"
            >
              {opt.label}
              {opt.value === value && <Check size={12} className="text-[#0a2333]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface EntitlementsPageProps {
  activeView: string;
  onNavigate: (id: string) => void;
}

export function EntitlementsPage({ activeView, onNavigate }: EntitlementsPageProps) {
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('usage');
  const { environment } = useEnvironment();
  const gridRef = useRef<HTMLDivElement>(null);

  const parts = activeView.split(':');
  const isProductDetail = parts[1] === 'product' && parts[2];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (isProductDetail) {
    return (
      <PageShell activeView={activeView} onNavigate={onNavigate}>
        <ProductDetailView
          slug={parts[2]}
          onBack={() => onNavigate('settings:categories')}
          backLabel="Back to Categories"
        />
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell activeView={activeView} onNavigate={onNavigate}>
        <EntitlementsSkeleton />
      </PageShell>
    );
  }

  const environmentEntitlements = MOCK_ENTITLEMENTS.filter(e => e.environment === environment);
  const selectedProduct = selectedId && selectedId !== ALL_BENEFITS_ID
    ? CATALOG_PRODUCTS.find(p => p.slug === selectedId)
    : null;
  const selectedRecord = selectedProduct
    ? environmentEntitlements.find(e => e.productSlug === selectedProduct.slug)
    : undefined;
  const selectedEntitlement = selectedId === ALL_BENEFITS_ID
    ? aggregateEntitlement(environmentEntitlements, environment)
    : selectedProduct
      ? selectedRecord ?? emptyEntitlement(selectedProduct, environment)
      : null;
  const selectedCategoryState = !selectedProduct || selectedRecord
    ? undefined
    : selectedProduct.clientStatus === 'payg' ? 'payg' as const : 'inactive' as const;

  if (selectedEntitlement) {
    return (
      <EntitlementDetailPage
        entitlement={selectedEntitlement}
        categoryState={selectedCategoryState}
        usageRate={selectedId === ALL_BENEFITS_ID ? averageUsageRate(environmentEntitlements) : undefined}
        swappableCategories={selectedProduct?.swappableCategories}
        activityModules={
          selectedId === ALL_BENEFITS_ID
            ? environmentEntitlements.map(e => e.productSlug)
            : selectedProduct?.swappableCategories
        }
        activeView={activeView}
        onNavigate={onNavigate}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  // AC-07: the grid lists every category Dragonpass supports, not only the ones
  // this client holds. A category with no entitlement renders as Inactive.
  let items = CATALOG_PRODUCTS.map(product => ({
    product,
    entitlement:
      MOCK_ENTITLEMENTS.find(e => e.productSlug === product.slug && e.environment === environment) ?? null,
  }));

  if (search.trim()) {
    const q = search.toLowerCase();
    items = items.filter(({ product, entitlement }) =>
      (entitlement?.productName ?? product.name).toLowerCase().includes(q) ||
      (entitlement?.description ?? product.shortDescription).toLowerCase().includes(q)
    );
  }

  // Entitlements first, then pay-as-you-go, then categories this channel does
  // not carry. Mirrors the order the cards are chosen in below.
  const group = (i: (typeof items)[number]) =>
    i.product.clientStatus === 'payg' ? 1 : i.entitlement ? 0 : 2;

  items = [...items].sort((a, b) => {
    if (group(a) !== group(b)) return group(a) - group(b);

    const x = a.entitlement;
    const y = b.entitlement;
    // Nothing to rank on without an entitlement, so order by name.
    if (!x || !y) return a.product.name.localeCompare(b.product.name);

    // AC-09: usage means total entitlements used, not a percentage of cap, so
    // limited and unlimited benefits rank on the same scale.
    if (sortBy === 'usage') return y.used - x.used || x.productName.localeCompare(y.productName);
    if (sortBy === 'remaining') {
      // Unlimited first (an infinite balance outranks any number), then limited
      // benefits by remaining balance descending.
      const group = (e: typeof x) => (e.cap === null || e.cap === undefined ? 0 : 1);
      if (group(x) !== group(y)) return group(x) - group(y);
      // Unlimited balances are all infinite, so there is nothing to rank them by.
      if (group(x) === 1 && x.remaining !== y.remaining) return y.remaining - x.remaining;
      return x.productName.localeCompare(y.productName);
    }
    if (sortBy === 'status') return benefitStatusRank(x) - benefitStatusRank(y) || x.productName.localeCompare(y.productName);
    return x.productName.localeCompare(y.productName);
  });

  const entitlements = items.map(i => i.entitlement).filter((e): e is NonNullable<typeof e> => e !== null);

  return (
    <PageShell activeView={activeView} onNavigate={onNavigate}>
      <div className="flex flex-col flex-1 overflow-auto w-full max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="px-8 pt-5 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-0.5">
                <h1 className="font-['Cabin',sans-serif] font-bold text-[22px] text-[#0a2333]">Benefits</h1>
                <TestModeBadge />
              </div>
              <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">
                Manage your product entitlements and service allocations
              </p>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-3 mt-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search benefits..."
              className="flex-1 max-w-xs"
            />
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {entitlements.length > 0 && (
            <div className="pt-4">
              <EntitlementsSummaryBanner
                entitlements={entitlements}
                onClick={() => setSelectedId(ALL_BENEFITS_ID)}
              />
            </div>
          )}
          {items.length === 0 ? (
            <EntitlementsEmptyState onBrowseCategories={() => onNavigate('settings:categories')} filtered={search.trim().length > 0} />
          ) : (
            <div ref={gridRef} className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(({ product, entitlement }) =>
                product.clientStatus === 'payg' ? (
                  <PayAsYouGoCard key={product.slug} product={product} />
                ) : entitlement ? (
                  <EntitlementCard key={product.slug} entitlement={entitlement} onClick={() => setSelectedId(product.slug)} />
                ) : (
                  <InactiveCategoryCard key={product.slug} product={product} />
                )
              )}
            </div>
          )}
        </div>
      </div>

    </PageShell>
  );
}
