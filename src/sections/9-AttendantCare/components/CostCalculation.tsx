'use client';

import React, { useEffect, useState } from 'react';
import { UseFormReturn } from "react-hook-form";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CARE_RATES, WEEKLY_TO_MONTHLY } from "../constants";
import { calculateSummary } from "../utils/calculations";

interface CostCalculationProps {
  form: UseFormReturn<any>;
}

export function CostCalculation({ form }: CostCalculationProps) {
  const { watch, register, setValue } = form;
  const formData = watch();
  
  // Initialize editable rates with the default values
  const [rates, setRates] = useState({
    level1: CARE_RATES.LEVEL_1,
    level2: CARE_RATES.LEVEL_2,
    level3: CARE_RATES.LEVEL_3
  });

  // Create a modified version of the calculations function that uses our custom rates
  const getCalculations = () => {
    // Set the custom rates in the form data for calculation
    const dataWithRates = {
      ...formData,
      customRates: {
        LEVEL_1: rates.level1,
        LEVEL_2: rates.level2,
        LEVEL_3: rates.level3
      }
    };
    
    return calculateSummary(dataWithRates);
  };
  
  const calculations = getCalculations();

  // Handle rate changes
  const handleRateChange = (level: 'level1' | 'level2' | 'level3', value: string) => {
    const numericValue = parseFloat(value) || 0;
    setRates(prev => ({
      ...prev,
      [level]: numericValue
    }));
    
    // Store the custom rates in the form data
    setValue(`summary.customRates.${level.toUpperCase()}`, numericValue);
  };

  // Additional notes and review information
  const reviewedBy = watch('summary.reviewedBy') || '';
  const reviewDate = watch('summary.reviewDate') || '';
  const notes = watch('summary.notes') || '';
  const hasAttachments = watch('summary.hasAttachments') || false;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Calculation of Attendant Care Costs</h3>
        <p className="text-sm text-muted-foreground mt-1">
          This part calculates the monthly attendant care allowance for Parts 1, 2, and 3. 
          The sum of all three parts will be the Total Assessed Monthly Attendant Care Benefit.
        </p>
        <p className="text-sm text-blue-600 font-medium mt-2">
          Hourly rates can be adjusted below to accommodate different legislative frameworks.
        </p>
      </div>

      <Card className="border rounded-md overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]"></TableHead>
                  <TableHead className="text-center">Total Minutes per Week</TableHead>
                  <TableHead className="text-center">Total Weekly Hours</TableHead>
                  <TableHead className="text-center">Total Monthly Hours</TableHead>
                  <TableHead className="text-center">Hourly Rate</TableHead>
                  <TableHead className="text-center">Monthly Care Benefit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Part 1</TableCell>
                  <TableCell className="text-center">
                    <div className="relative w-16 mx-auto">
                      <Input
                        className="text-center"
                        value={calculations?.level1?.minutesPerWeek || 0}
                        readOnly
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative w-16">
                        <Input 
                          className="text-center"
                          value={calculations?.level1?.weeklyHours || 0}
                          readOnly
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative w-16">
                        <Input 
                          className="text-center"
                          value={calculations?.level1?.monthlyHours || 0}
                          readOnly
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="relative w-20 mx-auto">
                      <div className="flex items-center">
                        <span className="mr-1">$</span>
                        <Input 
                          className="text-center"
                          type="number"
                          step="0.01"
                          min="0"
                          value={rates.level1}
                          onChange={(e) => handleRateChange('level1', e.target.value)}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">${calculations?.level1?.monthlyCost || 0}</TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Part 2</TableCell>
                  <TableCell className="text-center">
                    <div className="relative w-16 mx-auto">
                      <Input
                        className="text-center"
                        value={calculations?.level2?.minutesPerWeek || 0}
                        readOnly
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative w-16">
                        <Input 
                          className="text-center"
                          value={calculations?.level2?.weeklyHours || 0}
                          readOnly
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative w-16">
                        <Input 
                          className="text-center"
                          value={calculations?.level2?.monthlyHours || 0}
                          readOnly
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="relative w-20 mx-auto">
                      <div className="flex items-center">
                        <span className="mr-1">$</span>
                        <Input 
                          className="text-center"
                          type="number"
                          step="0.01"
                          min="0"
                          value={rates.level2}
                          onChange={(e) => handleRateChange('level2', e.target.value)}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">${calculations?.level2?.monthlyCost || 0}</TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Part 3</TableCell>
                  <TableCell className="text-center">
                    <div className="relative w-16 mx-auto">
                      <Input
                        className="text-center"
                        value={calculations?.level3?.minutesPerWeek || 0}
                        readOnly
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative w-16">
                        <Input 
                          className="text-center"
                          value={calculations?.level3?.weeklyHours || 0}
                          readOnly
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative w-16">
                        <Input 
                          className="text-center"
                          value={calculations?.level3?.monthlyHours || 0}
                          readOnly
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="relative w-20 mx-auto">
                      <div className="flex items-center">
                        <span className="mr-1">$</span>
                        <Input 
                          className="text-center"
                          type="number"
                          step="0.01"
                          min="0"
                          value={rates.level3}
                          onChange={(e) => handleRateChange('level3', e.target.value)}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">${calculations?.level3?.monthlyCost || 0}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">Total Assessed Monthly Attendant Care Benefit</h4>
              <div className="text-xl font-bold bg-blue-100 border border-blue-300 rounded-md px-4 py-2">
                ${calculations?.summary?.totalMonthlyCost || 0}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              (This amount is subject to the limits allowed under the Statutory Accident Benefits Schedule)
            </p>
          </div>
          
          {/* Rate Framework Selection */}
          <div className="mt-6 border rounded-md p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Rate Framework</h4>
            <div>
              <Label className="text-sm font-medium" htmlFor="rateFramework">Legislative Framework</Label>
              <select 
                id="rateFramework"
                className="w-full mt-1 p-2 border rounded-md"
                {...register('summary.rateFramework')}
                onChange={(e) => {
                  // Set predefined rates based on selected framework
                  if (e.target.value === 'pre-2010') {
                    setRates({
                      level1: 11.23,
                      level2: 8.75,
                      level3: 17.98
                    });
                  } else if (e.target.value === '2010-2016') {
                    setRates({
                      level1: 13.19,
                      level2: 10.25,
                      level3: 19.35
                    });
                  } else if (e.target.value === 'current') {
                    setRates({
                      level1: CARE_RATES.LEVEL_1,
                      level2: CARE_RATES.LEVEL_2,
                      level3: CARE_RATES.LEVEL_3
                    });
                  } else if (e.target.value === 'custom') {
                    // Keep current custom rates
                  }
                }}
              >
                <option value="current">Current Framework (2016+)</option>
                <option value="2010-2016">2010-2016 Framework</option>
                <option value="pre-2010">Pre-2010 Framework</option>
                <option value="custom">Custom Rates</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor="reviewedBy">Assessor Name</Label>
              <Input 
                id="reviewedBy"
                {...register('summary.reviewedBy')}
                placeholder="Enter assessor's name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor="reviewDate">Assessment Date</Label>
              <Input 
                id="reviewDate"
                type="date"
                {...register('summary.reviewDate')}
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label className="text-sm font-medium" htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes"
              {...register('summary.notes')}
              placeholder="Enter any additional notes or observations"
              className="min-h-[120px]"
            />
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasAttachments" 
                  checked={hasAttachments}
                  onCheckedChange={(checked) => {
                    setValue('summary.hasAttachments', checked === true);
                  }}
                />
                <Label 
                  htmlFor="hasAttachments" 
                  className="text-sm font-medium cursor-pointer"
                >
                  Are there any attachments?
                </Label>
              </div>
              
              {hasAttachments && (
                <div className="space-y-1">
                  <Label className="text-sm font-medium" htmlFor="attachmentCount">How many?</Label>
                  <Input 
                    id="attachmentCount"
                    type="number"
                    min="1"
                    className="w-20"
                    {...register('summary.attachmentCount', { valueAsNumber: true })}
                  />
                </div>
              )}
            </div>
            {hasAttachments && (
              <p className="text-sm text-muted-foreground mt-2">
                Send any attachments directly to the insurer
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}