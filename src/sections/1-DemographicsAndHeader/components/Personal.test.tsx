import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Personal } from './Personal';
import { renderWithForm } from '@/test/test-utils';

describe('Personal', () => {
  it('renders all required fields', () => {
    renderWithForm(<Personal />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/marital status/i)).toBeInTheDocument();
  });

  it('handles input changes', () => {
    renderWithForm(<Personal />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput).toHaveValue('John');
    
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    expect(lastNameInput).toHaveValue('Doe');
    
    const dobInput = screen.getByLabelText(/date of birth/i);
    fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
    expect(dobInput).toHaveValue('1990-01-01');
  });

  it('handles gender selection', async () => {
    renderWithForm(<Personal />);
    
    const genderTrigger = screen.getByRole('combobox', { name: /gender/i });
    fireEvent.click(genderTrigger);
    
    const maleOption = screen.getByRole('option', { name: 'Male' });
    fireEvent.click(maleOption);
    
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('handles marital status selection', async () => {
    renderWithForm(<Personal />);
    
    const maritalTrigger = screen.getByRole('combobox', { name: /marital status/i });
    fireEvent.click(maritalTrigger);
    
    const marriedOption = screen.getByRole('option', { name: 'Married' });
    fireEvent.click(marriedOption);
    
    expect(screen.getByText('Married')).toBeInTheDocument();
  });

  it('shows validation messages for required fields', async () => {
    const { findByText } = renderWithForm(<Personal />);
    
    // Try to submit empty form
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.blur(firstNameInput);
    
    expect(await findByText('First name is required')).toBeInTheDocument();
  });

  it('accepts valid inputs without validation errors', () => {
    renderWithForm(<Personal />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.blur(firstNameInput);
    
    expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
  });
});