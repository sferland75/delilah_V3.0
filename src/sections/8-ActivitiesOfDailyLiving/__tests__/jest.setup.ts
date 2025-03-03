import '@testing-library/jest-dom';
import React from 'react';

// Mock component factory
const createMockComponent = (name: string) => {
  const MockComponent = (props: any): JSX.Element => 
    React.createElement('div', {
      'data-testid': name.toLowerCase(),
      ...props,
    });
  MockComponent.displayName = name;
  return MockComponent;
};

// Mock UI components
jest.mock('@/components/ui', () => ({
  Card: createMockComponent('card'),
  CardContent: createMockComponent('card-content'),
  Alert: createMockComponent('alert'),
  AlertDescription: createMockComponent('alert-description'),
  Tabs: createMockComponent('tabs'),
  TabsList: createMockComponent('tabs-list'),
  TabsTrigger: createMockComponent('tabs-trigger'),
  TabsContent: createMockComponent('tabs-content'),
  Accordion: createMockComponent('accordion'),
  AccordionItem: createMockComponent('accordion-item'),
  AccordionTrigger: createMockComponent('accordion-trigger'),
  AccordionContent: createMockComponent('accordion-content'),
  Select: createMockComponent('select'),
  SelectTrigger: createMockComponent('select-trigger'),
  SelectValue: createMockComponent('select-value'),
  SelectContent: createMockComponent('select-content'),
  SelectItem: createMockComponent('select-item'),
  Label: createMockComponent('label'),
  Textarea: createMockComponent('textarea')
}));

// Mock all Lucide icons used in the component
jest.mock('lucide-react', () => ({
  Bath: createMockComponent('bath-icon'),
  Shirt: createMockComponent('shirt-icon'),
  Utensils: createMockComponent('utensils-icon'),
  ArrowUpDown: createMockComponent('arrow-up-down-icon'),
  User: createMockComponent('user-icon'),
  Bed: createMockComponent('bed-icon'),
  Home: createMockComponent('home-icon'),
  Phone: createMockComponent('phone-icon'),
  Bus: createMockComponent('bus-icon'),
  CreditCard: createMockComponent('credit-card-icon'),
  ShoppingCart: createMockComponent('shopping-cart-icon'),
  Pill: createMockComponent('pill-icon'),
  Calendar: createMockComponent('calendar-icon'),
  Clock: createMockComponent('clock-icon'),
  ClipboardList: createMockComponent('clipboard-list-icon'),
  HeartPulse: createMockComponent('heart-pulse-icon'),
  Briefcase: createMockComponent('briefcase-icon'),
  Building: createMockComponent('building-icon'),
  GraduationCap: createMockComponent('graduation-cap-icon'),
  Activity: createMockComponent('activity-icon')
}));