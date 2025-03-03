/**
 * Standardized Tabs Component Tests
 * 
 * Tests for the standardized tab component used across all sections
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

describe('Standardized Tabs Component', () => {
  const renderTabs = () => {
    return render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3" disabled>Tab 3 (Disabled)</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
        <TabsContent value="tab3">Tab 3 Content</TabsContent>
      </Tabs>
    );
  };

  it('renders tabs with correct default selection', () => {
    renderTabs();

    // Check that tab triggers are rendered
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 3 (Disabled)' })).toBeInTheDocument();

    // Check default tab is selected
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'inactive');

    // Check that correct content is displayed
    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
    expect(screen.queryByText('Tab 2 Content')).not.toBeVisible();
  });

  it('switches tab when clicked', async () => {
    renderTabs();
    const user = userEvent.setup();

    // Click on Tab 2
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    // Check that Tab 2 is now active
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'inactive');

    // Check that Tab 2 content is now displayed
    expect(screen.getByText('Tab 2 Content')).toBeVisible();
    expect(screen.queryByText('Tab 1 Content')).not.toBeVisible();
  });

  it('cannot click on disabled tab', async () => {
    renderTabs();
    const user = userEvent.setup();

    // Try to click on disabled Tab 3
    await user.click(screen.getByRole('tab', { name: 'Tab 3 (Disabled)' }));

    // Tab 3 should still be inactive, Tab 1 still active
    expect(screen.getByRole('tab', { name: 'Tab 3 (Disabled)' })).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'active');

    // Tab 1 content should still be displayed
    expect(screen.getByText('Tab 1 Content')).toBeVisible();
    expect(screen.queryByText('Tab 3 Content')).not.toBeVisible();
  });

  it('applies correct styling to active tab', () => {
    renderTabs();

    // Get active and inactive tabs
    const activeTab = screen.getByRole('tab', { name: 'Tab 1' });
    const inactiveTab = screen.getByRole('tab', { name: 'Tab 2' });
    
    // Verify that active tab has the correct styling classes
    expect(activeTab).toHaveAttribute('data-state', 'active');
    
    // Verify that inactive tab has the correct styling classes
    expect(inactiveTab).toHaveAttribute('data-state', 'inactive');
  });

  it('can be controlled externally with value prop', () => {
    const { rerender } = render(
      <Tabs value="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );

    // Tab 1 should be active
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('Tab 1 Content')).toBeVisible();

    // Update value prop to tab2
    rerender(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );

    // Tab 2 should now be active
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('Tab 2 Content')).toBeVisible();
  });

  it('handles onValueChange callback', async () => {
    const handleValueChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );

    // Click on Tab 2
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    // Check that callback was called with new value
    expect(handleValueChange).toHaveBeenCalledWith('tab2');
  });

  it('renders correctly with custom className props', () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs-class">
        <TabsList className="custom-tabslist-class">
          <TabsTrigger value="tab1" className="custom-trigger-class">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content-class">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );

    // Check that custom classes were applied
    expect(screen.getByRole('tablist').parentElement).toHaveClass('custom-tabs-class');
    expect(screen.getByRole('tablist')).toHaveClass('custom-tabslist-class');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveClass('custom-trigger-class');
    expect(screen.getByText('Tab 1 Content').parentElement).toHaveClass('custom-content-class');
  });

  it('handles keyboard navigation correctly', async () => {
    renderTabs();
    
    // Focus on first tab
    const firstTab = screen.getByRole('tab', { name: 'Tab 1' });
    const secondTab = screen.getByRole('tab', { name: 'Tab 2' });
    firstTab.focus();
    
    // Press right arrow key to move to next tab
    await act(async () => {
      fireEvent.keyDown(document.activeElement || document.body, { key: 'ArrowRight' });
    });
    
    // Second tab should be focused
    expect(document.activeElement).toBe(secondTab);
    
    // Press left arrow key to move back to first tab
    await act(async () => {
      fireEvent.keyDown(document.activeElement || document.body, { key: 'ArrowLeft' });
    });
    
    // First tab should be focused again
    expect(document.activeElement).toBe(firstTab);
    
    // Press Enter key to activate the tab
    await act(async () => {
      fireEvent.keyDown(document.activeElement || document.body, { key: 'Enter' });
    });
    
    // Check that tab is active
    expect(firstTab).toHaveAttribute('data-state', 'active');
  });
});
