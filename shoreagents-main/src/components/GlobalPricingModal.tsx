'use client';

import { useState, useEffect } from 'react';
import { PricingCalculatorModal } from '@/components/ui/pricing-calculator-modal';

export function GlobalPricingModal() {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenPricingModal = () => {
      setIsPricingModalOpen(true);
    };

    window.addEventListener('openPricingModal', handleOpenPricingModal);
    
    return () => {
      window.removeEventListener('openPricingModal', handleOpenPricingModal);
    };
  }, []);

  return (
    <PricingCalculatorModal
      isOpen={isPricingModalOpen}
      onClose={() => setIsPricingModalOpen(false)}
    />
  );
}
