import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ADLSection } from '../components/ADLSection';
import { mockADLData } from '../__test_utils__/fixtures';
import { renderWithFormContext } from '../__test_utils__/utils';

describe('ADLSection', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders main section headers', () => {
    renderWithFormContext(<ADLSection value={mockADLData} onChange={mockOnChange} />, mockADLData);

    expect(screen.getByText('Activities of Daily Living')).toBeInTheDocument();
    
    // Check the tab headers specifically
    const tabList = screen.getByRole('tablist');
    expect(within(tabList).getByText('Basic ADLs')).toBeInTheDocument();
    expect(within(tabList).getByText('IADLs')).toBeInTheDocument();
    expect(within(tabList).getByText('Health Management')).toBeInTheDocument();
    expect(within(tabList).getByText('Work Status')).toBeInTheDocument();
  });

  it('renders category sections in Basic ADLs tab', () => {
    renderWithFormContext(<ADLSection value={mockADLData} onChange={mockOnChange} />, mockADLData);

    expect(screen.getByText('Bathing & Hygiene')).toBeInTheDocument();
    expect(screen.getByText('Dressing')).toBeInTheDocument();
    expect(screen.getByText('Feeding')).toBeInTheDocument();
    expect(screen.getByText('Functional Mobility')).toBeInTheDocument();
  });

  it('expands accordion sections', () => {
    renderWithFormContext(<ADLSection value={mockADLData} onChange={mockOnChange} />, mockADLData);

    const bathingTrigger = screen.getByText('Bathing & Hygiene').closest('[data-testid="accordion-trigger"]');
    fireEvent.click(bathingTrigger!);

    expect(screen.getByText('Bathing/Showering')).toBeInTheDocument();
    expect(screen.getByText('Grooming')).toBeInTheDocument();
    expect(screen.getByText('Oral Care')).toBeInTheDocument();
  });

  it('displays informational alert', () => {
    renderWithFormContext(<ADLSection value={mockADLData} onChange={mockOnChange} />, mockADLData);
    
    expect(screen.getByText(/Document ability to perform daily activities/)).toBeInTheDocument();
    expect(screen.getByText(/Basic self-care tasks/)).toBeInTheDocument();
  });
});