import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DwellingInfo from '../components/DwellingInfo';

describe('DwellingInfo', () => {
  const mockValue = {
    type: 'house',
    floors: 1,
    rooms: {
      bedrooms: 2,
      bathrooms: 1,
      kitchen: true,
      livingRoom: true,
      other: []
    }
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with initial values', () => {
    render(<DwellingInfo value={mockValue} onChange={mockOnChange} />);
    
    expect(screen.getByText('Dwelling Information')).toBeInTheDocument();
    expect(screen.getByTestId('dwelling-type-select')).toHaveValue('house');
    expect(screen.getByTestId('input-floor-count')).toHaveValue(1);
    expect(screen.getByLabelText('Kitchen')).toBeChecked();
    expect(screen.getByLabelText('Living Room')).toBeChecked();
  });

  it('handles dwelling type change', () => {
    render(<DwellingInfo value={mockValue} onChange={mockOnChange} />);
    
    const select = screen.getByTestId('dwelling-type-select');
    fireEvent.change(select, { target: { value: 'apartment' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      type: 'apartment'
    });
  });

  it('handles floor count change', () => {
    render(<DwellingInfo value={mockValue} onChange={mockOnChange} />);
    
    const input = screen.getByLabelText('Number of Floors');
    fireEvent.change(input, { target: { value: '2' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      floors: 2
    });
  });

  it('handles room count changes', () => {
    render(<DwellingInfo value={mockValue} onChange={mockOnChange} />);
    
    const bedroomsInput = screen.getByTestId('input-bedroom-count');
    fireEvent.change(bedroomsInput, { target: { value: '3' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      rooms: {
        ...mockValue.rooms,
        bedrooms: 3
      }
    });
  });

  it('handles room type toggles', () => {
    render(<DwellingInfo value={mockValue} onChange={mockOnChange} />);
    
    const kitchenCheckbox = screen.getByLabelText('Kitchen');
    fireEvent.click(kitchenCheckbox);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      rooms: {
        ...mockValue.rooms,
        kitchen: false
      }
    });
  });
});