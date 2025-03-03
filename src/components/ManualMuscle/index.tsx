import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';

export function ManualMuscle() {
  return (
    <Card>
      <div data-testid="mock-mmt">Manual Muscle Testing Component</div>
    </Card>
  );
}