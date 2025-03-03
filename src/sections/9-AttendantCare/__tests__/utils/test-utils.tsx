import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendantCareSchema, type AttendantCareFormData } from '../../schema';
import { mockUiComponents } from '../testUtils';

// Mock UI Components
jest.mock('@/components/ui/card', () => ({
  Card: mockUiComponents.Card
}));

jest.mock('@/components/ui/tabs', () => ({
  Tabs: mockUiComponents.Tabs,
  TabsContent: mockUiComponents.TabsContent,
  TabsList: mockUiComponents.TabsList,
  TabsTrigger: mockUiComponents.TabsTrigger
}));

jest.mock('@/components/ui/label', () => ({
  Label: mockUiComponents.Label
}));

jest.mock('@/components/ui/input', () => ({
  Input: mockUiComponents.Input
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: mockUiComponents.Textarea
}));

jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, className, type, defaultValue }: any) => (
    <div data-testid="accordion" data-type={type} className={className} data-default-value={defaultValue}>
      {children}
    </div>
  ),
  AccordionContent: ({ children, className }: any) => (
    <div data-testid="accordion-content" className={className}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, value, className }: any) => (
    <div data-testid="accordion-item" data-value={value} className={className}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, className, onClick }: any) => (
    <button data-testid="accordion-trigger" className={className} onClick={onClick} role="button">
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: mockUiComponents.AlertDialog,
  AlertDialogContent: mockUiComponents.AlertDialogContent,
  AlertDialogHeader: mockUiComponents.AlertDialogHeader,
  AlertDialogTitle: mockUiComponents.AlertDialogTitle,
  AlertDialogDescription: mockUiComponents.AlertDialogDescription
}));

jest.mock('@/components/ui/button', () => ({
  Button: mockUiComponents.Button
}));

// Mock lodash debounce to execute immediately
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: (fn: Function) => fn
}));

// Form wrapper for testing components that need form context
export function FormWrapper({ 
  children, 
  defaultValues = {} 
}: { 
  children: React.ReactNode;
  defaultValues?: Partial<AttendantCareFormData>;
}) {
  const form = useForm<AttendantCareFormData>({
    resolver: zodResolver(attendantCareSchema),
    defaultValues
  });

  return (
    <div>
      <form onSubmit={form.handleSubmit(() => {})}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { form } as { form: UseFormReturn<AttendantCareFormData> });
          }
          return child;
        })}
      </form>
    </div>
  );
}

// Custom render function that includes form context
export function renderWithForm(
  ui: React.ReactElement,
  defaultValues?: Partial<AttendantCareFormData>
) {
  return {
    user: userEvent.setup(),
    ...render(
      <FormWrapper defaultValues={defaultValues}>{ui}</FormWrapper>
    ),
  };
}

// Test data generators
export const createTestActivity = (
  minutes: number = 0,
  timesPerWeek: number = 0,
  notes: string = ''
) => ({
  minutes,
  timesPerWeek,
  totalMinutes: minutes * timesPerWeek,
  notes
});

export const createTestCategoryData = (
  activities: { [key: string]: ReturnType<typeof createTestActivity> }
) => activities;

// Mock data for testing calculations
export const mockFormData = {
  level1: {
    personalCare: createTestCategoryData({
      bathing: createTestActivity(15, 7),
      dressing: createTestActivity(20, 7),
      grooming: createTestActivity(30, 7),
      toileting: createTestActivity(10, 21)
    })
  },
  level2: {
    householdManagement: createTestCategoryData({
      mealPreparation: createTestActivity(5, 21),
      cleaning: createTestActivity(30, 7),
      laundry: createTestActivity(15, 14)
    })
  },
  level3: {
    communityAccess: createTestCategoryData({
      transportation: createTestActivity(20, 7),
      shopping: createTestActivity(15, 14)
    })
  }
};

// Assertion helpers
export const expectActivityTotalMinutes = (
  activity: ReturnType<typeof createTestActivity>
) => {
  expect(activity.totalMinutes).toBe(activity.minutes * activity.timesPerWeek);
};

export const expectValidCategoryData = (
  category: { [key: string]: ReturnType<typeof createTestActivity> }
) => {
  Object.values(category).forEach(activity => {
    expect(activity).toHaveProperty('minutes');
    expect(activity).toHaveProperty('timesPerWeek');
    expect(activity).toHaveProperty('totalMinutes');
    expectActivityTotalMinutes(activity);
  });
};