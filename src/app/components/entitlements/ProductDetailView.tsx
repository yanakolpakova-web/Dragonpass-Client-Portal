import { ArrowLeft, ExternalLink, Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle, Globe, DollarSign, Star, TrendingUp, Shield, MapPin, Clock, Users, CreditCard, Calendar } from 'lucide-react';
import { CATALOG_PRODUCTS } from './catalogData';
import type { Product } from '../../types/portalTypes';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { IconBox } from '../shared/IconBox';

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle,
  Globe, DollarSign, Star, TrendingUp, Shield, MapPin, Clock, Users, CreditCard, Calendar,
};

const statusLabels: Record<string, string> = {
  active: 'ACTIVE',
  available: 'AVAILABLE',
  payg: 'PAY AS YOU GO',
  requested: 'REQUESTED',
};

interface ProductDetailViewProps {
  slug: string;
  onBack: () => void;
  backLabel?: string;
}

export function ProductDetailView({ slug, onBack, backLabel = 'Back to Categories' }: ProductDetailViewProps) {
  const product = CATALOG_PRODUCTS.find(p => p.slug === slug);
  if (!product) return null;

  const ProductIcon = iconMap[product.icon] || Plane;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-6">
        {/* Back link */}
        <Button variant="text" onClick={onBack} className="mb-6">
          <ArrowLeft size={14} />
          {backLabel}
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <IconBox className="w-12 h-12 rounded-xl">
              <ProductIcon size={22} className="text-[#0a2333]" />
            </IconBox>
            <div>
              <h1 className="font-['Cabin',sans-serif] font-bold text-[22px] text-[#0a2333]">
                {product.name}
              </h1>
              <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">{product.shortDescription}</p>
            </div>
          </div>
          <Badge variant={product.clientStatus as 'active' | 'available' | 'requested' | 'payg'} className="px-2.5 py-1 text-[11px]">
            {statusLabels[product.clientStatus]}
          </Badge>
        </div>

        <div className="h-px bg-[#e5e7eb] mb-8" />

        {/* Video overview */}
        <section className="mb-8">
          <h2 className="font-['Cabin',sans-serif] font-bold text-[16px] text-[#0a2333] mb-3">How It Works</h2>
          <div className="rounded-xl overflow-hidden border border-[#e5e7eb] bg-[#000] aspect-video">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title={`How ${product.name} works`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </section>

        {/* Overview */}
        <section className="mb-8">
          <h2 className="font-['Cabin',sans-serif] font-bold text-[16px] text-[#0a2333] mb-3">Overview</h2>
          <p className="font-['Cabin',sans-serif] text-[14px] text-[#45556c] leading-relaxed">
            {product.fullDescription}
          </p>
        </section>

        {/* Key Benefits */}
        <section className="mb-8">
          <h2 className="font-['Cabin',sans-serif] font-bold text-[16px] text-[#0a2333] mb-4">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.benefits.map((benefit, i) => {
              const BenefitIcon = iconMap[benefit.icon] || Star;
              return (
                <div key={i} className="bg-white rounded-xl border border-[#e5e7eb] p-4">
                  <IconBox size="sm" className="mb-3">
                    <BenefitIcon size={16} className="text-[#0a2333]" />
                  </IconBox>
                  <h4 className="font-['Cabin',sans-serif] font-semibold text-[13px] text-[#0a2333] mb-1">
                    {benefit.title}
                  </h4>
                  <p className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Integration Guide */}
        <section className="mb-8">
          <h2 className="font-['Cabin',sans-serif] font-bold text-[16px] text-[#0a2333] mb-3">Integration Guide</h2>
          <div className="bg-[#f9fafb] rounded-xl border border-[#e5e7eb] p-5">
            <p className="font-['Cabin',sans-serif] text-[13px] text-[#45556c] leading-relaxed">
              {product.integrationGuide}
            </p>
          </div>
        </section>

        {/* CTA row */}
        <div className="flex items-center gap-4 pt-2 pb-8">
          <Button variant="ghost" onClick={() => window.open(product.documentationUrl, '_blank')} className="h-auto py-2.5 px-4 gap-2 text-[13px] text-[#0a2333]">
            View API Documentation
            <ExternalLink size={13} />
          </Button>

          {product.clientStatus === 'available' && (
            <Button variant="primary">Request This Product</Button>
          )}
          {product.clientStatus === 'active' && (
            <Button variant="primary" onClick={onBack}>Manage Entitlements</Button>
          )}
          {product.clientStatus === 'requested' && (
            <button
              disabled
              className="px-4 py-2.5 rounded-lg bg-[#D97706]/20 text-[#92400E] font-['Cabin',sans-serif] font-medium text-[13px] cursor-not-allowed opacity-70"
            >
              Requested — Pending Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
