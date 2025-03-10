import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { History, ClipboardCheck } from 'lucide-react';

// Time slots in 30 minute increments
const TIME_SLOTS = [
  "5:00 AM", "5:30 AM", 
  "6:00 AM", "6:30 AM", 
  "7:00 AM", "7:30 AM", 
  "8:00 AM", "8:30 AM", 
  "9:00 AM", "9:30 AM", 
  "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", 
  "12:00 PM", "12:30 PM", 
  "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", 
  "3:00 PM", "3:30 PM", 
  "4:00 PM", "4:30 PM", 
  "5:00 PM", "5:30 PM", 
  "6:00 PM", "6:30 PM", 
  "7:00 PM", "7:30 PM", 
  "8:00 PM", "8:30 PM", 
  "9:00 PM", "9:30 PM", 
  "10:00 PM", "10:30 PM", 
  "11:00 PM", "11:30 PM"
];

// Schema
const timeSlotSchema = z.record(z.string().optional().default(""));

const assistanceSchema = z.record(z.string().optional().default(""));

const typicalDaySchema = z.object({
  preAccident: timeSlotSchema,
  postAccident: timeSlotSchema,
  postAccidentAssistance: assistanceSchema,
  activeTab: z.string().default('preAccident')
});

type FormData = z.infer<typeof typicalDaySchema>;

export function TypicalDayIntegratedFinal() {
  const { data, updateSection } = useAssessment();
  const [saveStatus, setSaveStatus] = useState<null | 'saving' | 'success' | 'error'>(null);
  
  // Default values
  const defaultValues: FormData = {
    preAccident: TIME_SLOTS.reduce((acc, time) => ({ ...acc, [time]: "" }), {}),
    postAccident: TIME_SLOTS.reduce((acc, time) => ({ ...acc, [time]: "" }), {}),
    postAccidentAssistance: TIME_SLOTS.reduce((acc, time) => ({ ...acc, [time]: "" }), {}),
    activeTab: 'preAccident'
  };
  
  // Setup form
  const methods = useForm<FormData>({
    resolver: zodResolver(typicalDaySchema),
    defaultValues
  });
  
  const { register, handleSubmit, watch, setValue, formState } = methods;
  const activeTab = watch('activeTab');
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setValue('activeTab', value);
  };
  
  // Handle form submission
  const onSubmit = (formData: FormData) => {
    setSaveStatus('saving');

    try {
      // Transform data for context
      const typicalDayData = {
        morningRoutine: formatTimeSlots(formData.postAccident, formData.postAccidentAssistance, "5:00 AM", "12:00 PM"),
        daytimeActivities: formatTimeSlots(formData.postAccident, formData.postAccidentAssistance, "12:00 PM", "5:00 PM"),
        eveningRoutine: formatTimeSlots(formData.postAccident, formData.postAccidentAssistance, "5:00 PM", "9:00 PM"),
        nightRoutine: formatTimeSlots(formData.postAccident, formData.postAccidentAssistance, "9:00 PM", "11:30 PM"),
        preAccidentRoutine: {
          morning: formatTimeSlots(formData.preAccident, {}, "5:00 AM", "12:00 PM"),
          afternoon: formatTimeSlots(formData.preAccident, {}, "12:00 PM", "5:00 PM"),
          evening: formatTimeSlots(formData.preAccident, {}, "5:00 PM", "9:00 PM"),
          night: formatTimeSlots(formData.preAccident, {}, "9:00 PM", "11:30 PM")
        }
      };
      
      // Update context
      updateSection('typicalDay', typicalDayData);
      setSaveStatus('success');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveStatus('error');
    }
  };
  
  // Format time slot data to text
  const formatTimeSlots = (
    timeSlots: Record<string, string>, 
    assistance: Record<string, string>, 
    startTime: string, 
    endTime: string
  ): string => {
    const startIndex = TIME_SLOTS.indexOf(startTime);
    const endIndex = TIME_SLOTS.indexOf(endTime);
    
    if (startIndex === -1 || endIndex === -1) return '';
    
    const relevantSlots = TIME_SLOTS.slice(startIndex, endIndex + 1);
    const result = relevantSlots
      .filter(time => timeSlots[time]?.trim())
      .map(time => {
        let text = `${time}: ${timeSlots[time] || ''}`;
        if (assistance[time]) {
          text += ` (Assistance: ${assistance[time]})`;
        }
        return text;
      })
      .join('\n');
      
    return result || '';
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Typical Day</h2>
        <p className="text-sm text-muted-foreground mt-1">Document daily activities in 30-minute increments</p>
      </div>

      <Alert className="mb-6 bg-slate-50 border-slate-200">
        <AlertDescription className="text-slate-700">
          Enter activities for each time slot. Leave blank if no specific activity occurs at that time.
        </AlertDescription>
      </Alert>

      <FormProvider {...methods}>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {formState.isDirty && !saveStatus && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}
          
          {saveStatus === 'saving' && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                Saving your changes...
              </AlertDescription>
            </Alert>
          )}
          
          {saveStatus === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Changes saved successfully!
              </AlertDescription>
            </Alert>
          )}
          
          {saveStatus === 'error' && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                Error saving changes. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full border rounded-md">
            <TabsList className="grid w-full grid-cols-2 p-0 h-auto border-b">
              <TabsTrigger 
                value="preAccident"
                className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span>Pre-Accident</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="postAccident"
                className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Post-Accident</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preAccident" className="p-6">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="py-2 px-4 text-left w-1/6">Time</th>
                      <th className="py-2 px-4 text-left">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((time, index) => (
                      <tr key={time} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="py-2 px-4 border-t">
                          <strong>{time}</strong>
                        </td>
                        <td className="py-2 px-4 border-t">
                          <Input 
                            {...register(`preAccident.${time}`)}
                            placeholder={`Activity at ${time}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="postAccident" className="p-6">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="py-2 px-4 text-left w-1/6">Time</th>
                      <th className="py-2 px-4 text-left">Activity</th>
                      <th className="py-2 px-4 text-left">Assistance/Limitations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((time, index) => (
                      <tr key={time} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="py-2 px-4 border-t">
                          <strong>{time}</strong>
                        </td>
                        <td className="py-2 px-4 border-t">
                          <Input 
                            {...register(`postAccident.${time}`)}
                            placeholder={`Activity at ${time}`}
                          />
                        </td>
                        <td className="py-2 px-4 border-t">
                          <Input 
                            {...register(`postAccidentAssistance.${time}`)}
                            placeholder="Assistance needed or limitations"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => methods.reset(defaultValues)}
              type="button"
            >
              Reset
            </Button>
            <Button type="submit">
              Save Typical Day
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}