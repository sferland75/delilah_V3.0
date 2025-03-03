import React from 'react';
import { render, screen } from '../utils/test-utils';
import { SymptomsAssessment } from '../../components';
import userEvent from '@testing-library/user-event';
import { mockEmotionalSymptom, mockPhysicalSymptom, mockCognitiveSymptom } from '../utils/mock-data';

describe('SymptomsAssessment Integration', () => {
  it('renders all tab sections', () => {
    render(React.createElement(SymptomsAssessment));
    
    expect(screen.getByRole('tab', { name: /general/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /physical/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /cognitive/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /emotional/i })).toBeInTheDocument();
  });

  it('switches content when tabs are clicked', async () => {
    const user = userEvent.setup();
    render(React.createElement(SymptomsAssessment));

    expect(screen.getByText(/document overall symptom presentation/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /physical/i }));
    expect(screen.getByText(/add physical symptom/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /cognitive/i }));
    expect(screen.getByText(/add cognitive symptom/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /emotional/i }));
    expect(screen.getByText(/add emotional symptom/i)).toBeInTheDocument();
  });

  it('maintains form state across tab switches', async () => {
    const user = userEvent.setup();
    render(React.createElement(SymptomsAssessment));

    // Add general notes
    const generalNotes = screen.getByLabelText(/general assessment/i);
    await user.type(generalNotes, 'Test general notes');

    // Switch tabs and verify persistence
    await user.click(screen.getByRole('tab', { name: /physical/i }));
    await user.click(screen.getByRole('tab', { name: /general/i }));
    
    expect(screen.getByDisplayValue('Test general notes')).toBeInTheDocument();
  });

  it('loads initial values', () => {
    const initialValues = {
      general: { notes: 'Initial general notes' },
      physical: [mockPhysicalSymptom],
      cognitive: [mockCognitiveSymptom],
      emotional: [mockEmotionalSymptom]
    };

    render(React.createElement(SymptomsAssessment), { defaultValues: initialValues });

    // Check general notes
    expect(screen.getByDisplayValue('Initial general notes')).toBeInTheDocument();
  });
});