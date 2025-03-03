import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider } from 'react-hook-form';
import { SymptomsAssessment } from '../../components';
import { mockEnhanceDocumentation, mockAnalyzeSymptomPatterns } from '../__mocks__/apiMocks';
import { TestProvider } from '../TestProvider';

// Mock the API calls
jest.mock('@/services/api', () => ({
  enhanceDocumentation: (...args) => mockEnhanceDocumentation(...args),
  analyzeSymptomPatterns: (...args) => mockAnalyzeSymptomPatterns(...args)
}));

describe('Symptoms Assessment E2E', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it('completes full assessment flow', async () => {
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );

    // General Notes Tab
    const generalNotes = 'Patient reports multiple symptoms starting 2 weeks ago';
    await user.type(screen.getByTestId('general-notes'), generalNotes);
    
    // Verify AI enhancement trigger
    await user.click(screen.getByTestId('enhance-button'));
    expect(mockEnhanceDocumentation).toHaveBeenCalledWith('general', expect.any(Object));

    // Physical Symptoms Tab
    await user.click(screen.getByTestId('physical-tab'));
    await user.click(screen.getByTestId('add-physical-button'));
    const physicalForm = screen.getByTestId('physical-symptom-form');
    await user.type(within(physicalForm).getByLabelText(/location/i), 'Lower Back');
    await user.type(within(physicalForm).getByLabelText(/type/i), 'Sharp Pain');
    await user.type(within(physicalForm).getByLabelText(/intensity/i), '7');
    await user.click(screen.getByTestId('save-physical-symptom'));

    // Cognitive Symptoms Tab
    await user.click(screen.getByTestId('cognitive-tab'));
    await user.click(screen.getByTestId('add-cognitive-button'));
    const cognitiveForm = screen.getByTestId('cognitive-symptom-form');
    await user.type(within(cognitiveForm).getByLabelText(/type/i), 'Memory Issues');
    await user.type(within(cognitiveForm).getByLabelText(/description/i), 'Difficulty recalling recent events');
    await user.click(screen.getByTestId('save-cognitive-symptom'));

    // Emotional Symptoms Tab
    await user.click(screen.getByTestId('emotional-tab'));
    await user.click(screen.getByTestId('add-emotional-button'));
    const emotionalForm = screen.getByTestId('emotional-symptom-form');
    await user.type(within(emotionalForm).getByLabelText(/type/i), 'Anxiety');
    await user.type(within(emotionalForm).getByLabelText(/severity/i), 'Moderate');
    await user.click(screen.getByTestId('save-emotional-symptom'));

    // Verify Data Persistence
    await user.click(screen.getByTestId('general-tab'));
    expect(screen.getByTestId('general-notes')).toHaveValue(generalNotes);

    await user.click(screen.getByTestId('physical-tab'));
    expect(screen.getByText('Lower Back')).toBeInTheDocument();
    expect(screen.getByText('Sharp Pain')).toBeInTheDocument();

    // Submit Assessment
    await user.click(screen.getByTestId('submit-assessment'));
    
    await waitFor(() => {
      expect(screen.getByText(/Assessment Complete/i)).toBeInTheDocument();
    });
  });

  it('handles error states gracefully', async () => {
    mockEnhanceDocumentation.mockRejectedValueOnce(new Error('API Error'));
    
    render(
      React.createElement(TestProvider, null,
        React.createElement(SymptomsAssessment)
      )
    );
    
    await user.click(screen.getByTestId('enhance-button'));
    expect(screen.getByTestId('validation-error')).toBeInTheDocument();
    
    mockEnhanceDocumentation.mockResolvedValueOnce({ enhanced: true });
    await user.click(screen.getByTestId('enhance-button'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('validation-error')).not.toBeInTheDocument();
    });
  });
});