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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function TransfersAssessment() {
  const { control, watch } = useFormContext();
  
  // Basic transfers
  const basicTransfers = [
    { id: 'bedMobility', title: 'Bed Mobility', description: 'Rolling, scooting, bridging in bed' },
    { id: 'supineToSit', title: 'Supine to Sit', description: 'Moving from lying to sitting position' },
    { id: 'sitToStand', title: 'Sit to Stand', description: 'Rising from sitting to standing' },
    { id: 'standToSit', title: 'Stand to Sit', description: 'Controlled lowering to sitting position' }
  ];
  
  // Functional transfers
  const functionalTransfers = [
    { id: 'chairToChair', title: 'Chair to Chair Transfer', description: 'Moving between two chairs/surfaces' },
    { id: 'toiletTransfer', title: 'Toilet Transfer', description: 'Transfers to/from toilet' },
    { id: 'carTransfer', title: 'Car Transfer', description: 'Entering/exiting a vehicle' },
    { id: 'tub', title: 'Tub/Shower Transfer', description: 'Entering/exiting tub or shower' }
  ];
  
  // Specialty transfers
  const specialtyTransfers = [
    { id: 'floorToChair', title: 'Floor to Chair', description: 'Rising from floor to chair' },
    { id: 'bedToWC', title: 'Bed to Wheelchair', description: 'Transfer between bed and wheelchair' },
    { id: 'slidingBoard', title: 'Sliding Board Transfer', description: 'Using a sliding board for transfers' },
    { id: 'dependentLift', title: 'Dependent Lift Transfer', description: 'Transfer using mechanical lift' }
  ];
  
  // Transfer independence levels
  const independenceLevels = [
    { value: 'independent', label: 'Independent - Requires no assistance or supervision' },
    { value: 'setup', label: 'Setup Only - Needs equipment setup but performs transfer independently' },
    { value: 'supervision', label: 'Supervision - Requires standby supervision/verbal cueing' },
    { value: 'minimalAssist', label: 'Minimal Assist (25%) - Requires minimal physical assistance' },
    { value: 'moderateAssist', label: 'Moderate Assist (50%) - Requires moderate physical assistance' },
    { value: 'maximalAssist', label: 'Maximal Assist (75%) - Performs some elements but requires significant assistance' },
    { value: 'dependent', label: 'Dependent (100%) - Unable to participate or requires total assistance' },
    { value: 'notAssessed', label: 'Not Assessed - Transfer not evaluated' }
  ];
  
  // Common limiting factors
  const limitingFactors = [
    { id: 'pain', label: 'Pain' },
    { id: 'strength', label: 'Decreased Strength' },
    { id: 'balance', label: 'Poor Balance' },
    { id: 'coordination', label: 'Impaired Coordination' },
    { id: 'endurance', label: 'Limited Endurance' },
    { id: 'cognition', label: 'Cognitive Impairment' },
    { id: 'fear', label: 'Fear/Anxiety' },
    { id: 'rangeOfMotion', label: 'Limited Range of Motion' }
  ];

  const renderTransferCategory = (category, title, items) => {
    const isExpanded = watch(`data.transfers.${category}.isExpanded`);
    
    return (
      <Card className="mb-6 border">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <FormField
              control={control}
              name={`data.transfers.${category}.isExpanded`}
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
            Check to assess this category of transfers
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
                      name={`data.transfers.${category}.${item.id}.independence`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level of Independence</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {independenceLevels.map((level) => (
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
                            name={`data.transfers.${category}.${item.id}.limitingFactors.${factor.id}`}
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
                    
                    <FormField
                      control={control}
                      name={`data.transfers.${category}.${item.id}.assistiveDevice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assistive Device / Equipment Needed</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., grab bars, transfer board, etc."
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name={`data.transfers.${category}.${item.id}.assistRequired`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assistance Required</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Describe number of assistants and type of assistance"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name={`data.transfers.${category}.${item.id}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Technique used, safety concerns, etc."
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
                name={`data.transfers.${category}.generalNotes`}
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
        <h3 className="font-semibold text-lg mb-2">Transfers Assessment</h3>
        <p className="text-sm mb-1">This section assesses the client's ability to perform various transfers required for daily activities.</p>
        <p className="text-sm">Expand each category to document specific transfer abilities, limitations, and required assistance/equipment.</p>
      </div>
      
      {renderTransferCategory('basic', 'Basic Bed & Chair Transfers', basicTransfers)}
      {renderTransferCategory('functional', 'Functional Transfers', functionalTransfers)}
      {renderTransferCategory('specialty', 'Specialty Transfers', specialtyTransfers)}
    </div>
  );
}