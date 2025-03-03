import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';

export function RangeOfMotion() {
  return (
    <Card>
      <div data-testid="mock-rom">Range of Motion Component</div>
    </Card>
  );
}