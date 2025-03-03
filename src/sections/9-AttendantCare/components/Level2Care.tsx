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

interface Level2CareProps {
  form: UseFormReturn<any>;
}

export function Level2Care({ form }: Level2CareProps) {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Level 2 Attendant Care</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {LEVEL_DESCRIPTIONS.LEVEL_2}
        </p>
      </div>

      <Accordion type="multiple" defaultValue={[]} className="space-y-4">
        {Object.entries(careCategories.level2).map(([key, category]) => (
          <AccordionItem key={key} value={key} className="border rounded-md overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-3 px-4">
              <div className="flex items-center gap-2 flex-1">
                <category.icon className="h-4 w-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{category.title}</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              {category.items.map((item) => (
                <CareActivity
                  key={item.id}
                  form={form}
                  path={`level2.${key}.${item.id}`}
                  label={item.title}
                  description={item.description}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}