'use client';

import { DemographicsIntegrated } from '@/sections/1-InitialAssessment';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DemographicsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demographics & Header</CardTitle>
      </CardHeader>
      <CardContent>
        <DemographicsIntegrated />
      </CardContent>
    </Card>
  );
}