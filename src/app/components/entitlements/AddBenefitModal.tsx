import { useState } from 'react';
import { Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle, Calendar, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { CATALOG_PRODUCTS } from './catalogData';

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Sofa, Car, UtensilsCrossed, Zap, Smartphone, Ticket, Heart, Shuffle,
};

function formatGBP(amount: number) {
  return `£${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SegmentedControl({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex bg-[#f1f5f9] rounded-lg p-0.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`cursor-pointer flex-1 px-3 py-1.5 rounded-md font-['Cabin',sans-serif] text-[13px] font-medium transition-colors ${
            value === opt.value
              ? 'bg-white text-[#0a2333] shadow-sm'
              : 'text-[#6a7282] hover:text-[#0a2333]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold font-['Cabin',sans-serif] ${
            i + 1 < current ? 'bg-[#0a2333] text-white' :
            i + 1 === current ? 'bg-[#0a2333] text-white' :
            'bg-[#e5e7eb] text-[#6a7282]'
          }`}>
            {i + 1 < current ? <Check size={12} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-8 h-0.5 ${i + 1 < current ? 'bg-[#0a2333]' : 'bg-[#e5e7eb]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

const BENEFIT_CATEGORIES = [
  'airport-lounge', 'fast-track', 'airport-dining', 'esims', 'health-wellness', 'airport-transfer',
];

interface AddBenefitModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export function AddBenefitModal({ open, onClose, onConfirm }: AddBenefitModalProps) {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [topUpMethod, setTopUpMethod] = useState<'count' | 'amount'>('count');
  const [benefitType, setBenefitType] = useState<'entitlement' | 'discount'>('entitlement');
  const [quantity, setQuantity] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const product = CATALOG_PRODUCTS.find(p => p.slug === selectedProduct);
  const unitCost = product?.unitCostGBP || 0;
  const effectiveCount = topUpMethod === 'count' ? quantity : (unitCost > 0 ? Math.floor(quantity / unitCost) : 0);
  const costPerUnit = benefitType === 'discount' ? unitCost * (discountPercent / 100) : unitCost;
  const totalCost = topUpMethod === 'count' ? quantity * costPerUnit : (benefitType === 'discount' ? quantity * (discountPercent / 100) : quantity);

  function handleClose() {
    setStep(1);
    setSelectedProduct(null);
    setTopUpMethod('count');
    setBenefitType('entitlement');
    setQuantity(0);
    setDiscountPercent(0);
    setStartDate('');
    setEndDate('');
    onClose();
  }

  const availableProducts = CATALOG_PRODUCTS.filter(p => BENEFIT_CATEGORIES.includes(p.slug));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[620px] p-0 bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-['Cabin',sans-serif] font-bold text-[18px] text-[#0a2333]">
            Add New Benefit
          </DialogTitle>
          <DialogDescription className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282] mb-3">
            {step === 1 && 'Select a product category for your new benefit.'}
            {step === 2 && 'Configure the benefit type, quantity, and dates.'}
            {step === 3 && 'Review and confirm your new benefit.'}
          </DialogDescription>
          <StepIndicator current={step} total={3} />
        </DialogHeader>

        <div className="px-6 pb-6">

          {/* Step 1: Select Product */}
          {step === 1 && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                {availableProducts.map(p => {
                  const Icon = iconMap[p.icon] || Smartphone;
                  const isSelected = selectedProduct === p.slug;
                  return (
                    <button
                      key={p.slug}
                      onClick={() => { setSelectedProduct(p.slug); setStep(2); }}
                      className={`cursor-pointer text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[#0a2333] bg-[#f8fafc]'
                          : 'border-[#e5e7eb] hover:border-[#0a2333]/30 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#0a2333]' : 'bg-[#f1f5f9]'}`}>
                          <Icon size={16} className={isSelected ? 'text-white' : 'text-[#0a2333]'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-['Cabin',sans-serif] font-semibold text-[14px] text-[#0a2333]">{p.name}</div>
                          <div className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282] truncate">{p.shortDescription}</div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#0a2333] flex items-center justify-center shrink-0">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Configure Benefit */}
          {step === 2 && (
            <div className="space-y-5 mt-4">
              {/* Top-up method */}
              <div>
                <label className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] font-medium block mb-2">
                  Top up by
                </label>
                <SegmentedControl
                  options={[
                    { value: 'count', label: 'Count of benefits' },
                    { value: 'amount', label: 'Amount (GBP)' },
                  ]}
                  value={topUpMethod}
                  onChange={v => { setTopUpMethod(v as 'count' | 'amount'); setQuantity(0); }}
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] font-medium block mb-1.5">
                  {topUpMethod === 'count' ? 'Number of benefits' : 'Amount (GBP)'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={quantity || ''}
                  onChange={e => setQuantity(Number(e.target.value))}
                  placeholder={topUpMethod === 'count' ? 'e.g. 500' : 'e.g. 10000'}
                  className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] text-[13px] font-['Cabin',sans-serif] text-[#0a2333] placeholder-[#9ca3af] focus:outline-none focus:border-[#0a2333] bg-[#f9fafb]"
                />
                {topUpMethod === 'amount' && effectiveCount > 0 && (
                  <div className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282] mt-1">
                    ≈ {effectiveCount.toLocaleString()} benefits at {formatGBP(unitCost)} each
                  </div>
                )}
              </div>

              {/* Benefit type */}
              <div>
                <label className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] font-medium block mb-2">
                  Benefit type
                </label>
                <SegmentedControl
                  options={[
                    { value: 'entitlement', label: 'Entitlement' },
                    { value: 'discount', label: 'Discount %' },
                  ]}
                  value={benefitType}
                  onChange={v => setBenefitType(v as 'entitlement' | 'discount')}
                />
              </div>

              {/* Discount % (conditional) */}
              {benefitType === 'discount' && (
                <div>
                  <label className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] font-medium block mb-1.5">
                    Discount percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={discountPercent || ''}
                      onChange={e => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                      placeholder="e.g. 25"
                      className="w-full h-9 px-3 pr-8 rounded-lg border border-[#e5e7eb] text-[13px] font-['Cabin',sans-serif] text-[#0a2333] placeholder-[#9ca3af] focus:outline-none focus:border-[#0a2333] bg-[#f9fafb]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">%</span>
                  </div>
                  <div className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282] mt-1">
                    Client pays {formatGBP(costPerUnit)} per benefit ({discountPercent}% of {formatGBP(unitCost)})
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] font-medium block mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#6a7282]" />
                      Start date
                      <span className="text-[11px] text-[#dc2626] font-normal">*</span>
                    </span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] text-[13px] font-['Cabin',sans-serif] text-[#0a2333] focus:outline-none focus:border-[#0a2333] bg-[#f9fafb]"
                  />
                </div>
                <div>
                  <label className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] font-medium block mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#6a7282]" />
                      End date
                      <span className="text-[11px] text-[#9ca3af] font-normal">(optional)</span>
                    </span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#e5e7eb] text-[13px] font-['Cabin',sans-serif] text-[#0a2333] focus:outline-none focus:border-[#0a2333] bg-[#f9fafb]"
                  />
                </div>
              </div>

              {/* Cost summary */}
              <div className="bg-[#f9fafb] rounded-lg border border-[#e5e7eb] p-4">
                <div className="font-['Cabin',sans-serif] text-[11px] text-[#6a7282] uppercase tracking-wider mb-2">Cost Summary</div>
                <div className="flex items-center justify-between">
                  <span className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] font-semibold">Total cost to you</span>
                  <span className="font-['Cabin',sans-serif] font-bold text-[18px] text-[#0a2333]">
                    {formatGBP(totalCost)}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep(1)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 h-10 rounded-lg border border-[#e5e7eb] font-['Cabin',sans-serif] font-medium text-[13px] text-[#45556c] hover:bg-[#f9fafb] transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={quantity <= 0 || !startDate || (benefitType === 'discount' && discountPercent <= 0)}
                  className="cursor-pointer flex-1 h-10 rounded-lg bg-[#0a2333] text-white font-['Cabin',sans-serif] font-medium text-[13px] hover:bg-[#152c3c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
                >
                  Review
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && product && (
            <div className="space-y-5 mt-4">
              <div className="bg-[#f9fafb] rounded-xl border border-[#e5e7eb] p-5 space-y-4">
                {/* Product */}
                <div className="flex items-center gap-3">
                  {(() => { const Icon = iconMap[product.icon] || Smartphone; return (
                    <div className="w-9 h-9 rounded-lg bg-[#0a2333] flex items-center justify-center">
                      <Icon size={16} className="text-white" />
                    </div>
                  ); })()}
                  <div>
                    <div className="font-['Cabin',sans-serif] font-semibold text-[15px] text-[#0a2333]">{product.name}</div>
                    <div className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282]">{product.shortDescription}</div>
                  </div>
                </div>

                <div className="border-t border-[#e5e7eb]" />

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="font-['Cabin',sans-serif] text-[11px] text-[#6a7282] uppercase tracking-wider">Benefit Type</div>
                    <div className="font-['Cabin',sans-serif] text-[14px] text-[#0a2333] font-medium mt-0.5">
                      {benefitType === 'entitlement' ? 'Entitlement' : `Discount (${discountPercent}%)`}
                    </div>
                  </div>
                  <div>
                    <div className="font-['Cabin',sans-serif] text-[11px] text-[#6a7282] uppercase tracking-wider">
                      {topUpMethod === 'count' ? 'Quantity' : 'Budget'}
                    </div>
                    <div className="font-['Cabin',sans-serif] text-[14px] text-[#0a2333] font-medium mt-0.5">
                      {topUpMethod === 'count' ? quantity.toLocaleString() : formatGBP(quantity)}
                    </div>
                  </div>
                  <div>
                    <div className="font-['Cabin',sans-serif] text-[11px] text-[#6a7282] uppercase tracking-wider">Start Date</div>
                    <div className="font-['Cabin',sans-serif] text-[14px] text-[#0a2333] font-medium mt-0.5">
                      {new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div className="font-['Cabin',sans-serif] text-[11px] text-[#6a7282] uppercase tracking-wider">End Date</div>
                    <div className="font-['Cabin',sans-serif] text-[14px] text-[#0a2333] font-medium mt-0.5">
                      {endDate ? new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No end date'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#e5e7eb]" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-['Cabin',sans-serif] text-[14px] text-[#0a2333] font-semibold">Total cost to you</span>
                  <span className="font-['Cabin',sans-serif] font-bold text-[22px] text-[#0a2333]">
                    {formatGBP(totalCost)}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 h-10 rounded-lg border border-[#e5e7eb] font-['Cabin',sans-serif] font-medium text-[13px] text-[#45556c] hover:bg-[#f9fafb] transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={() => { onConfirm?.(); handleClose(); }}
                  className="cursor-pointer flex-1 h-10 rounded-lg bg-[#0a2333] text-white font-['Cabin',sans-serif] font-medium text-[13px] hover:bg-[#152c3c] transition-colors"
                >
                  Confirm — {formatGBP(totalCost)}
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
