import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Contact } from './Contact';
import { renderWithForm } from '@/test/test-utils';

describe('Contact', () => {
  it('renders primary contact fields', () => {
    renderWithForm(<Contact />);
    
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
  });

  it('renders emergency contact fields', () => {
    renderWithForm(<Contact />);
    
    expect(screen.getByText(/emergency contact/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/name/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/relationship/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/phone number/i)[1]).toBeInTheDocument();
  });

  it('handles primary contact input changes', () => {
    renderWithForm(<Contact />);
    
    const phoneInput = screen.getAllByLabelText(/phone number/i)[0];
    fireEvent.change(phoneInput, { target: { value: '(555) 555-5555' } });
    expect(phoneInput).toHaveValue('(555) 555-5555');
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
    
    const addressInput = screen.getByLabelText(/address/i);
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
    expect(addressInput).toHaveValue('123 Main St');
  });

  it('handles emergency contact input changes', () => {
    renderWithForm(<Contact />);
    
    const nameInput = screen.getAllByLabelText(/name/i)[0];
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(nameInput).toHaveValue('Jane Doe');
    
    const relationshipInput = screen.getByLabelText(/relationship/i);
    fireEvent.change(relationshipInput, { target: { value: 'Spouse' } });
    expect(relationshipInput).toHaveValue('Spouse');
    
    const phoneInput = screen.getAllByLabelText(/phone number/i)[1];
    fireEvent.change(phoneInput, { target: { value: '(555) 555-5556' } });
    expect(phoneInput).toHaveValue('(555) 555-5556');
  });

  it('validates email format', async () => {
    const { findByText } = renderWithForm(<Contact />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(await findByText('Invalid email address')).toBeInTheDocument();
    
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.blur(emailInput);
    
    expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
  });

  it('displays the help text', () => {
    renderWithForm(<Contact />);
    
    expect(screen.getByText(/please ensure all contact information is current/i)).toBeInTheDocument();
  });
});