import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { SymptomsAssessment } from '../../components/SymptomsAssessment';

describe('Keyboard Navigation', () => {
  const user = userEvent.setup();

  it('allows complete form navigation and submission using keyboard', async () => {
    render(React.createElement(SymptomsAssessment));

    // Navigate to and fill general notes
    await user.tab(); // Focus first element
    await user.keyboard('Test notes');
    
    // Navigate to physical tab
    await user.tab(); // Focus tab
    await user.keyboard('{Enter}'); // Activate tab
    
    // Add physical symptom
    await user.tab(); // Focus add button
    await user.keyboard('{Enter}');
    await user.keyboard('Head{Tab}Sharp{Tab}7{Tab}{Enter}');

    // Verify physical symptom was added
    expect(screen.getByText('Head')).toBeInTheDocument();
    expect(screen.getByText('Sharp')).toBeInTheDocument();

    // Test focus trap in modal forms
    const addButtons = ['physical', 'cognitive', 'emotional'].map(section => 
      screen.getByTestId(`add-${section}-symptom`)
    );

    for (const button of addButtons) {
      await user.click(button);
      await user.keyboard('{Tab}');
      await user.keyboard('{Tab}');
      await user.keyboard('{Tab}');
      // Should loop back to first focusable element in modal
      const firstInput = screen.getByTestId(`${button.dataset.testid}-first-input`);
      expect(document.activeElement).toBe(firstInput);
      await user.keyboard('{Escape}');
    }
  });

  it('supports keyboard shortcuts for common actions', async () => {
    render(React.createElement(SymptomsAssessment));

    // Save shortcut
    await user.keyboard('{Control>}s{/Control}');
    expect(screen.getByText('Assessment saved')).toBeInTheDocument();

    // Tab navigation
    await user.keyboard('{Alt>}1{/Alt}');
    expect(screen.getByTestId('general-tab')).toHaveAttribute('aria-selected', 'true');
    
    await user.keyboard('{Alt>}2{/Alt}');
    expect(screen.getByTestId('physical-tab')).toHaveAttribute('aria-selected', 'true');
  });

  it('handles focus management during async operations', async () => {
    render(React.createElement(SymptomsAssessment));

    // Focus should be maintained after async operations
    const enhanceButton = screen.getByTestId('enhance-button');
    await user.tab(); // Focus enhance button
    await user.keyboard('{Enter}');

    // Wait for operation to complete
    await waitFor(() => {
      expect(document.activeElement).toBe(enhanceButton);
    });

    // Focus should move to error message if operation fails
    const errorButton = screen.getByTestId('error-button');
    await user.click(errorButton);
    expect(document.activeElement).toBe(screen.getByTestId('error-message'));
  });
});