import { Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle, ChevronRight } from 'lucide-react';
import type { Product } from '../../types/portalTypes';

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle,
};

const statusStyles: Record<string, string> = {
  active: 'bg-[#dcfce7] text-[#166534]',
  available: 'bg-[#f3f4f6] text-[#374151]',
  payg: 'bg-[#FEF3C7] text-[#92400E]',
  requested: 'bg-[#FEF3C7] text-[#92400E]',
};

const statusLabels: Record<string, string> = {
  active: 'ACTIVE',
  available: 'AVAILABLE',
  payg: 'PAY AS YOU GO',
  requested: 'REQUESTED',
};

interface ProductCardProps {
  product: Product;
  onViewDetails: (slug: string) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const Icon = iconMap[product.icon] || Plane;

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] flex items-center justify-center shrink-0">
            <Icon size={18} className="text-[#0a2333]" />
          </div>
          <h3 className="font-['Cabin',sans-serif] font-bold text-[15px] text-[#0a2333]">
            {product.name}
          </h3>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-['Cabin',sans-serif] ${statusStyles[product.clientStatus]}`}>
          {statusLabels[product.clientStatus]}
        </span>
      </div>

      <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282] flex-1">
        {product.shortDescription}
      </p>

      <button
        onClick={() => onViewDetails(product.slug)}
        className="mt-4 inline-flex items-center gap-1 font-['Cabin',sans-serif] font-medium text-[13px] text-[#0a2333] hover:text-[#152c3c] transition-colors self-start"
      >
        View Details
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
