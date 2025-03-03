import React from 'react';
import { render, screen } from '@testing-library/react';
import { Display } from '../../components/Display';

describe('Display', () => {
  const mockData = {
    personal: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      maritalStatus: 'single'
    },
    contact: {
      address: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
      phone: '555-123-4567',
      email: 'john@example.com'
    },
    insurance: {
      provider: 'Blue Cross',
      policyNumber: 'POL-123',
      groupNumber: 'GRP-456',
      claimNumber: 'CLM-789',
      claimDate: '2024-01-15'
    },
    legal: {
      firm: 'Smith & Associates',
      attorney: 'Jane Smith',
      caseNumber: 'CASE-2024-001',
      fileNumber: 'FILE-001',
      dateOfRepresentation: '2024-01-01'
    }
  };

  it('renders all sections', () => {
    render(<Display data={mockData} />);
    
    // Personal section
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/1990-01-01/)).toBeInTheDocument();
    
    // Contact section
    expect(screen.getByText(/123 main st/i)).toBeInTheDocument();
    expect(screen.getByText(/boston, ma 02108/i)).toBeInTheDocument();
    
    // Insurance section
    expect(screen.getByText(/blue cross/i)).toBeInTheDocument();
    expect(screen.getByText(/pol-123/i)).toBeInTheDocument();
    
    // Legal section
    expect(screen.getByText(/smith & associates/i)).toBeInTheDocument();
    expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<Display data={mockData} />);
    
    expect(screen.getByText(/january 1, 1990/i)).toBeInTheDocument();
    expect(screen.getByText(/january 15, 2024/i)).toBeInTheDocument();
  });

  it('handles missing data gracefully', () => {
    const incompleteData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe'
      },
      contact: {},
      insurance: {},
      legal: {}
    };

    render(<Display data={incompleteData} />);
    
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/not provided/i)).toBeInTheDocument();
  });

  it('formats phone numbers correctly', () => {
    render(<Display data={mockData} />);
    
    expect(screen.getByText(/\(555\) 123-4567/)).toBeInTheDocument();
  });

  it('formats addresses correctly', () => {
    render(<Display data={mockData} />);
    
    const addressText = screen.getByText(/123 main st/i);
    const cityStateZip = screen.getByText(/boston, ma 02108/i);
    
    expect(addressText).toBeInTheDocument();
    expect(cityStateZip).toBeInTheDocument();
  });

  it('maintains section order', () => {
    render(<Display data={mockData} />);
    
    const sections = screen.getAllByRole('region');
    expect(sections[0]).toHaveAttribute('aria-label', /personal information/i);
    expect(sections[1]).toHaveAttribute('aria-label', /contact information/i);
    expect(sections[2]).toHaveAttribute('aria-label', /insurance information/i);
    expect(sections[3]).toHaveAttribute('aria-label', /legal information/i);
  });

  it('applies consistent styling', () => {
    render(<Display data={mockData} />);
    
    const sections = screen.getAllByRole('region');
    sections.forEach(section => {
      expect(section).toHaveClass('mb-6');
    });
  });

  it('handles null values', () => {
    const dataWithNull = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: null,
        gender: null,
        maritalStatus: null
      },
      contact: {
        address: null,
        city: null,
        state: null,
        zip: null,
        phone: null,
        email: null
      },
      insurance: null,
      legal: null
    };

    render(<Display data={dataWithNull} />);
    
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getAllByText(/not provided/i).length).toBeGreaterThan(0);
  });

  it('handles empty strings', () => {
    const dataWithEmpty = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '',
        gender: '',
        maritalStatus: ''
      },
      contact: {
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: ''
      },
      insurance: {
        provider: '',
        policyNumber: '',
        groupNumber: '',
        claimNumber: '',
        claimDate: ''
      },
      legal: {
        firm: '',
        attorney: '',
        caseNumber: '',
        fileNumber: '',
        dateOfRepresentation: ''
      }
    };

    render(<Display data={dataWithEmpty} />);
    
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getAllByText(/not provided/i).length).toBeGreaterThan(0);
  });

  it('displays formatted labels', () => {
    render(<Display data={mockData} />);
    
    expect(screen.getByText(/date of birth/i)).toHaveClass('text-sm', 'font-medium', 'text-gray-500');
    expect(screen.getByText(/contact information/i)).toHaveClass('text-lg', 'font-semibold');
  });

  it('handles special characters in data', () => {
    const dataWithSpecialChars = {
      ...mockData,
      personal: {
        ...mockData.personal,
        firstName: 'Jean-François',
        lastName: "O'Connor"
      },
      legal: {
        ...mockData.legal,
        firm: 'Smith & Associates, LLC.'
      }
    };

    render(<Display data={dataWithSpecialChars} />);
    
    expect(screen.getByText(/jean-françois o'connor/i)).toBeInTheDocument();
    expect(screen.getByText(/smith & associates, llc\./i)).toBeInTheDocument();
  });

  it('renders with proper ARIA attributes', () => {
    render(<Display data={mockData} />);
    
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getAllByRole('region')).toHaveLength(4);
    expect(screen.getAllByRole('definition')).toBeTruthy();
  });

  it('maintains data privacy for sensitive information', () => {
    render(<Display data={mockData} />);
    
    // Policy and case numbers should be partially masked
    expect(screen.getByText(/POL-\*\*\*/i)).toBeInTheDocument();
    expect(screen.getByText(/CASE-\*\*\*\*/i)).toBeInTheDocument();
  });
});