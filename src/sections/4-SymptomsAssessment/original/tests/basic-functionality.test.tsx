import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SymptomsAssessment from '../components/SymptomsAssessment';

// Simple test provider
const TestProvider = ({ children }) => children;

describe('Symptoms Assessment Basic Functionality', () => {
  const user = userEvent.setup();

  const completeCognitiveSection = async (user) => {
    // Go to cognitive tab
    await user.click(screen.getByRole('tab', { name: /cognitive/i }));

    // Fill all required fields
    await user.selectOptions(screen.getByLabelText(/type of cognitive symptom/i), 'memory');
    await user.type(screen.getByLabelText(/impact on daily life/i), 'Memory issues');
    await user.type(screen.getByLabelText(/management strategies/i), 'Using reminders');

    // Return to emotional tab
    await user.click(screen.getByRole('tab', { name: /emotional/i }));
  };

  it('allows data entry in both physical and cognitive tabs', async () => {
    await act(async () => {
      render(
        <TestProvider>
          <SymptomsAssessment />
        </TestProvider>
      );
    });

    // Physical symptoms
    await act(async () => {
      await user.click(screen.getByRole('tab', { name: /physical/i }));
      await user.type(screen.getByLabelText(/symptom location/i), 'Lower Back');
      await user.type(screen.getByLabelText(/symptom intensity/i), '7');
      await user.type(screen.getByLabelText(/symptom description/i), 'Sharp pain when bending');
    });

    // Cognitive symptoms
    await act(async () => {
      await user.click(screen.getByRole('tab', { name: /cognitive/i }));
      await user.selectOptions(screen.getByLabelText(/type of cognitive symptom/i), 'memory');
      await user.type(screen.getByLabelText(/impact on daily life/i), 'Difficulty remembering appointments');
      await user.type(screen.getByLabelText(/management strategies/i), 'Using calendar reminders');
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /submit assessment/i }));
    });

    // Form submitted without errors
    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  it('maintains data across all tab switches', async () => {
    await act(async () => {
      render(
        <TestProvider>
          <SymptomsAssessment />
        </TestProvider>
      );
    });

    // Enter cognitive data
    await act(async () => {
      await completeCognitiveSection(user);
    });

    // Switch tabs multiple times
    await act(async () => {
      await user.click(screen.getByRole('tab', { name: /physical/i }));
      await user.click(screen.getByRole('tab', { name: /general/i }));
      await user.click(screen.getByRole('tab', { name: /cognitive/i }));
    });

    // Verify data persisted
    await waitFor(() => {
      expect(screen.getByLabelText(/type of cognitive symptom/i)).toHaveValue('memory');
      expect(screen.getByLabelText(/impact on daily life/i)).toHaveValue('Memory issues');
    });
  });

  it('validates required cognitive fields', async () => {
    await act(async () => {
      render(
        <TestProvider>
          <SymptomsAssessment />
        </TestProvider>
      );
    });

    await act(async () => {
      await user.click(screen.getByRole('tab', { name: /cognitive/i }));
      await user.click(screen.getByRole('button', { name: /submit assessment/i }));
    });

    // Wait for validation messages
    await waitFor(() => {
      expect(screen.getByText('Type of cognitive issue is required')).toBeInTheDocument();
      expect(screen.getByText('Impact description is required')).toBeInTheDocument();
    });
  });

  it('handles emotional symptoms data entry', async () => {
    await act(async () => {
      render(
        <TestProvider>
          <SymptomsAssessment />
        </TestProvider>
      );
    });

    // Complete cognitive section first
    await act(async () => {
      await completeCognitiveSection(user);
    });

    // Try to add emotional symptom
    await act(async () => {
      const addButton = screen.getByTestId('add-emotional-button');
      await user.click(addButton);
    });

    // Wait for symptom form to appear
    await waitFor(() => {
      const symptom = screen.getByTestId('emotional-anxiety-1');
      expect(symptom).toBeInTheDocument();
    });

    // Fill emotional data
    await act(async () => {
      await user.click(screen.getByTestId('emotional-anxiety-1'));
      await user.type(screen.getByTestId('emotional-factors-1'), 'Work stress');
      await user.type(screen.getByTestId('emotional-triggers-1'), 'deadlines,meetings');
    });

    // Verify data was entered
    expect(screen.getByTestId('emotional-anxiety-1')).toBeChecked();
    expect(screen.getByTestId('emotional-factors-1')).toHaveValue('Work stress');
    expect(screen.getByTestId('emotional-triggers-1')).toHaveValue('deadlines,meetings');
  });

  it('validates emotional symptoms requirements', async () => {
    await act(async () => {
      render(
        <TestProvider>
          <SymptomsAssessment />
        </TestProvider>
      );
    });

    // Try to add emotional before cognitive
    await act(async () => {
      await user.click(screen.getByRole('tab', { name: /emotional/i }));
      await user.click(screen.getByRole('button', { name: /add emotional symptom/i }));
    });

    // Check validation error
    await waitFor(() => {
      expect(screen.getByText('Complete cognitive assessment first')).toBeInTheDocument();
    });
  });
});