import React from 'react';
import { render, screen } from '@testing-library/react';
import { Display } from './Display';
import { Demographics } from '../schema';

describe('Display', () => {
  const mockData: Demographics = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    maritalStatus: 'married',
    contact: {
      phone: '(555) 555-5555',
      email: 'john.doe@example.com',
      address: '123 Main St'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '(555) 555-5556'
    },
    insurance: {
      provider: 'Test Insurance',
      claimNumber: 'CLM123456',
      adjustorName: 'Sarah Smith',
      adjustorPhone: '(555) 555-5557',
      adjustorEmail: 'sarah.smith@insurance.com'
    },
    legalRep: {
      name: 'Bob Wilson',
      firm: 'Wilson Law',
      phone: '(555) 555-5558',
      email: 'bob@wilsonlaw.com',
      address: '456 Law St',
      fileNumber: 'FILE789'
    }
  };

  it('renders personal information', () => {
    render(<Display data={mockData} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1/1/1990')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
    expect(screen.getByText('married')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Display data={mockData} />);
    
    expect(screen.getByText('(555) 555-5555')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('renders emergency contact information', () => {
    render(<Display data={mockData} />);
    
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Spouse')).toBeInTheDocument();
    expect(screen.getByText('(555) 555-5556')).toBeInTheDocument();
  });

  it('renders insurance information', () => {
    render(<Display data={mockData} />);
    
    expect(screen.getByText('Test Insurance')).toBeInTheDocument();
    expect(screen.getByText('CLM123456')).toBeInTheDocument();
    expect(screen.getByText('Sarah Smith')).toBeInTheDocument();
    expect(screen.getByText('sarah.smith@insurance.com')).toBeInTheDocument();
  });

  it('renders legal representative information', () => {
    render(<Display data={mockData} />);
    
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    expect(screen.getByText('Wilson Law')).toBeInTheDocument();
    expect(screen.getByText('FILE789')).toBeInTheDocument();
    expect(screen.getByText('bob@wilsonlaw.com')).toBeInTheDocument();
  });

  it('displays "Not provided" for missing optional fields', () => {
    const minimalData: Demographics = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      contact: {},
      insurance: {
        provider: 'Test Insurance',
        claimNumber: 'CLM123456',
        adjustorName: 'Sarah Smith'
      },
      legalRep: {
        name: 'Bob Wilson',
        firm: 'Wilson Law',
        fileNumber: 'FILE789'
      }
    };

    render(<Display data={minimalData} />);
    
    const notProvidedInstances = screen.getAllByText('Not provided');
    expect(notProvidedInstances.length).toBeGreaterThan(0);
  });
});