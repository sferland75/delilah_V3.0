import { DemographicsSection } from '@/sections/1-DemographicsAndHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DemographicsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demographics & Header</CardTitle>
      </CardHeader>
      <CardContent>
        <DemographicsSection />
      </CardContent>
    </Card>
  );
}