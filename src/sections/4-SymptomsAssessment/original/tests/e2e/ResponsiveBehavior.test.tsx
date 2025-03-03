import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { SymptomsAssessment } from '../../components/SymptomsAssessment';

describe('Responsive Behavior', () => {
  const user = userEvent.setup();

  // Helper to set viewport size
  const setViewport = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    // Reset to desktop viewport
    setViewport(1024, 768);
  });

  it('adapts layout for mobile viewport', async () => {
    setViewport(375, 667); // iPhone SE viewport
    render(React.createElement(SymptomsAssessment));

    // Verify tab navigation collapses to dropdown on mobile
    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveClass('mobile-tabs');

    // Verify form elements stack vertically
    const formElements = screen.getByTestId('symptoms-form');
    expect(formElements).toHaveClass('stack-vertical');

    // Test mobile-specific interaction patterns
    await user.click(screen.getByTestId('mobile-menu-button'));
    expect(screen.getByTestId('mobile-navigation')).toBeVisible();
  });

  it('handles touch interactions correctly', async () => {
    setViewport(375, 667);
    render(React.createElement(SymptomsAssessment));

    // Simulate touch events
    const bodyMap = screen.getByTestId('body-map');
    
    // Touch selection
    fireEvent.touchStart(bodyMap, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchEnd(bodyMap);

    expect(screen.getByTestId('location-marker')).toBeInTheDocument();

    // Verify touch-friendly UI elements
    const touchTargets = screen.getAllByRole('button');
    touchTargets.forEach(target => {
      const styles = window.getComputedStyle(target);
      // Verify minimum touch target size
      expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(44);
    });
  });

  it('maintains functionality across breakpoints', async () => {
    const { rerender } = render(React.createElement(SymptomsAssessment));

    // Start with desktop layout
    await user.type(screen.getByTestId('general-notes'), 'Test notes');

    // Switch to tablet
    setViewport(768, 1024);
    rerender(React.createElement(SymptomsAssessment));

    // Verify content persists
    expect(screen.getByTestId('general-notes')).toHaveValue('Test notes');

    // Switch to mobile
    setViewport(375, 667);
    rerender(React.createElement(SymptomsAssessment));

    // Verify content still persists
    expect(screen.getByTestId('general-notes')).toHaveValue('Test notes');

    // Test mobile-specific UI elements
    expect(screen.getByTestId('mobile-save-button')).toBeVisible();
  });

  it('handles form validation appropriately across viewports', async () => {
    const viewports = [
      { width: 1024, height: 768, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      setViewport(viewport.width, viewport.height);
      const { rerender } = render(React.createElement(SymptomsAssessment));

      // Submit empty form
      await user.click(screen.getByTestId('submit-assessment'));

      // Verify error messages are visible and properly positioned
      const errorMessages = screen.getAllByRole('alert');
      errorMessages.forEach(message => {
        expect(message).toBeVisible();
        if (viewport.name === 'mobile') {
          expect(message).toHaveClass('mobile-error');
        }
      });

      // Clean up for next iteration
      rerender(React.createElement(React.Fragment));
    }
  });

  it('maintains accessibility across viewport sizes', async () => {
    const viewports = [
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      setViewport(viewport.width, viewport.height);
      const { container } = render(React.createElement(SymptomsAssessment));

      // Check for proper ARIA attributes
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 
        viewport.width < 768 ? 'vertical' : 'horizontal'
      );

      // Verify focus indicators remain visible
      const interactiveElements = container.querySelectorAll('button, input, select');
      interactiveElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        expect(styles.outlineStyle).not.toBe('none');
      });
    }
  });
});