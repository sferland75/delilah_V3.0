import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import { FormProvider } from 'react-hook-form';
import { PreExistingConditions } from './TabViews/PreExistingConditions';
import { InjuryMechanism } from './TabViews/InjuryMechanism';
import { CurrentTreatment } from './TabViews/CurrentTreatment';
import { Medications } from './TabViews/Medications';
import { type FormState } from '../types';

interface FormProps {
  methods: UseFormReturn<FormState>;
}

export function Form({ methods }: FormProps) {
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <TabsContent value="preExisting">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <PreExistingConditions />
          </div>
        </TabsContent>

        <TabsContent value="injury">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <InjuryMechanism />
          </div>
        </TabsContent>

        <TabsContent value="treatment">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <CurrentTreatment />
          </div>
        </TabsContent>

        <TabsContent value="medications">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <Medications />
          </div>
        </TabsContent>
      </div>
    </FormProvider>
  );
}