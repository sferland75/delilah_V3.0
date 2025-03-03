import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';

describe('Select Component', () => {
  it('should render select with options', () => {
    render(
      <Select value="1" onValueChange={jest.fn()}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should call onValueChange when an option is selected', async () => {
    const handleChange = jest.fn();
    render(
      <Select value="1" onValueChange={handleChange}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '2');
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  it('should handle falsy onValueChange gracefully', async () => {
    render(
      <Select value="1">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '2');
    // Should not throw error
  });

  describe('SelectTrigger', () => {
    it('should render trigger with id', () => {
      render(<SelectTrigger id="test">Trigger</SelectTrigger>);
      expect(screen.getByText('Trigger')).toHaveAttribute('id', 'test');
    });

    it('should pass through additional props', () => {
      render(<SelectTrigger className="custom">Trigger</SelectTrigger>);
      expect(screen.getByText('Trigger')).toHaveClass('custom');
    });
  });

  describe('SelectValue', () => {
    it('should render with placeholder', () => {
      render(<SelectValue placeholder="Select..." />);
      expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('should render without placeholder', () => {
      render(<SelectValue />);
      expect(screen.getByText('')).toBeInTheDocument();
    });
  });

  describe('SelectContent', () => {
    it('should render content', () => {
      render(<SelectContent>Options</SelectContent>);
      expect(screen.getByText('Options')).toBeInTheDocument();
    });
  });

  describe('SelectItem', () => {
    it('should render item with value', () => {
      render(<SelectItem value="test">Item</SelectItem>);
      const option = screen.getByText('Item');
      expect(option.parentElement).toHaveAttribute('value', 'test');
    });

    it('should handle props', () => {
      render(<SelectItem value="test" disabled>Item</SelectItem>);
      const option = screen.getByText('Item').parentElement;
      expect(option).toBeDisabled();
    });
  });
});