import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Legal } from './Legal';
import { renderWithForm } from '@/test/test-utils';

describe('Legal', () => {
  it('renders all legal representative fields', () => {
    renderWithForm(<Legal />);
    
    expect(screen.getByLabelText(/legal representative name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/law firm/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/office address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/file number/i)).toBeInTheDocument();
  });

  it('handles input changes', () => {
    renderWithForm(<Legal />);
    
    const nameInput = screen.getByLabelText(/legal representative name/i);
    fireEvent.change(nameInput, { target: { value: 'John Smith' } });
    expect(nameInput).toHaveValue('John Smith');
    
    const firmInput = screen.getByLabelText(/law firm/i);
    fireEvent.change(firmInput, { target: { value: 'Smith & Associates' } });
    expect(firmInput).toHaveValue('Smith & Associates');
    
    const fileNumberInput = screen.getByLabelText(/file number/i);
    fireEvent.change(fileNumberInput, { target: { value: 'FILE123' } });
    expect(fileNumberInput).toHaveValue('FILE123');
  });

  it('validates required fields', async () => {
    const { findByText } = renderWithForm(<Legal />);
    
    const nameInput = screen.getByLabelText(/legal representative name/i);
    fireEvent.blur(nameInput);
    
    expect(await findByText('Legal representative name is required')).toBeInTheDocument();
    
    const firmInput = screen.getByLabelText(/law firm/i);
    fireEvent.blur(firmInput);
    
    expect(await findByText('Law firm name is required')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const { findByText } = renderWithForm(<Legal />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(await findByText('Invalid email address')).toBeInTheDocument();
    
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.blur(emailInput);
    
    expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
  });
});