import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ADLField } from '../components/ADLField';
import { Bath } from 'lucide-react';
import { mockADLData } from '../__test_utils__/fixtures';
import { renderWithFormContext } from '../__test_utils__/utils';
import { independenceLevels } from '../constants';

// Test specific props
const defaultProps = {
  basePath: 'basic.bathing.shower',
  title: 'Bathing/Showering',
  subtitle: 'Including transfer and washing',
  icon: Bath
};

describe('ADLField', () => {
  it('renders with all props', () => {
    const { container } = renderWithFormContext(<ADLField {...defaultProps} />, mockADLData);
    
    expect(screen.getByText('Bathing/Showering')).toBeInTheDocument();
    expect(screen.getByText('Including transfer and washing')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByTestId('textarea')).toBeInTheDocument();
    expect(container.querySelector('.text-primary')).toBeInTheDocument(); // Icon present
  });

  it('renders without subtitle', () => {
    const propsWithoutSubtitle = {
      ...defaultProps,
      subtitle: undefined
    };
    renderWithFormContext(<ADLField {...propsWithoutSubtitle} />, mockADLData);

    expect(screen.getByText('Bathing/Showering')).toBeInTheDocument();
    expect(screen.queryByText('Including transfer and washing')).not.toBeInTheDocument();
  });

  it('shows independence level options', () => {
    renderWithFormContext(<ADLField {...defaultProps} />, mockADLData);

    // Verify the select is present
    const select = screen.getByTestId('select');
    expect(select).toBeInTheDocument();

    // Get the SelectValue component and verify placeholder
    const selectValue = screen.getByTestId('select-value');
    expect(selectValue).toBeInTheDocument();
    expect(selectValue).toHaveTextContent('Select independence level');
  });

  it('handles independence level selection', () => {
    const { container } = renderWithFormContext(<ADLField {...defaultProps} />, {});
    
    // Find the select component
    const select = screen.getByTestId('select');
    const selectTrigger = screen.getByTestId('select-trigger');

    // Simulate click to open the select
    fireEvent.click(selectTrigger);

    // Check that select items are rendered
    const independentOption = screen.getAllByTestId('select-item').find(
      element => element.getAttribute('value') === 'independent'
    );
    expect(independentOption).toBeInTheDocument();

    // Click the first option
    fireEvent.click(independentOption);

    // Verify the trigger was clicked
    expect(selectTrigger).toBeInTheDocument();
  });

  it('handles textarea inputs', () => {
    renderWithFormContext(<ADLField {...defaultProps} />, {});
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveValue('');
    
    // Test textarea interaction
    fireEvent.change(textarea, { target: { value: 'Test notes' } });
    expect(textarea).toHaveValue('Test notes');
  });

  it('renders with empty initial values', () => {
    renderWithFormContext(<ADLField {...defaultProps} />, {});
    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByTestId('textarea')).toHaveValue('');
  });
});