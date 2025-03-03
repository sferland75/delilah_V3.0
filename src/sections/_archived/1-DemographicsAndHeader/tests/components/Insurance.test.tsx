import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Insurance } from '../../components/Insurance';
import { FormProvider, useForm } from 'react-hook-form';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      insurance: {
        provider: '',
        claimNumber: '',
        adjustorName: '',
        adjustorPhone: '',
        adjustorEmail: ''
      }
    }
  });

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

// Helper to create unique IDs
const createFieldId = (section: string, field: string) => `${section}-${field}`;

// Mock UI components
jest.mock('@/components/ui/form', () => ({
  FormField: ({ name, render }: any) => {
    const [section, field] = name.split('.');
    const id = createFieldId(section, field);
    return render({ 
      field: { 
        name,
        id,
        value: '',
        onChange: (e: any) => e.target.value,
        onBlur: jest.fn()
      }
    });
  },
  FormItem: ({ children, className }: any) => (
    <div data-testid="form-item" className={className}>{children}</div>
  ),
  FormLabel: ({ children, htmlFor }: any) => (
    <label 
      data-testid={`label-${htmlFor}`} 
      htmlFor={htmlFor}
      className="form-label"
    >
      {children}
    </label>
  ),
  FormControl: ({ children }: any) => <div data-testid="form-control">{children}</div>,
  FormMessage: () => null
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ id, name, ...props }: any) => (
    <input
      data-testid={`input-${id}`}
      id={id}
      name={name}
      aria-labelledby={`label-${id}`}
      {...props}
    />
  ),
}));

describe('Insurance Component', () => {
  describe('Rendering', () => {
    it('renders section title', () => {
      render(<Insurance />, { wrapper: Wrapper });
      expect(screen.getByText('Insurance Information')).toBeInTheDocument();
    });

    it('renders all required fields with proper labels', () => {
      render(<Insurance />, { wrapper: Wrapper });
      
      const fields = [
        { field: 'provider', label: 'Insurance Provider' },
        { field: 'claimNumber', label: 'Claim Number' },
        { field: 'adjustorName', label: 'Claims Adjustor' },
        { field: 'adjustorPhone', label: 'Adjustor Phone' },
        { field: 'adjustorEmail', label: 'Adjustor Email' }
      ];

      fields.forEach(({ field, label }) => {
        const id = createFieldId('insurance', field);
        const input = screen.getByTestId(`input-${id}`);
        const labelElement = screen.getByText(label);

        // Input assertions
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('id', id);
        expect(input).toHaveAttribute('aria-labelledby', `label-${id}`);

        // Label assertions
        expect(labelElement).toBeInTheDocument();
        expect(labelElement.tagName).toBe('LABEL');
        expect(labelElement.className).toContain('form-label');
      });
    });

    it('renders email field with correct type', () => {
      render(<Insurance />, { wrapper: Wrapper });
      const emailInput = screen.getByTestId('input-insurance-adjustorEmail');
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Field Behavior', () => {
    it('includes proper placeholders', () => {
      render(<Insurance />, { wrapper: Wrapper });
      
      const placeholders = {
        provider: 'Insurance company name',
        claimNumber: 'Claim/Policy number',
        adjustorName: 'Adjustor name',
        adjustorPhone: 'Adjustor phone',
        adjustorEmail: 'Adjustor email'
      };

      Object.entries(placeholders).forEach(([field, placeholder]) => {
        const id = createFieldId('insurance', field);
        const input = screen.getByTestId(`input-${id}`);
        expect(input).toHaveAttribute('placeholder', placeholder);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper aria attributes', () => {
      render(<Insurance />, { wrapper: Wrapper });

      const fields = [
        { field: 'provider', label: 'Insurance Provider' },
        { field: 'claimNumber', label: 'Claim Number' },
        { field: 'adjustorName', label: 'Claims Adjustor' },
        { field: 'adjustorPhone', label: 'Adjustor Phone' },
        { field: 'adjustorEmail', label: 'Adjustor Email' }
      ];

      fields.forEach(({ field, label }) => {
        const id = createFieldId('insurance', field);
        const input = screen.getByTestId(`input-${id}`);
        
        // Verify input accessibility attributes
        expect(input).toHaveAttribute('id', id);
        expect(input).toHaveAttribute('aria-labelledby', `label-${id}`);
        
        // Verify label exists with correct text
        const labelElement = screen.getByText(label);
        expect(labelElement).toBeInTheDocument();
      });
    });

    it('uses semantic heading for section title', () => {
      render(<Insurance />, { wrapper: Wrapper });
      const heading = screen.getByText('Insurance Information');
      expect(heading.tagName).toBe('H3');
    });
  });
});