import { Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle, ArrowRight } from 'lucide-react';
import type { Entitlement, Product } from '../../types/portalTypes';
import { Badge } from '../shared/Badge';
import { IconBox } from '../shared/IconBox';
import { benefitStatus, usageRingColor } from './benefitStatus';

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle,
};

interface EntitlementCardProps {
  entitlement: Entitlement;
  onClick: (id: string) => void;
}

function DonutArc({ pct, size = 64, unlimited = false }: { pct: number; size?: number; unlimited?: boolean }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = Math.min(pct / 100, 1) * circumference;
  const color = usageRingColor(pct);
  const isComplete = pct >= 100;

  if (unlimited) {
    return (
      <div className="shrink-0 relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#dbeafe" strokeWidth="6" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="29" height="19" viewBox="-1 -1 26 14" fill="none">
            <path
              d="M12 6C12 6 9.5 1 5.5 1C2.46 1 0 3.24 0 6C0 8.76 2.46 11 5.5 11C9.5 11 12 6 12 6ZM12 6C12 6 14.5 11 18.5 11C21.54 11 24 8.76 24 6C24 3.24 21.54 1 18.5 1C14.5 1 12 6 12 6Z"
              stroke="#dbeafe"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M12 6C12 6 9.5 1 5.5 1C2.46 1 0 3.24 0 6C0 8.76 2.46 11 5.5 11C9.5 11 12 6 12 6ZM12 6C12 6 14.5 11 18.5 11C21.54 11 24 8.76 24 6C24 3.24 21.54 1 18.5 1C14.5 1 12 6 12 6Z"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: '20 46',
                strokeDashoffset: 0,
                animation: 'infinitySnake 2s linear infinite',
              }}
            />
            <style>{`
              @keyframes infinitySnake {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -66; }
              }
            `}</style>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {isComplete ? (
        <path
          d={`M${cx - 9.5} ${cy - 1} l7 7 l12 -12`}
          stroke="#6a7282" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
      ) : (
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#6a7282" fontFamily="Cabin, sans-serif">
          {pct.toFixed(0)}%
        </text>
      )}
    </svg>
  );
}

export function EntitlementCard({ entitlement, onClick }: EntitlementCardProps) {
  const Icon = iconMap[entitlement.productIcon] || Smartphone;
  const hasCap = entitlement.cap !== null && entitlement.cap !== undefined;
  const pct = hasCap ? Math.min(100, (entitlement.used / entitlement.cap!) * 100) : 0;
  const status = benefitStatus(entitlement);

  return (
    <button
      type="button"
      onClick={() => onClick(entitlement.id)}
      className="group cursor-pointer w-full text-left bg-white rounded-xl border border-[#e5e7eb] p-6 flex flex-col transition-colors hover:border-[#0a2333]/30 hover:bg-[#f9fafb] focus:outline-none focus-visible:border-[#0a2333] focus-visible:ring-2 focus-visible:ring-[#0a2333]/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <IconBox>
            <Icon size={18} className="text-[#0a2333]" />
          </IconBox>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-['Cabin',sans-serif] font-bold text-[15px] text-[#0a2333] leading-tight truncate">
                {entitlement.productName}
              </h3>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="font-['Cabin',sans-serif] font-normal text-[12px] text-[#6a7282] mt-0.5 truncate">
              {entitlement.description}
            </p>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="shrink-0 mt-1 text-[#9ca3af] transition-colors group-hover:text-[#0a2333]"
        />
      </div>

      <div className="flex items-center gap-4 pt-6">
        {hasCap ? <DonutArc pct={pct} /> : <DonutArc pct={0} unlimited />}
        <div className="min-w-0">
          <div className="font-['Cabin',sans-serif] font-bold text-[28px] leading-none text-[#0a2333] tracking-tight">
            {entitlement.used.toLocaleString()}
          </div>
          <div className="font-['Cabin',sans-serif] font-normal text-[13px] text-[#6a7282] mt-2">
            {hasCap ? (
              /* AC-12: "X of Y remaining", remaining value in bold. */
              <>
                <span className="font-semibold text-[#0a2333]">
                  {entitlement.remaining.toLocaleString()}
                </span>
                {' '}of {entitlement.allocation.toLocaleString()} remaining
              </>
            ) : (
              /* AC-14 */
              'redemptions this period'
            )}
          </div>
        </div>
      </div>

    </button>
  );
}

// Cards for categories with no entitlement behind them: rendered from the
// catalogue, with no ring, usage or balance.
function PlaceholderCard({
  product,
  muted = false,
  badges = [],
  note,
  onClick,
}: {
  product: Product;
  muted?: boolean;
  badges?: { label: string; variant: 'inactive' | 'active' | 'payg' }[];
  note: string;
  onClick?: () => void;
}) {
  const Icon = iconMap[product.icon] || Smartphone;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#e5e7eb] p-6 flex flex-col ${muted ? 'opacity-60' : ''} ${
        onClick ? 'cursor-pointer transition-colors hover:border-[#0a2333]/30 hover:bg-[#f9fafb]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <IconBox>
            <Icon size={18} className={muted ? 'text-[#6a7282]' : 'text-[#0a2333]'} />
          </IconBox>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-['Cabin',sans-serif] font-bold text-[15px] leading-tight truncate ${muted ? 'text-[#6a7282]' : 'text-[#0a2333]'}`}>
                {product.name}
              </h3>
              {badges.map(b => (
                <Badge key={b.label} variant={b.variant}>{b.label}</Badge>
              ))}
            </div>
            <p className="font-['Cabin',sans-serif] text-[12px] mt-0.5 truncate text-[#6a7282]">
              {product.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* min-h matches the height of the usage block on an active card, so both
          card types come out the same size. */}
      <div className="flex items-center gap-4 pt-6 min-h-[88px]">
        <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">{note}</p>
      </div>
    </div>
  );
}

// AC-07: a Dragonpass category this channel does not carry.
export function InactiveCategoryCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  return (
    <PlaceholderCard
      product={product}
      onClick={onClick}
      muted
      badges={[{ label: 'Inactive', variant: 'inactive' }]}
      note="This category is not available for this channel."
    />
  );
}

// AC-16: pay-as-you-go category — no points are issued, so there is no ring,
// usage volume or balance to show.
export function PayAsYouGoCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  return (
    <PlaceholderCard
      product={product}
      onClick={onClick}
      badges={[
        { label: 'Active', variant: 'active' },
        { label: 'Pay as you go', variant: 'payg' },
      ]}
      note="This product module is provided to users on a pay-as-you-go basis."
    />
  );
}
