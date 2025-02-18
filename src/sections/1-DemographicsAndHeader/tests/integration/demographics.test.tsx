import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemographicsSection } from '../../index';

// Previous mocks remain the same...

describe('Demographics Section Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Previous tests remain the same...

  describe('Tab Content', () => {
    it('manages tab panel visibility correctly', async () => {
      render(<DemographicsSection />);

      // Get all tab panels
      const getTabPanel = (name: string) => 
        screen.getByRole('tabpanel', { name: new RegExp(name, 'i') });

      // Initially only Personal tab should be visible
      const personalPanel = getTabPanel('personal');
      expect(personalPanel).not.toHaveAttribute('hidden');
      
      // Click Contact tab
      await user.click(screen.getByRole('tab', { name: /contact/i }));
      
      // Now Contact should be visible and Personal hidden
      const contactPanel = getTabPanel('contact');
      expect(contactPanel).not.toHaveAttribute('hidden');
      expect(personalPanel).toHaveAttribute('hidden');

      // Verify each tab shows correct content
      const tabs = ['Insurance', 'Legal'];
      for (const tab of tabs) {
        await user.click(screen.getByRole('tab', { name: new RegExp(tab, 'i') }));
        const currentPanel = getTabPanel(tab);
        expect(currentPanel).not.toHaveAttribute('hidden');
        expect(contactPanel).toHaveAttribute('hidden');
      }
    });
  });
});