type BadgeVariant =
  | 'confirmed' | 'entitlement' | 'discount'
  | 'pending' | 'cancelled'
  | 'active' | 'exhausted' | 'low' | 'unlimited' | 'inactive'
  | 'requested' | 'available' | 'payg';

const STYLES: Record<BadgeVariant, string> = {
  confirmed:   'bg-[#dcfce7] text-[#166534]',
  active:      'bg-[#dcfce7] text-[#166534]',
  entitlement: 'bg-[#d1fae5] text-[#0a2333]',
  discount:    'bg-[#ccfbf1] text-[#134e4a]',
  pending:     'bg-[#fef9c3] text-[#854d0e]',
  low:         'bg-[#fef9c3] text-[#854d0e]',
  unlimited:   'bg-[#dbeafe] text-[#1e40af]',
  inactive:    'bg-[#f3f4f6] text-[#6a7282]',
  requested:   'bg-[#FEF3C7] text-[#92400E]',
  cancelled:   'bg-[#fee2e2] text-[#991b1b]',
  exhausted:   'bg-[#fee2e2] text-[#991b1b]',
  available:   'bg-[#f3f4f6] text-[#374151]',
  payg:       'bg-[#FEF3C7] text-[#92400E]',
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-['Cabin',sans-serif] ${STYLES[variant]} ${className}`}>
      {children}
    </span>
  );
}
