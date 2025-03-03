import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Legal } from '../../components/Legal';
import { FormProvider, useForm } from 'react-hook-form';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      legalRep: {
        name: '',
        firm: '',
        phone: '',
        email: '',
        address: '',
        fileNumber: ''
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

describe('Legal Component', () => {
  describe('Rendering', () => {
    it('renders section title', () => {
      render(<Legal />, { wrapper: Wrapper });
      expect(screen.getByText('Legal Representative Information')).toBeInTheDocument();
    });

    it('renders all required fields with proper labels', () => {
      render(<Legal />, { wrapper: Wrapper });
      
      const fields = [
        { field: 'name', label: 'Legal Representative Name' },
        { field: 'firm', label: 'Law Firm' },
        { field: 'phone', label: 'Phone Number' },
        { field: 'email', label: 'Email' },
        { field: 'address', label: 'Office Address' },
        { field: 'fileNumber', label: 'File Number' }
      ];

      fields.forEach(({ field, label }) => {
        const id = createFieldId('legalRep', field);
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
      render(<Legal />, { wrapper: Wrapper });
      const emailInput = screen.getByTestId('input-legalRep-email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('renders address field as full width', () => {
      render(<Legal />, { wrapper: Wrapper });
      const addressFormItem = screen.getAllByTestId('form-item')
        .find(item => item.className?.includes('col-span-2'));
      expect(addressFormItem).toBeInTheDocument();
    });
  });

  describe('Field Behavior', () => {
    it('includes proper placeholders', () => {
      render(<Legal />, { wrapper: Wrapper });
      
      const placeholders = {
        name: 'Representative name',
        firm: 'Law firm name',
        phone: 'Legal contact phone',
        email: 'Legal contact email',
        address: 'Legal office address',
        fileNumber: 'Legal file number'
      };

      Object.entries(placeholders).forEach(([field, placeholder]) => {
        const id = createFieldId('legalRep', field);
        const input = screen.getByTestId(`input-${id}`);
        expect(input).toHaveAttribute('placeholder', placeholder);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper aria attributes', () => {
      render(<Legal />, { wrapper: Wrapper });

      const fields = [
        { field: 'name', label: 'Legal Representative Name' },
        { field: 'firm', label: 'Law Firm' },
        { field: 'phone', label: 'Phone Number' },
        { field: 'email', label: 'Email' },
        { field: 'address', label: 'Office Address' },
        { field: 'fileNumber', label: 'File Number' }
      ];

      fields.forEach(({ field, label }) => {
        const id = createFieldId('legalRep', field);
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
      render(<Legal />, { wrapper: Wrapper });
      const heading = screen.getByText('Legal Representative Information');
      expect(heading.tagName).toBe('H3');
    });
  });
});