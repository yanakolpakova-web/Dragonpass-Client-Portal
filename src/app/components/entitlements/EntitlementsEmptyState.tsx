import { Package } from 'lucide-react';
import { EmptyState } from '../shared/EmptyState';
import { Button } from '../shared/Button';

interface EntitlementsEmptyStateProps {
  onBrowseCategories: () => void;
  filtered?: boolean;
}

export function EntitlementsEmptyState({ onBrowseCategories, filtered = false }: EntitlementsEmptyStateProps) {
  return (
    <EmptyState
      icon={<Package size={28} className="text-[#6a7282]" />}
      title={filtered ? 'No benefits found' : 'No active entitlements yet'}
      description={
        filtered
          ? 'Try adjusting your search or filter to find what you are looking for'
          : 'Browse the categories in Settings to explore available products and request entitlements for your account.'
      }
    >
      {!filtered && (
        <Button variant="primary" onClick={onBrowseCategories}>
          Browse Categories
        </Button>
      )}
    </EmptyState>
  );
}
