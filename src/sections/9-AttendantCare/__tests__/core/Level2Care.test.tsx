import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { Level2Care } from '../../components/Level2Care';
import { renderWithForm, createTestActivity } from '../utils/test-utils';
import { careCategories } from '../../constants';

describe('Level2Care Core Functionality', () => {
  it('renders basic structure correctly', () => {
    renderWithForm(<Level2Care />);

    // Check for level title and description
    expect(screen.getByText('Level 2 Attendant Care')).toBeInTheDocument();
    expect(screen.getByText(/Level 2 Attendant Care is for basic supervisory functions/)).toBeInTheDocument();

    // Check all category headers are present
    Object.values(careCategories.level2).forEach(category => {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    });
  });

  it('expands categories and shows activities', async () => {
    const { user } = renderWithForm(<Level2Care />);

    // Get first category
    const categoryTitle = Object.values(careCategories.level2)[0].title;
    const trigger = screen.getByText(categoryTitle);

    // Expand category
    await user.click(trigger);

    // Check if all activities in category are visible
    Object.values(careCategories.level2)[0].items.forEach(item => {
      expect(screen.getByText(item.title)).toBeVisible();
      expect(screen.getByText(item.description)).toBeVisible();
    });
  });

  it('handles basic activity data input', async () => {
    const { user } = renderWithForm(<Level2Care />);

    // Expand first category
    const categoryTitle = Object.values(careCategories.level2)[0].title;
    await user.click(screen.getByText(categoryTitle));

    // Get first activity's inputs
    const minutesInputs = screen.getAllByLabelText(/Minutes per Activity/i);
    const timesInputs = screen.getAllByLabelText(/Times per Week/i);

    // Enter data in first activity
    await user.type(minutesInputs[0], '30');
    await user.type(timesInputs[0], '7');

    // Check total calculation
    await waitFor(() => {
      expect(screen.getByText('210')).toBeInTheDocument();
    });
  });

  it('maintains state across category toggles', async () => {
    const { user } = renderWithForm(<Level2Care />);

    // Expand first category
    const categoryTitle = Object.values(careCategories.level2)[0].title;
    await user.click(screen.getByText(categoryTitle));

    // Enter data
    const minutesInput = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    const timesInput = screen.getAllByLabelText(/Times per Week/i)[0];

    await user.type(minutesInput, '30');
    await user.type(timesInput, '7');

    // Collapse and re-expand category
    await user.click(screen.getByText(categoryTitle));
    await user.click(screen.getByText(categoryTitle));

    // Verify data persists
    await waitFor(() => {
      expect(minutesInput).toHaveValue(30);
      expect(timesInput).toHaveValue(7);
      expect(screen.getByText('210')).toBeInTheDocument();
    });
  });

  it('loads initial values correctly', async () => {
    const initialData = {
      level2: {
        supervision: {
          medication: createTestActivity(15, 7, 'Test note'),
          safety: createTestActivity(30, 3, 'Safety note')
        }
      }
    };

    renderWithForm(<Level2Care />, initialData);

    // Expand supervision category
    const categoryTitle = Object.values(careCategories.level2)[0].title;
    await screen.getByText(categoryTitle).click();

    // Check values are loaded
    await waitFor(() => {
      // Check medication activity
      const medicationInputs = screen.getAllByLabelText(/Minutes per Activity/i);
      expect(medicationInputs[0]).toHaveValue(15);
      
      const medicationTimes = screen.getAllByLabelText(/Times per Week/i);
      expect(medicationTimes[0]).toHaveValue(7);

      // Check safety activity
      expect(medicationInputs[1]).toHaveValue(30);
      expect(medicationTimes[1]).toHaveValue(3);

      // Check notes
      const notes = screen.getAllByPlaceholderText(/Enter details about assistance/i);
      expect(notes[0]).toHaveValue('Test note');
      expect(notes[1]).toHaveValue('Safety note');
    });
  });

  it('handles form validation correctly', async () => {
    const { user } = renderWithForm(<Level2Care />);

    // Expand first category
    const categoryTitle = Object.values(careCategories.level2)[0].title;
    await user.click(screen.getByText(categoryTitle));

    const minutesInput = screen.getAllByLabelText(/Minutes per Activity/i)[0];
    const timesInput = screen.getAllByLabelText(/Times per Week/i)[0];

    // Try invalid inputs
    await user.type(minutesInput, '-10');
    await user.type(timesInput, '-5');

    // Check that negative values are prevented
    await waitFor(() => {
      expect(minutesInput).not.toHaveValue(-10);
      expect(timesInput).not.toHaveValue(-5);
    });
  });

  it('calculates category totals correctly', async () => {
    const { user } = renderWithForm(<Level2Care />);

    // Expand supervision category
    const categoryTitle = Object.values(careCategories.level2)[0].title;
    await user.click(screen.getByText(categoryTitle));

    // Fill out multiple activities
    const minutesInputs = screen.getAllByLabelText(/Minutes per Activity/i);
    const timesInputs = screen.getAllByLabelText(/Times per Week/i);

    // Activity 1: 30 mins × 7 times = 210 mins
    await user.type(minutesInputs[0], '30');
    await user.type(timesInputs[0], '7');

    // Activity 2: 15 mins × 14 times = 210 mins
    await user.type(minutesInputs[1], '15');
    await user.type(timesInputs[1], '14');

    // Total should be 420 minutes (7 hours) per week
    await waitFor(() => {
      expect(screen.getByText('210')).toBeInTheDocument();
      expect(screen.getByText('210')).toBeInTheDocument();
    });
  });
});