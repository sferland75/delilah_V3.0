import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessmentContext } from '@/contexts/AssessmentContext';
import { Demographics, demographicsSchema } from './schema';
import { Personal } from './components/Personal';
import { Contact } from './components/Contact';
import { Insurance } from './components/Insurance';
import { Legal } from './components/Legal';
import { Display } from './components/Display';

const defaultValues: Demographics = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'prefer-not-to-say',
  contact: {
    phone: '',
    email: '',
    address: ''
  },
  insurance: {
    provider: '',
    claimNumber: '',
    adjustorName: '',
    adjustorPhone: '',
    adjustorEmail: ''
  },
  legalRep: {
    name: '',
    firm: '',
    phone: '',
    email: '',
    address: '',
    fileNumber: ''
  }
};

export function DemographicsSection() {
  const { mode } = useAssessmentContext();
  const methods = useForm<Demographics>({
    resolver: zodResolver(demographicsSchema),
    defaultValues
  });

  useFormPersistence(methods);

  if (mode === 'view') {
    return <Display data={methods.getValues()} />;
  }

  return (
    <FormProvider {...methods}>
      <form>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>

          <Card className="mt-4 p-4">
            <TabsContent value="personal">
              <Personal />
            </TabsContent>

            <TabsContent value="contact">
              <Contact />
            </TabsContent>

            <TabsContent value="insurance">
              <Insurance />
            </TabsContent>

            <TabsContent value="legal">
              <Legal />
            </TabsContent>
          </Card>
        </Tabs>
      </form>
    </FormProvider>
  );
}