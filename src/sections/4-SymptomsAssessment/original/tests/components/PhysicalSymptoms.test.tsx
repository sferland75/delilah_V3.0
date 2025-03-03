import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PhysicalSymptoms } from '../../components/PhysicalSymptoms';
import { FormProvider, useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

const renderWithForm = (defaultValues = {}) => {
  const Wrapper = ({ children }) => {
    const methods = useForm({
      defaultValues: {
        physical: [],
        ...defaultValues
      }
    });
    return React.createElement(FormProvider, { ...methods }, children);
  };

  const utils = render(
    React.createElement(Wrapper, null,
      React.createElement(PhysicalSymptoms)
    )
  );

  return {
    ...utils,
    user: userEvent.setup()
  };
};

describe('PhysicalSymptoms', () => {
  it('renders empty state correctly', () => {
    renderWithForm();
    expect(screen.getByTestId('add-physical-button')).toBeInTheDocument();
    expect(screen.getByTestId('body-map')).toBeInTheDocument();
    expect(screen.getByText('Physical Symptoms')).toBeInTheDocument();
  });

  it('allows adding symptoms via body map', async () => {
    const { user } = renderWithForm();
    
    await act(async () => {
      await user.click(screen.getByTestId('body-map'));
    });

    expect(screen.getByTestId('physical-symptoms-list')).toBeInTheDocument();
  });

  it('allows removing symptoms', async () => {
    const { user } = renderWithForm({
      physical: [{
        location: 'test',
        painType: 'sharp',
        intensity: 'mild',
        description: 'test pain'
      }]
    });

    // Check initial symptom exists
    const removeButton = screen.getByTestId('remove-physical-1');
    
    // Remove symptom
    await act(async () => {
      await user.click(removeButton);
    });

    // Verify removal
    expect(screen.queryByTestId('physical-symptom-1')).not.toBeInTheDocument();
  });

  it('allows editing symptoms', async () => {
    const { user } = renderWithForm();
    
    // Add a symptom first
    await act(async () => {
      await user.click(screen.getByTestId('add-physical-button'));
    });

    // Fill in location
    const locationInput = screen.getByTestId('physical-location-1');
    await act(async () => {
      await user.type(locationInput, 'Left shoulder');
    });

    // Fill in description
    const descriptionInput = screen.getByTestId('physical-description-1');
    await act(async () => {
      await user.type(descriptionInput, 'Sharp pain when moving');
    });

    // Verify inputs
    expect(locationInput).toHaveValue('Left shoulder');
    expect(descriptionInput).toHaveValue('Sharp pain when moving');
  });
});