export interface ApiKey {
  id: string;
  name: string;
  type: 'publishable' | 'secret';
  keyPrefix: string;
  maskedKey: string;
  fullKey?: string;
  environment: 'test' | 'production';
  status: 'active' | 'revoked';
  createdAt: string;
  lastUsedAt: string | null;
  canReveal: boolean;
}

export interface ProductionAccessRequest {
  status: 'not_requested' | 'pending' | 'approved' | 'rejected';
  requestedAt?: string;
  approvedAt?: string;
  reviewedBy?: string;
}

export interface Entitlement {
  id: string;
  productSlug: string;
  productName: string;
  productIcon: string;
  description: string;
  environment: 'test' | 'production';
  benefitType: 'entitlement' | 'discount';
  discountPercent?: number;
  unitCostGBP: number;
  allocation: number;
  used: number;
  remaining: number;
  cap: number | null;
  status: 'active' | 'exhausted';
  alertThresholds: {
    enabled: boolean;
    thresholds: number[];
    recipients: string[];
  };
  lastAlertedThreshold: number | null;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  benefits: ProductBenefit[];
  integrationGuide: string;
  documentationUrl: string;
  clientStatus: 'active' | 'available' | 'requested' | 'payg';
  unitCostGBP: number;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  linkTo: string;
  linkLabel: string;
}
