import React from 'react';
import { render, screen } from '../../../../tests/utils/test-utils';
import { Personal } from '../../components/Personal';
import userEvent from '@testing-library/user-event';

// Mock UI components to simplify testing
jest.mock('@/components/ui/form', () => {
  return {
    FormField: function FormField(props) {
      return props.render({ 
        field: { 
          name: props.name,
          id: props.name,
          value: '',
          onChange: jest.fn(),
          onBlur: jest.fn(),
          ref: jest.fn()
        }
      });
    },
    FormItem: function FormItem(props) {
      return <div>{props.children}</div>;
    },
    FormLabel: function FormLabel(props) {
      return <label htmlFor={props.htmlFor}>{props.children}</label>;
    },
    FormControl: function FormControl(props) {
      return <div>{props.children}</div>;
    },
    FormMessage: function FormMessage(props) {
      return props.children ? <div role="alert">{props.children}</div> : null;
    }
  };
});

// Mock Input component
jest.mock('@/components/ui/input', () => {
  return {
    Input: function Input(props) {
      return <input {...props} />;
    }
  };
});

// Mock Select components
jest.mock('@/components/ui/select', () => {
  return {
    Select: function Select(props) {
      return (
        <div data-value={props.value} onChange={props.onValueChange}>
          {props.children}
        </div>
      );
    },
    SelectTrigger: function SelectTrigger(props) {
      return <button id={props.id}>{props.children}</button>;
    },
    SelectValue: function SelectValue(props) {
      return <span>{props.placeholder}</span>;
    },
    SelectContent: function SelectContent(props) {
      return <div>{props.children}</div>;
    },
    SelectItem: function SelectItem(props) {
      return <option value={props.value}>{props.children}</option>;
    }
  };
});

describe('Personal Component', () => {
  it('renders all form fields', () => {
    render(<Personal />);
    
    // Check for required input fields
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    
    // Check for select fields
    expect(screen.getByText('Select gender')).toBeInTheDocument();
    expect(screen.getByText('Select marital status')).toBeInTheDocument();
  });

  it('renders all gender options', () => {
    render(<Personal />);
    
    const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
    genderOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('renders all marital status options', () => {
    render(<Personal />);
    
    const statusOptions = ['Single', 'Married', 'Common Law', 'Divorced', 'Separated', 'Widowed'];
    statusOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('has proper ARIA labels', () => {
    render(<Personal />);
    
    expect(screen.getByLabelText('First Name')).toHaveAttribute('aria-label', 'First Name');
    expect(screen.getByLabelText('Last Name')).toHaveAttribute('aria-label', 'Last Name');
    expect(screen.getByLabelText('Date of Birth')).toHaveAttribute('aria-label', 'Date of Birth');
  });

  it('displays form validation errors', async () => {
    // Mock form context with errors
    const formValues = {
      formState: {
        errors: {
          firstName: { type: 'required', message: 'First name is required' },
          lastName: { type: 'required', message: 'Last name is required' }
        }
      }
    };

    render(<Personal />, { formValues });

    // Check for error messages
    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(await screen.findByText('Last name is required')).toBeInTheDocument();
  });
});