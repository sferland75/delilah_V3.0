import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmotionalSymptoms } from '../../components';
import { TestProvider } from '../TestProvider';

describe('EmotionalSymptoms', () => {
  it('expands and collapses accordion sections', async () => {
    const user = userEvent.setup();
    
    render(
      React.createElement(TestProvider, null,
        React.createElement(EmotionalSymptoms)
      )
    );

    const button = screen.getByRole('button', { name: /expand/i });
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('accordion-content')).toBeInTheDocument();
    });
    
    await user.click(button);
    await waitFor(() => {
      expect(screen.queryByTestId('accordion-content')).not.toBeInTheDocument();
    });
  });
});