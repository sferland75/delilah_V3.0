'use client';

import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LEVEL_DESCRIPTIONS, careCategories } from "../constants";
import { CareActivity } from "./CareActivity";
import { AttendantCareField } from "./AttendantCareField";

interface Level1CareProps {
  form: UseFormReturn<any>;
}

export function Level1Care({ form }: Level1CareProps) {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Level 1 Attendant Care</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {LEVEL_DESCRIPTIONS.LEVEL_1}
        </p>
      </div>

      <Accordion type="multiple" defaultValue={[]} className="space-y-4">
        {Object.entries(careCategories.level1).map(([key, category]) => (
          <AccordionItem key={key} value={key} className="border rounded-md overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center gap-2 flex-1">
                <category.icon className="h-4 w-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{category.title}</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              {category.items.map((item) => {
                // Use the new enhanced field for specific categories like dressing and grooming
                if (['dressing', 'grooming', 'feeding', 'mobility'].includes(key)) {
                  return (
                    <AttendantCareField
                      key={item.id}
                      form={form}
                      path={`level1.${key}.${item.id}`}
                      label={item.title}
                      description={item.description}
                      includeHoursPerWeek={true}
                      assistanceLevels={['none', 'minimal', 'moderate', 'maximal', 'setup', 'standby']}
                    />
                  );
                }
                
                // Use the standard activity component for others
                return (
                  <CareActivity
                    key={item.id}
                    form={form}
                    path={`level1.${key}.${item.id}`}
                    label={item.title}
                    description={item.description}
                  />
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}