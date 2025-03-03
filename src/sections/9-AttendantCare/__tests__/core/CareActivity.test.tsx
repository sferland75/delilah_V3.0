import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { CareActivity } from '../../components/CareActivity';
import { renderWithForm, createTestActivity } from '../utils/test-utils';

describe('CareActivity Core Functionality', () => {
  const defaultProps = {
    path: 'test.activity',
    label: 'Test Activity',
    description: 'Test description'
  };

  it('renders basic input fields', async () => {
    const { user } = renderWithForm(
      <CareActivity {...defaultProps} />
    );

    // Check basic structure
    expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minutes per Activity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Times per Week/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter details about assistance/i)).toBeInTheDocument();
  });

  it('handles numeric input correctly', async () => {
    const { user } = renderWithForm(
      <CareActivity {...defaultProps} />
    );

    const minutesInput = screen.getByLabelText(/Minutes per Activity/i);
    const timesInput = screen.getByLabelText(/Times per Week/i);

    // Enter valid numbers
    await user.type(minutesInput, '30');
    await user.type(timesInput, '7');

    await waitFor(() => {
      expect(minutesInput).toHaveValue(30);
      expect(timesInput).toHaveValue(7);
      expect(screen.getByText('210')).toBeInTheDocument(); // Total minutes
    });
  });

  it('prevents invalid numeric input', async () => {
    const { user } = renderWithForm(
      <CareActivity {...defaultProps} />
    );

    const minutesInput = screen.getByLabelText(/Minutes per Activity/i);
    
    // Try negative number
    await user.type(minutesInput, '-5');
    
    await waitFor(() => {
      expect(minutesInput).not.toHaveValue(-5);
    });

    // Try non-numeric input
    await user.clear(minutesInput);
    await user.type(minutesInput, 'abc');

    await waitFor(() => {
      expect(minutesInput).not.toHaveValue('abc');
    });
  });

  it('calculates total minutes correctly', async () => {
    const { user } = renderWithForm(
      <CareActivity {...defaultProps} />
    );

    const minutesInput = screen.getByLabelText(/Minutes per Activity/i);
    const timesInput = screen.getByLabelText(/Times per Week/i);

    // Test various combinations
    const testCases = [
      { minutes: '30', times: '7', expected: '210' },
      { minutes: '15', times: '14', expected: '210' },
      { minutes: '60', times: '1', expected: '60' },
      { minutes: '0', times: '5', expected: '0' },
      { minutes: '10', times: '0', expected: '0' },
    ];

    for (const testCase of testCases) {
      await user.clear(minutesInput);
      await user.clear(timesInput);
      await user.type(minutesInput, testCase.minutes);
      await user.type(timesInput, testCase.times);

      await waitFor(() => {
        expect(screen.getByText(testCase.expected)).toBeInTheDocument();
      });
    }
  });

  it('handles form submission data correctly', async () => {
    const onSubmit = jest.fn();
    const { user } = renderWithForm(
      <CareActivity {...defaultProps} />,
      undefined,
      onSubmit
    );

    const minutesInput = screen.getByLabelText(/Minutes per Activity/i);
    const timesInput = screen.getByLabelText(/Times per Week/i);
    const notesInput = screen.getByPlaceholderText(/Enter details about assistance/i);

    // Fill out the form
    await user.type(minutesInput, '30');
    await user.type(timesInput, '7');
    await user.type(notesInput, 'Test notes');

    // Find and click submit button (assuming it's in the form wrapper)
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Check submitted data
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          test: {
            activity: {
              minutes: 30,
              timesPerWeek: 7,
              totalMinutes: 210,
              notes: 'Test notes'
            }
          }
        })
      );
    });
  });

  it('preserves data across re-renders', async () => {
    const { user, rerender } = renderWithForm(
      <CareActivity {...defaultProps} />
    );

    const minutesInput = screen.getByLabelText(/Minutes per Activity/i);
    const timesInput = screen.getByLabelText(/Times per Week/i);

    // Enter initial values
    await user.type(minutesInput, '30');
    await user.type(timesInput, '7');

    // Force re-render
    rerender(<CareActivity {...defaultProps} />);

    // Check if values persist
    await waitFor(() => {
      expect(minutesInput).toHaveValue(30);
      expect(timesInput).toHaveValue(7);
      expect(screen.getByText('210')).toBeInTheDocument();
    });
  });

  it('handles empty string inputs gracefully', async () => {
    const { user } = renderWithForm(
      <CareActivity {...defaultProps} />
    );

    const minutesInput = screen.getByLabelText(/Minutes per Activity/i);
    const timesInput = screen.getByLabelText(/Times per Week/i);

    // Clear inputs
    await user.clear(minutesInput);
    await user.clear(timesInput);

    // Should default to 0
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  it('validates input ranges correctly', async () => {
    const { user } = renderWithForm(
      <CareActivity {...defaultProps} />
    );

    const minutesInput = screen.getByLabelText(/Minutes per Activity/i);
    const timesInput = screen.getByLabelText(/Times per Week/i);

    // Test reasonable maximums
    await user.type(minutesInput, '999');
    await user.type(timesInput, '168'); // 24 * 7 (hours in a week)

    await waitFor(() => {
      expect(minutesInput).toHaveValue(999);
      expect(timesInput).toHaveValue(168);
    });

    // Test unreasonable values
    await user.clear(minutesInput);
    await user.type(minutesInput, '9999');

    await waitFor(() => {
      expect(minutesInput).not.toHaveValue(9999);
    });
  });
});