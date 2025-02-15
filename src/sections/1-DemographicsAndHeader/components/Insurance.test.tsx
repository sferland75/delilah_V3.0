import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Insurance } from './Insurance';
import { renderWithForm } from '@/test/test-utils';

describe('Insurance', () => {
  it('renders all insurance fields', () => {
    renderWithForm(<Insurance />);
    
    expect(screen.getByLabelText(/insurance provider/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/claim number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/claims adjustor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/adjustor phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/adjustor email/i)).toBeInTheDocument();
  });

  it('handles input changes', () => {
    renderWithForm(<Insurance />);
    
    const providerInput = screen.getByLabelText(/insurance provider/i);
    fireEvent.change(providerInput, { target: { value: 'Test Insurance Co' } });
    expect(providerInput).toHaveValue('Test Insurance Co');
    
    const claimInput = screen.getByLabelText(/claim number/i);
    fireEvent.change(claimInput, { target: { value: 'CLM123456' } });
    expect(claimInput).toHaveValue('CLM123456');
    
    const adjustorInput = screen.getByLabelText(/claims adjustor/i);
    fireEvent.change(adjustorInput, { target: { value: 'John Smith' } });
    expect(adjustorInput).toHaveValue('John Smith');
  });

  it('validates required fields', async () => {
    const { findByText } = renderWithForm(<Insurance />);
    
    const providerInput = screen.getByLabelText(/insurance provider/i);
    fireEvent.blur(providerInput);
    
    expect(await findByText('Insurance provider is required')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const { findByText } = renderWithForm(<Insurance />);
    
    const emailInput = screen.getByLabelText(/adjustor email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(await findByText('Invalid email address')).toBeInTheDocument();
    
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.blur(emailInput);
    
    expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
  });
});