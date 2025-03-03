import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FunctionalStatus } from '../../FunctionalStatus';
import { FormProvider, useForm } from 'react-hook-form';
import { act } from 'react';

const FormWrapper = ({ children }) => {
  const methods = useForm({
    defaultValues: {
      config: {
        activeTab: 'rom'
      },
      data: {
        posturalTolerances: {
          sitting: {},
          standing: {}
        },
        transfers: {
          bedMobility: {},
          toileting: {}
        }
      }
    }
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('FunctionalStatus Section - Basic E2E', () => {
  it('allows complete navigation through all subsections', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <FormWrapper>
          <FunctionalStatus />
        </FormWrapper>
      );
    });

    // Verify initial ROM section
    expect(screen.getByText('Range of Motion Assessment')).toBeInTheDocument();

    // Navigate through sections and verify content
    const sections = [
      { tab: 'Manual Muscle', content: 'Manual Muscle Testing' },
      { tab: 'Berg Balance', content: 'Berg Balance Assessment' },
      { tab: 'Postural Tolerances', content: 'Sitting Tolerance' },
      { tab: 'Transfers', content: 'Bed Mobility' }
    ];

    for (const { tab, content } of sections) {
      await user.click(screen.getByRole('tab', { name: tab }));
      expect(screen.getByText(content)).toBeInTheDocument();
    }
  });

  it('preserves entered data after navigation', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <FormWrapper>
          <FunctionalStatus />
        </FormWrapper>
      );
    });

    // Go to postural tab
    await user.click(screen.getByRole('tab', { name: 'Postural Tolerances' }));

    // Fill sitting duration
    const durationInput = screen.getByTestId('input-sitting-duration');
    await user.type(durationInput, '30');

    // Select unit
    const unitSelect = screen.getByTestId('select-sitting-unit');
    await user.selectOptions(unitSelect, 'minutes');

    // Navigate away and back
    await user.click(screen.getByRole('tab', { name: 'Transfers' }));
    await user.click(screen.getByRole('tab', { name: 'Postural Tolerances' }));

    // Verify data persisted
    expect(durationInput).toHaveValue('30');
    expect(unitSelect).toHaveValue('minutes');
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(
        <FormWrapper>
          <FunctionalStatus />
        </FormWrapper>
      );
    });

    // Go to transfers tab
    await user.click(screen.getByRole('tab', { name: 'Transfers' }));

    // Select bed mobility independence without notes
    const bedSelect = screen.getByTestId('select-bed-independence');
    await user.selectOptions(bedSelect, 'independent');

    // Fill toilet independence
    const toiletSelect = screen.getByTestId('select-toilet-independence');
    await user.selectOptions(toiletSelect, 'supervised');
    
    // Fill required notes
    const toiletNotes = screen.getByTestId('textarea-toilet-notes');
    await user.type(toiletNotes, 'Requires standby assistance');

    // Verify values were set
    expect(bedSelect).toHaveValue('independent');
    expect(toiletSelect).toHaveValue('supervised');
    expect(toiletNotes).toHaveValue('Requires standby assistance');
  });
});