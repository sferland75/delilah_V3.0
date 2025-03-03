import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';

export function BergBalanceTest() {
  return (
    <Card>
      <div data-testid="mock-berg">Berg Balance Test Component</div>
    </Card>
  );
}