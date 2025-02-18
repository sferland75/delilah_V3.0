import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
  const { mode, setMode } = useAssessmentContext();
  const methods = useForm<Demographics>({
    resolver: zodResolver(demographicsSchema),
    defaultValues
  });

  const { persist, loading, error } = useFormPersistence(methods);

  const onSubmit = async (data: Demographics) => {
    try {
      await persist(data);
    } catch (err) {
      // Error is handled by useFormPersistence
    }
  };

  if (mode === 'view') {
    return (
      <div>
        <Button onClick={() => setMode('edit')}>Edit Mode</Button>
        <Display data={methods.getValues()} />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex justify-between mb-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" onClick={() => setMode('view')}>
            View Mode
          </Button>
        </div>

        {error && (
          <div role="alert" className="mb-4 text-red-500">
            Error saving data: {error.message}
          </div>
        )}

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