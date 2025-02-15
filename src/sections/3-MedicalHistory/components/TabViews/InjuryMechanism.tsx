import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type FormState } from '../../types';

const VEHICLE_POSITIONS = [
  "Driver",
  "Front Passenger",
  "Left Rear Passenger",
  "Right Rear Passenger",
  "Middle Rear Passenger",
  "Other"
] as const;

const IMPACT_TYPES = [
  "Front",
  "Rear",
  "Driver Side",
  "Passenger Side",
  "Multiple Impacts",
  "Rollover",
  "Other"
] as const;

export function InjuryMechanism() {
  const { control } = useFormContext<FormState>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Injury Mechanism</h3>
        <p className="text-sm text-slate-600 mb-4">Document details of the accident or injury event</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="data.injury.date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Incident</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="data.injury.time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Incident</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="data.injury.position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position in Vehicle</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VEHICLE_POSITIONS.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="data.injury.impactType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Impact</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {IMPACT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="data.injury.circumstance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Circumstances of Accident</FormLabel>
              <FormDescription>
                Speed of vehicles, road conditions, weather conditions, etc.
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the circumstances leading to the accident..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.injury.preparedForImpact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preparation for Impact</FormLabel>
              <FormDescription>
                Awareness of impending collision, bracing position, head position, etc.
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe preparation or awareness of impending impact..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.injury.immediateSymptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immediate Symptoms</FormLabel>
              <FormDescription>
                Symptoms noted at scene and immediately following accident
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe immediate symptoms following the accident..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="data.injury.immediateResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immediate Response & Care</FormLabel>
              <FormDescription>
                Emergency services response, treatment at scene, transport details
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe immediate medical response and care received..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}