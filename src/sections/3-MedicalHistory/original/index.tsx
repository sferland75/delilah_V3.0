import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Bone, Stethoscope, Pill } from 'lucide-react';
import { Form } from './components/Form';
import { Display } from './components/Display';
import { 
  type FormState
} from './types';
import {
  medicalHistorySchema,
  defaultFormState,
  defaultViewConfig
} from './schema';
import { useFormPersistence } from '@/hooks/useFormPersistence';

export function MedicalHistorySection() {
  const methods = useForm<FormState>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: defaultFormState,
  });

  // Safe config access with fallback
  let config = defaultViewConfig;
  try {
    const watchResult = methods.watch('config');
    config = watchResult ?? defaultViewConfig;
  } catch (error) {
    console.error('Error watching form config:', error);
  }

  const { mode, activeTab } = config;

  // Persist form state
  useFormPersistence(methods, 'medical-history');

  const handleTabChange = (value: string) => {
    try {
      methods.setValue('config.activeTab', value as FormState['config']['activeTab'], {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.error('Error updating tab:', error);
      methods.setValue('config', {
        ...defaultViewConfig,
        activeTab: value as FormState['config']['activeTab']
      });
    }
  };

  return (
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Medical History</h2>
      <p className="text-sm text-slate-600 mb-6">Pre-existing conditions, injury details, and current treatments</p>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document comprehensive medical history including:
          - Pre-existing conditions and prior surgeries
          - Injury mechanism and immediate symptoms
          - Current medications and treatments
          - Ongoing care and rehabilitation details
        </AlertDescription>
      </Alert>

      {mode === 'view' ? (
        <Display data={methods.getValues('data')} />
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger 
              value="preExisting"
              className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" data-testid="icon-history" />
                <span>Pre-Existing</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="injury"
              className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <Bone className="h-4 w-4" data-testid="icon-bone" />
                <span>Injury Details</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="treatment"
              className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" data-testid="icon-stethoscope" />
                <span>Treatment</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="medications"
              className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4" data-testid="icon-pill" />
                <span>Medications</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <Form methods={methods} activeTab={activeTab} />
          </div>
        </Tabs>
      )}
    </Card>
  );
}