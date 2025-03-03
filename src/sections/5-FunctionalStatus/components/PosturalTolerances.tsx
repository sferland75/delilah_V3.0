'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function PosturalTolerances() {
  const { control, watch } = useFormContext();
  
  // Basic static postures
  const staticPostures = [
    { id: 'sitting', title: 'Sitting', description: 'Ability to maintain seated position' },
    { id: 'standing', title: 'Standing', description: 'Ability to maintain standing position' },
    { id: 'squatting', title: 'Squatting', description: 'Ability to maintain squatting position' },
    { id: 'kneeling', title: 'Kneeling', description: 'Ability to maintain kneeling position' }
  ];
  
  // Complex dynamic postures
  const dynamicPostures = [
    { id: 'walking', title: 'Walking', description: 'Ability to walk on level surfaces' },
    { id: 'stairClimbing', title: 'Stair Climbing', description: 'Ability to ascend/descend stairs' },
    { id: 'uneven', title: 'Uneven Surfaces', description: 'Ability to navigate uneven terrain' },
    { id: 'carrying', title: 'Carrying Objects', description: 'Ability to carry objects while walking' }
  ];
  
  // Positional changes
  const posturalTransitions = [
    { id: 'sitToStand', title: 'Sit to Stand', description: 'Ability to transition from sitting to standing' },
    { id: 'standToSit', title: 'Stand to Sit', description: 'Ability to transition from standing to sitting' },
    { id: 'floorToStand', title: 'Floor to Stand', description: 'Ability to get up from the floor' },
    { id: 'supineToSit', title: 'Supine to Sit', description: 'Ability to move from lying to sitting' }
  ];
  
  // Common limiting factors
  const limitingFactors = [
    { id: 'pain', label: 'Pain' },
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'weakness', label: 'Weakness' },
    { id: 'balance', label: 'Balance' },
    { id: 'endurance', label: 'Endurance' },
    { id: 'dizziness', label: 'Dizziness' },
    { id: 'breathlessness', label: 'Shortness of breath' },
    { id: 'fear', label: 'Fear/anxiety' }
  ];
  
  // Tolerance levels
  const toleranceLevels = [
    { value: 'normal', label: 'Normal - No limitations' },
    { value: 'mildlyLimited', label: 'Mildly Limited - Can maintain/perform for extended periods with minimal difficulty' },
    { value: 'moderatelyLimited', label: 'Moderately Limited - Can maintain/perform for moderate periods with some difficulty' },
    { value: 'severelyLimited', label: 'Severely Limited - Can only maintain/perform for brief periods with significant difficulty' },
    { value: 'unableToPerform', label: 'Unable to Perform - Cannot maintain/perform even with assistance' }
  ];

  const renderPostureCategory = (category, title, items) => {
    const isExpanded = watch(`data.posturalTolerances.${category}.isExpanded`);
    
    return (
      <Card className="mb-6 border">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <FormField
              control={control}
              name={`data.posturalTolerances.${category}.isExpanded`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 m-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </FormItem>
              )}
            />
          </div>
          <FormDescription>
            Check to assess this category of postural tolerance
          </FormDescription>
        </CardHeader>
        
        {isExpanded && (
          <CardContent>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-md">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={control}
                      name={`data.posturalTolerances.${category}.${item.id}.toleranceLevel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tolerance Level</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tolerance level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {toleranceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel>Limiting Factors</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {limitingFactors.map((factor) => (
                          <FormField
                            key={factor.id}
                            control={control}
                            name={`data.posturalTolerances.${category}.${item.id}.limitingFactors.${factor.id}`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {factor.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name={`data.posturalTolerances.${category}.${item.id}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter duration"
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name={`data.posturalTolerances.${category}.${item.id}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="seconds">Seconds</SelectItem>
                                <SelectItem value="minutes">Minutes</SelectItem>
                                <SelectItem value="hours">Hours</SelectItem>
                                <SelectItem value="repetitions">Repetitions</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={control}
                      name={`data.posturalTolerances.${category}.${item.id}.assistiveDevice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assistive Device / Modification Needed</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., walker, cane, chair modification, etc."
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name={`data.posturalTolerances.${category}.${item.id}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Additional observations..."
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              
              <FormField
                control={control}
                name={`data.posturalTolerances.${category}.generalNotes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">General Notes for {title}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`Add general observations about ${title.toLowerCase()}...`}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-md p-4 mb-6">
        <h3 className="font-semibold text-lg mb-2">Postural & Mobility Assessment</h3>
        <p className="text-sm mb-1">This section assesses the client's ability to maintain various postures and perform functional movements.</p>
        <p className="text-sm">Expand each category to document specific tolerances, limitations, and required accommodations.</p>
      </div>
      
      {renderPostureCategory('static', 'Static Postures', staticPostures)}
      {renderPostureCategory('dynamic', 'Dynamic Mobility', dynamicPostures)}
      {renderPostureCategory('transitions', 'Postural Transitions', posturalTransitions)}
    </div>
  );
}