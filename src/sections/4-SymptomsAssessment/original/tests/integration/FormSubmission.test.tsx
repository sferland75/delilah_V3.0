import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SymptomsAssessment } from '../../components';
import { TestProvider } from '../TestProvider';
import { mockEnhanceDocumentation } from '../__mocks__/apiMocks';

jest.mock('@/services/api', () => ({
  enhanceDocumentation: (...args) => mockEnhanceDocumentation(...args)
}));

describe('Symptoms Form Submission', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes full symptoms workflow', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    // Fill general section
    await user.type(screen.getByTestId('general-notes'), 'Test symptoms');
    await user.click(screen.getByTestId('submit-assessment'));

    await waitFor(() => {
      expect(mockEnhanceDocumentation).toHaveBeenCalled();
    });
  });

  it('validates required fields before submission', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    await user.click(screen.getByTestId('submit-assessment'));
    
    await waitFor(() => {
      expect(screen.getByText(/Required field/i)).toBeInTheDocument();
    });
  });

  it('preserves data during form updates', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    const testNote = 'Test note content';
    await user.type(screen.getByTestId('general-notes'), testNote);
    
    await user.click(screen.getByTestId('physical-tab'));
    await user.click(screen.getByTestId('general-tab'));
    
    expect(screen.getByTestId('general-notes')).toHaveValue(testNote);
  });

  it('handles multiple symptom entries correctly', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    await user.click(screen.getByTestId('physical-tab'));
    
    // Add first symptom
    await user.click(screen.getByTestId('add-physical-button'));
    await user.type(screen.getByTestId('symptom-location-0'), 'Head');
    await user.type(screen.getByTestId('symptom-description-0'), 'Headache');
    await user.click(screen.getByTestId('save-physical-symptom'));

    // Add second symptom
    await user.click(screen.getByTestId('add-physical-button'));
    await user.type(screen.getByTestId('symptom-location-1'), 'Back');
    await user.type(screen.getByTestId('symptom-description-1'), 'Back pain');
    await user.click(screen.getByTestId('save-physical-symptom'));

    // Verify both symptoms are present
    expect(screen.getByText('Head')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});