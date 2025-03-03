import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OutdoorAccess from '../components/OutdoorAccess';

describe('OutdoorAccess', () => {
  const mockValue = {
    hasSpace: true,
    types: ['garden'],
    access: 'Back door access'
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with initial values', () => {
    render(<OutdoorAccess value={mockValue} onChange={mockOnChange} />);
    
    expect(screen.getByLabelText('Has Outdoor Space')).toBeChecked();
    expect(screen.getByText('Type of Outdoor Space')).toBeInTheDocument();
    expect(screen.getByTestId('textarea')).toHaveValue('Back door access');
  });

  it('handles outdoor space toggle', () => {
    render(<OutdoorAccess value={mockValue} onChange={mockOnChange} />);
    
    const checkbox = screen.getByLabelText('Has Outdoor Space');
    fireEvent.click(checkbox);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      hasSpace: false
    });
  });

  it('handles type selection', () => {
    render(<OutdoorAccess value={mockValue} onChange={mockOnChange} />);
    
    const select = screen.getByTestId('outdoor-type-select');
    fireEvent.change(select, { target: { value: 'balcony' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      types: 'balcony'
    });
  });

  it('handles access details update', () => {
    render(<OutdoorAccess value={mockValue} onChange={mockOnChange} />);
    
    const textarea = screen.getByTestId('textarea');
    fireEvent.change(textarea, { target: { value: 'Updated access details' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      access: 'Updated access details'
    });
  });
});