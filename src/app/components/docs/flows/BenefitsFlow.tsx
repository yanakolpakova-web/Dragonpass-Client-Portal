import { useState, useRef, useEffect } from 'react';
import type { Frame } from '../types';
import { DocFrame } from '../DocFrame';
import { DocPageShell } from '../DocPageShell';
import { PageHeader } from '../../shared/PageHeader';
import { TestModeBadge } from '../../shared/TestModeBadge';
import { EntitlementCard } from '../../entitlements/EntitlementCard';
import { EntitlementDetailPage } from '../../entitlements/EntitlementDetailPage';
import { EntitlementsEmptyState } from '../../entitlements/EntitlementsEmptyState';
import { MOCK_ENTITLEMENTS } from '../../entitlements/mockEntitlements';
import { Badge } from '../../shared/Badge';
import { IconBox } from '../../shared/IconBox';
import { Plus, Search, SlidersHorizontal, ChevronDown, Check, MoreHorizontal, Settings, Trash2, AlertTriangle, Smartphone, Sofa, Zap, Car, Heart, Pause, Play, RotateCcw } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { Smartphone, Sofa, Zap, Car, Heart };

// -- Helpers: render parts of the Benefits page in forced states --

function BenefitsPageShell({ env = 'production' as const, children }: { env?: 'test' | 'production'; children: React.ReactNode }) {
  return (
    <DocFrame environment={env}>
      <DocPageShell activeView="entitlements" onNavigate={() => {}}>
        {children}
      </DocPageShell>
    </DocFrame>
  );
}

function BenefitsHeader({ search = '', children }: { search?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden w-full max-w-[1440px] mx-auto">
      <div className="px-8 pt-5 pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <h1 className="font-['Cabin',sans-serif] font-bold text-[22px] text-[#0a2333]">Benefits</h1>
              <TestModeBadge />
            </div>
            <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">Manage your product entitlements and service allocations</p>
          </div>
          <button className="cursor-pointer inline-flex items-center gap-1.5 bg-[#0a2333] text-white rounded-xl px-4 py-2.5 font-['Cabin',sans-serif] font-medium text-[13px]">
            <Plus size={14} />
            Add Benefit
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              readOnly
              value={search}
              placeholder="Search benefits..."
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#e5e7eb] text-[13px] font-['Cabin',sans-serif] text-[#0a2333] placeholder-[#9ca3af] bg-[#f9fafb]"
            />
          </div>
          <div className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#e5e7eb] bg-white font-['Cabin',sans-serif] text-[13px] text-[#45556c]">
            <SlidersHorizontal size={13} />
            <span>Sort:</span>
            <span className="text-[#0a2333] font-medium">Name</span>
            <ChevronDown size={12} className="text-[#9ca3af]" />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function CardGrid({ entitlements, onManage }: { entitlements: typeof MOCK_ENTITLEMENTS; onManage?: (id: string) => void }) {
  return (
    <div className="flex-1 overflow-auto px-8 pb-8">
      <div className="py-4 grid grid-cols-3 gap-4">
        {entitlements.map(e => (
          <EntitlementCard key={e.id} entitlement={e} onClick={onManage ?? (() => {})} />
        ))}
      </div>
    </div>
  );
}

// Sort dropdown forced open
function SortDropdownOpen() {
  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#0a2333] bg-white font-['Cabin',sans-serif] text-[13px] text-[#45556c] ring-1 ring-[#0a2333]/10">
        <SlidersHorizontal size={13} />
        <span>Sort:</span>
        <span className="text-[#0a2333] font-medium">Name</span>
        <ChevronDown size={12} className="text-[#9ca3af]" />
      </div>
      <div className="absolute left-0 top-10 z-20 w-40 bg-white border border-[#e5e7eb] rounded-xl shadow-lg py-1 overflow-hidden">
        {[
          { value: 'name', label: 'Name', active: true },
          { value: 'usage', label: 'Usage %', active: false },
          { value: 'remaining', label: 'Remaining', active: false },
        ].map(opt => (
          <div
            key={opt.value}
            className={`w-full flex items-center justify-between px-3 py-2 font-['Cabin',sans-serif] text-[13px] text-[#0a2333] ${opt.active ? 'bg-[#f9fafb]' : ''}`}
          >
            {opt.label}
            {opt.active && <Check size={12} className="text-[#0a2333]" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Card with action menu forced open
function CardWithMenuOpen() {
  const ent = MOCK_ENTITLEMENTS.find(e => e.environment === 'production' && e.status === 'active')!;
  const Icon = iconMap[ent.productIcon] || Smartphone;
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <IconBox><Icon size={18} className="text-[#0a2333]" /></IconBox>
          <div>
            <h3 className="font-['Cabin',sans-serif] font-bold text-[15px] text-[#0a2333]">{ent.productName}</h3>
            <p className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282]">{ent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="active">Active</Badge>
          <div className="relative">
            <div className="w-7 h-7 flex items-center justify-center rounded-md bg-[#f3f4f6] text-[#0a2333]">
              <MoreHorizontal size={15} />
            </div>
            <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-[#e5e7eb] rounded-xl shadow-lg py-1">
              <div className="w-full flex items-center gap-2.5 px-3 py-2 font-['Cabin',sans-serif] text-[13px] text-[#0a2333]">
                <Settings size={13} className="text-[#6a7282]" />
                Edit configuration
              </div>
              <div className="border-t border-[#e5e7eb] my-1" />
              <div className="w-full flex items-center gap-2.5 px-3 py-2 font-['Cabin',sans-serif] text-[13px] text-[#dc2626]">
                <Trash2 size={13} className="text-[#dc2626]" />
                Remove benefit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -- Frame definitions --

const prodEntitlements = MOCK_ENTITLEMENTS.filter(e => e.environment === 'production').sort((a, b) => a.productName.localeCompare(b.productName));
const testEntitlements = MOCK_ENTITLEMENTS.filter(e => e.environment === 'test');

export const benefitsFrames: Frame[] = [
  {
    id: 'benefits-list-prod',
    title: 'Benefits List — Production',
    description: 'Entitlement cards in production environment. Shows active, low and exhausted statuses with usage indicators.',
    category: 'List Views',
    render: () => (
      <BenefitsPageShell>
        <BenefitsHeader>
          <CardGrid entitlements={prodEntitlements} />
        </BenefitsHeader>
      </BenefitsPageShell>
    ),
  },
  {
    id: 'benefits-list-test',
    title: 'Benefits List — Test',
    description: 'Test environment shows only 2 entitlements. TestModeBadge visible in header.',
    category: 'List Views',
    render: () => (
      <BenefitsPageShell env="test">
        <BenefitsHeader>
          <CardGrid entitlements={testEntitlements} />
        </BenefitsHeader>
      </BenefitsPageShell>
    ),
  },
  {
    id: 'benefits-empty',
    title: 'Empty State',
    description: 'No entitlements for the current environment. Shows empty state with CTA to browse categories.',
    category: 'List Views',
    render: () => (
      <BenefitsPageShell>
        <BenefitsHeader>
          <div className="flex-1 overflow-auto px-8">
            <EntitlementsEmptyState onBrowseCategories={() => {}} />
          </div>
        </BenefitsHeader>
      </BenefitsPageShell>
    ),
  },
  {
    id: 'benefits-search-results',
    title: 'Search — With Results',
    description: 'Searching "Airport" filters to matching cards only.',
    category: 'Search & Filter',
    render: () => {
      const filtered = prodEntitlements.filter(e => e.productName.toLowerCase().includes('airport'));
      return (
        <BenefitsPageShell>
          <BenefitsHeader search="Airport">
            <CardGrid entitlements={filtered} />
          </BenefitsHeader>
        </BenefitsPageShell>
      );
    },
  },
  {
    id: 'benefits-search-none',
    title: 'Search — No Results',
    description: 'Search query with no matching entitlements. Shows the empty state.',
    category: 'Search & Filter',
    render: () => (
      <BenefitsPageShell>
        <BenefitsHeader search="xyz123">
          <div className="flex-1 overflow-auto px-8">
            <EntitlementsEmptyState onBrowseCategories={() => {}} filtered />
          </div>
        </BenefitsHeader>
      </BenefitsPageShell>
    ),
  },
  {
    id: 'benefits-sort-open',
    title: 'Sort Dropdown — Open',
    description: 'Custom dropdown expanded showing Name, Usage %, and Remaining sort options. Active option has checkmark.',
    category: 'Search & Filter',
    render: () => (
      <BenefitsPageShell>
        <div className="flex flex-col flex-1 overflow-hidden w-full max-w-[1440px] mx-auto">
          <div className="px-8 pt-5 pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-0.5">
                  <h1 className="font-['Cabin',sans-serif] font-bold text-[22px] text-[#0a2333]">Benefits</h1>
                </div>
                <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">Manage your product entitlements and service allocations</p>
              </div>
              <button className="inline-flex items-center gap-1.5 bg-[#0a2333] text-white rounded-xl px-4 py-2.5 font-['Cabin',sans-serif] font-medium text-[13px]">
                <Plus size={14} />
                Add Benefit
              </button>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input type="text" readOnly placeholder="Search benefits..." className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#e5e7eb] text-[13px] font-['Cabin',sans-serif] bg-[#f9fafb]" />
              </div>
              <SortDropdownOpen />
            </div>
          </div>
          <CardGrid entitlements={prodEntitlements} />
        </div>
      </BenefitsPageShell>
    ),
  },
  {
    id: 'benefits-card-menu',
    title: 'Card — Action Menu Open',
    description: '3-dot menu shows Edit configuration and Remove benefit options. Remove is red with a divider.',
    category: 'Card States',
    render: () => (
      <BenefitsPageShell>
        <div className="flex flex-col flex-1 overflow-hidden w-full max-w-[1440px] mx-auto">
          <div className="px-8 pt-5 pb-4 shrink-0">
            <h1 className="font-['Cabin',sans-serif] font-bold text-[22px] text-[#0a2333] mb-4">Card — Action Menu</h1>
          </div>
          <div className="px-8">
            <div className="max-w-sm">
              <CardWithMenuOpen />
            </div>
          </div>
        </div>
      </BenefitsPageShell>
    ),
  },
  {
    id: 'benefits-card-active',
    title: 'Card — Active (Pause)',
    description: 'Active entitlement shows green "Active" badge and "Pause" button (outlined) in footer.',
    category: 'Card States',
    render: () => {
      const ent = prodEntitlements.find(e => e.status === 'active')!;
      return (
        <BenefitsPageShell>
          <div className="px-8 pt-8">
            <div className="max-w-md">
              <EntitlementCard entitlement={ent} onClick={() => {}} />
            </div>
          </div>
        </BenefitsPageShell>
      );
    },
  },
  {
    id: 'benefits-card-exhausted',
    title: 'Card — Exhausted (Restart)',
    description: 'Exhausted entitlement shows red "Exhausted" badge, "Cap reached" warning, and solid "Restart" button.',
    category: 'Card States',
    render: () => {
      const ent = prodEntitlements.find(e => e.status === 'exhausted')!;
      return (
        <BenefitsPageShell>
          <div className="px-8 pt-8">
            <div className="max-w-md">
              <EntitlementCard entitlement={ent} onClick={() => {}} />
            </div>
          </div>
        </BenefitsPageShell>
      );
    },
  },
  {
    id: 'benefits-warnings',
    title: 'Usage Warnings',
    description: 'Three cards showing different warning levels: 80%+ used, 90%+ approaching cap, and 100% cap reached.',
    category: 'Card States',
    render: () => {
      const warnings = prodEntitlements.filter(e => {
        const pct = e.cap ? (e.used / e.cap) * 100 : 0;
        return pct >= 80;
      });
      return (
        <BenefitsPageShell>
          <div className="px-8 pt-8">
            <div className="grid grid-cols-3 gap-4">
              {warnings.map(e => <EntitlementCard key={e.id} entitlement={e} onClick={() => {}} />)}
            </div>
          </div>
        </BenefitsPageShell>
      );
    },
  },
  {
    id: 'benefits-detail-active',
    title: 'Detail Page — Active',
    description: 'Full detail page for an active entitlement. Shows "Pause benefit" button, usage ring, cap config, and activity log.',
    category: 'Detail Pages',
    render: () => {
      const ent = prodEntitlements.find(e => e.status === 'active')!;
      return (
        <DocFrame>
          <EntitlementDetailPage entitlement={ent} activeView="entitlements" onNavigate={() => {}} onBack={() => {}} />
        </DocFrame>
      );
    },
  },
  {
    id: 'benefits-detail-exhausted',
    title: 'Detail Page — Exhausted',
    description: 'Detail page for an exhausted entitlement. Shows "Restart benefit" button and "Cap reached" warning.',
    category: 'Detail Pages',
    render: () => {
      const ent = prodEntitlements.find(e => e.status === 'exhausted')!;
      return (
        <DocFrame>
          <EntitlementDetailPage entitlement={ent} activeView="entitlements" onNavigate={() => {}} onBack={() => {}} />
        </DocFrame>
      );
    },
  },
];
