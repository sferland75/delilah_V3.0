import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SafetyChecklist from '../components/SafetyChecklist';

describe('SafetyChecklist', () => {
  const mockValue = {
    hazards: ['Loose carpet'],
    modifications: ['Grab bars in bathroom'],
    recommendations: ['Install handrails']
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with initial values', () => {
    render(<SafetyChecklist value={mockValue} onChange={mockOnChange} />);
    
    expect(screen.getByText('Safety Assessment')).toBeInTheDocument();
    expect(screen.getByText('Loose carpet')).toBeInTheDocument();
    expect(screen.getByText('Grab bars in bathroom')).toBeInTheDocument();
    expect(screen.getByText('Install handrails')).toBeInTheDocument();
  });

  it('adds new hazard', () => {
    render(<SafetyChecklist value={mockValue} onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Enter safety hazard');
    const addButton = screen.getByText('Add Hazard');
    
    fireEvent.change(input, { target: { value: 'Poor lighting' } });
    fireEvent.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      hazards: [...mockValue.hazards, 'Poor lighting']
    });
  });

  it('removes hazard', () => {
    render(<SafetyChecklist value={mockValue} onChange={mockOnChange} />);
    
    const removeButton = screen.getAllByText('Remove')[0];
    fireEvent.click(removeButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      hazards: []
    });
  });

  it('adds new modification', () => {
    render(<SafetyChecklist value={mockValue} onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Enter existing modification');
    const addButton = screen.getByText('Add Modification');
    
    fireEvent.change(input, { target: { value: 'Ramp at entrance' } });
    fireEvent.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      modifications: [...mockValue.modifications, 'Ramp at entrance']
    });
  });

  it('adds new recommendation', () => {
    render(<SafetyChecklist value={mockValue} onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Enter safety recommendation');
    const addButton = screen.getByText('Add Recommendation');
    
    fireEvent.change(input, { target: { value: 'Add non-slip mats' } });
    fireEvent.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      recommendations: [...mockValue.recommendations, 'Add non-slip mats']
    });
  });

  it('does not add empty items', () => {
    render(<SafetyChecklist value={mockValue} onChange={mockOnChange} />);
    
    const addButton = screen.getByText('Add Hazard');
    fireEvent.click(addButton);
    
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});