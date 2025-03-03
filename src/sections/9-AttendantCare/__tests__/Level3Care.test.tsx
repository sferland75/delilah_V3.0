import React from 'react';
import { render, screen } from '@testing-library/react';
import { Level3Care } from '../components/Level3Care';
import { LEVEL_DESCRIPTIONS, careCategories } from "../constants";
import { useForm, FormProvider } from 'react-hook-form';
import { mockUiComponents } from './testUtils';

// Mock the component imports using our centralized mocks
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
  AccordionTrigger: ({ children, className }: any) => (
    <div data-testid="accordion-trigger" className={className}>
      {children}
    </div>
  ),
}));

// Mock the CareActivity component
jest.mock('../components/CareActivity', () => ({
  CareActivity: ({ label, path, description }: { label: string; path: string; description?: string }) => (
    <div data-testid="care-activity" data-path={path} data-description={description}>{label}</div>
  ),
}));

interface WrapperProps {
  defaultValues?: any;
  children: React.ReactNode;
}

const FormWrapper = ({ defaultValues = {}, children }: WrapperProps) => {
  const methods = useForm({
    defaultValues: {
      level3: defaultValues,
    },
    mode: 'onChange'
  });

  return (
    <FormProvider {...methods}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { form: methods });
        }
        return child;
      })}
    </FormProvider>
  );
};

describe('Level3Care Component', () => {
  beforeEach(() => {
    // Mock all category icons
    Object.values(careCategories.level3).forEach(category => {
      category.icon = () => <span>Icon</span>;
    });
  });

  it('renders the component title and description', () => {
    render(
      <FormWrapper>
        <Level3Care form={useForm()} />
      </FormWrapper>
    );
    
    // Check for the title
    expect(screen.getByText('Level 3 Attendant Care')).toBeInTheDocument();
    
    // Check for the description
    expect(screen.getByText(LEVEL_DESCRIPTIONS.LEVEL_3)).toBeInTheDocument();
  });

  it('renders all care categories', () => {
    render(
      <FormWrapper>
        <Level3Care form={useForm()} />
      </FormWrapper>
    );
    
    // Check for each category title
    Object.values(careCategories.level3).forEach(category => {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    });
  });

  it('renders the correct number of care activities', () => {
    render(
      <FormWrapper>
        <Level3Care form={useForm()} />
      </FormWrapper>
    );
    
    // Count all activities across all categories
    const totalActivities = Object.values(careCategories.level3).reduce(
      (count, category) => count + category.items.length, 
      0
    );
    
    const careActivities = screen.getAllByTestId('care-activity');
    expect(careActivities.length).toBe(totalActivities);
  });

  it('passes the correct path to CareActivity components', () => {
    render(
      <FormWrapper>
        <Level3Care form={useForm()} />
      </FormWrapper>
    );
    
    // Check path format for each care activity
    Object.entries(careCategories.level3).forEach(([categoryKey, category]) => {
      category.items.forEach(item => {
        const expectedPath = `level3.${categoryKey}.${item.id}`;
        const careActivity = screen.getByText(item.title);
        expect(careActivity.closest('[data-path]')).toHaveAttribute('data-path', expectedPath);
      });
    });
  });
});