import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Contact } from '../components/Contact';
import { Demographics } from '../schema';
import { FormProvider, useForm } from 'react-hook-form';

// Mock the UI components
jest.mock('@/components/ui/form', () => ({
  FormField: ({ render }: any) => render({ 
    field: { 
      value: '', 
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn()
    } 
  }),
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormMessage: () => null,
  FormDescription: ({ children }: any) => <p>{children}</p>
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h3>{children}</h3>,
  CardContent: ({ children }: any) => <div>{children}</div>
}));

const mockDemographicsData = {
  contact: {
    phone: '(555) 555-5555',
    email: 'test@example.com',
    address: '123 Test St'
  },
  emergencyContact: {
    name: 'Emergency Contact',
    relationship: 'Relative',
    phone: '(555) 555-5556'
  }
};

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<Demographics>({
    defaultValues: mockDemographicsData
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('Contact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Contact />, { wrapper: TestWrapper });
    expect(screen.getByText('Primary Contact')).toBeInTheDocument();
  });

  describe('Primary Contact Section', () => {
    it('renders all primary contact fields', () => {
      render(<Contact />, { wrapper: TestWrapper });
      
      expect(screen.getByText('Primary Contact')).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    });

    it('shows correct placeholders', () => {
      render(<Contact />, { wrapper: TestWrapper });
      
      expect(screen.getByPlaceholderText('(555) 555-5555')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Street address')).toBeInTheDocument();
    });
  });

  describe('Emergency Contact Section', () => {
    it('renders emergency contact card', () => {
      render(<Contact />, { wrapper: TestWrapper });
      
      expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('renders all emergency contact fields', () => {
      render(<Contact />, { wrapper: TestWrapper });
      
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Relationship/i)).toBeInTheDocument();
      expect(screen.getAllByLabelText(/Phone Number/i)).toHaveLength(2);
    });
  });

  describe('Form Description', () => {
    it('renders the form description text', () => {
      render(<Contact />, { wrapper: TestWrapper });
      
      expect(screen.getByText(/Please ensure all contact information is current and accurate/i)).toBeInTheDocument();
      expect(screen.getByText(/The emergency contact should be someone who can be reached/i)).toBeInTheDocument();
    });
  });
});
