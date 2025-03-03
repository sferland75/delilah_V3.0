import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import { PreExistingConditions } from './TabViews/PreExistingConditions';
import { InjuryMechanism } from './TabViews/InjuryMechanism';
import { CurrentTreatment } from './TabViews/CurrentTreatment';
import { Medications } from './TabViews/Medications';
import { type FormState } from '../types';

interface FormProps {
  methods: UseFormReturn<FormState>;
  activeTab: string;
}

export function Form({ methods, activeTab }: FormProps) {
  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <TabsContent value="preExisting">
          <PreExistingConditions />
        </TabsContent>

        <TabsContent value="injury">
          <InjuryMechanism />
        </TabsContent>

        <TabsContent value="treatment">
          <CurrentTreatment />
        </TabsContent>

        <TabsContent value="medications">
          <Medications />
        </TabsContent>
      </div>
    </FormProvider>
  );
}