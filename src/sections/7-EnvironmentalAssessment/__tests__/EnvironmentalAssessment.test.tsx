import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EnvironmentalAssessment, { EnvironmentalAssessmentData } from '../components/EnvironmentalAssessment';

describe('EnvironmentalAssessment', () => {
  const mockValue: EnvironmentalAssessmentData = {
    dwelling: {
      type: 'house',
      floors: 1,
      rooms: {
        bedrooms: 2,
        bathrooms: 1,
        kitchen: true,
        livingRoom: true,
        other: []
      }
    },
    safety: {
      hazards: ['Loose carpet'],
      modifications: ['Grab bars in bathroom'],
      recommendations: ['Install handrails']
    },
    outdoor: {
      hasSpace: true,
      types: ['garden'],
      access: 'Back door access'
    }
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all sub-components', () => {
    render(<EnvironmentalAssessment value={mockValue} onChange={mockOnChange} />);
    
    // DwellingInfo
    expect(screen.getByText('Dwelling Information')).toBeInTheDocument();
    expect(screen.getByTestId('dwelling-type-select')).toHaveValue('house');
    
    // SafetyChecklist
    expect(screen.getByText('Safety Assessment')).toBeInTheDocument();
    expect(screen.getByText('Loose carpet')).toBeInTheDocument();
    
    // OutdoorAccess
    expect(screen.getByText('Outdoor Space')).toBeInTheDocument();
    expect(screen.getByLabelText('Has Outdoor Space')).toBeChecked();
  });

  it('handles dwelling changes', () => {
    render(<EnvironmentalAssessment value={mockValue} onChange={mockOnChange} />);
    
    const floorInput = screen.getByTestId('input-floor-count');
    fireEvent.change(floorInput, { target: { value: '2' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      dwelling: {
        ...mockValue.dwelling,
        floors: 2
      }
    });
  });

  it('handles safety changes', () => {
    render(<EnvironmentalAssessment value={mockValue} onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Enter safety hazard');
    const addButton = screen.getByText('Add Hazard');
    
    fireEvent.change(input, { target: { value: 'Poor lighting' } });
    fireEvent.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      safety: {
        ...mockValue.safety,
        hazards: [...mockValue.safety.hazards, 'Poor lighting']
      }
    });
  });

  it('handles outdoor space changes', () => {
    render(<EnvironmentalAssessment value={mockValue} onChange={mockOnChange} />);
    
    const textarea = screen.getByTestId('textarea');
    fireEvent.change(textarea, { target: { value: 'Updated access details' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      outdoor: {
        ...mockValue.outdoor,
        access: 'Updated access details'
      }
    });
  });
});