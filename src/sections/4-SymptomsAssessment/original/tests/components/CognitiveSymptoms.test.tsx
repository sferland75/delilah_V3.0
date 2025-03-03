import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CognitiveSymptoms } from '../../components/cognitive-symptoms';
import { FormProvider, useForm } from 'react-hook-form';
import { SymptomsFormState } from '../../types';
import { mockCognitiveSymptom } from '../utils/mock-utils';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

const renderWithForm = (defaultValues = {}) => {
  const Wrapper = ({ children }) => {
    const methods = useForm({
      defaultValues: {
        cognitive: { symptoms: [] },
        ...defaultValues
      }
    });
    return React.createElement(FormProvider, { ...methods }, children);
  };

  const utils = render(
    React.createElement(Wrapper, null,
      React.createElement(CognitiveSymptoms)
    )
  );

  return {
    ...utils,
    user: userEvent.setup()
  };
};

describe('CognitiveSymptoms', () => {
  it('renders add button when empty', () => {
    renderWithForm();
    expect(screen.getByText(/add cognitive symptom/i)).toBeInTheDocument();
  });

  it('displays existing symptoms', () => {
    renderWithForm({
      cognitive: {
        symptoms: [mockCognitiveSymptom]
      }
    });
    expect(screen.getByTestId('cognitive-symptom-1')).toBeInTheDocument();
  });

  it('allows adding a new symptom', async () => {
    const { user } = renderWithForm();
    
    const addButton = screen.getByRole('button', { name: /add cognitive symptom/i });
    await act(async () => {
      await user.click(addButton);
    });
    
    expect(screen.getByTestId('cognitive-symptom-1')).toBeInTheDocument();
  });

  it('allows removing a symptom', async () => {
    const { user } = renderWithForm({
      cognitive: {
        symptoms: [mockCognitiveSymptom]
      }
    });

    const symptom = screen.getByTestId('cognitive-symptom-1');
    expect(symptom).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /cognitive symptom 1/i }));
      await user.click(screen.getByRole('button', { name: /remove/i }));
    });

    expect(screen.queryByTestId('cognitive-symptom-1')).not.toBeInTheDocument();
  });

  it('allows editing symptom details', async () => {
    const { user } = renderWithForm();
    
    // Add a symptom
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /add cognitive symptom/i }));
    });

    // Open the accordion
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /cognitive symptom 1/i }));
    });

    // Fill in details
    await act(async () => {
      await user.selectOptions(
        screen.getByRole('combobox', { name: /type of cognitive symptom/i }),
        'memory'
      );
      await user.type(
        screen.getByRole('textbox', { name: /description/i }),
        'Test description'
      );
    });

    expect(screen.getByRole('combobox')).toHaveValue('memory');
    expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue('Test description');
  });
});