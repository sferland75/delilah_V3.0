import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Contact } from '../../components/Contact';
import { FormProvider, useForm } from 'react-hook-form';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      contact: {
        phone: '',
        email: '',
        address: ''
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    }
  });

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

const mockFormLabel = jest.fn().mockImplementation(({ children, htmlFor }) => (
  <label data-testid={`label-${htmlFor}`} htmlFor={htmlFor}>{children}</label>
));

// Mock UI components
jest.mock('@/components/ui/form', () => ({
  FormField: ({ name, render }: any) => {
    const [section, field] = name.split('.');
    const id = `${section}-${field}`;
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
  FormItem: ({ children }: any) => <div data-testid="form-item">{children}</div>,
  FormLabel: (props: any) => mockFormLabel(props),
  FormControl: ({ children }: any) => <div data-testid="form-control">{children}</div>,
  FormMessage: () => null,
  FormDescription: ({ children }: any) => <div data-testid="form-description">{children}</div>,
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

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="emergency-contact-card">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

describe('Contact Component', () => {
  beforeEach(() => {
    mockFormLabel.mockClear();
  });

  describe('Rendering', () => {
    it('renders primary contact fields with proper labels', () => {
      render(<Contact />, { wrapper: Wrapper });
      
      const primaryLabels = {
        phone: screen.getByTestId('label-contact-phone'),
        email: screen.getByTestId('label-contact-email'),
        address: screen.getByTestId('label-contact-address')
      };

      expect(primaryLabels.phone).toHaveTextContent('Phone Number');
      expect(primaryLabels.email).toHaveTextContent('Email');
      expect(primaryLabels.address).toHaveTextContent('Address');
    });

    it('renders emergency contact section with proper labels', () => {
      render(<Contact />, { wrapper: Wrapper });
      
      expect(screen.getByTestId('card-title')).toHaveTextContent('Emergency Contact');
      
      const emergencyLabels = {
        name: screen.getByTestId('label-emergencyContact-name'),
        relationship: screen.getByTestId('label-emergencyContact-relationship'),
        phone: screen.getByTestId('label-emergencyContact-phone')
      };

      expect(emergencyLabels.name).toHaveTextContent('Name');
      expect(emergencyLabels.relationship).toHaveTextContent('Relationship');
      expect(emergencyLabels.phone).toHaveTextContent('Phone Number');
    });

    it('renders form description', () => {
      render(<Contact />, { wrapper: Wrapper });
      
      const description = screen.getByTestId('form-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent(/ensure all contact information is current/i);
    });
  });

  describe('Field Interactions', () => {
    it('renders all required primary contact fields', () => {
      render(<Contact />, { wrapper: Wrapper });
      
      expect(screen.getByTestId('input-contact-phone')).toHaveAttribute('name', 'contact.phone');
      expect(screen.getByTestId('input-contact-email')).toHaveAttribute('name', 'contact.email');
      expect(screen.getByTestId('input-contact-address')).toHaveAttribute('name', 'contact.address');
    });

    it('renders all required emergency contact fields', () => {
      render(<Contact />, { wrapper: Wrapper });
      
      expect(screen.getByTestId('input-emergencyContact-name')).toHaveAttribute('name', 'emergencyContact.name');
      expect(screen.getByTestId('input-emergencyContact-relationship')).toHaveAttribute('name', 'emergencyContact.relationship');
      expect(screen.getByTestId('input-emergencyContact-phone')).toHaveAttribute('name', 'emergencyContact.phone');
    });
  });

  describe('Accessibility', () => {
    it('associates labels with inputs', () => {
      render(<Contact />, { wrapper: Wrapper });
      
      // Verify FormLabel was called with correct htmlFor prop
      const expectedCalls = [
        { htmlFor: 'contact-phone', children: 'Phone Number' },
        { htmlFor: 'contact-email', children: 'Email' },
        { htmlFor: 'contact-address', children: 'Address' },
        { htmlFor: 'emergencyContact-name', children: 'Name' },
        { htmlFor: 'emergencyContact-relationship', children: 'Relationship' },
        { htmlFor: 'emergencyContact-phone', children: 'Phone Number' }
      ];

      expectedCalls.forEach(({ htmlFor, children }) => {
        expect(mockFormLabel).toHaveBeenCalledWith(
          expect.objectContaining({ 
            htmlFor,
            children
          })
        );
      });

      // Verify inputs have correct attributes
      expectedCalls.forEach(({ htmlFor }) => {
        const input = screen.getByTestId(`input-${htmlFor}`);
        expect(input).toHaveAttribute('id', htmlFor);
        expect(input).toHaveAttribute('aria-labelledby', `label-${htmlFor}`);
      });
    });

    it('groups emergency contact information appropriately', () => {
      render(<Contact />, { wrapper: Wrapper });
      
      const section = screen.getByTestId('emergency-contact-card');
      expect(section).toBeInTheDocument();
      expect(section).toContainElement(screen.getByText('Emergency Contact'));
    });
  });
});