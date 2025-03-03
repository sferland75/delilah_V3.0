'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { adlCategories, iadlCategories, healthCategories, workCategories } from '../constants';
import { ADLField } from './ADLField';
import type { ADLData } from '../types';

export interface ADLSectionProps {
  value: ADLData;
  onChange: (value: ADLData) => void;
}

// This component is now deprecated in favor of the new approach in ActivitiesOfDailyLiving.tsx
// Keeping it for reference and backward compatibility
export const ADLSection: React.FC<ADLSectionProps> = function ADLSection({ value, onChange }) {
  return (
    <div>
      {/* Empty component - logic moved to ActivitiesOfDailyLiving.tsx */}
    </div>
  );
};