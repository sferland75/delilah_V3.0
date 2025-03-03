import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SymptomsAssessment } from '../../components';
import { TestProvider } from '../TestProvider';

describe('Symptoms Tab Navigation', () => {
  const user = userEvent.setup();

  it('shows correct initial tab layout', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    expect(screen.getByTestId('general-content')).toBeVisible();
    expect(screen.queryByTestId('physical-content')).not.toBeVisible();
    expect(screen.queryByTestId('cognitive-content')).not.toBeVisible();
    expect(screen.queryByTestId('emotional-content')).not.toBeVisible();
  });

  it('maintains header visibility across tabs', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    const header = screen.getByTestId('symptoms-header');
    expect(header).toBeVisible();

    await user.click(screen.getByTestId('physical-tab'));
    expect(header).toBeVisible();

    await user.click(screen.getByTestId('cognitive-tab'));
    expect(header).toBeVisible();

    await user.click(screen.getByTestId('emotional-tab'));
    expect(header).toBeVisible();
  });

  it('preserves form data between tab switches', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    const testNote = 'Test symptoms note';
    await user.type(screen.getByTestId('general-notes'), testNote);
    
    await user.click(screen.getByTestId('physical-tab'));
    await user.click(screen.getByTestId('general-tab'));
    
    expect(screen.getByTestId('general-notes')).toHaveValue(testNote);
  });

  it('handles rapid tab switching without data loss', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    const testNote = 'Test note';
    await user.type(screen.getByTestId('general-notes'), testNote);

    // Rapid tab switching
    await user.click(screen.getByTestId('physical-tab'));
    await user.click(screen.getByTestId('cognitive-tab'));
    await user.click(screen.getByTestId('emotional-tab'));
    await user.click(screen.getByTestId('general-tab'));

    expect(screen.getByTestId('general-notes')).toHaveValue(testNote);
  });

  it('updates form state when changing tabs', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    // Start in general tab
    expect(screen.getByTestId('general-content')).toBeVisible();

    // Switch to physical tab
    await user.click(screen.getByTestId('physical-tab'));
    expect(screen.getByTestId('physical-content')).toBeVisible();
    expect(screen.queryByTestId('general-content')).not.toBeVisible();

    // Switch to cognitive tab
    await user.click(screen.getByTestId('cognitive-tab'));
    expect(screen.getByTestId('cognitive-content')).toBeVisible();
    expect(screen.queryByTestId('physical-content')).not.toBeVisible();
  });

  it('retains accordion states between tab switches', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    // Open physical symptom accordion
    await user.click(screen.getByTestId('physical-tab'));
    await user.click(screen.getByTestId('add-physical-button'));
    const physicalAccordion = screen.getByTestId('physical-accordion');
    expect(physicalAccordion).toHaveAttribute('data-state', 'open');

    // Switch tabs and return
    await user.click(screen.getByTestId('cognitive-tab'));
    await user.click(screen.getByTestId('physical-tab'));

    // Verify accordion state is preserved
    expect(physicalAccordion).toHaveAttribute('data-state', 'open');
  });
});